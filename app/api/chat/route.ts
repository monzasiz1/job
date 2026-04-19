import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `Du bist "Talento KI", der intelligente Assistent der Talento-Plattform. Du hilfst Nutzern mit allem rund um Jobs, Bewerbungen und die Plattform.

DEINE FÄHIGKEITEN:
- Fragen zur Jobsuche beantworten (Filter, Kartenansicht, Swipe-Modus)
- Bewerbungstipps geben (Lebenslauf, Anschreiben, Vorstellungsgespräch)
- Plattform-Features erklären (KI-Tools, Marktplatz, Treuhand, Favoriten)
- Karriereberatung geben
- Gehaltsverhandlung Tipps
- Technische Hilfe zur Plattform

TALENTO-FEATURES die du kennst:
- Jobsuche mit KI-Match-Score, Gehaltsfilter, Umkreissuche, Kartenansicht
- KI-Tools: Lebenslauf-Analyse, Bewerbungs-Generator, Job-Matching
- Lokaler Marktplatz für Dienstleistungen (Handwerk, Nachhilfe, Kreativ etc.)
- Treuhand-Zahlungen über Stripe mit Käuferschutz
- Direktchat zwischen Bewerbern und Arbeitgebern
- Für Arbeitgeber: Stellenanzeigen ab 99€, Live-Dashboard

REGELN:
- Antworte IMMER auf Deutsch
- Halte Antworten kurz und hilfreich (max 3-4 Sätze wenn möglich)
- Sei freundlich aber professionell
- Verweise auf konkrete Plattform-Features wenn passend
- Bei technischen Problemen: empfehle Seite neu laden oder Support kontaktieren
- Formatiere mit kurzen Absätzen, keine Markdown-Überschriften`

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Keine Nachrichten' }, { status: 400 })
    }

    const apiKey = process.env.MISTRAL_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'KI nicht verfügbar' }, { status: 500 })
    }

    // Limit conversation history to last 10 messages to control token usage
    const recentMessages = messages.slice(-10)

    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        max_tokens: 500,
        temperature: 0.6,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...recentMessages.map((m: { role: string; content: string }) => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: typeof m.content === 'string' ? m.content.substring(0, 1000) : '',
          })),
        ],
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      return NextResponse.json({ error: 'KI-Antwort fehlgeschlagen' }, { status: 500 })
    }

    const reply = data.choices?.[0]?.message?.content || 'Entschuldigung, ich konnte keine Antwort generieren.'
    return NextResponse.json({ reply })
  } catch {
    return NextResponse.json({ error: 'Chat-Fehler aufgetreten' }, { status: 500 })
  }
}
