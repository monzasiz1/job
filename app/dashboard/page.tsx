import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

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

  return (
    <>
      <Navbar />
      <div className="page">
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ color: 'var(--ink2)', marginBottom: 4, fontSize: '0.9rem' }}>👋 Guten Tag,</p>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{profile.full_name}</h1>
            <p style={{ color: 'var(--ink2)', fontSize: '0.9rem', marginTop: 4 }}>{isEmployer ? `🏢 ${profile.company_name}` : '🔍 Bewerber'}</p>
          </div>
          {isEmployer && (
            <Link href="/post-job" className="btn btn-primary btn-lg">+ Neuen Job inserieren</Link>
          )}
        </div>

        {/* EMPLOYER DASHBOARD */}
        {isEmployer && (
          <>
            {/* STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: '2.5rem' }}>
              {[
                [jobs.length, 'Aktive Anzeigen', 'var(--ink)'],
                [jobs.length * 12, 'Aufrufe (gesamt)', 'var(--blue)'],
                [jobs.length * 3, 'Bewerbungen', 'var(--green)'],
                ['–', 'Matches diese Woche', 'var(--accent)'],
              ].map(([n, l, c]) => (
                <div key={l as string} className="stat-card">
                  <div className="stat-num" style={{ color: c as string }}>{n}</div>
                  <div className="stat-label">{l}</div>
                </div>
              ))}
            </div>

            {/* JOB LIST */}
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>Meine Stellenanzeigen</h2>
            {jobs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📝</div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Noch keine Anzeigen</h3>
                <p style={{ color: 'var(--ink2)', marginBottom: '1.5rem' }}>Schalten Sie Ihren ersten Job und finden Sie die besten Kandidaten.</p>
                <Link href="/post-job" className="btn btn-primary">Ersten Job inserieren →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {jobs.map(job => (
                  <div key={job.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>{job.title}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--ink2)', display: 'flex', gap: 12 }}>
                        <span>📍 {job.location}</span>
                        <span>🏠 {job.type}</span>
                        <span>📅 {new Date(job.created_at).toLocaleDateString('de-DE')}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span className={`badge ${job.is_active ? 'badge-green' : 'badge-amber'}`}>{job.is_active ? 'Aktiv' : 'Inaktiv'}</span>
                      <Link href={`/jobs/${job.id}`} className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>Ansehen</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* JOBSEEKER DASHBOARD */}
        {!isEmployer && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <Link href="/jobs" style={{ textDecoration: 'none' }}>
              <div className="card" style={{ cursor: 'pointer', transition: 'all 0.2s', border: '1.5px solid var(--border)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>Jobs entdecken</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--ink2)' }}>Durchsuchen Sie tausende aktuelle Stellenangebote.</div>
              </div>
            </Link>
            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>Mein Profil</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--ink2)', marginBottom: '1rem' }}>Ergänze dein Profil für bessere Match-Ergebnisse.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.85rem' }}>
                {[['Name', profile.full_name], ['E-Mail', profile.email]].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink2)' }}>{l}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔔</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>Job-Alerts</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--ink2)' }}>Benachrichtigungen für neue passende Jobs — demnächst verfügbar.</div>
            </div>
          </div>
        )}
      </div>

      <footer>
        <div className="footer-inner">
          <div className="footer-logo-wrap"><div className="logo-dot" />WorkMatch</div>
          <div style={{ fontSize: '0.82rem' }}>© 2026 WorkMatch · Made in 🇩🇪</div>
        </div>
      </footer>
    </>
  )
}
