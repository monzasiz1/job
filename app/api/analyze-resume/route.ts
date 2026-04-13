import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { resumeText } = await request.json()
  if (!resumeText) return NextResponse.json({ error: 'Kein Text' }, { status: 400 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY fehlt in Vercel Environment Variables' }, { status: 500 })

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Du bist ein erfahrener HR-Experte. Analysiere diesen Lebenslauf auf Deutsch.
Antworte NUR mit diesem JSON (kein Markdown, kein Text davor/danach):
{"strengths":["Stärke 1","Stärke 2","Stärke 3"],"weaknesses":["Schwäche 1","Schwäche 2"],"improvements":["Tipp 1","Tipp 2","Tipp 3"]}

Lebenslauf:
${resumeText.substring(0, 3000)}` }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1000 }
      })
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'Gemini Fehler' }, { status: 500 })
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    const cleaned = content.replace(/```json|```/g, '').trim()
    const start = cleaned.indexOf('{'); const end = cleaned.lastIndexOf('}')
    return NextResponse.json(JSON.parse(cleaned.substring(start, end + 1)))
  } catch {
    return NextResponse.json({ error: 'Analyse fehlgeschlagen.' }, { status: 500 })
  }
}
