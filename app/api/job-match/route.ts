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
        max_tokens: 800,
        temperature: 0.2,
        messages: [{
          role: 'system',
          content: 'Du bist ein präziser HR-Analyst. Vergleiche Lebensläufe mit Stellenanzeigen. Antworte NUR mit validem JSON.'
        }, {
          role: 'user',
          content: `Vergleiche Lebenslauf mit Stelle. Antworte NUR mit diesem JSON:
{"score":75,"explanation":"2-3 Sätze Erklärung auf Deutsch","matchingSkills":["Skill1","Skill2"],"missingSkills":["Skill1","Skill2"]}

LEBENSLAUF:
${resumeText.substring(0, 1500)}

STELLE:
${jobDescription.substring(0, 1500)}`
        }]
      })
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'Groq Fehler' }, { status: 500 })
    const content = data.choices?.[0]?.message?.content || '{}'
    const cleaned = content.replace(/```json|```/g, '').trim()
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    return NextResponse.json(JSON.parse(cleaned.substring(start, end + 1)))
  } catch {
    return NextResponse.json({ error: 'Matching fehlgeschlagen' }, { status: 500 })
  }
}
