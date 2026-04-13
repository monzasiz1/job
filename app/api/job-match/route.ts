import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { resumeText, jobDescription } = await request.json()
  if (!resumeText || !jobDescription) return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY fehlt' }, { status: 500 })

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Vergleiche diesen Lebenslauf mit der Stellenanzeige. Antworte NUR mit diesem JSON:
{"score":75,"explanation":"2-3 Sätze auf Deutsch","matchingSkills":["Skill1","Skill2"],"missingSkills":["Skill1","Skill2"]}

LEBENSLAUF:
${resumeText.substring(0, 1500)}

STELLE:
${jobDescription.substring(0, 1500)}` }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 800 }
      })
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'Gemini Fehler' }, { status: 500 })
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
    const cleaned = content.replace(/```json|```/g, '').trim()
    const start = cleaned.indexOf('{'); const end = cleaned.lastIndexOf('}')
    return NextResponse.json(JSON.parse(cleaned.substring(start, end + 1)))
  } catch {
    return NextResponse.json({ error: 'Matching fehlgeschlagen' }, { status: 500 })
  }
}
