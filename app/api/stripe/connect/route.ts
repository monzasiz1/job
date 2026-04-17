import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

// POST - Create Express account + onboarding link
export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_account_id, stripe_onboarding_complete, full_name, email')
    .eq('id', user.id)
    .single()

  let accountId = profile?.stripe_account_id

  if (!accountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email || profile?.email || undefined,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_profile: {
        product_description: 'Dienstleistungen ueber Talento Marktplatz',
      },
      metadata: { user_id: user.id },
    })
    accountId = account.id

    await supabase
      .from('profiles')
      .update({ stripe_account_id: accountId })
      .eq('id', user.id)
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://localhost:3000'

  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: baseUrl + '/dashboard?stripe=refresh',
    return_url: baseUrl + '/dashboard?stripe=complete',
    type: 'account_onboarding',
  })

  return NextResponse.json({ url: accountLink.url, accountId })
}

// GET - Check onboarding status
export async function GET() {
  const supabase = createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_account_id, stripe_onboarding_complete')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_account_id) {
    return NextResponse.json({ connected: false, onboarded: false })
  }

  if (profile.stripe_onboarding_complete) {
    return NextResponse.json({ connected: true, onboarded: true, accountId: profile.stripe_account_id })
  }

  try {
    const account = await stripe.accounts.retrieve(profile.stripe_account_id)
    const isComplete = !!(account.details_submitted && account.charges_enabled)

    if (isComplete) {
      await supabase
        .from('profiles')
        .update({ stripe_onboarding_complete: true })
        .eq('id', user.id)
    }

    return NextResponse.json({ connected: true, onboarded: isComplete, accountId: profile.stripe_account_id })
  } catch(e) {
    return NextResponse.json({ connected: true, onboarded: false, accountId: profile.stripe_account_id })
  }
}