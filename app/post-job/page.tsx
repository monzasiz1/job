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
          <p style={{ color: 'var(--ink2)' }}>Ihr Stellenangebot geht sofort live.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">✓ Job wurde erfolgreich inseriert! Sie werden weitergeleitet...</div>}

        <form onSubmit={submit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div className="form-group">
            <label className="form-label">Jobtitel *</label>
            <input className="form-input" value={form.title} onChange={set('title')} placeholder="z.B. Senior Product Manager" required />
          </div>

          <div className="form-group">
            <label className="form-label">Ort *</label>
            <input className="form-input" value={form.location} onChange={set('location')} placeholder="z.B. Berlin, Remote, München" required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Arbeitsmodell</label>
              <select className="form-input" value={form.type} onChange={set('type')}>
                <option>Remote</option><option>Hybrid</option><option value="Vor Ort">Vor Ort</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Anstellung</label>
              <select className="form-input" value={form.contract} onChange={set('contract')}>
                <option>Vollzeit</option><option>Teilzeit</option><option>Freelance</option><option>Praktikum</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Level</label>
              <select className="form-input" value={form.level} onChange={set('level')}>
                <option>Junior</option><option>Mid</option><option>Senior</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Bereich</label>
              <select className="form-input" value={form.field} onChange={set('field')}>
                <option>Tech & IT</option><option>Marketing</option><option>Finance</option>
                <option>Sales</option><option>HR</option><option>Design</option><option>Sonstiges</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label className="form-label">Jahresgehalt (€)</label>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <input className="form-input" value={form.salary_min} onChange={set('salary_min')} placeholder="Min. z.B. 55000" type="number" />
              <input className="form-input" value={form.salary_max} onChange={set('salary_max')} placeholder="Max. z.B. 75000" type="number" />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Stellenbeschreibung *</label>
            <textarea
              className="form-input" value={form.description} onChange={set('description')}
              placeholder="Beschreiben Sie die Stelle, Aufgaben, Anforderungen und Benefits..." rows={8} required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ padding: '1rem', background: 'var(--bg2)', borderRadius: 10, marginBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--ink2)' }}>
            💡 <strong>Tipp:</strong> Anzeigen mit vollständiger Beschreibung erhalten 3x mehr Bewerbungen.
          </div>

          <button type="submit" className="form-submit" disabled={loading || success} style={{ background: 'var(--accent)' }}>
            {loading ? 'Wird veröffentlicht...' : '🚀 Job live schalten'}
          </button>
        </form>
      </div>
    </>
  )
}
