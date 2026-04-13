import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { resumeText, jobDescription } = await request.json()
  if (!resumeText || !jobDescription) return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY fehlt' }, { status: 500 })

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Erstelle ein professionelles Bewerbungsanschreiben auf Deutsch.

Aufbau:
- Ort, Datum (heutiges Datum)
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
${jobDescription.substring(0, 1500)}` }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 1200 }
      })
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'Gemini Fehler' }, { status: 500 })
    const coverLetter = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return NextResponse.json({ coverLetter })
  } catch {
    return NextResponse.json({ error: 'Generierung fehlgeschlagen' }, { status: 500 })
  }
}
