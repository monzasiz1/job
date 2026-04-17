import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { stripe, PLATFORM_FEE_PERCENT } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { booking_id } = await request.json()
  if (!booking_id) return NextResponse.json({ error: 'booking_id fehlt' }, { status: 400 })

  const { data: booking } = await supabase
    .from('marketplace_bookings')
    .select('*')
    .eq('id', booking_id)
    .single()

  if (!booking) return NextResponse.json({ error: 'Buchung nicht gefunden' }, { status: 404 })
  if (booking.client_id !== user.id) return NextResponse.json({ error: 'Nur der Auftraggeber darf bezahlen' }, { status: 403 })
  if (booking.status !== 'accepted') return NextResponse.json({ error: 'Buchung muss angenommen sein' }, { status: 400 })

  // Wenn bereits ein PaymentIntent existiert, diesen wiederverwenden
  if (booking.payment_intent_id) {
    try {
      const existing = await stripe.paymentIntents.retrieve(booking.payment_intent_id)
      // Nur wiederverwenden wenn noch nicht abgeschlossen oder storniert
      if (['requires_payment_method', 'requires_confirmation', 'requires_action'].includes(existing.status)) {
        return NextResponse.json({
          clientSecret: existing.client_secret,
          amount: existing.amount,
          platformFee: booking.platform_fee || 0,
        })
      }
      if (existing.status === 'succeeded' || existing.status === 'processing') {
        return NextResponse.json({ error: 'Zahlung wurde bereits durchgeführt' }, { status: 400 })
      }
      // canceled/requires_capture → neuen PI erstellen (weiter unten)
    } catch(e) {
      // PI nicht mehr gültig → neuen erstellen
    }
  }

  // Get provider Stripe account
  const { data: providerProfile } = await supabase
    .from('profiles')
    .select('stripe_account_id, stripe_onboarding_complete')
    .eq('id', booking.provider_id)
    .single()

  if (!providerProfile?.stripe_account_id || !providerProfile?.stripe_onboarding_complete) {
    return NextResponse.json({ error: 'Der Anbieter hat noch kein Zahlungskonto eingerichtet' }, { status: 400 })
  }

  // Calculate amount in cents
  let amountCents = booking.price_amount || 0

  if (booking.price_type === 'hourly' && booking.estimated_hours) {
    // Reserve 120% buffer for hourly jobs
    amountCents = Math.ceil(amountCents * Number(booking.estimated_hours) * 1.2)
  }

  if (amountCents < 50) {
    return NextResponse.json({ error: 'Mindestbetrag ist 0,50 EUR' }, { status: 400 })
  }

  const platformFee = Math.round(amountCents * PLATFORM_FEE_PERCENT / 100)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'eur',
      capture_method: 'manual',
      automatic_payment_methods: { enabled: true },
      transfer_data: {
        destination: providerProfile.stripe_account_id,
      },
      application_fee_amount: platformFee,
      metadata: {
        booking_id: booking.id,
        client_id: booking.client_id,
        provider_id: booking.provider_id,
        price_type: booking.price_type || 'fixed',
      },
    })

    // Save PaymentIntent ID (status stays 'none' until client confirms)
    await supabase
      .from('marketplace_bookings')
      .update({
        payment_intent_id: paymentIntent.id,
        platform_fee: platformFee,
        provider_payout: amountCents - platformFee,
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking_id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: amountCents,
      platformFee,
    })
  } catch(e: any) {
    return NextResponse.json({ error: e.message || 'Stripe Fehler' }, { status: 500 })
  }
}
