import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { resumeText } = await request.json()
  if (!resumeText) return NextResponse.json({ error: 'Kein Text' }, { status: 400 })

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GROQ_API_KEY fehlt in Vercel Environment Variables' }, { status: 500 })

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 1000,
        temperature: 0.3,
        messages: [{
          role: 'system',
          content: 'Du bist ein erfahrener HR-Experte. Analysiere Lebensläufe auf Deutsch. Antworte NUR mit validem JSON, kein Markdown, kein Text davor oder danach.'
        }, {
          role: 'user',
          content: `Analysiere diesen Lebenslauf. Antworte NUR mit diesem JSON-Format:
{"strengths":["Stärke 1","Stärke 2","Stärke 3"],"weaknesses":["Schwäche 1","Schwäche 2"],"improvements":["Tipp 1","Tipp 2","Tipp 3"]}

Lebenslauf:
${resumeText.substring(0, 3000)}`
        }]
      })
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'Groq Fehler' }, { status: 500 })
    const content = data.choices?.[0]?.message?.content || '{}'
    const cleaned = content.replace(/```json|```/g, '').trim()
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    const jsonStr = cleaned.substring(start, end + 1)
    return NextResponse.json(JSON.parse(jsonStr))
  } catch (e) {
    return NextResponse.json({ error: 'Analyse fehlgeschlagen. Bitte versuche es erneut.' }, { status: 500 })
  }
}
