import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { stripe, PLATFORM_FEE_PERCENT } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { booking_id, actual_hours } = await request.json()
  if (!booking_id) return NextResponse.json({ error: 'booking_id fehlt' }, { status: 400 })

  const { data: booking } = await supabase
    .from('marketplace_bookings')
    .select('*')
    .eq('id', booking_id)
    .single()

  if (!booking) return NextResponse.json({ error: 'Buchung nicht gefunden' }, { status: 404 })

  // Only provider or client can trigger capture (via completion)
  const isProvider = booking.provider_id === user.id
  const isClient = booking.client_id === user.id
  if (!isProvider && !isClient) return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })

  if (!booking.payment_intent_id) return NextResponse.json({ error: 'Kein PaymentIntent vorhanden' }, { status: 400 })
  if (booking.payment_status !== 'authorized') return NextResponse.json({ error: 'Zahlung nicht autorisiert' }, { status: 400 })

  try {
    let captureAmount: number | undefined = undefined

    // For hourly: calculate final amount based on actual hours
    if (booking.price_type === 'hourly' && actual_hours && booking.price_amount) {
      captureAmount = Math.round(booking.price_amount * Number(actual_hours))

      // Recalculate platform fee for actual amount
      const newFee = Math.round(captureAmount * PLATFORM_FEE_PERCENT / 100)

      await supabase
        .from('marketplace_bookings')
        .update({
          actual_hours: Number(actual_hours),
          platform_fee: newFee,
          provider_payout: captureAmount - newFee,
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking_id)
    }

    // Capture the payment
    const captured = await stripe.paymentIntents.capture(booking.payment_intent_id, {
      ...(captureAmount ? { amount_to_capture: captureAmount } : {}),
    })

    if (captured.status === 'succeeded') {
      await supabase
        .from('marketplace_bookings')
        .update({ payment_status: 'captured', updated_at: new Date().toISOString() })
        .eq('id', booking_id)
    }

    return NextResponse.json({ payment_status: 'captured', captured_amount: captured.amount_received })
  } catch(e: any) {
    return NextResponse.json({ error: e.message || 'Capture fehlgeschlagen' }, { status: 500 })
  }
}