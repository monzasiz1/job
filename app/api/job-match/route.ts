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
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: `Vergleiche diesen Lebenslauf mit der Stellenanzeige. Antworte NUR mit diesem JSON:
{"score":75,"explanation":"2-3 Sätze auf Deutsch","matchingSkills":["Skill1","Skill2"],"missingSkills":["Skill1","Skill2"]}

LEBENSLAUF:
${resumeText.substring(0, 1500)}

STELLE:
${jobDescription.substring(0, 1500)}`
        }]
      })
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'API Fehler' }, { status: 500 })
    const content = data.content?.[0]?.text || '{}'
    const start = content.indexOf('{'); const end = content.lastIndexOf('}')
    return NextResponse.json(JSON.parse(content.substring(start, end + 1)))
  } catch {
    return NextResponse.json({ error: 'Matching fehlgeschlagen' }, { status: 500 })
  }
}
