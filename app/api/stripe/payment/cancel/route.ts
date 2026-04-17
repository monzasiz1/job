import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { booking_id } = await request.json()
  if (!booking_id) return NextResponse.json({ error: 'booking_id fehlt' }, { status: 400 })

  const { data: booking } = await supabase
    .from('marketplace_bookings')
    .select('id, client_id, provider_id, payment_intent_id, payment_status')
    .eq('id', booking_id)
    .single()

  if (!booking) return NextResponse.json({ error: 'Buchung nicht gefunden' }, { status: 404 })

  const isClient = booking.client_id === user.id
  const isProvider = booking.provider_id === user.id
  if (!isClient && !isProvider) return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })

  if (!booking.payment_intent_id) {
    return NextResponse.json({ payment_status: 'none' })
  }

  if (!['authorized', 'none'].includes(booking.payment_status || 'none')) {
    return NextResponse.json({ error: 'Zahlung kann nicht mehr storniert werden' }, { status: 400 })
  }

  try {
    await stripe.paymentIntents.cancel(booking.payment_intent_id)

    await supabase
      .from('marketplace_bookings')
      .update({
        payment_status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking_id)

    return NextResponse.json({ payment_status: 'cancelled' })
  } catch(e: any) {
    return NextResponse.json({ error: e.message || 'Cancel fehlgeschlagen' }, { status: 500 })
  }
}