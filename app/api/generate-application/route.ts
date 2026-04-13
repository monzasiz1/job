import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { resumeText, jobDescription } = await request.json()
  if (!resumeText || !jobDescription) return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GROQ_API_KEY fehlt' }, { status: 500 })

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1200,
        temperature: 0.5,
        messages: [{
          role: 'system',
          content: 'Du bist ein professioneller Bewerbungsberater. Erstelle überzeugende, individuelle Anschreiben auf Deutsch. Keine generischen Floskeln.'
        }, {
          role: 'user',
          content: `Erstelle ein professionelles Bewerbungsanschreiben.

Struktur:
- Ort, Datum (heutiges Datum)
- Betreff: Bewerbung als [Stelle]
- Anrede
- Absatz 1: Interesse an der Stelle (konkret, nicht generisch)
- Absatz 2: Passende Qualifikationen aus dem Lebenslauf
- Absatz 3: Motivation / Mehrwert für das Unternehmen
- Abschluss + "Mit freundlichen Grüßen"
- Name aus dem Lebenslauf

Nur den Brief-Text, kein JSON, kein Markdown.

LEBENSLAUF:
${resumeText.substring(0, 1500)}

STELLENANZEIGE:
${jobDescription.substring(0, 1500)}`
        }]
      })
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'Groq Fehler' }, { status: 500 })
    const coverLetter = data.choices?.[0]?.message?.content || ''
    return NextResponse.json({ coverLetter })
  } catch {
    return NextResponse.json({ error: 'Generierung fehlgeschlagen' }, { status: 500 })
  }
}
