import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

/**
 * POST /api/map-recommend
 * KI-basierte Empfehlung: Welche Angebote/Jobs passen zu den Fähigkeiten des Nutzers?
 * Nutzt Mistral um aus dem Profil die besten Matches zu finden.
 */
export async function POST(request: Request) {
  const apiKey = process.env.MISTRAL_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'MISTRAL_API_KEY fehlt' }, { status: 500 })

  const supabase = createClient()
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { offerings, jobs, requests } = await request.json()

  // Profil laden
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio, skills, experience_years, role')
    .eq('id', user.id)
    .single()

  if (!profile) return NextResponse.json({ error: 'Kein Profil' }, { status: 404 })

  const skills = profile.skills?.join(', ') || 'keine angegeben'
  const bio = profile.bio || 'keine Bio'

  // Kurze Zusammenfassung der Items für KI
  const itemSummary: string[] = []
  if (offerings?.length) {
    offerings.slice(0, 15).forEach((o: any, i: number) => {
      itemSummary.push(`A${i + 1}: "${o.title}" (${o.category}, ${o.location_name})${o.price_info ? ` - ${o.price_info}` : ''}`)
    })
  }
  if (jobs?.length) {
    jobs.slice(0, 15).forEach((j: any, i: number) => {
      itemSummary.push(`J${i + 1}: "${j.title}" bei ${j.company} (${j.location}, ${j.type})`)
    })
  }
  if (requests?.length) {
    requests.slice(0, 15).forEach((r: any, i: number) => {
      const urg = r.urgency === 'sofort' ? '🔴 Sofort' : r.urgency === 'diese_woche' ? '🟡 Diese Woche' : '🟢 Flexibel'
      itemSummary.push(`G${i + 1}: GESUCH "${r.title}" (${r.category}, ${r.location_name}, ${urg})${r.budget ? ` - Budget: ${r.budget}` : ''}`)
    })
  }

  if (!itemSummary.length) {
    return NextResponse.json({ recommendations: [], suggestions: [], summary: 'Keine Angebote oder Jobs in der Nähe gefunden.' })
  }

  try {
    const res = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'mistral-small-latest',
        max_tokens: 800,
        temperature: 0.4,
        messages: [{
          role: 'system',
          content: 'Du bist ein Karriere- und Marktplatz-Assistent. Antworte NUR mit validem JSON, kein Markdown.'
        }, {
          role: 'user',
          content: `Nutzer-Profil:
- Name: ${profile.full_name}
- Rolle: ${profile.role}
- Skills: ${skills}
- Erfahrung: ${profile.experience_years || 0} Jahre
- Bio: ${bio.substring(0, 300)}

Verfügbare Angebote/Jobs/Gesuche in der Nähe:
${itemSummary.join('\n')}

Aufgaben:
1. Wähle die 3-5 besten Matches aus den Angeboten/Jobs/Gesuchen und erkläre kurz warum. Bei Gesuchen (G1, G2...): matche den Nutzer als potenziellen Helfer, wenn seine Skills zum Gesuch passen.
2. Schlage dem Nutzer 2-4 Fähigkeiten/Dienstleistungen vor, die er basierend auf seinen Skills selbst auf dem Marktplatz ANBIETEN könnte (z.B. Nachhilfe, Beratung, Reparatur). Sei kreativ und konkret!

Antworte NUR mit diesem JSON:
{"summary":"1-2 Sätze Gesamteinschätzung auf Deutsch","recommendations":[{"id":"A1 oder J3 oder G2 etc","reason":"Kurzer Grund auf Deutsch"}],"suggestions":[{"title":"Konkreter Angebotstitel","category":"Passende Kategorie","reason":"Warum das zu den Skills passt"}]}`
        }]
      })
    })

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data.message || 'Mistral Fehler' }, { status: 500 })

    const content = data.choices?.[0]?.message?.content || '{}'
    const cleaned = content.replace(/```json|```/g, '').trim()
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    return NextResponse.json(JSON.parse(cleaned.substring(start, end + 1)))
  } catch {
    return NextResponse.json({ error: 'KI-Empfehlung fehlgeschlagen' }, { status: 500 })
  }
}
