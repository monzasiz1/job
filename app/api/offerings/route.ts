import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// Haversine-Distanz in km
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// GET — Angebote laden (optional mit Umkreis-Filter)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = searchParams.get('radius') || '25'
  const category = searchParams.get('category') || null

  const supabase = createClient()

  // Alle aktiven Angebote laden
  let query = supabase
    .from('skill_offerings')
    .select('*, profiles(full_name, avatar_url)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(500)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Offerings query error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Profile-Daten flach machen
  let offerings = (data || []).map((o: any) => ({
    ...o,
    user_name: o.profiles?.full_name || 'Anonym',
    user_avatar: o.profiles?.avatar_url || null,
    profiles: undefined,
  }))

  // Wenn Koordinaten vorhanden → Haversine-Filter + Distanz berechnen
  if (lat && lng) {
    const centerLat = parseFloat(lat)
    const centerLng = parseFloat(lng)
    const radiusKm = parseFloat(radius)

    offerings = offerings
      .map((o: any) => ({
        ...o,
        distance_km: Math.round(haversine(centerLat, centerLng, o.lat, o.lng) * 10) / 10,
      }))
      .filter((o: any) => o.distance_km <= radiusKm)
      .sort((a: any, b: any) => a.distance_km - b.distance_km)
  }

  return NextResponse.json(offerings)
}

// POST — Neues Angebot erstellen
export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const body = await request.json()
  const { title, description, category, price_info, location_name, lat, lng, radius_km } = body

  if (!title || !category || !location_name || lat == null || lng == null) {
    return NextResponse.json({ error: 'Pflichtfelder fehlen (title, category, location_name, lat, lng)' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('skill_offerings')
    .insert({
      user_id: user.id,
      title: String(title).slice(0, 200),
      description: description ? String(description).slice(0, 2000) : null,
      category: String(category),
      price_info: price_info ? String(price_info).slice(0, 100) : null,
      location_name: String(location_name).slice(0, 200),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      radius_km: radius_km ? parseFloat(radius_km) : 10,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

// DELETE — eigenes Angebot löschen
export async function DELETE(request: Request) {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Keine ID angegeben' }, { status: 400 })

  const { error } = await supabase
    .from('skill_offerings')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
