import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { resumeText, jobDescription } = await request.json()
  if (!resumeText || !jobDescription) return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY fehlt' }, { status: 500 })

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        messages: [{
          role: 'user',
          content: `Erstelle ein professionelles Bewerbungsanschreiben auf Deutsch.

Aufbau:
- Ort, Datum
- Betreff: Bewerbung als [Stelle]
- Anrede
- Absatz 1: Konkretes Interesse an der Stelle
- Absatz 2: Passende Qualifikationen aus dem Lebenslauf
- Absatz 3: Mehrwert für das Unternehmen
- "Mit freundlichen Grüßen" + Name

Nur den Brief-Text, kein JSON, kein Markdown.

LEBENSLAUF:
${resumeText.substring(0, 1500)}

STELLENANZEIGE:
${jobDescription.substring(0, 1500)}`
        }]
      })
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'API Fehler' }, { status: 500 })
    const coverLetter = data.content?.[0]?.text || ''
    return NextResponse.json({ coverLetter })
  } catch {
    return NextResponse.json({ error: 'Generierung fehlgeschlagen' }, { status: 500 })
  }
}
