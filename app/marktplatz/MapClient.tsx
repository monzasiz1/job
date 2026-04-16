'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { SkillOffering, OFFERING_CATEGORIES } from '@/lib/types'

// ─── Leaflet wird per CDN geladen (kein npm nötig) ───
declare const L: any

function loadLeaflet(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).L) { resolve(); return }
    if (!document.querySelector('link[href*="leaflet"]')) {
      const css = document.createElement('link')
      css.rel = 'stylesheet'
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(css)
    }
    const scr = document.createElement('script')
    scr.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    scr.onload = () => resolve()
    scr.onerror = () => reject(new Error('Leaflet konnte nicht geladen werden'))
    document.head.appendChild(scr)
  })
}

// ─── Kategorien → Farben / Emoji ───
const CAT_META: Record<string, { emoji: string; color: string }> = {
  'Handwerk':           { emoji: '🔨', color: '#f06090' },
  'Garten & Haushalt':  { emoji: '🌱', color: '#3dba7e' },
  'Nachhilfe':          { emoji: '📚', color: '#7c68fa' },
  'IT & Technik':       { emoji: '💻', color: '#7aa2f7' },
  'Transport':          { emoji: '🚚', color: '#d4a843' },
  'Pflege & Betreuung': { emoji: '❤️', color: '#f06090' },
  'Kreativ & Design':   { emoji: '🎨', color: '#a855c8' },
  'Fitness & Sport':    { emoji: '💪', color: '#3dba7e' },
  'Musik & Kunst':      { emoji: '🎵', color: '#c084fc' },
  'Kochen & Catering':  { emoji: '🍳', color: '#f0c060' },
  'Reinigung':          { emoji: '✨', color: '#7aa2f7' },
  'Reparatur':          { emoji: '🔧', color: '#d4a843' },
  'Sonstiges':          { emoji: '📌', color: '#888' },
}

function getCatMeta(cat: string) {
  return CAT_META[cat] || CAT_META['Sonstiges']
}

function createMarkerIcon(cat: string) {
  const { emoji, color } = getCatMeta(cat)
  return L.divIcon({
    className: 'custom-map-marker',
    html: `<div style="
      width:38px;height:38px;border-radius:50%;
      background:${color}22;border:2px solid ${color};
      display:flex;align-items:center;justify-content:center;
      font-size:18px;box-shadow:0 2px 12px ${color}40;
      backdrop-filter:blur(4px);
    ">${emoji}</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -22],
  })
}

// ─── Haversine-Distanz in km ───
function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => d * Math.PI / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ═══════════════════════════════════════════════════════════════
// MapClient — Nur Fähigkeiten / Angebote (Marktplatz)
// ═══════════════════════════════════════════════════════════════

export default function MapClient() {
  const supabase = createClient()
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<any>(null)
  const userPosRef = useRef<{ lat: number; lng: number } | null>(null)
  const searchRadiusRef = useRef(25)

  const [offerings, setOfferings] = useState<SkillOffering[]>([])
  const [loading, setLoading] = useState(true)
  const [leafletReady, setLeafletReady] = useState(false)
  const [selectedCat, setSelectedCat] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchRadius, setSearchRadius] = useState(25)
  const [searchLocation, setSearchLocation] = useState('')
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)
  const radiusCircleRef = useRef<any>(null)

  // ── KI-Empfehlung ──
  const [aiTips, setAiTips] = useState<{ summary: string; recommendations: { id: string; reason: string }[]; suggestions?: { title: string; category: string; reason: string }[] } | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(false)

  // ── Eigenes Angebot erstellen ──
  const [showForm, setShowForm] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Sonstiges',
    price_info: '', location_name: '', lat: 0, lng: 0, radius_km: 10,
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formMsg, setFormMsg] = useState('')
  const [selectedOffering, setSelectedOffering] = useState<SkillOffering | null>(null)

  // ── Init ──
  useEffect(() => {
    loadLeaflet().then(() => setLeafletReady(true))
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  // ── Karte aufbauen ──
  useEffect(() => {
    if (!leafletReady || !mapContainerRef.current || mapRef.current) return
    const defaultCenter: [number, number] = [51.23, 6.78]
    const map = L.map(mapContainerRef.current, { zoomControl: false }).setView(defaultCenter, 11)
    mapRef.current = map
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 19,
    }).addTo(map)
    markersRef.current = L.featureGroup().addTo(map)
    setTimeout(() => { map.invalidateSize(); }, 200)
    setTimeout(() => { map.invalidateSize(); }, 800)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserPos(latlng)
          map.setView([latlng.lat, latlng.lng], 12)
          setTimeout(() => map.invalidateSize(), 100)
        },
        () => {}
      )
    }
  }, [leafletReady])

  // ── Refs synchron halten ──
  useEffect(() => { userPosRef.current = userPos }, [userPos])
  useEffect(() => { searchRadiusRef.current = searchRadius }, [searchRadius])

  // ── Angebote laden (immer ALLE, Radius-Filter passiert client-seitig) ──
  const fetchOfferings = useCallback(async (cat?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (cat) params.set('category', cat)
      const res = await fetch(`/api/offerings?${params}`)
      const data = await res.json()
      if (Array.isArray(data)) setOfferings(data)
    } catch (e) {
      console.error('Fehler beim Laden:', e)
    }
    setLoading(false)
  }, [])

  // ── Client-seitiger Distanz-Berechnung + Radius-Filter ──
  const filteredOfferings = useMemo(() => {
    // Kein Standort → keine Angebote anzeigen
    if (!userPos) return []
    return offerings
      .filter((o: SkillOffering) => o.lat !== 0 || o.lng !== 0) // Ungültige Koordinaten raus
      .map((o: SkillOffering) => ({
        ...o,
        distance_km: Math.round(haversine(userPos.lat, userPos.lng, o.lat, o.lng) * 10) / 10,
      }))
      .filter((o: SkillOffering) => (o.distance_km ?? Infinity) <= searchRadius) // NUR im Radius
      .sort((a: SkillOffering, b: SkillOffering) => (a.distance_km ?? 0) - (b.distance_km ?? 0))
  }, [offerings, userPos, searchRadius])

  // ── Zusammenfassung für den Standort ──
  const areaSummary = useMemo(() => {
    if (!userPos || filteredOfferings.length === 0) return null
    const cats = new Map<string, number>()
    filteredOfferings.forEach(o => {
      cats.set(o.category, (cats.get(o.category) || 0) + 1)
    })
    const topCats = Array.from(cats.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3)
    return {
      total: filteredOfferings.length,
      topCategories: topCats.map(([cat, count]) => ({ cat, count })),
      nearest: filteredOfferings[0],
    }
  }, [filteredOfferings, userPos])

  // ── Marker setzen ──
  useEffect(() => {
    if (!markersRef.current || !leafletReady) return
    markersRef.current.clearLayers()
    const filtered = filteredOfferings.filter(o => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return o.title.toLowerCase().includes(q) ||
               o.category.toLowerCase().includes(q) ||
               (o.description || '').toLowerCase().includes(q) ||
               o.location_name.toLowerCase().includes(q)
      }
      return true
    })
    filtered.forEach(o => {
      const { emoji } = getCatMeta(o.category)
      const marker = L.marker([o.lat, o.lng], { icon: createMarkerIcon(o.category) })
      marker.bindPopup(`
        <div style="font-family:'DM Sans',sans-serif;min-width:200px;color:#e0e0e0">
          <div style="font-weight:700;font-size:0.95rem;margin-bottom:4px">${emoji} ${escapeHtml(o.title)}</div>
          <div style="color:#aaa;font-size:0.78rem;margin-bottom:6px">${escapeHtml(o.category)} · ${escapeHtml(o.location_name)}</div>
          ${o.price_info ? `<div style="color:#d4a843;font-size:0.82rem;font-weight:600">💰 ${escapeHtml(o.price_info)}</div>` : ''}
          ${o.user_name ? `<div style="color:#999;font-size:0.75rem;margin-top:6px">von ${escapeHtml(o.user_name)}</div>` : ''}
          ${o.distance_km != null ? `<div style="color:#7c68fa;font-size:0.73rem">📍 ${o.distance_km.toFixed(1)} km entfernt</div>` : ''}
        </div>
      `, { className: 'dark-popup' })
      marker.on('click', () => setSelectedOffering(o))
      markersRef.current.addLayer(marker)
    })
    // Karte auf Marker zentrieren (wenn es welche gibt)
    if (filtered.length > 0 && mapRef.current && markersRef.current.getLayers().length > 0) {
      try {
        const bounds = markersRef.current.getBounds()
        if (bounds.isValid()) {
          mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 })
        }
      } catch {}
    }
  }, [filteredOfferings, searchQuery, leafletReady])

  // ── Radius-Kreis ──
  useEffect(() => {
    if (!mapRef.current || !leafletReady || !userPos) return
    if (radiusCircleRef.current) radiusCircleRef.current.remove()
    radiusCircleRef.current = L.circle([userPos.lat, userPos.lng], {
      radius: searchRadius * 1000,
      color: '#7c68fa', fillColor: '#7c68fa', fillOpacity: 0.06,
      weight: 1.5, dashArray: '6 4', interactive: false,
    }).addTo(mapRef.current)
  }, [userPos, searchRadius, leafletReady])

  // ── Suche nach Ort ──
  const handleLocationSearch = async () => {
    if (!searchLocation.trim()) return
    try {
      const res = await fetch(`/api/geocode?city=${encodeURIComponent(searchLocation)}`)
      const data = await res.json()
      if (data.lat && data.lng) {
        const latlng = { lat: data.lat, lng: data.lng }
        setUserPos(latlng)
        if (mapRef.current) {
          mapRef.current.setView([latlng.lat, latlng.lng], searchRadius <= 10 ? 13 : searchRadius <= 25 ? 11 : 10)
        }
      }
    } catch {}
  }

  // ── Daten laden bei Kategorie-Wechsel (Radius-Filter ist client-seitig) ──
  useEffect(() => {
    fetchOfferings(selectedCat || undefined)
  }, [selectedCat])

  // ── KI-Empfehlung ──
  const getAiRecommendation = async () => {
    setAiLoading(true)
    setShowAiPanel(true)
    try {
      const res = await fetch('/api/map-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerings: filteredOfferings.slice(0, 15).map(o => ({
            title: o.title, category: o.category,
            location_name: o.location_name, price_info: o.price_info,
          })),
          jobs: [],
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setAiTips(data)
      }
    } catch {}
    setAiLoading(false)
  }

  // ── Geocode für Formular ──
  const geocodeLocation = async (loc: string) => {
    try {
      const res = await fetch(`/api/geocode?city=${encodeURIComponent(loc)}`)
      const data = await res.json()
      if (data.lat && data.lng) {
        setFormData(f => ({ ...f, lat: data.lat, lng: data.lng, location_name: loc }))
        return true
      }
    } catch {}
    return false
  }

  // ── Angebot erstellen ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormMsg('')

    // Koordinaten sicherstellen (nicht auf State warten!)
    let submitData = { ...formData }
    if (submitData.lat === 0 && submitData.lng === 0) {
      try {
        const geoRes = await fetch(`/api/geocode?city=${encodeURIComponent(submitData.location_name)}`)
        const geoData = await geoRes.json()
        if (geoData.lat && geoData.lng) {
          submitData = { ...submitData, lat: geoData.lat, lng: geoData.lng }
          setFormData(f => ({ ...f, lat: geoData.lat, lng: geoData.lng }))
        } else {
          setFormMsg('Standort konnte nicht gefunden werden.'); setFormLoading(false); return
        }
      } catch {
        setFormMsg('Standort konnte nicht gefunden werden.'); setFormLoading(false); return
      }
    }
    try {
      const res = await fetch('/api/offerings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })
      if (res.ok) {
        setFormMsg('Angebot erstellt!')
        setShowForm(false)
        setFormData({ title: '', description: '', category: 'Sonstiges', price_info: '', location_name: '', lat: 0, lng: 0, radius_km: 10 })
        fetchOfferings(selectedCat || undefined)
      } else {
        const err = await res.json()
        setFormMsg(err.error || 'Fehler beim Erstellen')
      }
    } catch { setFormMsg('Netzwerkfehler') }
    setFormLoading(false)
  }

  return (
    <div style={{ display: 'flex', height: '100%', position: 'relative' }}>
      {/* ── Sidebar ── */}
      <div className="map-sidebar">
        {/* Header */}
        <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1rem', color: '#fff' }}>🎯 Marktplatz</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2 }}>Fähigkeiten & Dienstleistungen in deiner Nähe</div>
        </div>

        {/* Suchfeld + Ort + Radius */}
        <div style={{ padding: '12px 16px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="map-search-box">
            <span style={{ fontSize: '0.9rem' }}>🔍</span>
            <input
              type="text"
              placeholder="Angebote durchsuchen..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                color: '#fff', fontFamily: 'inherit', fontSize: '0.85rem',
              }}
            />
          </div>
          <div className="map-search-box">
            <span style={{ fontSize: '0.9rem' }}>📍</span>
            <input
              type="text"
              placeholder="Ort suchen (z.B. Krefeld, Berlin)..."
              value={searchLocation}
              onChange={e => setSearchLocation(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleLocationSearch() } }}
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                color: '#fff', fontFamily: 'inherit', fontSize: '0.85rem',
              }}
            />
            <button
              onClick={handleLocationSearch}
              style={{
                background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 6,
                padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}
            >Suchen</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>Radius:</span>
            <input
              type="range" min={5} max={100} step={5}
              value={searchRadius}
              onChange={e => setSearchRadius(parseInt(e.target.value))}
              className="map-range" style={{ flex: 1 }}
            />
            <span style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 700, minWidth: 42, textAlign: 'right' }}>
              {searchRadius} km
            </span>
          </div>
        </div>

        {/* Kategorie-Filter */}
        <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          <button onClick={() => setSelectedCat('')} className={`map-cat-btn ${selectedCat === '' ? 'active' : ''}`}>Alle</button>
          {OFFERING_CATEGORIES.map(cat => {
            const { emoji } = getCatMeta(cat)
            return (
              <button key={cat} onClick={() => setSelectedCat(cat === selectedCat ? '' : cat)}
                className={`map-cat-btn ${selectedCat === cat ? 'active' : ''}`}
              >{emoji} {cat}</button>
            )
          })}
        </div>

        {/* ── Angebote-Liste ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
          {!userPos ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text3)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>📍</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: 6 }}>
                Wo suchst du?
              </div>
              <div style={{ fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 14 }}>
                Gib oben einen Ort ein oder erlaube die Standorterkennung, um Angebote in deiner Nähe zu sehen.
              </div>
              <button
                onClick={() => {
                  if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                        setUserPos(latlng)
                        if (mapRef.current) mapRef.current.setView([latlng.lat, latlng.lng], 12)
                      },
                      () => alert('Standorterkennung wurde abgelehnt. Bitte gib einen Ort ein.')
                    )
                  }
                }}
                style={{
                  padding: '10px 20px', border: '1px solid rgba(124,104,250,0.3)',
                  borderRadius: 'var(--r-full)', background: 'rgba(124,104,250,0.08)',
                  color: 'var(--accent)', fontFamily: 'inherit', fontWeight: 700,
                  fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex',
                  alignItems: 'center', gap: 6,
                }}
              >
                📍 Standort erkennen
              </button>
            </div>
          ) : loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem 0' }}>Lade Angebote...</div>
          ) : filteredOfferings.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Keine Angebote im Umkreis von {searchRadius} km</div>
              <div style={{ fontSize: '0.78rem' }}>Versuche einen größeren Radius oder einen anderen Ort.</div>
            </div>
          ) : (
            <>
            {/* Zusammenfassung der Umgebung */}
            {areaSummary && (
              <div style={{
                padding: '10px 12px', borderRadius: 'var(--r-md)', marginBottom: 10,
                background: 'rgba(124,104,250,0.06)', border: '1px solid rgba(124,104,250,0.12)',
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 700, marginBottom: 3 }}>
                  📍 {areaSummary.total} Angebot{areaSummary.total !== 1 ? 'e' : ''} im Umkreis von {searchRadius} km
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>
                  {areaSummary.topCategories.map(tc => `${getCatMeta(tc.cat).emoji} ${tc.cat} (${tc.count})`).join(' · ')}
                </div>
                {areaSummary.nearest && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--text2)', marginTop: 2 }}>
                    Nächstes: <strong>{areaSummary.nearest.title}</strong> — {areaSummary.nearest.distance_km?.toFixed(1)} km
                  </div>
                )}
              </div>
            )}
            {filteredOfferings
              .filter(o => {
                if (!searchQuery) return true
                const q = searchQuery.toLowerCase()
                return o.title.toLowerCase().includes(q) ||
                  o.category.toLowerCase().includes(q) ||
                  (o.description || '').toLowerCase().includes(q)
              })
              .map((o: SkillOffering) => (
                <div
                  key={o.id}
                  className={`map-offer-card ${selectedOffering?.id === o.id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedOffering(o)
                    if (mapRef.current) mapRef.current.setView([o.lat, o.lng], 14)
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: getCatMeta(o.category).color + '22',
                      border: `1.5px solid ${getCatMeta(o.category).color}55`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.9rem', flexShrink: 0,
                    }}>{getCatMeta(o.category).emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {o.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>
                        {o.category} · {o.location_name}
                      </div>
                    </div>
                  </div>
                  {o.price_info && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 600, marginTop: 4 }}>
                      💰 {o.price_info}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>{o.user_name || 'Anonym'}</span>
                    {o.distance_km != null && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>{o.distance_km.toFixed(1)} km</span>
                    )}
                  </div>
                </div>
              ))}
          </>
          )}
        </div>

        {/* ── Bottom-Buttons ── */}
        <div style={{ padding: '8px 16px 12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {user && filteredOfferings.length > 0 && (
            <button onClick={getAiRecommendation} disabled={aiLoading} style={{
              width: '100%', padding: '9px', border: '1px solid rgba(124,104,250,0.3)', borderRadius: 'var(--r-md)',
              background: 'rgba(124,104,250,0.08)', color: 'var(--accent)',
              fontFamily: 'inherit', fontWeight: 700, fontSize: '0.82rem',
              cursor: aiLoading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              {aiLoading ? '🧠 KI analysiert...' : '🧠 KI-Empfehlung für mich'}
            </button>
          )}
          {user && (
            <button onClick={() => setShowForm(true)} style={{
              width: '100%', padding: '9px', border: 'none', borderRadius: 'var(--r-md)',
              background: 'linear-gradient(135deg, var(--gold), #f0c060)', color: '#000',
              fontFamily: 'inherit', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
            }}>+ Fähigkeit anbieten</button>
          )}
        </div>
      </div>

      {/* ── Karte ── */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0, background: '#0f0f17' }} />
        {!leafletReady && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text3)', fontSize: '0.9rem',
          }}>Karte wird geladen...</div>
        )}
      </div>

      {/* ── KI-Panel ── */}
      {showAiPanel && (
        <div className="map-ai-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '0.9rem' }}>🧠 KI-Empfehlung</span>
            <button onClick={() => setShowAiPanel(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
          </div>
          {aiLoading ? (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '1rem 0' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>🧠</div>
              Analysiere dein Profil und {filteredOfferings.length} Angebote...
            </div>
          ) : aiTips ? (
            <>
              <p style={{ fontSize: '0.82rem', color: 'var(--text2)', lineHeight: 1.6, marginBottom: 10 }}>{aiTips.summary}</p>
              {aiTips.recommendations?.length > 0 && (
                <>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>🎯 Passende Angebote für dich</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                    {aiTips.recommendations.map((r, i) => (
                      <div key={i} style={{
                        padding: '8px 10px', borderRadius: 'var(--r-sm)',
                        background: 'rgba(124,104,250,0.08)', border: '1px solid rgba(124,104,250,0.15)',
                      }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent)' }}>{r.id}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text2)', marginLeft: 6 }}>{r.reason}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {aiTips.suggestions && aiTips.suggestions.length > 0 && (
                <>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>💡 Das könntest du anbieten</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {aiTips.suggestions.map((s, i) => (
                      <div key={i} style={{
                        padding: '8px 10px', borderRadius: 'var(--r-sm)',
                        background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.15)',
                      }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#d4a843', marginBottom: 2 }}>
                          {getCatMeta(s.category).emoji} {s.title}
                        </div>
                        <div style={{ fontSize: '0.73rem', color: 'var(--text3)' }}>{s.category}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: 3 }}>{s.reason}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>Keine Empfehlung verfügbar.</div>
          )}
        </div>
      )}

      {/* ── Formular Modal ── */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <form onSubmit={handleSubmit} style={{
            background: 'var(--surface)', border: '1px solid var(--border2)',
            borderRadius: 'var(--r-xl)', padding: '2rem',
            maxWidth: 460, width: '100%', maxHeight: '85vh', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              🎯 Fähigkeit anbieten
            </h3>
            <label className="map-label">Was bietest du an? *</label>
            <input className="map-input" required maxLength={200} placeholder="z.B. Gartenarbeit, Nachhilfe Mathe..."
              value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} />
            <label className="map-label">Kategorie *</label>
            <select className="map-input" value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}>
              {OFFERING_CATEGORIES.map(c => <option key={c} value={c}>{getCatMeta(c).emoji} {c}</option>)}
            </select>
            <label className="map-label">Beschreibung</label>
            <textarea className="map-input" rows={3} maxLength={2000} placeholder="Beschreibe dein Angebot näher..."
              value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
            <label className="map-label">Preis / Konditionen</label>
            <input className="map-input" maxLength={100} placeholder="z.B. 20€/Stunde, Verhandlungsbasis..."
              value={formData.price_info} onChange={e => setFormData(f => ({ ...f, price_info: e.target.value }))} />
            <label className="map-label">Standort / Ort *</label>
            <input className="map-input" required maxLength={200} placeholder="z.B. Krefeld, Düsseldorf, Berlin Mitte..."
              value={formData.location_name} onChange={e => setFormData(f => ({ ...f, location_name: e.target.value }))}
              onBlur={e => { if (e.target.value) geocodeLocation(e.target.value) }} />
            {formData.lat !== 0 && (
              <div style={{ fontSize: '0.72rem', color: 'var(--green)', marginTop: 2, marginBottom: 8 }}>
                ✓ Standort erkannt ({formData.lat.toFixed(3)}, {formData.lng.toFixed(3)})
              </div>
            )}
            <label className="map-label">Umkreis (km)</label>
            <input className="map-input" type="number" min={1} max={100} value={formData.radius_km}
              onChange={e => setFormData(f => ({ ...f, radius_km: parseInt(e.target.value) || 10 }))} />
            {formMsg && (
              <div style={{
                padding: '8px 12px', borderRadius: 'var(--r-sm)', marginTop: 12,
                background: formMsg.includes('erstellt') ? 'var(--green-soft)' : 'var(--pink-soft)',
                color: formMsg.includes('erstellt') ? 'var(--green)' : 'var(--pink)',
                fontSize: '0.82rem', fontWeight: 600,
              }}>{formMsg}</div>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{
                flex: 1, padding: 10, border: '1px solid var(--border2)', borderRadius: 'var(--r-md)',
                background: 'transparent', color: 'var(--text2)', fontFamily: 'inherit',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              }}>Abbrechen</button>
              <button type="submit" disabled={formLoading} style={{
                flex: 1, padding: 10, border: 'none', borderRadius: 'var(--r-md)',
                background: formLoading ? 'var(--surface3)' : 'var(--accent)',
                color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem',
                cursor: formLoading ? 'not-allowed' : 'pointer',
              }}>{formLoading ? 'Wird erstellt...' : 'Angebot erstellen'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function escapeHtml(s: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
  return s.replace(/[&<>"']/g, c => map[c] || c)
}
