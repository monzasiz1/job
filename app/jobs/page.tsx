import { createClient } from '@/lib/supabase-server'
import Sidebar from '@/components/Sidebar'
import JobsClient from './JobsClient'

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371, dLat = (lat2-lat1)*Math.PI/180, dLng = (lng2-lng1)*Math.PI/180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2
  return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

const CITY_COORDS: Record<string, [number,number]> = {
  'berlin':[52.52,13.405],'münchen':[48.137,11.576],'hamburg':[53.551,9.993],
  'frankfurt':[50.11,8.682],'köln':[50.938,6.96],'düsseldorf':[51.227,6.773],
  'krefeld':[51.337,6.585],'willich':[51.263,6.549],'dortmund':[51.514,7.468],
  'essen':[51.455,7.012],'duisburg':[51.434,6.762],'wuppertal':[51.256,7.15],
  'bonn':[50.733,7.099],'aachen':[50.776,6.084],'mönchengladbach':[51.18,6.437],
  'stuttgart':[48.775,9.182],'nürnberg':[49.453,11.077],'leipzig':[51.34,12.374],
  'dresden':[51.05,13.737],'hannover':[52.374,9.738],'bremen':[53.075,8.808],
}
function findCoords(loc: string): [number,number]|null {
  const l = loc.toLowerCase().trim()
  for (const [c,coords] of Object.entries(CITY_COORDS)) if (l.includes(c)||c.includes(l)) return coords
  const plz = l.match(/\b(\d{5})\b/)
  if (plz) {
    const p = plz[1]
    if (p.startsWith('47')) return [51.337,6.585]
    if (p.startsWith('40')||p.startsWith('41')) return [51.227,6.773]
    if (p.startsWith('50')||p.startsWith('51')) return [50.938,6.96]
    if (p.startsWith('10')||p.startsWith('12')) return [52.52,13.405]
  }
  return null
}

export default async function JobsPage({ searchParams }: { searchParams: Record<string,string> }) {
  const supabase = createClient()
  let query = supabase.from('jobs').select('*').eq('is_active', true).order('created_at', { ascending: false })
  if (searchParams.q) query = query.ilike('title', `%${searchParams.q}%`)
  if (searchParams.type) query = query.eq('type', searchParams.type)
  if (searchParams.contract) query = query.eq('contract', searchParams.contract)
  if (searchParams.level) query = query.eq('level', searchParams.level)
  if (searchParams.field) query = query.ilike('field', `%${searchParams.field}%`)
  if (searchParams.salary_min) query = query.gte('salary_min', parseInt(searchParams.salary_min))
  const { data: jobs } = await query
  let list = jobs || []

  const cLat = searchParams.clat ? parseFloat(searchParams.clat) : null
  const cLng = searchParams.clng ? parseFloat(searchParams.clng) : null
  const radius = searchParams.radius ? parseFloat(searchParams.radius) : null

  if (cLat && cLng && radius && radius < 999) {
    list = list.filter((job: any) => {
      if (job.lat && job.lng) return haversine(cLat, cLng, job.lat, job.lng) <= radius
      const coords = findCoords(job.location)
      if (coords) return haversine(cLat, cLng, coords[0], coords[1]) <= radius
      return (searchParams.city||'').toLowerCase() ? job.location.toLowerCase().includes((searchParams.city||'').toLowerCase()) : false
    })
  } else if (searchParams.city && !cLat) {
    list = list.filter((job: any) => job.location.toLowerCase().includes(searchParams.city.toLowerCase()))
  }

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <JobsClient initialJobs={list} searchParams={searchParams} user={user} />
      </div>
    </div>
  )
}
