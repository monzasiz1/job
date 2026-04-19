import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { userId, code, method } = await request.json()
    if (!userId || !code || !method) {
      return NextResponse.json({ error: 'Fehlende Parameter' }, { status: 400 })
    }

    // Profil mit Code laden
    const { data: profile, error: pErr } = await supabaseAdmin
      .from('profiles')
      .select('verification_code, verification_code_expires, email_verified, phone_verified')
      .eq('id', userId)
      .single()

    if (pErr || !profile) {
      return NextResponse.json({ error: 'Profil nicht gefunden' }, { status: 404 })
    }

    // Code prüfen
    if (!profile.verification_code) {
      return NextResponse.json({ error: 'Kein aktiver Verifizierungscode. Bitte neuen Code anfordern.' }, { status: 400 })
    }

    // Ablauf prüfen
    if (new Date(profile.verification_code_expires) < new Date()) {
      await supabaseAdmin
        .from('profiles')
        .update({ verification_code: null, verification_code_expires: null })
        .eq('id', userId)
      return NextResponse.json({ error: 'Code abgelaufen. Bitte neuen Code anfordern.' }, { status: 400 })
    }

    // Code vergleichen
    if (profile.verification_code !== code.trim()) {
      return NextResponse.json({ error: 'Falscher Code. Bitte erneut versuchen.' }, { status: 400 })
    }

    // Verifizierung setzen
    const updates: Record<string, any> = {
      verification_code: null,
      verification_code_expires: null,
    }

    if (method === 'email') {
      updates.email_verified = true
    } else if (method === 'phone') {
      updates.phone_verified = true
    }

    // Prüfen ob jetzt beides verifiziert → Goldener Haken
    const emailDone = method === 'email' ? true : profile.email_verified
    const phoneDone = method === 'phone' ? true : profile.phone_verified

    if (emailDone && phoneDone) {
      updates.verified = true
      updates.verified_at = new Date().toISOString()
    }

    await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    const fullyVerified = emailDone && phoneDone

    return NextResponse.json({
      success: true,
      verified: fullyVerified,
      email_verified: method === 'email' ? true : profile.email_verified,
      phone_verified: method === 'phone' ? true : profile.phone_verified,
      message: fullyVerified
        ? 'Profil vollständig verifiziert! Du hast jetzt das goldene Verified-Siegel.'
        : `${method === 'email' ? 'E-Mail' : 'Telefon'} erfolgreich verifiziert.`,
    })
  } catch {
    return NextResponse.json({ error: 'Server-Fehler' }, { status: 500 })
  }
}
