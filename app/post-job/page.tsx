'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function PostJobPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [form, setForm] = useState({
    title: '', location: '', type: 'Remote', contract: 'Vollzeit', level: 'Mid',
    field: 'Tech & IT', salary_min: '', salary_max: '', description: ''
  })

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      if (!p || p.role !== 'employer') { router.push('/dashboard'); return }
      setProfile(p)
    })
  }, [])

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Nicht angemeldet'); setLoading(false); return }

    // Koordinaten via Geocoding ermitteln
    let lat = null, lng = null
    if (form.location && form.type !== 'Remote') {
      try {
        const res = await fetch(`/api/geocode?city=${encodeURIComponent(form.location)}`)
        const geo = await res.json()
        if (geo.lat) { lat = geo.lat; lng = geo.lng }
      } catch {}
    }

    const { error: err } = await supabase.from('jobs').insert({
      employer_id: user.id,
      title: form.title,
      company: profile?.company_name || 'Unbekannt',
      location: form.location,
      type: form.type,
      contract: form.contract,
      level: form.level,
      field: form.field,
      salary_min: parseInt(form.salary_min) || 0,
      salary_max: parseInt(form.salary_max) || 0,
      description: form.description,
      is_active: true,
      lat,
      lng,
    })

    if (err) { setError(err.message); setLoading(false); return }
    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  if (!profile) return <><Navbar /><div className="page-sm" style={{ textAlign: 'center', paddingTop: '5rem' }}>Laden...</div></>

  return (
    <>
      <Navbar />
      <div className="page-sm">
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/dashboard" style={{ color: 'var(--ink2)', textDecoration: 'none', fontSize: '0.9rem' }}>← Dashboard</Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginTop: '0.75rem', marginBottom: '0.5rem' }}>Job inserieren</h1>
          <p style={{ color: 'var(--ink2)' }}>Ihr Stellenangebot geht sofort live — inkl. Umkreissuche.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">✓ Job erfolgreich inseriert! Weiterleitung...</div>}

        <form onSubmit={submit} className="card">
          <div className="form-group">
            <label className="form-label">Jobtitel *</label>
            <input className="form-input" value={form.title} onChange={set('title')} placeholder="z.B. Friseur/in, Senior Developer..." required />
          </div>

          <div className="form-group">
            <label className="form-label">Ort * <span style={{ color: 'var(--ink3)', fontWeight: 400 }}>(Stadt oder PLZ — wird für Umkreissuche verwendet)</span></label>
            <input className="form-input" value={form.location} onChange={set('location')} placeholder="z.B. Krefeld, 47800, Düsseldorf..." required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Arbeitsmodell</label>
              <select className="form-input" value={form.type} onChange={set('type')}>
                <option value="Remote">🌐 Remote</option>
                <option value="Hybrid">🔀 Hybrid</option>
                <option value="Vor Ort">🏢 Vor Ort</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Anstellung</label>
              <select className="form-input" value={form.contract} onChange={set('contract')}>
                <option value="Vollzeit">Vollzeit</option>
                <option value="Teilzeit">Teilzeit</option>
                <option value="Freelance">Freelance</option>
                <option value="Praktikum">Praktikum</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Erfahrungslevel</label>
              <select className="form-input" value={form.level} onChange={set('level')}>
                <option value="Junior">Junior (0–2 Jahre)</option>
                <option value="Mid">Mid (2–5 Jahre)</option>
                <option value="Senior">Senior (5+ Jahre)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Bereich</label>
              <select className="form-input" value={form.field} onChange={set('field')}>
                <option>Tech & IT</option><option>Marketing</option><option>Finance</option>
                <option>Sales</option><option>HR</option><option>Design</option>
                <option>Handwerk</option><option>Gesundheit</option><option>Gastronomie</option><option>Sonstiges</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Jahresgehalt in € <span style={{ color: 'var(--ink3)', fontWeight: 400 }}>(0 = Gehalt nach Vereinbarung)</span></label>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <input className="form-input" value={form.salary_min} onChange={set('salary_min')} placeholder="Min. z.B. 28000" type="number" min="0" />
              <input className="form-input" value={form.salary_max} onChange={set('salary_max')} placeholder="Max. z.B. 38000" type="number" min="0" />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Stellenbeschreibung *</label>
            <textarea className="form-input" value={form.description} onChange={set('description')}
              placeholder="Beschreiben Sie die Stelle, Aufgaben, Anforderungen und Benefits..." rows={8} required style={{ resize: 'vertical' }} />
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg2)', borderRadius: 10, marginBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--ink2)' }}>
            📍 <strong>Umkreissuche:</strong> Der eingegebene Ort wird automatisch in GPS-Koordinaten umgewandelt, damit Bewerber Jobs in ihrer Nähe finden können.
          </div>

          <button type="submit" className="form-submit" disabled={loading || success} style={{ background: 'var(--accent)' }}>
            {loading ? '📍 Ort wird ermittelt...' : '🚀 Job live schalten'}
          </button>
        </form>
      </div>
    </>
  )
}
