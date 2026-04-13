import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { resumeText } = await request.json()
  if (!resumeText) return NextResponse.json({ error: 'Kein Text' }, { status: 400 })

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'OpenAI API-Key fehlt. Bitte in Vercel Environment Variables eintragen: OPENAI_API_KEY' }, { status: 500 })

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        messages: [{
          role: 'system',
          content: 'Du bist ein erfahrener HR-Experte und Karriereberater. Analysiere Lebensläufe präzise auf Deutsch. Antworte NUR mit validem JSON.'
        }, {
          role: 'user',
          content: `Analysiere diesen Lebenslauf und antworte NUR mit diesem JSON (kein Markdown, kein Text davor/danach):
{
  "strengths": ["Stärke 1", "Stärke 2", "Stärke 3"],
  "weaknesses": ["Schwäche 1", "Schwäche 2"],
  "improvements": ["Verbesserung 1", "Verbesserung 2", "Verbesserung 3"]
}

Lebenslauf:
${resumeText}`
        }]
      })
    })
    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || '{}'
    const cleaned = content.replace(/```json|```/g, '').trim()
    return NextResponse.json(JSON.parse(cleaned))
  } catch (e) {
    return NextResponse.json({ error: 'Analyse fehlgeschlagen' }, { status: 500 })
  }
}
