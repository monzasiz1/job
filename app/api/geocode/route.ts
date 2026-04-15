import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  if (!city) return NextResponse.json({ error: 'Kein Ort angegeben' }, { status: 400 })

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ', Deutschland')}&format=json&limit=1`,
      { headers: { 'User-Agent': 'Talento/1.0' } }
    )
    const data = await res.json()
    if (!data.length) return NextResponse.json({ error: 'Ort nicht gefunden' }, { status: 404 })
    return NextResponse.json({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name })
  } catch {
    return NextResponse.json({ error: 'Geocoding fehlgeschlagen' }, { status: 500 })
  }
}
