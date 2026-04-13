import { createClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function BewerberProfilePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', params.id).eq('role', 'jobseeker').single()
  if (!profile) notFound()

  // Nur eigenes Profil oder Arbeitgeber können Bewerberprofile sehen
  if (!user) redirect('/login')

  return (
    <>
      <Navbar />

      {/* HERO */}
      <div className="profile-hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="profile-avatar">
              {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name} /> : profile.full_name?.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(200,169,81,0.12)', border: '1px solid rgba(200,169,81,0.25)', color: 'var(--gold2)', borderRadius: 100, padding: '4px 14px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>👤 Bewerber</div>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: '0.4rem' }}>{profile.full_name}</h1>
              <div style={{ color: 'rgba(255,255,255,0.55)', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {profile.location && <span>📍 {profile.location}</span>}
                {profile.experience_years > 0 && <span>💼 {profile.experience_years} Jahre Erfahrung</span>}
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener" style={{ color: 'var(--gold2)', textDecoration: 'none' }}>LinkedIn →</a>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2.5rem', alignItems: 'start', marginTop: '-2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {profile.bio && (
            <div className="card">
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem' }}>Über mich</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink2)', lineHeight: 1.85 }}>{profile.bio}</p>
            </div>
          )}

          {profile.skills?.length > 0 && (
            <div className="card">
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem' }}>Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {profile.skills.map((skill: string) => (
                  <span key={skill} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card card-gold">
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Kontakt</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
              {user?.id === profile.id && <div style={{ display: 'flex', gap: 8 }}><span>✉️</span><span>{profile.email}</span></div>}
              {profile.phone && <div style={{ display: 'flex', gap: 8 }}><span>📞</span><span>{profile.phone}</span></div>}
              {profile.linkedin && <div style={{ display: 'flex', gap: 8 }}><span>💼</span><a href={profile.linkedin} target="_blank" rel="noopener" style={{ color: 'var(--gold)', textDecoration: 'none' }}>LinkedIn Profil</a></div>}
            </div>
            {user?.id === profile.id && (
              <Link href="/dashboard/profil" className="btn btn-outline btn-full" style={{ marginTop: '1rem', borderRadius: 'var(--radius-xs)' }}>Profil bearbeiten</Link>
            )}
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>KI-Match</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink2)', marginBottom: '1rem' }}>Prüfe wie gut du zu einer Stelle passt</div>
            <Link href="/ki-tools" className="btn btn-gold btn-full" style={{ borderRadius: 'var(--radius-xs)' }}>Matching starten</Link>
          </div>
        </div>
      </div>
    </>
  )
}
