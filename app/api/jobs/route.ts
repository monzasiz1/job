import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

// Haversine-Formel: Entfernung in km zwischen zwei Koordinaten
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = createClient()

  let query = supabase.from('jobs').select('*, profiles(full_name, company_name)').eq('is_active', true).order('created_at', { ascending: false })

  const q = searchParams.get('q')
  const type = searchParams.get('type')
  const contract = searchParams.get('contract')
  const level = searchParams.get('level')
  const field = searchParams.get('field')
  const salary_min = searchParams.get('salary_min')

  if (q) query = query.ilike('title', `%${q}%`)
  if (type) query = query.eq('type', type)
  if (contract) query = query.eq('contract', contract)
  if (level) query = query.eq('level', level)
  if (field) query = query.ilike('field', `%${field}%`)
  if (salary_min) query = query.gte('salary_min', parseInt(salary_min))

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let jobs = data || []

  // Umkreissuche wenn lat/lng und radius vorhanden
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = searchParams.get('radius')

  if (lat && lng && radius) {
    const centerLat = parseFloat(lat)
    const centerLng = parseFloat(lng)
    const radiusKm = parseFloat(radius)
    jobs = jobs.filter(job => {
      // Jobs ohne Koordinaten: nach Stadtname filtern
      if (!job.lat || !job.lng) {
        const city = searchParams.get('city') || ''
        return job.location.toLowerCase().includes(city.toLowerCase())
      }
      return haversine(centerLat, centerLng, job.lat, job.lng) <= radiusKm
    })
  }

  return NextResponse.json({ jobs })
}
