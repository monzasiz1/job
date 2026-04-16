import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// GET — Angebote im Umkreis laden (oder alle wenn keine Koordinaten)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = searchParams.get('radius') || '25'
  const category = searchParams.get('category') || null

  const supabase = createClient()

  // Wenn Koordinaten vorhanden → RPC Umkreissuche (mit Haversine-Fallback)
  if (lat && lng) {
    const centerLat = parseFloat(lat)
    const centerLng = parseFloat(lng)
    const radiusKm = parseFloat(radius)

    const { data, error } = await supabase.rpc('offerings_within_radius', {
      center_lat: centerLat,
      center_lng: centerLng,
      search_radius_km: radiusKm,
      search_category: category,
    })

    // Fallback: Wenn RPC fehlschlägt → alle laden und manuell Haversine-filtern
    if (error) {
      console.error('RPC Fehler, nutze Haversine-Fallback:', error.message)
      let query = supabase
        .from('skill_offerings')
        .select('*, profiles!skill_offerings_user_id_fkey(full_name, avatar_url)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(500)

      if (category) query = query.eq('category', category)

      const { data: allData, error: fallbackErr } = await query
      if (fallbackErr) return NextResponse.json({ error: fallbackErr.message }, { status: 500 })

      // Haversine-Filter + Distanz berechnen
      const toRad = (d: number) => d * Math.PI / 180
      const filtered = (allData || [])
        .map((o: any) => {
          const dLat = toRad(o.lat - centerLat)
          const dLng = toRad(o.lng - centerLng)
          const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(centerLat)) * Math.cos(toRad(o.lat)) * Math.sin(dLng / 2) ** 2
          const distance_km = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
          return {
            ...o,
            distance_km: Math.round(distance_km * 10) / 10,
            user_name: o.profiles?.full_name || 'Anonym',
            user_avatar: o.profiles?.avatar_url || null,
            profiles: undefined,
          }
        })
        .filter((o: any) => o.distance_km <= radiusKm)
        .sort((a: any, b: any) => a.distance_km - b.distance_km)

      return NextResponse.json(filtered)
    }

    return NextResponse.json(data || [])
  }

  // Sonst: alle aktiven Angebote laden (mit Profil-Join)
  let query = supabase
    .from('skill_offerings')
    .select('*, profiles!skill_offerings_user_id_fkey(full_name, avatar_url)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(200)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Flatten profile data
  const offerings = (data || []).map((o: any) => ({
    ...o,
    user_name: o.profiles?.full_name || 'Anonym',
    user_avatar: o.profiles?.avatar_url || null,
    profiles: undefined,
  }))

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
