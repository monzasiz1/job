'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import AppShell from '@/components/AppShell'
import Link from 'next/link'

export default function ProfilBearbeiten() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [avatarPreview, setAvatarPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const avatarRef = useRef<HTMLInputElement>(null)
  const [skillInput, setSkillInput] = useState('')
  const [form, setForm] = useState({
    full_name: '', company_name: '', bio: '', location: '',
    website: '', linkedin: '', phone: '', experience_years: '',
    skills: [] as string[],
  })

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      if (!p) { router.push('/dashboard'); return }
      setProfile(p)
      setForm({
        full_name: p.full_name || '',
        company_name: p.company_name || '',
        bio: p.bio || '',
        location: p.location || '',
        website: p.website || '',
        linkedin: p.linkedin || '',
        phone: p.phone || '',
        experience_years: p.experience_years?.toString() || '',
        skills: p.skills || [],
      })
      if (p.avatar_url) setAvatarPreview(p.avatar_url)
    })
  }, [])

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const name = `${Date.now()}.${file.name.split('.').pop()}`
      await supabase.storage.from('avatars').upload(name, file, { upsert: true })
      const url = supabase.storage.from('avatars').getPublicUrl(name).data.publicUrl
      setForm(f => ({ ...f, avatar_url: url } as any))
      await supabase.from('profiles').update({ avatar_url: url }).eq('id', profile.id)
    } catch { setError('Bild-Upload fehlgeschlagen') }
    setUploading(false)
  }

  const addSkill = () => {
    const s = skillInput.trim()
    if (!s || form.skills.includes(s)) { setSkillInput(''); return }
    setForm(f => ({ ...f, skills: [...f.skills, s] }))
    setSkillInput('')
  }

  const removeSkill = (s: string) => setForm(f => ({ ...f, skills: f.skills.filter(x => x !== s) }))

  const save = async (e: any) => {
    e.preventDefault(); setLoading(true); setError(''); setSaved(false)
    const updates: any = {
      full_name: form.full_name,
      bio: form.bio,
      location: form.location,
      website: form.website,
      linkedin: form.linkedin,
      phone: form.phone,
      skills: form.skills,
    }
    if (profile.role === 'employer') updates.company_name = form.company_name
    if (profile.role === 'jobseeker') updates.experience_years = parseInt(form.experience_years) || 0
    const { error: err } = await supabase.from('profiles').update(updates).eq('id', profile.id)
    if (err) { setError(err.message); setLoading(false); return }
    setSaved(true); setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!profile) return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>Laden...</div>
    </AppShell>
  )

  const isEmp = profile.role === 'employer'

  const inp = (label: string, key: string, placeholder: string, type = 'text') => (
    <div style={{ marginBottom: '1.1rem' }}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '0.4rem' }}>{label}</label>
      <input type={type} value={(form as any)[key]} onChange={set(key)} placeholder={placeholder}
        style={{ width: '100%', padding: '11px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontFamily: 'inherit', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} />
    </div>
  )

  return (
    <AppShell>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,15,23,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1.5rem', height: 60 }}>
        <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>← Dashboard</Link>
        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', flex: 1 }}>Profil bearbeiten</span>
        {saved && <span style={{ padding: '6px 14px', background: 'rgba(61,186,126,0.15)', border: '1px solid rgba(61,186,126,0.25)', borderRadius: 999, color: '#3dba7e', fontSize: '0.82rem', fontWeight: 700 }}>✓ Gespeichert!</span>}
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {error && <div style={{ padding: '11px 14px', background: 'rgba(240,96,144,0.12)', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 12, color: '#f06090', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem' }}>{error}</div>}

        <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.25rem' }}>

          {/* AVATAR */}
          <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '1rem' }}>
              {isEmp ? 'Firmenlogo / Avatar' : 'Profilbild'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div onClick={() => avatarRef.current?.click()} style={{ width: 80, height: 80, borderRadius: 20, background: avatarPreview ? 'transparent' : 'linear-gradient(135deg, #7c68fa, #a080ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.6rem', color: '#fff', cursor: 'pointer', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                {avatarPreview ? <img src={avatarPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (profile.full_name?.slice(0,2).toUpperCase() || '?')}
              </div>
              <div>
                <button type="button" onClick={() => avatarRef.current?.click()} style={{ padding: '8px 16px', background: 'rgba(124,104,250,0.15)', border: '1px solid rgba(124,104,250,0.25)', borderRadius: 999, color: '#a080ff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'block', marginBottom: 6 }}>
                  {uploading ? '⏳ Lädt...' : '📷 Bild ändern'}
                </button>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>JPG, PNG · max. 5 MB</div>
                <input ref={avatarRef} type="file" accept="image/*" onChange={uploadAvatar} style={{ display: 'none' }} />
              </div>
            </div>
          </div>

          {/* BASIS INFO */}
          <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '1rem' }}>Basisinformationen</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
              <div style={{ gridColumn: '1/-1' }}>{inp('Vollständiger Name *', 'full_name', 'Max Mustermann')}</div>
              {isEmp && <div style={{ gridColumn: '1/-1' }}>{inp('Firmenname *', 'company_name', 'Muster GmbH')}</div>}
              {inp('Standort / Stadt', 'location', 'z.B. Krefeld, NRW')}
              {!isEmp && inp('Erfahrung (Jahre)', 'experience_years', 'z.B. 5', 'number')}
              {inp('Website', 'website', 'https://meinefirma.de')}
              {inp('Telefon', 'phone', '+49 123 456789')}
              {!isEmp && inp('LinkedIn', 'linkedin', 'https://linkedin.com/in/...')}
            </div>
          </div>

          {/* BIO */}
          <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '1rem' }}>
              {isEmp ? 'Über das Unternehmen' : 'Über mich'}
            </div>
            <textarea value={form.bio} onChange={set('bio')}
              placeholder={isEmp ? 'Beschreibe dein Unternehmen, Mission und Kultur...' : 'Erzähle von dir, deinen Zielen und was dich ausmacht...'}
              rows={5} style={{ width: '100%', padding: '11px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontFamily: 'inherit', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none', resize: 'vertical' as const, lineHeight: 1.7 }} />
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', marginTop: 6 }}>{form.bio.length} Zeichen</div>
          </div>

          {/* SKILLS — für beide */}
          <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '1.5rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: '1rem' }}>
              {isEmp ? 'Gesuchte Skills / Branchen' : 'Meine Skills'}
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
                placeholder="Skill eingeben + Enter" style={{ flex: 1, padding: '10px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontFamily: 'inherit', fontSize: '0.88rem', background: 'rgba(255,255,255,0.05)', color: '#fff', outline: 'none' }} />
              <button type="button" onClick={addSkill} style={{ padding: '10px 18px', background: 'rgba(124,104,250,0.2)', border: '1px solid rgba(124,104,250,0.3)', borderRadius: 12, color: '#a080ff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>＋ Hinzufügen</button>
            </div>
            {form.skills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {form.skills.map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', background: 'rgba(124,104,250,0.12)', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 999 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#a080ff' }}>{s}</span>
                    <button type="button" onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', color: 'rgba(124,104,250,0.5)', cursor: 'pointer', fontSize: '0.8rem', padding: 0, lineHeight: 1, fontFamily: 'inherit' }}>✕</button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem', textAlign: 'center' as const, padding: '1rem' }}>Noch keine Skills hinzugefügt</div>
            )}
          </div>

          {/* SAVE */}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? 'rgba(124,104,250,0.4)' : '#7c68fa', color: '#fff', border: 'none', borderRadius: 14, fontFamily: 'inherit', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.18s' }}>
            {loading ? '⏳ Wird gespeichert...' : '✓ Profil speichern'}
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            {!isEmp && profile.id && (
              <Link href={`/bewerber/${profile.id}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                👤 Profil ansehen
              </Link>
            )}
            {isEmp && profile.id && (
              <Link href={`/arbeitgeber/${profile.id}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                🏢 Firmenprofil ansehen
              </Link>
            )}
          </div>
        </form>
      </div>
    </AppShell>
  )
}

// Responsive styles injected via globals.css
