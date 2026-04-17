import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

// Use service role for webhook (no user context)
function getAdminSupabase() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch(e: any) {
    console.error('Webhook signature verification failed:', e.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getAdminSupabase()

  switch (event.type) {
    case 'payment_intent.amount_capturable_updated': {
      // Payment authorized (manual capture) - money is held
      const pi = event.data.object as any
      const bookingId = pi.metadata?.booking_id
      if (bookingId) {
        await supabase
          .from('marketplace_bookings')
          .update({ payment_status: 'authorized', updated_at: new Date().toISOString() })
          .eq('id', bookingId)
      }
      break
    }

    case 'payment_intent.succeeded': {
      // Payment captured successfully
      const pi = event.data.object as any
      const bookingId = pi.metadata?.booking_id
      if (bookingId) {
        await supabase
          .from('marketplace_bookings')
          .update({ payment_status: 'paid', updated_at: new Date().toISOString() })
          .eq('id', bookingId)
      }
      break
    }

    case 'payment_intent.canceled': {
      const pi = event.data.object as any
      const bookingId = pi.metadata?.booking_id
      if (bookingId) {
        await supabase
          .from('marketplace_bookings')
          .update({ payment_status: 'cancelled', updated_at: new Date().toISOString() })
          .eq('id', bookingId)
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as any
      const bookingId = pi.metadata?.booking_id
      if (bookingId) {
        // Reset to none so client can retry
        await supabase
          .from('marketplace_bookings')
          .update({ payment_status: 'none', payment_intent_id: null, updated_at: new Date().toISOString() })
          .eq('id', bookingId)
      }
      break
    }

    case 'account.updated': {
      // Stripe Connect account updated (onboarding complete?)
      const account = event.data.object as any
      if (account.details_submitted && account.charges_enabled) {
        await supabase
          .from('profiles')
          .update({ stripe_onboarding_complete: true })
          .eq('stripe_account_id', account.id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

// Disable body parsing for webhook signature verification
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'