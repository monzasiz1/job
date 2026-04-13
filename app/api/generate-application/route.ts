import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { resumeText, jobDescription } = await request.json()
  if (!resumeText || !jobDescription) return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'OpenAI API-Key fehlt' }, { status: 500 })

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1200,
        messages: [{
          role: 'system',
          content: 'Du bist ein erfahrener Bewerbungsberater. Erstelle professionelle, individuelle Anschreiben auf Deutsch. Keine generischen Phrasen.'
        }, {
          role: 'user',
          content: `Erstelle ein maßgeschneidertes Bewerbungsanschreiben basierend auf dem Lebenslauf und der Stelle.

Format: Professionelles deutsches Anschreiben mit:
- Ort, Datum
- Betreff
- Anrede (falls kein Name, "Sehr geehrte Damen und Herren")
- 3-4 Absätze (Einstieg, Qualifikationen, Motivation, Abschluss)
- Unterschrift

LEBENSLAUF:
${resumeText}

STELLENANZEIGE:
${jobDescription}

Antworte NUR mit dem Anschreiben-Text, kein JSON, kein Markdown.`
        }]
      })
    })
    const data = await res.json()
    const coverLetter = data.choices?.[0]?.message?.content || ''
    return NextResponse.json({ coverLetter })
  } catch {
    return NextResponse.json({ error: 'Generierung fehlgeschlagen' }, { status: 500 })
  }
}
