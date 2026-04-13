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
        max_tokens: 1000,
        messages: [{
          role: 'system',
          content: 'Du bist ein präziser HR-Analyst. Vergleiche Lebensläufe mit Stellenanzeigen. Antworte NUR mit validem JSON.'
        }, {
          role: 'user',
          content: `Vergleiche diesen Lebenslauf mit der Stellenanzeige. Antworte NUR mit diesem JSON:
{
  "score": 75,
  "explanation": "Kurze Erklärung auf Deutsch (2-3 Sätze)",
  "matchingSkills": ["Skill1", "Skill2"],
  "missingSkills": ["Skill1", "Skill2"]
}

LEBENSLAUF:
${resumeText}

STELLENANZEIGE:
${jobDescription}`
        }]
      })
    })
    const data = await res.json()
    const content = data.choices?.[0]?.message?.content || '{}'
    const cleaned = content.replace(/```json|```/g, '').trim()
    return NextResponse.json(JSON.parse(cleaned))
  } catch {
    return NextResponse.json({ error: 'Matching fehlgeschlagen' }, { status: 500 })
  }
}
