import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { userId, method } = await request.json()
    if (!userId || !method) {
      return NextResponse.json({ error: 'Fehlende Parameter' }, { status: 400 })
    }
    if (method !== 'email' && method !== 'phone') {
      return NextResponse.json({ error: 'Ungültige Methode' }, { status: 400 })
    }

    // Profil laden
    const { data: profile, error: pErr } = await supabaseAdmin
      .from('profiles')
      .select('email, phone, email_verified, phone_verified, verified')
      .eq('id', userId)
      .single()

    if (pErr || !profile) {
      return NextResponse.json({ error: 'Profil nicht gefunden' }, { status: 404 })
    }

    // Prüfen ob Kontaktdaten vorhanden
    if (method === 'phone' && !profile.phone) {
      return NextResponse.json({ error: 'Keine Telefonnummer hinterlegt. Bitte zuerst im Profil ergänzen.' }, { status: 400 })
    }

    // Bereits verifiziert?
    if (method === 'email' && profile.email_verified) {
      return NextResponse.json({ error: 'E-Mail bereits verifiziert' }, { status: 400 })
    }
    if (method === 'phone' && profile.phone_verified) {
      return NextResponse.json({ error: 'Telefon bereits verifiziert' }, { status: 400 })
    }

    // Code generieren (6 Stellen, 10 Min gültig)
    const code = generateCode()
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    await supabaseAdmin
      .from('profiles')
      .update({
        verification_code: code,
        verification_code_expires: expires,
      })
      .eq('id', userId)

    // In Produktion würde hier SMS/E-Mail versendet werden
    // Für Demo: Code wird im Response zurückgegeben
    // TODO: Twilio SMS oder Resend E-Mail Versand einbauen
    const target = method === 'email' ? profile.email : profile.phone

    return NextResponse.json({
      success: true,
      message: `Verifizierungscode wurde an ${method === 'email' ? 'deine E-Mail' : 'deine Telefonnummer'} gesendet.`,
      // Demo-Modus: Code direkt zurückgeben (in Prod entfernen!)
      demo_code: code,
      target,
    })
  } catch {
    return NextResponse.json({ error: 'Server-Fehler' }, { status: 500 })
  }
}
