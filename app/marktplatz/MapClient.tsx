'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { SkillOffering, OFFERING_CATEGORIES } from '@/lib/types'

// ─── Leaflet wird per CDN geladen (kein npm nötig) ───
declare const L: any

function loadLeaflet(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).L) { resolve(); return }
    // CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const css = document.createElement('link')
      css.rel = 'stylesheet'
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(css)
    }
    // JS
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

// ─── Custom Marker SVG ───
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

// ═══════════════════════════════════════════════════════════════
// MapClient Component
// ═══════════════════════════════════════════════════════════════

export default function MapClient() {
  const supabase = createClient()
  const mapRef = useRef<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersRef = useRef<any>(null)

  const [offerings, setOfferings] = useState<SkillOffering[]>([])
  const [loading, setLoading] = useState(true)
  const [leafletReady, setLeafletReady] = useState(false)
  const [selectedCat, setSelectedCat] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null)

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

    const defaultCenter: [number, number] = [51.23, 6.78] // Krefeld

    mapRef.current = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView(defaultCenter, 11)

    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current)

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 19,
    }).addTo(mapRef.current)

    markersRef.current = L.layerGroup().addTo(mapRef.current)

    // Geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          setUserPos(latlng)
          mapRef.current.setView([latlng.lat, latlng.lng], 12)
        },
        () => {} // Silently ignore if denied
      )
    }

    fetchOfferings()
  }, [leafletReady])

  // ── Angebote laden ──
  const fetchOfferings = useCallback(async (cat?: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (userPos) {
        params.set('lat', String(userPos.lat))
        params.set('lng', String(userPos.lng))
        params.set('radius', '50')
      }
      if (cat) params.set('category', cat)
      const res = await fetch(`/api/offerings?${params}`)
      const data = await res.json()
      if (Array.isArray(data)) setOfferings(data)
    } catch (e) {
      console.error('Fehler beim Laden:', e)
    }
    setLoading(false)
  }, [userPos])

  // ── Marker setzen ──
  useEffect(() => {
    if (!markersRef.current || !leafletReady) return
    markersRef.current.clearLayers()

    const filtered = offerings.filter(o => {
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
      const { emoji, color } = getCatMeta(o.category)
      const marker = L.marker([o.lat, o.lng], { icon: createMarkerIcon(o.category) })
      marker.bindPopup(`
        <div style="font-family:'DM Sans',sans-serif;min-width:200px;color:#e0e0e0">
          <div style="font-weight:700;font-size:0.95rem;margin-bottom:4px">${emoji} ${escapeHtml(o.title)}</div>
          <div style="color:#aaa;font-size:0.78rem;margin-bottom:6px">${escapeHtml(o.category)} · ${escapeHtml(o.location_name)}</div>
          ${o.price_info ? `<div style="color:#d4a843;font-size:0.82rem;font-weight:600">💰 ${escapeHtml(o.price_info)}</div>` : ''}
          ${o.user_name ? `<div style="color:#999;font-size:0.75rem;margin-top:6px">von ${escapeHtml(o.user_name)}</div>` : ''}
          ${o.distance_km != null ? `<div style="color:#7c68fa;font-size:0.73rem">📍 ${o.distance_km.toFixed(1)} km entfernt</div>` : ''}
        </div>
      `, {
        className: 'dark-popup',
      })

      marker.on('click', () => setSelectedOffering(o))
      markersRef.current.addLayer(marker)
    })
  }, [offerings, searchQuery, leafletReady])

  // ── Kategorie wechseln ──
  useEffect(() => {
    fetchOfferings(selectedCat || undefined)
  }, [selectedCat, userPos])

  // ── Geocode Standort für Formular ──
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

    // Geocode if still 0,0
    if (formData.lat === 0 && formData.lng === 0) {
      const ok = await geocodeLocation(formData.location_name)
      if (!ok) { setFormMsg('Standort konnte nicht gefunden werden.'); setFormLoading(false); return }
    }

    try {
      const res = await fetch('/api/offerings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    } catch {
      setFormMsg('Netzwerkfehler')
    }
    setFormLoading(false)
  }

  return (
    <div style={{ display: 'flex', height: '100%', position: 'relative' }}>
      {/* ── Linke Sidebar (Suche + Liste) ── */}
      <div className="map-sidebar">
        {/* Suchfeld */}
        <div style={{ padding: '16px 16px 8px' }}>
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
        </div>

        {/* Kategorie-Filter */}
        <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          <button
            onClick={() => setSelectedCat('')}
            className={`map-cat-btn ${selectedCat === '' ? 'active' : ''}`}
          >Alle</button>
          {OFFERING_CATEGORIES.map(cat => {
            const { emoji } = getCatMeta(cat)
            return (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat === selectedCat ? '' : cat)}
                className={`map-cat-btn ${selectedCat === cat ? 'active' : ''}`}
              >{emoji} {cat}</button>
            )
          })}
        </div>

        {/* Angebote-Liste */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem 0' }}>
              Lade Angebote...
            </div>
          ) : offerings.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text3)', padding: '2rem 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>📍</div>
              <div>Keine Angebote in der Nähe gefunden.</div>
              <div style={{ fontSize: '0.8rem', marginTop: 4 }}>Versuche einen anderen Standort oder eine andere Kategorie.</div>
            </div>
          ) : (
            offerings
              .filter(o => {
                if (!searchQuery) return true
                const q = searchQuery.toLowerCase()
                return o.title.toLowerCase().includes(q) ||
                  o.category.toLowerCase().includes(q) ||
                  (o.description || '').toLowerCase().includes(q)
              })
              .map(o => (
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
                    <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>
                      {o.user_name || 'Anonym'}
                    </span>
                    {o.distance_km != null && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>
                        {o.distance_km.toFixed(1)} km
                      </span>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>

        {/* Angebot erstellen Button */}
        {user && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => setShowForm(true)}
              style={{
                width: '100%', padding: '10px', border: 'none', borderRadius: 'var(--r-md)',
                background: 'linear-gradient(135deg, var(--gold), #f0c060)', color: '#000',
                fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              }}
            >+ Fähigkeit anbieten</button>
          </div>
        )}
      </div>

      {/* ── Karte ── */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', background: '#0f0f17' }} />
        {!leafletReady && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text3)', fontSize: '0.9rem',
          }}>Karte wird geladen...</div>
        )}
      </div>

      {/* ── Formular Modal ── */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border2)',
              borderRadius: 'var(--r-xl)', padding: '2rem',
              maxWidth: 460, width: '100%', maxHeight: '85vh', overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              🎯 Fähigkeit anbieten
            </h3>

            <label className="map-label">Was bietest du an? *</label>
            <input
              className="map-input"
              required
              maxLength={200}
              placeholder="z.B. Gartenarbeit, Nachhilfe Mathe..."
              value={formData.title}
              onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
            />

            <label className="map-label">Kategorie *</label>
            <select
              className="map-input"
              value={formData.category}
              onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}
            >
              {OFFERING_CATEGORIES.map(c => (
                <option key={c} value={c}>{getCatMeta(c).emoji} {c}</option>
              ))}
            </select>

            <label className="map-label">Beschreibung</label>
            <textarea
              className="map-input"
              rows={3}
              maxLength={2000}
              placeholder="Beschreibe dein Angebot näher..."
              value={formData.description}
              onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
              style={{ resize: 'vertical' }}
            />

            <label className="map-label">Preis / Konditionen</label>
            <input
              className="map-input"
              maxLength={100}
              placeholder="z.B. 20€/Stunde, Verhandlungsbasis..."
              value={formData.price_info}
              onChange={e => setFormData(f => ({ ...f, price_info: e.target.value }))}
            />

            <label className="map-label">Standort / Ort *</label>
            <input
              className="map-input"
              required
              maxLength={200}
              placeholder="z.B. Krefeld, Düsseldorf, Berlin Mitte..."
              value={formData.location_name}
              onChange={e => setFormData(f => ({ ...f, location_name: e.target.value }))}
              onBlur={e => { if (e.target.value) geocodeLocation(e.target.value) }}
            />
            {formData.lat !== 0 && (
              <div style={{ fontSize: '0.72rem', color: 'var(--green)', marginTop: 2, marginBottom: 8 }}>
                ✓ Standort erkannt ({formData.lat.toFixed(3)}, {formData.lng.toFixed(3)})
              </div>
            )}

            <label className="map-label">Umkreis (km)</label>
            <input
              className="map-input"
              type="number"
              min={1}
              max={100}
              value={formData.radius_km}
              onChange={e => setFormData(f => ({ ...f, radius_km: parseInt(e.target.value) || 10 }))}
            />

            {formMsg && (
              <div style={{
                padding: '8px 12px', borderRadius: 'var(--r-sm)', marginTop: 12,
                background: formMsg.includes('erstellt') ? 'var(--green-soft)' : 'var(--pink-soft)',
                color: formMsg.includes('erstellt') ? 'var(--green)' : 'var(--pink)',
                fontSize: '0.82rem', fontWeight: 600,
              }}>{formMsg}</div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  flex: 1, padding: 10, border: '1px solid var(--border2)', borderRadius: 'var(--r-md)',
                  background: 'transparent', color: 'var(--text2)', fontFamily: 'inherit',
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                }}
              >Abbrechen</button>
              <button
                type="submit"
                disabled={formLoading}
                style={{
                  flex: 1, padding: 10, border: 'none', borderRadius: 'var(--r-md)',
                  background: formLoading ? 'var(--surface3)' : 'var(--accent)',
                  color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem',
                  cursor: formLoading ? 'not-allowed' : 'pointer',
                }}
              >{formLoading ? 'Wird erstellt...' : 'Angebot erstellen'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

// ── XSS-safe HTML escape ──
function escapeHtml(s: string): string {
  const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
  return s.replace(/[&<>"']/g, c => map[c] || c)
}
