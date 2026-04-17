import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_SENDER = 'system-talento'

async function scanForPaymentBypass(content: string): Promise<boolean> {
  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) return false
  try {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        messages: [
          {
            role: 'system',
            content:
              'Du bist ein Moderations-Bot für eine Dienstleistungs-Plattform. Antworte NUR mit "JA" oder "NEIN". Prüfe ob die folgende Chat-Nachricht einen Versuch enthält, die Bezahlung außerhalb der Plattform abzuwickeln. Beispiele: Barzahlung, PayPal direkt, Überweisung direkt, "ohne Plattform bezahlen", "bar machen", "cash", IBAN teilen, Revolut, Venmo, Handshake-Deal. Ignoriere harmlose Erwähnungen von Geld.',
          },
          { role: 'user', content },
        ],
        max_tokens: 5,
        temperature: 0,
      }),
    })
    if (!res.ok) return false
    const data = await res.json()
    const answer = data.choices?.[0]?.message?.content?.trim().toUpperCase() || ''
    return answer.startsWith('JA')
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const conversationId = searchParams.get('conversation_id')

    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversation_id' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json(messages)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { conversation_id, sender_id, content } = body

    if (!conversation_id || !sender_id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()

    // Speichere Nachricht
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert([{ conversation_id, sender_id, content }])
      .select()
      .single()

    if (msgError) throw msgError

    // Aktualisiere last_message in conversations
    await supabase
      .from('conversations')
      .update({ last_message: content, last_message_at: new Date().toISOString() })
      .eq('id', conversation_id)

    // Mistral-Scan: prüfe ob Zahlung außerhalb der Plattform vorgeschlagen wird
    let warning = null
    const isBypass = await scanForPaymentBypass(content)
    if (isBypass) {
      const { data: warnMsg } = await supabase
        .from('messages')
        .insert([{
          conversation_id,
          sender_id: SYSTEM_SENDER,
          content: '⚠️ Hinweis: Bei Barzahlung entfällt dein Talento-Käuferschutz. Wir empfehlen, alle Zahlungen über die Plattform abzuwickeln.',
        }])
        .select()
        .single()
      warning = warnMsg
    }

    return NextResponse.json({ message, warning })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
