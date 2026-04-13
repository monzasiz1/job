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
      body: JSON.stringify({ model: 'mistral-small-latest', max_tokens: 1200, temperature: 0.5,
        messages: [{ role: 'system', content: 'Du bist ein Bewerbungsberater. Erstelle Anschreiben auf Deutsch. Kein JSON, kein Markdown.' },
        { role: 'user', content: `Erstelle ein professionelles Bewerbungsanschreiben.\n\nAufbau: Ort+Datum, Betreff, Anrede, 3 Absätze, Mit freundlichen Grüßen + Name.\n\nLEBENSLAUF:\n${resumeText.substring(0, 1500)}\n\nSTELLENANZEIGE:\n${jobDescription.substring(0, 1500)}` }] })
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.message || 'Mistral Fehler' }, { status: 500 })
    const coverLetter = data.choices?.[0]?.message?.content || ''
    return NextResponse.json({ coverLetter })
  } catch { return NextResponse.json({ error: 'Generierung fehlgeschlagen' }, { status: 500 }) }
}
