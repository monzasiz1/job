import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'
import { PLATFORM_FEE_PERCENT } from '@/lib/stripe'

// GET — Meine Buchungen laden (als Client oder Provider)
export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role') // 'client' | 'provider' | null (beide)
  const status = searchParams.get('status') // optional Status-Filter

  let query = supabase
    .from('marketplace_bookings')
    .select('*, client:client_id(full_name, avatar_url, company_name), provider:provider_id(full_name, avatar_url, company_name), offering:offering_id(title, category, price_info), request:request_id(title, category, budget)')
    .order('created_at', { ascending: false })
    .limit(50)

  if (role === 'client') {
    query = query.eq('client_id', user.id)
  } else if (role === 'provider') {
    query = query.eq('provider_id', user.id)
  } else {
    query = query.or(`client_id.eq.${user.id},provider_id.eq.${user.id}`)
  }

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}

// POST — Neue Buchung / Anfrage erstellen
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const body = await request.json()
  const { provider_id, client_id, offering_id, request_id, title, message, price, price_amount, price_type, estimated_hours } = body

  if (!title) {
    return NextResponse.json({ error: 'title ist Pflicht' }, { status: 400 })
  }

  // Determine roles: For offerings, current user is client. For requests, current user is provider.
  const resolvedClientId = client_id || user.id
  const resolvedProviderId = provider_id || user.id

  if (resolvedProviderId === resolvedClientId) {
    return NextResponse.json({ error: 'Du kannst dich nicht selbst buchen' }, { status: 400 })
  }

  // Der aktuelle User muss entweder Client oder Provider sein
  if (resolvedClientId !== user.id && resolvedProviderId !== user.id) {
    return NextResponse.json({ error: 'Du musst entweder Client oder Provider sein' }, { status: 400 })
  }

  // Duplikat-Check: Offene Anfrage für dasselbe Angebot?
  if (offering_id) {
    const { data: existing } = await supabase
      .from('marketplace_bookings')
      .select('id')
      .eq('client_id', resolvedClientId)
      .eq('offering_id', offering_id)
      .in('status', ['requested', 'accepted', 'in_progress'])
      .limit(1)
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Es gibt bereits eine offene Anfrage für dieses Angebot' }, { status: 409 })
    }
  }

  // Duplikat-Check für Gesuche
  if (request_id) {
    const { data: existing } = await supabase
      .from('marketplace_bookings')
      .select('id')
      .eq('provider_id', resolvedProviderId)
      .eq('request_id', request_id)
      .in('status', ['requested', 'accepted', 'in_progress'])
      .limit(1)
    if (existing && existing.length > 0) {
      return NextResponse.json({ error: 'Du hast bereits ein Angebot für dieses Gesuch abgegeben' }, { status: 409 })
    }
  }

  const { data, error } = await supabase
    .from('marketplace_bookings')
    .insert({
      client_id: resolvedClientId,
      provider_id: resolvedProviderId,
      offering_id: offering_id || null,
      request_id: request_id || null,
      title: String(title).slice(0, 200),
      message: message ? String(message).slice(0, 2000) : null,
      price: price ? String(price).slice(0, 100) : null,
      price_amount: price_amount ? Math.round(Number(price_amount)) : 0,
      price_type: price_type === 'hourly' ? 'hourly' : 'fixed',
      estimated_hours: estimated_hours ? Number(estimated_hours) : null,
      status: 'requested',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// PUT — Status einer Buchung ändern (accept, decline, cancel, complete, in_progress)
export async function PUT(request: Request) {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const body = await request.json()
  const { id, status } = body

  if (!id || !status) {
    return NextResponse.json({ error: 'id und status sind Pflicht' }, { status: 400 })
  }

  const validStatuses = ['requested', 'accepted', 'in_progress', 'completed', 'cancelled', 'declined']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Ungültiger Status' }, { status: 400 })
  }

  // Zuerst die Buchung laden, um Berechtigungen zu prüfen
  const { data: booking } = await supabase
    .from('marketplace_bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (!booking) return NextResponse.json({ error: 'Buchung nicht gefunden' }, { status: 404 })

  // Berechtigungsprüfung
  const isClient = booking.client_id === user.id
  const isProvider = booking.provider_id === user.id

  if (!isClient && !isProvider) {
    return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
  }

  // Status-Übergangsregeln
  // Bei Gesuchen (request_id gesetzt) entscheidet der Client (Gesuch-Ersteller),
  // bei Angeboten (offering_id gesetzt) entscheidet der Provider (Anbieter).
  const isRequestBased = !!booking.request_id
  const decider = isRequestBased ? 'client' : 'provider'
  const initiator = isRequestBased ? 'provider' : 'client'

  const allowed: Record<string, { by: string[]; from: string[] }> = {
    accepted:    { by: [decider], from: ['requested'] },
    declined:    { by: [decider], from: ['requested'] },
    in_progress: { by: ['provider', 'client'], from: ['accepted'] },
    completed:   { by: ['provider', 'client'], from: ['accepted', 'in_progress'] },
    cancelled:   { by: [initiator, decider], from: ['requested', 'accepted'] },
  }

  const rule = allowed[status]
  if (!rule) {
    return NextResponse.json({ error: 'Status-Übergang nicht erlaubt' }, { status: 400 })
  }

  const userRole = isProvider ? 'provider' : 'client'
  if (!rule.by.includes(userRole)) {
    return NextResponse.json({ error: `${userRole === 'provider' ? 'Anbieter' : 'Auftraggeber'} darf diesen Status nicht setzen` }, { status: 403 })
  }
  if (!rule.from.includes(booking.status)) {
    return NextResponse.json({ error: `Status-Übergang von "${booking.status}" zu "${status}" nicht erlaubt` }, { status: 400 })
  }

  // Payment logic on status transitions
  // Block starting work if price exists but payment not authorized
  if (status === 'in_progress' && booking.price_amount && booking.price_amount > 0) {
    if (!booking.payment_intent_id || booking.payment_status !== 'authorized') {
      return NextResponse.json({ error: 'Zahlung muss zuerst autorisiert sein bevor der Auftrag gestartet werden kann' }, { status: 400 })
    }
  }

  const { data, error } = await supabase
    .from('marketplace_bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Auto-capture payment on completion
  if (status === 'completed' && booking.payment_intent_id && booking.payment_status === 'authorized') {
    try {
      await stripe.paymentIntents.capture(booking.payment_intent_id)
      await supabase
        .from('marketplace_bookings')
        .update({ payment_status: 'captured', updated_at: new Date().toISOString() })
        .eq('id', id)
    } catch(e) { /* webhook will handle it */ }
  }

  // Auto-cancel payment on cancellation/decline
  if (['cancelled', 'declined'].includes(status) && booking.payment_intent_id && ['authorized', 'none'].includes(booking.payment_status || 'none')) {
    try {
      await stripe.paymentIntents.cancel(booking.payment_intent_id)
      await supabase
        .from('marketplace_bookings')
        .update({ payment_status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', id)
    } catch(e) { /* ignore if already cancelled */ }
  }

  // Bei completed/declined/cancelled: Angebot/Gesuch vom Marktplatz nehmen (is_active=false)
  if (['completed', 'declined', 'cancelled'].includes(status)) {
    if (booking.offering_id) {
      await supabase
        .from('skill_offerings')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', booking.offering_id)
    }
    if (booking.request_id) {
      await supabase
        .from('skill_requests')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', booking.request_id)
    }
  }

  return NextResponse.json(data)
}
