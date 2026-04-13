import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { resumeText, jobDescription } = await request.json()
  if (!resumeText || !jobDescription) return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 })

  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'MISTRAL_API_KEY fehlt' }, { status: 500 })

  try {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        max_tokens: 1200,
        temperature: 0.5,
        messages: [{
          role: 'system',
          content: 'Du bist ein professioneller Bewerbungsberater. Erstelle individuelle Anschreiben auf Deutsch. Kein JSON, kein Markdown.'
        }, {
          role: 'user',
          content: `Erstelle ein professionelles Bewerbungsanschreiben auf Deutsch.

Aufbau:
- Ort, Datum
- Betreff: Bewerbung als [Stelle]
- Anrede
- Absatz 1: Interesse an der Stelle
- Absatz 2: Qualifikationen aus dem Lebenslauf
- Absatz 3: Mehrwert für das Unternehmen
- Mit freundlichen Grüßen + Name

Nur den Brief-Text, kein JSON, kein Markdown.

LEBENSLAUF:
${resumeText.substring(0, 1500)}

STELLENANZEIGE:
${jobDescription.substring(0, 1500)}`
        }]
      })
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.message || 'Mistral Fehler' }, { status: 500 })
    const coverLetter = data.choices?.[0]?.message?.content || ''
    return NextResponse.json({ coverLetter })
  } catch {
    return NextResponse.json({ error: 'Generierung fehlgeschlagen' }, { status: 500 })
  }
}
