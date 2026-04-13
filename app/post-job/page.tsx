'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function PostJobPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [coverPreview, setCoverPreview] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const coverRef = useRef<HTMLInputElement>(null)
  const logoRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    title: '', location: '', type: 'Vor Ort', contract: 'Vollzeit', level: 'Mid',
    field: 'Sonstiges', salary_min: '', salary_max: '', description: '',
    company_description: '', company_website: '', benefits: '',
    cover_image_url: '', company_logo_url: '',
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

  const uploadImage = async (file: File, bucket: string) => {
    const ext = file.name.split('.').pop()
    const name = `${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from(bucket).upload(name, file, { upsert: true })
    if (error) throw error
    const { data: url } = supabase.storage.from(bucket).getPublicUrl(name)
    return url.publicUrl
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setCoverPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const url = await uploadImage(file, 'job-images')
      setForm(f => ({ ...f, cover_image_url: url }))
    } catch { setError('Bild-Upload fehlgeschlagen') }
    setUploading(false)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setLogoPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const url = await uploadImage(file, 'job-images')
      // Speichere Logo im Profil (für alle Inserate)
      await supabase.from('profiles').update({ avatar_url: url }).eq('id', profile.id)
      setForm(f => ({ ...f, company_logo_url: url }))
    } catch { setError('Logo-Upload fehlgeschlagen') }
    setUploading(false)
  }

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Nicht angemeldet'); setLoading(false); return }

    let lat = null, lng = null
    if (form.location && form.type !== 'Remote') {
      try {
        const res = await fetch(`/api/geocode?city=${encodeURIComponent(form.location)}`)
        const geo = await res.json()
        if (geo.lat) { lat = geo.lat; lng = geo.lng }
      } catch {}
    }

    const benefits = form.benefits.split('\n').map(b => b.trim()).filter(Boolean)

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
      company_description: form.company_description,
      company_website: form.company_website,
      cover_image_url: form.cover_image_url,
      company_logo_url: form.company_logo_url,
      benefits,
      is_active: true,
      lat, lng,
    })

    if (err) { setError(err.message); setLoading(false); return }
    setSuccess(true)
    setTimeout(() => router.push('/dashboard'), 2000)
  }

  if (!profile) return <><Navbar /><div className="page-sm" style={{ textAlign: 'center', paddingTop: '5rem' }}>Laden...</div></>

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--navy)', padding: '3rem 2.5rem 2rem' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem' }}>← Dashboard</Link>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Stelle inserieren</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Gestalte eine ansprechende Stellenanzeige mit Bildern und Unternehmensprofil.</p>
        </div>
      </div>

      <div className="page-md">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">✓ Stelle erfolgreich inseriert! Weiterleitung...</div>}

        <form onSubmit={submit}>

          {/* COVER BILD */}
          <div className="card" style={{ marginBottom: '1.5rem', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>📸 Cover-Bild</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--ink2)' }}>Ein attraktives Bild macht deine Anzeige 3× ansprechender</div>
            </div>
            <div style={{ padding: '1.75rem' }}>
              {coverPreview ? (
                <div style={{ position: 'relative' }}>
                  <img src={coverPreview} alt="Cover" className="upload-preview" style={{ height: 220 }} />
                  <button type="button" onClick={() => { setCoverPreview(''); setForm(f => ({ ...f, cover_image_url: '' })) }}
                    style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(13,27,42,0.8)', color: 'white', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: '0.82rem' }}>
                    Ändern
                  </button>
                </div>
              ) : (
                <div className="upload-zone" onClick={() => coverRef.current?.click()}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🖼️</div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Cover-Bild hochladen</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ink2)' }}>JPG, PNG · max. 5 MB</div>
                  <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: 'none' }} />
                </div>
              )}
            </div>
          </div>

          {/* FIRMENINFO */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>🏢 Unternehmensprofil</div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '1.5rem', alignItems: 'start', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--ink2)', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Logo</div>
                {logoPreview ? (
                  <img src={logoPreview} onClick={() => logoRef.current?.click()} style={{ width: 80, height: 80, borderRadius: 14, objectFit: 'cover', border: '1px solid var(--border)', cursor: 'pointer' }} alt="Logo" />
                ) : (
                  <div onClick={() => logoRef.current?.click()} style={{ width: 80, height: 80, borderRadius: 14, border: '2px dashed var(--border-gold)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(200,169,81,0.04)', gap: 4 }}>
                    <span style={{ fontSize: '1.5rem' }}>+</span>
                    <span style={{ fontSize: '0.6rem', color: 'var(--ink3)', fontWeight: 600 }}>LOGO</span>
                  </div>
                )}
                <input ref={logoRef} type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              </div>
              <div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Firmenname</label>
                  <input className="form-input" value={profile?.company_name || ''} disabled style={{ background: 'var(--bg2)' }} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Website</label>
                  <input className="form-input" value={form.company_website} onChange={set('company_website')} placeholder="https://meinefirma.de" />
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Über das Unternehmen</label>
              <textarea className="form-input" value={form.company_description} onChange={set('company_description')}
                placeholder="Beschreibe dein Unternehmen, eure Mission und Kultur..." rows={4} style={{ resize: 'vertical' }} />
            </div>
          </div>

          {/* STELLE */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>📋 Stellendetails</div>
            <div className="form-group">
              <label className="form-label">Jobtitel *</label>
              <input className="form-input" value={form.title} onChange={set('title')} placeholder="z.B. Senior UX Designer, Friseur/in, Softwareentwickler..." required />
            </div>
            <div className="form-group">
              <label className="form-label">Ort * <span style={{ color: 'var(--ink3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(wird für Umkreissuche verwendet)</span></label>
              <input className="form-input" value={form.location} onChange={set('location')} placeholder="z.B. Krefeld, Berlin, Remote..." required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Arbeitsmodell</label>
                <select className="form-input" value={form.type} onChange={set('type')}>
                  <option value="Vor Ort">🏢 Vor Ort</option>
                  <option value="Remote">🌐 Remote</option>
                  <option value="Hybrid">🔀 Hybrid</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Anstellung</label>
                <select className="form-input" value={form.contract} onChange={set('contract')}>
                  <option>Vollzeit</option><option>Teilzeit</option><option>Freelance</option><option>Praktikum</option><option>Ausbildung</option>
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
                  <option>Tech & IT</option><option>Marketing</option><option>Finance</option><option>Sales</option>
                  <option>HR</option><option>Design</option><option>Handwerk</option><option>Gesundheit</option>
                  <option>Gastronomie</option><option>Logistik</option><option>Bildung</option><option>Sonstiges</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Jahresgehalt in € <span style={{ color: 'var(--ink3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(0 = n. V.)</span></label>
              <div className="form-row" style={{ marginBottom: 0 }}>
                <input className="form-input" value={form.salary_min} onChange={set('salary_min')} placeholder="Min. z.B. 30000" type="number" min="0" />
                <input className="form-input" value={form.salary_max} onChange={set('salary_max')} placeholder="Max. z.B. 42000" type="number" min="0" />
              </div>
            </div>
          </div>

          {/* BESCHREIBUNG + BENEFITS */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: '1.5rem' }}>✍️ Beschreibung & Benefits</div>
            <div className="form-group">
              <label className="form-label">Stellenbeschreibung *</label>
              <textarea className="form-input" value={form.description} onChange={set('description')}
                placeholder="Beschreibe die Aufgaben, Anforderungen und was die Stelle besonders macht..." rows={8} required style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Benefits <span style={{ color: 'var(--ink3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(ein Benefit pro Zeile)</span></label>
              <textarea className="form-input" value={form.benefits} onChange={set('benefits')}
                placeholder="30 Tage Urlaub&#10;Home Office möglich&#10;Firmenwagen&#10;Weiterbildungsbudget&#10;Betriebliche Altersvorsorge" rows={5} style={{ resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(200,169,81,0.08)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--ink2)', border: '1px solid var(--border-gold)' }}>
            📍 <strong>Automatisch:</strong> Der Ort wird in GPS-Koordinaten umgewandelt für die Umkreissuche.
          </div>

          <button type="submit" className="form-submit" disabled={loading || success || uploading}>
            {uploading ? '⏳ Bild wird hochgeladen...' : loading ? '📍 Wird veröffentlicht...' : '🚀 Stelle live schalten'}
          </button>
        </form>
      </div>
    </>
  )
}
