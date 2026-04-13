import { createClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import type { Job } from '@/lib/types'
import JobsClient from './JobsClient'

// Haversine in km
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

// Koordinaten-Lookup für häufige deutsche Städte + PLZ-Regionen
const CITY_COORDS: Record<string, [number, number]> = {
  'berlin': [52.52, 13.405], 'münchen': [48.137, 11.576], 'hamburg': [53.551, 9.993],
  'frankfurt': [50.11, 8.682], 'köln': [50.938, 6.96], 'düsseldorf': [51.227, 6.773],
  'stuttgart': [48.775, 9.182], 'dortmund': [51.514, 7.468], 'essen': [51.455, 7.012],
  'bremen': [53.075, 8.808], 'leipzig': [51.34, 12.374], 'dresden': [51.05, 13.737],
  'hannover': [52.374, 9.738], 'nürnberg': [49.453, 11.077], 'duisburg': [51.434, 6.762],
  'bochum': [51.482, 7.216], 'wuppertal': [51.256, 7.15], 'bielefeld': [52.021, 8.532],
  'bonn': [50.733, 7.099], 'münster': [51.962, 7.626], 'karlsruhe': [49.009, 8.404],
  'mannheim': [49.487, 8.466], 'augsburg': [48.37, 10.898], 'wiesbaden': [50.082, 8.243],
  'gelsenkirchen': [51.517, 7.085], 'mönchengladbach': [51.18, 6.437],
  'braunschweig': [52.267, 10.517], 'kiel': [54.323, 10.123], 'chemnitz': [50.833, 12.917],
  'aachen': [50.776, 6.084], 'halle': [51.48, 11.97], 'magdeburg': [52.131, 11.628],
  'freiburg': [47.999, 7.842], 'krefeld': [51.337, 6.585], 'lübeck': [53.866, 10.686],
  'oberhausen': [51.47, 6.852], 'erfurt': [50.978, 11.029], 'rostock': [54.088, 12.14],
  'mainz': [49.999, 8.274], 'kassel': [51.312, 9.481], 'hagen': [51.36, 7.474],
  'hamm': [51.68, 7.815], 'saarbrücken': [49.234, 6.997], 'mülheim': [51.427, 6.883],
  'potsdam': [52.396, 13.058], 'ludwigshafen': [49.477, 8.445], 'oldenburg': [53.143, 8.214],
  'leverkusen': [51.045, 6.984], 'osnabrück': [52.279, 8.047], 'solingen': [51.178, 7.083],
  'heidelberg': [49.399, 8.673], 'neuss': [51.198, 6.686], 'darmstadt': [49.872, 8.652],
  'regensburg': [49.013, 12.102], 'paderborn': [51.719, 8.754], 'ingolstadt': [48.763, 11.424],
  'würzburg': [49.795, 9.932], 'wolfsburg': [52.423, 10.788], 'ulm': [48.401, 9.987],
  'göttingen': [51.534, 9.932], 'heilbronn': [49.14, 9.22], 'recklinghausen': [51.614, 7.197],
  'willich': [51.263, 6.549], 'viersen': [51.254, 6.395], 'kempen': [51.364, 6.419],
  'tönisvorst': [51.32, 6.496], 'meerbusch': [51.264, 6.689], 'kaarst': [51.226, 6.619],
  'korschenbroich': [51.186, 6.513], 'nettetal': [51.318, 6.279], 'niederkrüchten': [51.204, 6.219],
  'schwalmtal': [51.225, 6.257], 'brüggen': [51.243, 6.181], 'grefrath': [51.334, 6.338],
  'geldern': [51.518, 6.327], 'kleve': [51.789, 6.139], 'wesel': [51.657, 6.619],
  'dinslaken': [51.566, 6.727], 'moers': [51.452, 6.626], 'neukirchen': [51.441, 6.549],
}

function findCityCoords(locationStr: string): [number, number] | null {
  const loc = locationStr.toLowerCase().trim()
  // Direkte Übereinstimmung
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (loc.includes(city) || city.includes(loc)) return coords
  }
  // PLZ-Lookup (erste 3 Ziffern → Region)
  const plzMatch = loc.match(/\b(\d{5})\b/)
  if (plzMatch) {
    const plz = plzMatch[1]
    const prefix = plzMatch[1].substring(0, 2)
    // NRW PLZ-Bereiche
    if (plz.startsWith('478') || plz.startsWith('477') || plz.startsWith('476')) return [51.337, 6.585] // Krefeld
    if (plz.startsWith('478') && parseInt(plz) >= 47800) return [51.337, 6.585]
    if (plz.startsWith('477')) return [51.263, 6.549] // Willich
    if (prefix === '10' || prefix === '12' || prefix === '13' || prefix === '14') return [52.52, 13.405]
    if (prefix === '20' || prefix === '21' || prefix === '22') return [53.551, 9.993]
    if (prefix === '40' || prefix === '41') return [51.227, 6.773]
    if (prefix === '42' || prefix === '43' || prefix === '44') return [51.514, 7.468]
    if (prefix === '45') return [51.455, 7.012]
    if (prefix === '47') return [51.337, 6.585] // Krefeld/Duisburg
    if (prefix === '50' || prefix === '51') return [50.938, 6.96]
    if (prefix === '60' || prefix === '61' || prefix === '63') return [50.11, 8.682]
    if (prefix === '70' || prefix === '71' || prefix === '72') return [48.775, 9.182]
    if (prefix === '80' || prefix === '81' || prefix === '82') return [48.137, 11.576]
  }
  return null
}

export default async function JobsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const supabase = createClient()
  let query = supabase.from('jobs').select('*, profiles(avatar_url, company_name)').eq('is_active', true).order('created_at', { ascending: false })

  if (searchParams.q) query = query.ilike('title', `%${searchParams.q}%`)
  if (searchParams.type) query = query.eq('type', searchParams.type)
  if (searchParams.contract) query = query.eq('contract', searchParams.contract)
  if (searchParams.level) query = query.eq('level', searchParams.level)
  if (searchParams.field) query = query.ilike('field', `%${searchParams.field}%`)
  if (searchParams.salary_min) query = query.gte('salary_min', parseInt(searchParams.salary_min))

  const { data: jobs } = await query
  let list: Job[] = jobs || []

  // Umkreissuche
  const centerLat = searchParams.clat ? parseFloat(searchParams.clat) : null
  const centerLng = searchParams.clng ? parseFloat(searchParams.clng) : null
  const radius = searchParams.radius ? parseFloat(searchParams.radius) : null

  if (centerLat && centerLng && radius && radius < 999) {
    list = list.filter(job => {
      // 1. Job hat eigene Koordinaten → exakt
      if (job.lat && job.lng) {
        return haversine(centerLat, centerLng, job.lat, job.lng) <= radius
      }
      // 2. Koordinaten aus Stadtname/PLZ ermitteln
      const jobCoords = findCityCoords(job.location)
      if (jobCoords) {
        return haversine(centerLat, centerLng, jobCoords[0], jobCoords[1]) <= radius
      }
      // 3. Fallback: Stadtname-Vergleich
      const city = (searchParams.city || '').toLowerCase()
      return city ? job.location.toLowerCase().includes(city) : false
    })
  } else if (searchParams.city && !centerLat) {
    list = list.filter(job => job.location.toLowerCase().includes(searchParams.city.toLowerCase()))
  }

  const hasFilters = !!(searchParams.q || searchParams.city || searchParams.type || searchParams.contract || searchParams.level || searchParams.field || searchParams.salary_min)

  return (
    <>
      <Navbar />
      <JobsClient initialJobs={list} searchParams={searchParams} hasFilters={hasFilters} />
      <footer>
        <div className="footer-inner">
          <div className="footer-logo-wrap"><div className="logo-dot" />WorkMatch</div>
          <div style={{ fontSize: '0.82rem' }}>© 2026 WorkMatch · Made in 🇩🇪</div>
        </div>
      </footer>
    </>
  )
}
