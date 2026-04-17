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
    .select('id, client_id, payment_intent_id, payment_status')
    .eq('id', booking_id)
    .single()

  if (!booking) return NextResponse.json({ error: 'Buchung nicht gefunden' }, { status: 404 })
  if (booking.client_id !== user.id) return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
  if (!booking.payment_intent_id) return NextResponse.json({ error: 'Kein PaymentIntent vorhanden' }, { status: 400 })

  try {
    const pi = await stripe.paymentIntents.retrieve(booking.payment_intent_id)

    if (pi.status === 'requires_capture') {
      await supabase
        .from('marketplace_bookings')
        .update({ payment_status: 'authorized', updated_at: new Date().toISOString() })
        .eq('id', booking_id)

      return NextResponse.json({ payment_status: 'authorized', amount: pi.amount })
    }

    return NextResponse.json({ payment_status: booking.payment_status, stripe_status: pi.status })
  } catch(e: any) {
    return NextResponse.json({ error: e.message || 'Stripe Fehler' }, { status: 500 })
  }
}