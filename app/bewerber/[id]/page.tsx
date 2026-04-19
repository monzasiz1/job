import { createClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import VerifiedBadge from '@/components/VerifiedBadge'
import Link from 'next/link'

export default async function BewerberProfile({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', params.id).single()
  if (!profile) notFound()

  const isOwn = user.id === params.id
  const initials = profile.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || '?'
  const skills: string[] = profile.skills || []
  const expYears: number = profile.experience_years || 0

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f1e' }}>
      <Navbar />

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a35 0%, #0f0f20 100%)', position: 'relative', overflow: 'hidden', paddingBottom: '3rem' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,104,250,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 2rem 0', position: 'relative', zIndex: 1 }}>
          <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, marginBottom: '2rem', padding: '6px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)' }}>← Zurück</Link>

          <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ width: 110, height: 110, borderRadius: 28, background: 'linear-gradient(135deg, #7c68fa, #a080ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '2.2rem', color: '#fff', border: '4px solid rgba(255,255,255,0.12)', flexShrink: 0, overflow: 'hidden' }}>
              {profile.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'inline-flex', background: 'rgba(124,104,250,0.15)', border: '1px solid rgba(124,104,250,0.25)', color: '#a080ff', borderRadius: 999, padding: '4px 12px', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' as const, marginBottom: '0.75rem' }}>👤 Bewerber</div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>{profile.full_name} <VerifiedBadge verified={profile.verified} size="lg" /></h1>
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {profile.location && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>📍 {profile.location}</span>}
                {expYears > 0 && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>💼 {expYears} J. Erfahrung</span>}
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noopener" style={{ color: '#7aa2f7', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 600 }}>LinkedIn →</a>}
              </div>
              {skills.length > 0 && (
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  {skills.slice(0, 6).map((s: string) => <span key={s} style={{ padding: '4px 12px', background: 'rgba(124,104,250,0.15)', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, color: '#a080ff' }}>{s}</span>)}
                  {skills.length > 6 && <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 999, fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>+{skills.length - 6}</span>}
                </div>
              )}
            </div>

            {/* Nur 1 Button — nur wenn eigenes Profil */}
            {isOwn && (
              <Link href="/dashboard/profil" style={{ padding: '10px 20px', background: 'rgba(124,104,250,0.15)', border: '1px solid rgba(124,104,250,0.25)', borderRadius: 999, color: '#a080ff', fontSize: '0.84rem', fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>✏️ Profil bearbeiten</Link>
            )}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '1.25rem' }}>
          {profile.bio ? (
            <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '1.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>💬 Über mich</div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>{profile.bio}</p>
            </div>
          ) : isOwn ? (
            <div style={{ background: 'rgba(124,104,250,0.05)', border: '2px dashed rgba(124,104,250,0.2)', borderRadius: 20, padding: '2rem', textAlign: 'center' as const }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
              <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>Noch kein Bio</div>
              <Link href="/dashboard/profil" style={{ padding: '8px 18px', background: 'rgba(124,104,250,0.15)', border: '1px solid rgba(124,104,250,0.25)', borderRadius: 999, color: '#a080ff', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>Jetzt hinzufügen →</Link>
            </div>
          ) : null}

          {skills.length > 0 ? (
            <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '1.75rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>⚡ Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {skills.map((skill: string) => <span key={skill} style={{ padding: '7px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, fontSize: '0.83rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{skill}</span>)}
              </div>
            </div>
          ) : isOwn ? (
            <div style={{ background: 'rgba(212,168,67,0.05)', border: '2px dashed rgba(212,168,67,0.2)', borderRadius: 20, padding: '2rem', textAlign: 'center' as const }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
              <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>Noch keine Skills</div>
              <Link href="/dashboard/profil" style={{ padding: '8px 18px', background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.25)', borderRadius: 999, color: '#d4a843', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>Skills hinzufügen →</Link>
            </div>
          ) : null}

          <div style={{ background: 'rgba(124,104,250,0.07)', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 20, padding: '1.75rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '2.5rem' }}>🎯</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', marginBottom: '0.3rem' }}>KI-Karriereassistent</div>
              <div style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>Analysiere deinen Lebenslauf und generiere Anschreiben per KI.</div>
            </div>
            <Link href="/ki-tools" style={{ padding: '11px 22px', background: '#7c68fa', color: '#fff', borderRadius: 999, fontWeight: 700, fontSize: '0.86rem', textDecoration: 'none', flexShrink: 0 }}>KI-Tools →</Link>
          </div>
        </div>

        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column' as const, gap: '1rem' }}>
          <div style={{ background: '#17172a', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 20, padding: '1.5rem' }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '1rem' }}>Kontakt</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ width: 34, height: 34, background: 'rgba(124,104,250,0.12)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✉️</span>
                <a href={`mailto:${profile.email}`} style={{ fontSize: '0.84rem', color: '#a080ff', textDecoration: 'none', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{profile.email}</a>
              </div>
              {profile.phone && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><span style={{ width: 34, height: 34, background: 'rgba(61,186,126,0.12)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>📞</span><span style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.6)' }}>{profile.phone}</span></div>}
              {profile.location && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><span style={{ width: 34, height: 34, background: 'rgba(240,96,144,0.12)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>📍</span><span style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.6)' }}>{profile.location}</span></div>}
              {profile.linkedin && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><span style={{ width: 34, height: 34, background: 'rgba(30,64,175,0.2)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>in</span><a href={profile.linkedin} target="_blank" rel="noopener" style={{ fontSize: '0.84rem', color: '#7aa2f7', textDecoration: 'none', fontWeight: 600 }}>LinkedIn</a></div>}
            </div>
          </div>

          <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {([[''+skills.length,'Skills','#a080ff'],[expYears>0?expYears+'J':'–','Erfahrung','#d4a843'],['–','Matches','#3dba7e'],['–','Bewerbungen','#f06090']] as [string,string,string][]).map(([n,l,c]) => (
                <div key={l} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '0.9rem', textAlign: 'center' as const }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: c }}>{n}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 3, fontWeight: 600, textTransform: 'uppercase' as const }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>Mitglied seit</span>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>{new Date(profile.created_at).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</span>
          </div>

          {profile.verified && (
            <div style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 20, padding: '1.25rem', textAlign: 'center' as const }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: '0.5rem' }}>
                <VerifiedBadge verified={true} size="md" />
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#d4a843' }}>Verified by Talento</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>E-Mail und Telefonnummer verifiziert</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
