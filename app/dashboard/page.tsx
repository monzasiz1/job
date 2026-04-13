import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/register')

  const isEmployer = profile.role === 'employer'
  let jobs: any[] = []
  if (isEmployer) {
    const { data } = await supabase.from('jobs').select('*').eq('employer_id', user.id).order('created_at', { ascending: false })
    jobs = data || []
  }

  const logoClasses = ['logo-a','logo-b','logo-c','logo-d']

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.1rem' }}>Dashboard</span>
            <span style={{ color: 'var(--ink3)', fontSize: '0.85rem', marginLeft: 10 }}>{new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          <div className="topbar-actions">
            {isEmployer && <Link href="/post-job" className="btn btn-gold btn-sm">+ Stelle inserieren</Link>}
            <Link href="/ki-tools" className="btn btn-dark btn-sm">✦ KI-Tools</Link>
          </div>
        </div>

        <div className="page">
          {/* STATS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: '2rem' }}>
            {isEmployer ? (
              <>
                {[
                  [jobs.length, 'Aktive Stellen', 'var(--accent)'],
                  [jobs.length * 12, 'Aufrufe gesamt', 'var(--green)'],
                  [jobs.length * 3, 'Bewerbungen', '#e65100'],
                  ['–', 'KI-Matches', 'var(--gold)'],
                ].map(([n,l,c]) => (
                  <div key={l as string} className="stat-card">
                    <div className="stat-num" style={{ color: c as string }}>{n}</div>
                    <div className="stat-label">{l}</div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  ['0', 'Bewerbungen', 'var(--accent)'],
                  ['0', 'Gespeicherte Jobs', 'var(--green)'],
                  ['–', 'KI-Analysen', 'var(--gold)'],
                  ['65%', 'Ø Match-Score', '#e65100'],
                ].map(([n,l,c]) => (
                  <div key={l} className="stat-card">
                    <div className="stat-num" style={{ color: c }}>{n}</div>
                    <div className="stat-label">{l}</div>
                  </div>
                ))}
              </>
            )}
          </div>

          {isEmployer ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.1rem' }}>Meine Stellen</h2>
                <Link href="/post-job" className="btn btn-dark btn-sm" style={{ borderRadius: 10 }}>+ Neue Stelle</Link>
              </div>
              {jobs.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: '0.5rem' }}>Noch keine Stellen</div>
                  <div style={{ color: 'var(--ink2)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Schalten Sie Ihre erste Stelle live.</div>
                  <Link href="/post-job" className="btn btn-gold" style={{ borderRadius: 12 }}>Erste Stelle inserieren →</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {jobs.map((job, i) => (
                    <div key={job.id} style={{ background: 'white', borderRadius: 14, border: '1.5px solid var(--border)', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: 'var(--shadow)' }}>
                      {job.cover_image_url ? (
                        <img src={job.cover_image_url} alt="" style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div className={`job-logo ${logoClasses[i%4]}`}>{job.company.substring(0,2).toUpperCase()}</div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 4 }}>{job.title}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--ink3)', display: 'flex', gap: 12 }}>
                          <span>📍 {job.location}</span><span>⏰ {job.contract}</span>
                          <span>{new Date(job.created_at).toLocaleDateString('de-DE')}</span>
                        </div>
                      </div>
                      <span className={`badge ${job.is_active ? 'badge-remote' : 'badge-office'}`}>{job.is_active ? 'Aktiv' : 'Inaktiv'}</span>
                      <Link href={`/jobs/${job.id}`} className="btn btn-light btn-sm" style={{ borderRadius: 10 }}>Ansehen</Link>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              {[
                { icon: '◈', title: 'Jobs entdecken', desc: 'Tausende aktuelle Stellen in deiner Region.', href: '/jobs', btn: 'Jobs ansehen' },
                { icon: '✦', title: 'KI-Karriereassistent', desc: 'Lebenslauf analysieren, Stellen matchen, Anschreiben generieren.', href: '/ki-tools', btn: 'Jetzt nutzen' },
                { icon: '◉', title: 'Mein Profil', desc: 'Ergänze dein Profil für bessere Ergebnisse.', href: `/bewerber/${user.id}`, btn: 'Profil ansehen' },
              ].map(c => (
                <div key={c.title} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--accent)' }}>{c.icon}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>{c.title}</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--ink2)', flex: 1, marginBottom: '1.25rem' }}>{c.desc}</div>
                  <Link href={c.href} className="btn btn-dark btn-sm" style={{ borderRadius: 10, alignSelf: 'flex-start' }}>{c.btn} →</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
