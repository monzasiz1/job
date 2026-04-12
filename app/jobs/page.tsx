import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
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

export default async function JobsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const supabase = createClient()
  let query = supabase.from('jobs').select('*').eq('is_active', true).order('created_at', { ascending: false })

  if (searchParams.q) query = query.ilike('title', `%${searchParams.q}%`)
  if (searchParams.type) query = query.eq('type', searchParams.type)
  if (searchParams.contract) query = query.eq('contract', searchParams.contract)
  if (searchParams.level) query = query.eq('level', searchParams.level)
  if (searchParams.field) query = query.ilike('field', `%${searchParams.field}%`)
  if (searchParams.salary_min) query = query.gte('salary_min', parseInt(searchParams.salary_min))

  const { data: jobs } = await query
  let list: Job[] = jobs || []

  // Umkreissuche serverseitig
  const centerLat = searchParams.clat ? parseFloat(searchParams.clat) : null
  const centerLng = searchParams.clng ? parseFloat(searchParams.clng) : null
  const radius = searchParams.radius ? parseFloat(searchParams.radius) : null

  if (centerLat && centerLng && radius && radius < 999) {
    list = list.filter(job => {
      if (job.lat && job.lng) {
        return haversine(centerLat, centerLng, job.lat, job.lng) <= radius
      }
      // Fallback: Stadtname vergleichen
      const city = (searchParams.city || '').toLowerCase()
      return city ? job.location.toLowerCase().includes(city) : true
    })
  } else if (searchParams.city && !centerLat) {
    // Nur Stadtname ohne Koordinaten
    list = list.filter(job => job.location.toLowerCase().includes(searchParams.city.toLowerCase()))
  }

  const hasFilters = !!(searchParams.q || searchParams.city || searchParams.type || searchParams.contract || searchParams.level || searchParams.field || searchParams.salary_min)

  return (
    <>
      <Navbar />
      <JobsClient
        initialJobs={list}
        searchParams={searchParams}
        hasFilters={hasFilters}
      />
      <footer>
        <div className="footer-inner">
          <div className="footer-logo-wrap"><div className="logo-dot" />WorkMatch</div>
          <div style={{ fontSize: '0.82rem' }}>© 2026 WorkMatch · Made in 🇩🇪</div>
        </div>
      </footer>
    </>
  )
}
