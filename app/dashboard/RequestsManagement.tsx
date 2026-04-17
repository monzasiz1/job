'use client'
import { useState } from 'react'
import { SkillRequest, OFFERING_CATEGORIES, REQUEST_URGENCY, URGENCY_META } from '@/lib/types'

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
function getCatMeta(cat: string) { return CAT_META[cat] || CAT_META['Sonstiges'] }

export default function RequestsManagement({ requests: initial }: { requests: SkillRequest[] }) {
  const [items, setItems] = useState<SkillRequest[]>(initial)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<SkillRequest | null>(null)
  const [editForm, setEditForm] = useState({
    title: '', description: '', category: 'Sonstiges',
    budget: '', urgency: 'flexibel',
    location_name: '', lat: 0, lng: 0, radius_km: 15,
  })
  const [editLoading, setEditLoading] = useState(false)
  const [editMsg, setEditMsg] = useState('')

  const handleDelete = async (id: string) => {
    if (!confirm('Gesuch wirklich löschen?')) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/requests?id=${id}`, { method: 'DELETE' })
      if (res.ok) setItems(prev => prev.filter(r => r.id !== id))
      else alert('Fehler beim Löschen')
    } catch { alert('Netzwerkfehler') }
    setDeletingId(null)
  }

  const openEdit = (r: SkillRequest) => {
    setEditItem(r)
    setEditForm({
      title: r.title,
      description: r.description || '',
      category: r.category,
      budget: r.budget || '',
      urgency: r.urgency,
      location_name: r.location_name,
      lat: r.lat,
      lng: r.lng,
      radius_km: r.radius_km,
    })
    setEditMsg('')
  }

  const geocode = async (loc: string) => {
    try {
      const res = await fetch(`/api/geocode?city=${encodeURIComponent(loc)}`)
      const data = await res.json()
      if (data.lat && data.lng) {
        setEditForm(f => ({ ...f, lat: data.lat, lng: data.lng }))
        return { lat: data.lat, lng: data.lng }
      }
    } catch {}
    return null
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editItem) return
    setEditLoading(true)
    setEditMsg('')

    let submitData = { ...editForm }
    if (submitData.lat === 0 && submitData.lng === 0) {
      const geo = await geocode(submitData.location_name)
      if (!geo) { setEditMsg('Standort nicht gefunden.'); setEditLoading(false); return }
      submitData = { ...submitData, lat: geo.lat, lng: geo.lng }
    }

    try {
      const res = await fetch('/api/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editItem.id, ...submitData }),
      })
      if (res.ok) {
        const updated = await res.json()
        setItems(prev => prev.map(r => r.id === editItem.id ? { ...r, ...updated } : r))
        setEditItem(null)
        setEditMsg('')
      } else {
        const err = await res.json()
        setEditMsg(err.error || 'Fehler beim Speichern')
      }
    } catch { setEditMsg('Netzwerkfehler') }
    setEditLoading(false)
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 'clamp(0.78rem, 3vw, 0.85rem)', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
          Gesuche
          {items.length > 0 && (
            <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{items.length}</span>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center' as const }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem', marginBottom: '1rem' }}>Du hast noch keine Gesuche erstellt.</div>
          <a href="/marktplatz" style={{ padding: '10px 20px', background: '#fff', color: '#000', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>Zum Marktplatz</a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(r => {
            const { emoji } = getCatMeta(r.category)
            const urgMeta = URGENCY_META[r.urgency] || URGENCY_META.flexibel
            const isDeleting = deletingId === r.id
            return (
              <div key={r.id} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10,
                padding: 'clamp(0.75rem, 2vw, 1rem)', display: 'flex', alignItems: 'center', gap: 12,
                opacity: isDeleting ? 0.5 : 1, transition: 'opacity 0.2s', flexWrap: 'wrap',
              }}>
                <span style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: urgMeta.color + '18', border: `1.5px solid ${urgMeta.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                }}>{emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 'clamp(0.82rem, 2vw, 0.9rem)', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.title}
                  </div>
                  <div style={{ fontSize: 'clamp(0.68rem, 1.5vw, 0.75rem)', color: 'rgba(255,255,255,0.35)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                    {r.category} · {r.location_name}
                    <span style={{ padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', fontSize: '0.62rem', fontWeight: 600 }}>{urgMeta.label}</span>
                    {r.budget && <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 2 }}>{r.budget}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => openEdit(r)} style={{
                    padding: '7px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 8, color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                  }}>Bearbeiten</button>
                  <button onClick={() => handleDelete(r.id)} disabled={isDeleting} style={{
                    padding: '7px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 8, color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: 600,
                    cursor: isDeleting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                  }}>{isDeleting ? '...' : 'Löschen'}</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Bearbeiten Modal ── */}
      {editItem && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }} onClick={(e) => { if (e.target === e.currentTarget) setEditItem(null) }}>
          <form onSubmit={handleEditSubmit} style={{
            background: 'var(--surface, #1a1a2e)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16, padding: '2rem', maxWidth: 460, width: '100%',
            maxHeight: '85vh', overflowY: 'auto',
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.5rem', color: '#fff' }}>
              Gesuch bearbeiten
            </h3>

            <label style={labelStyle}>Titel *</label>
            <input style={inputStyle} required maxLength={200} value={editForm.title}
              onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />

            <label style={labelStyle}>Kategorie *</label>
            <select style={inputStyle} value={editForm.category}
              onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
              {OFFERING_CATEGORIES.map(c => <option key={c} value={c}>{getCatMeta(c).emoji} {c}</option>)}
            </select>

            <label style={labelStyle}>Dringlichkeit</label>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {REQUEST_URGENCY.map(u => {
                const m = URGENCY_META[u]
                return (
                  <button key={u} type="button" onClick={() => setEditForm(f => ({ ...f, urgency: u }))} style={{
                    flex: 1, padding: '8px 4px', borderRadius: 10,
                    border: editForm.urgency === u ? `2px solid ${m.color}` : '1px solid rgba(255,255,255,0.08)',
                    background: editForm.urgency === u ? m.color + '18' : 'rgba(255,255,255,0.03)',
                    color: editForm.urgency === u ? m.color : 'rgba(255,255,255,0.4)',
                    fontFamily: 'inherit', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  }}>
                    <span>{m.emoji}</span>
                    <span>{m.label}</span>
                  </button>
                )
              })}
            </div>

            <label style={labelStyle}>Beschreibung</label>
            <textarea style={{ ...inputStyle, resize: 'vertical' as const }} rows={3} maxLength={2000}
              value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />

            <label style={labelStyle}>Budget</label>
            <input style={inputStyle} maxLength={100} value={editForm.budget}
              onChange={e => setEditForm(f => ({ ...f, budget: e.target.value }))} />

            <label style={labelStyle}>Standort *</label>
            <input style={inputStyle} required maxLength={200} value={editForm.location_name}
              onChange={e => setEditForm(f => ({ ...f, location_name: e.target.value, lat: 0, lng: 0 }))}
              onBlur={e => { if (e.target.value) geocode(e.target.value) }} />
            {editForm.lat !== 0 && (
              <div style={{ fontSize: '0.72rem', color: '#3dba7e', marginTop: 2, marginBottom: 8 }}>
                ✓ Standort erkannt ({editForm.lat.toFixed(3)}, {editForm.lng.toFixed(3)})
              </div>
            )}

            <label style={labelStyle}>Umkreis (km)</label>
            <input style={inputStyle} type="number" min={1} max={100} value={editForm.radius_km}
              onChange={e => setEditForm(f => ({ ...f, radius_km: parseInt(e.target.value) || 15 }))} />

            {editMsg && (
              <div style={{
                padding: '8px 12px', borderRadius: 8, marginTop: 12, fontSize: '0.82rem', fontWeight: 600,
                background: editMsg.includes('Fehler') || editMsg.includes('nicht') ? 'rgba(240,96,144,0.1)' : 'rgba(61,186,126,0.1)',
                color: editMsg.includes('Fehler') || editMsg.includes('nicht') ? '#f06090' : '#3dba7e',
              }}>{editMsg}</div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setEditItem(null)} style={{
                flex: 1, padding: 10, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
                background: 'transparent', color: 'rgba(255,255,255,0.5)', fontFamily: 'inherit',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              }}>Abbrechen</button>
              <button type="submit" disabled={editLoading} style={{
                flex: 1, padding: 10, border: 'none', borderRadius: 12,
                background: editLoading ? 'rgba(240,96,144,0.3)' : '#f06090',
                color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem',
                cursor: editLoading ? 'not-allowed' : 'pointer',
              }}>{editLoading ? 'Speichern...' : 'Speichern'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.78rem', fontWeight: 700,
  color: 'rgba(255,255,255,0.45)', marginBottom: 4, marginTop: 12,
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10,
  color: '#fff', fontFamily: 'inherit', fontSize: '0.88rem', outline: 'none',
}
