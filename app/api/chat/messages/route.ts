import { createClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

const WARNING_TEXT = '⚠️ Hinweis: Bei Barzahlung entfällt dein Talento-Käuferschutz. Wir empfehlen, alle Zahlungen über die Plattform abzuwickeln.'

// Schneller Keyword-Check (sofort, kein API-Call nötig)
const BYPASS_PATTERNS = [
  /\bbar\s*(bezahl|machen|geld|zahlen|kasse)/i,
  /\bbarzahlung/i,
  /\bcash\b/i,
  /\b(ohne|außerhalb)\s*(der\s*)?(plattform|talento)/i,
  /\bpaypal\s*(direkt|privat|schick)/i,
  /\b(meine?|deine?|schick.*)\s*iban\b/i,
  /\brevolut\b/i,
  /\bvenmo\b/i,
  /\büberweisen?\b.*direkt/i,
  /direkt.*\büberweisen?\b/i,
  /\bhand\s*shake/i,
  /\bschwarz\s*(arbeit|bezahl|kasse)/i,
  /\bam\s*finanzamt\s*vorbei/i,
]

function quickBypassCheck(content: string): boolean {
  return BYPASS_PATTERNS.some(p => p.test(content))
}

async function mistralBypassCheck(content: string): Promise<boolean> {
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

    // Chat-Scan: prüfe ob Zahlung außerhalb der Plattform vorgeschlagen wird
    // 1) Schneller Keyword-Check (sofort)
    // 2) Mistral-Check als Ergänzung (async, für subtilere Fälle)
    let warning = null
    const quickHit = quickBypassCheck(content)

    if (quickHit) {
      // Sofort warnen bei eindeutigen Keywords
      warning = {
        id: 'warn-' + Date.now(),
        conversation_id,
        sender_id: 'system-talento',
        content: WARNING_TEXT,
        created_at: new Date().toISOString(),
      }
    } else {
      // Mistral für subtilere Fälle (non-blocking: Fehler = keine Warnung)
      const mistralHit = await mistralBypassCheck(content)
      if (mistralHit) {
        warning = {
          id: 'warn-' + Date.now(),
          conversation_id,
          sender_id: 'system-talento',
          content: WARNING_TEXT,
          created_at: new Date().toISOString(),
        }
      }
    }

    return NextResponse.json({ message, warning })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
