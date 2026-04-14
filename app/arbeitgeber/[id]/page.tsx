import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default async function ArbeitgeberProfile({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .eq('role', 'employer')
    .single()

  if (!profile) notFound()
  
  const isOwn = user?.id === params.id

  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('employer_id', params.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const jobIds = jobs?.map((j: any) => j.id) || []
  
  const { data: interests } = await supabase
    .from('job_interests')
    .select('*, applicant:applicant_id(full_name, avatar_url, bio), job:job_id(id, title)')
    .eq('action', 'like')
    .in('job_id', jobIds)
    .order('created_at', { ascending: false })

  const activeJobs = jobs || []
  const interestedApplicants = interests || []
  const lc = ['ja','jb','jc','jd']
  const tb = (t: string) => t === 'Remote' ? 'b-remote' : t === 'Hybrid' ? 'b-hybrid' : 'b-office'

  const initials = (profile.company_name || profile.full_name || '?').slice(0, 2).toUpperCase()

  return (
    <>
      <Navbar />

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a30 0%, #0f0f1e 100%)', position: 'relative', overflow: 'hidden', paddingBottom: '3rem' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212,168,67,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 2rem 0', position: 'relative', zIndex: 1 }}>
          <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, marginBottom: '2rem', padding: '6px 12px', background: 'rgba(255,255,255,0.06)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)' }}>
            ← Jobs
          </Link>

          <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* LOGO */}
            <div style={{ width: 110, height: 110, borderRadius: 28, background: 'linear-gradient(135deg, rgba(212,168,67,0.2), rgba(212,168,67,0.08))', border: '3px solid rgba(212,168,67,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '2rem', color: '#d4a843', flexShrink: 0, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
              {profile.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.25)', color: '#d4a843', borderRadius: 999, padding: '4px 12px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                🏢 Arbeitgeber
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                {profile.company_name || profile.full_name}
              </h1>
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {profile.location && <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>📍 {profile.location}</span>}
                {profile.website && <a href={profile.website} target="_blank" rel="noopener" style={{ color: '#d4a843', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 600 }}>🌐 {profile.website}</a>}
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>💼 {activeJobs.length} offene {activeJobs.length === 1 ? 'Stelle' : 'Stellen'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(1rem, 3vw, 2rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>

          {/* ÜBER UNS */}
          {profile.bio && (
            <div style={{ background: 'var(--surface, #17172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '1.75rem' }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 32, height: 32, background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>🏢</span>
                Über uns
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>{profile.bio}</p>
            </div>
          )}

          {/* OFFENE STELLEN */}
          <div style={{ background: 'var(--surface, #17172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 32, height: 32, background: 'rgba(61,186,126,0.12)', border: '1px solid rgba(61,186,126,0.2)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>◈</span>
                Offene Stellen
                <span style={{ padding: '2px 9px', background: 'rgba(61,186,126,0.15)', border: '1px solid rgba(61,186,126,0.2)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, color: '#3dba7e' }}>{activeJobs.length}</span>
              </h2>
            </div>

            {activeJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>📋</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>Aktuell keine offenen Stellen</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {activeJobs.map((job: any, i: number) => (
                  <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, transition: 'all 0.18s', cursor: 'pointer' }}>
                      {job.cover_image_url
                        ? <img src={job.cover_image_url} alt="" style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                        : <div className={`jlogo ${lc[i % 4]}`} style={{ width: 52, height: 52, flexShrink: 0, borderRadius: 12 }}>{(job.company || '').slice(0,2).toUpperCase()}</div>}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                          <span>📍 {job.location}</span>
                          <span>⏰ {job.contract}</span>
                          {job.salary_min > 0 && <span style={{ color: '#3dba7e', fontWeight: 700 }}>{job.salary_min.toLocaleString('de-DE')} – {job.salary_max.toLocaleString('de-DE')} €</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexShrink: 0 }}>
                        <span className={`badge ${tb(job.type)}`}>{job.type}</span>
                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>→</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* INTERESSIERTE BEWERBER - Nur für den Arbeitgeber selbst sichtbar */}
          {isOwn && (
            <div style={{ background: 'var(--surface, #17172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 32, height: 32, background: 'rgba(240,96,144,0.12)', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>💌</span>
                  Interessierte Bewerber
                  <span style={{ padding: '2px 9px', background: 'rgba(240,96,144,0.15)', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, color: '#f06090' }}>{interestedApplicants.length}</span>
                </h2>
              </div>

              {interestedApplicants.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>💭</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>Noch keine Interessenten</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                  {interestedApplicants.map((interest: any) => (
                    <Link key={interest.id} href={`/chat?employer=${profile.id}&applicant=${interest.applicant_id}&job=${interest.job_id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem', background: 'rgba(240,96,144,0.04)', border: '1px solid rgba(240,96,144,0.12)', borderRadius: 14, transition: 'all 0.18s', cursor: 'pointer', height: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {interest.applicant?.avatar_url
                            ? <img src={interest.applicant.avatar_url} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                            : <div style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 10, background: 'rgba(240,96,144,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#f06090', fontSize: '0.85rem' }}>
                                {(interest.applicant?.full_name || '?').slice(0,2).toUpperCase()}
                              </div>}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{interest.applicant?.full_name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>👀 {interest.job?.title}</div>
                          </div>
                        </div>
                        {interest.applicant?.bio && (
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>"{interest.applicant.bio}"</div>
                        )}
                        <div style={{ marginTop: 'auto', color: '#f06090', fontSize: '0.75rem', fontWeight: 700 }}>💬 Chat öffnen →</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ position: 'sticky', top: 'clamp(60px, 10vh, 100px)', display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>

          {/* KONTAKT */}
          <div style={{ background: 'var(--surface, #17172a)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 20, padding: '1.5rem' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '1rem' }}>Kontakt & Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {profile.location && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ width: 34, height: 34, background: 'rgba(240,96,144,0.12)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>📍</span>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>{profile.location}</span>
                </div>
              )}
              {profile.website && (
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ width: 34, height: 34, background: 'rgba(212,168,67,0.12)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>🌐</span>
                  <a href={profile.website} target="_blank" rel="noopener" style={{ fontSize: '0.85rem', color: '#d4a843', textDecoration: 'none', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.website}</a>
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ width: 34, height: 34, background: 'rgba(124,104,250,0.12)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>✉️</span>
                <a href={`mailto:${profile.email}`} style={{ fontSize: '0.85rem', color: '#a080ff', textDecoration: 'none', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile.email}</a>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div style={{ background: 'var(--surface, #17172a)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                [activeJobs.length, 'Offene Stellen', '#3dba7e'],
                [new Date(profile.created_at).getFullYear(), 'Mitglied seit', '#d4a843'],
              ].map(([n, l, c]) => (
                <div key={l as string} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: c as string }}>{n}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* BEWERBEN CTA */}
          <div style={{ background: 'rgba(124,104,250,0.07)', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 20, padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>🚀</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '0.4rem' }}>Interesse geweckt?</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem', lineHeight: 1.6 }}>Schau dir die offenen Stellen an oder nutze den KI-Match.</div>
            <Link href="/ki-tools" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', background: 'rgba(124,104,250,1)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: '0.83rem', textDecoration: 'none' }}>
              KI-Matching starten →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          /* Mobile: Stack layout */
        }
        .jlogo { display: flex; align-items: center; justify-content: center; font-weight: 800; font-family: 'Syne', sans-serif; }
        .ja { background: rgba(30,64,175,0.2); color: #7aa2f7; }
        .jb { background: rgba(212,168,67,0.18); color: #d4a843; }
        .jc { background: rgba(240,96,144,0.18); color: #f06090; }
        .jd { background: rgba(61,186,126,0.18); color: #3dba7e; }
        .badge { font-size: 0.68rem; font-weight: 700; padding: 3px 9px; border-radius: 999px; display: inline-flex; align-items: center; }
        .b-remote { background: rgba(61,186,126,0.15); color: #3dba7e; }
        .b-hybrid { background: rgba(30,64,175,0.15); color: #7aa2f7; }
        .b-office { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.5); }
      `}</style>
    </>
  )
}
