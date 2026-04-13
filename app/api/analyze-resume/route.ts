import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { resumeText } = await request.json()
  if (!resumeText) return NextResponse.json({ error: 'Kein Text' }, { status: 400 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY fehlt in Vercel Environment Variables' }, { status: 500 })

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
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `Du bist ein erfahrener HR-Experte. Analysiere diesen Lebenslauf auf Deutsch.
Antworte NUR mit diesem JSON (kein Markdown, kein Text davor/danach):
{"strengths":["Stärke 1","Stärke 2","Stärke 3"],"weaknesses":["Schwäche 1","Schwäche 2"],"improvements":["Tipp 1","Tipp 2","Tipp 3"]}

Lebenslauf:
${resumeText.substring(0, 3000)}`
        }]
      })
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'API Fehler' }, { status: 500 })
    const content = data.content?.[0]?.text || '{}'
    const start = content.indexOf('{'); const end = content.lastIndexOf('}')
    return NextResponse.json(JSON.parse(content.substring(start, end + 1)))
  } catch {
    return NextResponse.json({ error: 'Analyse fehlgeschlagen.' }, { status: 500 })
  }
}
