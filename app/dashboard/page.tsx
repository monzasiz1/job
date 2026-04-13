import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AppShell from '@/components/AppShell'

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
    <AppShell>
      <div className="topbar">
        <span className="topbar-title">Dashboard</span>
        <div className="topbar-spacer" />
        <div style={{ display: 'flex', gap: 8 }}>
          {isEmployer && <Link href="/post-job" className="btn btn-gold btn-sm">+ Stelle inserieren</Link>}
          <Link href="/ki-tools" className="btn btn-accent btn-sm">✦ KI-Tools</Link>
        </div>
      </div>
      <div className="page">
        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: '1.75rem' }}>
          {isEmployer ? [
            [jobs.length,'Aktive Stellen','#7aa2f7'],
            [jobs.length*12,'Aufrufe','#9ece6a'],
            [jobs.length*3,'Bewerbungen','var(--gold2)'],
            ['–','KI-Matches','var(--accent2)'],
          ] : [
            ['0','Bewerbungen','var(--accent2)'],
            ['0','Gespeicherte Jobs','#9ece6a'],
            ['–','Analysen','var(--gold2)'],
            ['65%','Match-Score','#f7768e'],
          ].map(([n,l,c]:any) => (
            <div key={l} className="stat-card">
              <div className="stat-num" style={{ color: c }}>{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>

        {isEmployer ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1rem', color: 'white' }}>Meine Stellen</h2>
              <Link href="/post-job" className="btn btn-dark btn-sm" style={{ borderRadius: 10 }}>+ Neue Stelle</Link>
            </div>
            {jobs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Noch keine Stellen</div>
                <div style={{ color: 'var(--text2)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Schalten Sie Ihre erste Stelle live.</div>
                <Link href="/post-job" className="btn btn-gold" style={{ borderRadius: 12 }}>Erste Stelle inserieren →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {jobs.map((job, i) => (
                  <div key={job.id} style={{ background: 'var(--dark2)', borderRadius: 14, border: '1px solid var(--border)', padding: '1rem 1.1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {job.cover_image_url ? (
                      <img src={job.cover_image_url} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div className={`job-logo ${logoClasses[i%4]}`}>{job.company.substring(0,2).toUpperCase()}</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'white', marginBottom: 3 }}>{job.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text3)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <span>📍 {job.location}</span><span>⏰ {job.contract}</span><span>{new Date(job.created_at).toLocaleDateString('de-DE')}</span>
                      </div>
                    </div>
                    <span className={`badge ${job.is_active?'badge-remote':'badge-office'}`}>{job.is_active?'Aktiv':'Inaktiv'}</span>
                    <Link href={`/jobs/${job.id}`} className="btn btn-dark btn-sm" style={{ borderRadius: 10 }}>Ansehen</Link>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { icon: '◈', title: 'Jobs finden', desc: 'Tausende aktuelle Stellen in deiner Region.', href: '/jobs', color: 'rgba(124,106,247,0.15)', border: 'rgba(124,106,247,0.25)' },
              { icon: '✦', title: 'KI-Assistent', desc: 'Lebenslauf analysieren, matchen, Anschreiben generieren.', href: '/ki-tools', color: 'rgba(200,169,81,0.08)', border: 'rgba(200,169,81,0.2)' },
              { icon: '◉', title: 'Mein Profil', desc: 'Ergänze dein Profil für bessere Match-Ergebnisse.', href: `/bewerber/${user.id}`, color: 'rgba(76,175,125,0.08)', border: 'rgba(76,175,125,0.2)' },
            ].map(c => (
              <Link key={c.title} href={c.href} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ background: c.color, borderColor: c.border, height: '100%', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem', color: 'var(--accent2)' }}>{c.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'white', marginBottom: '0.4rem' }}>{c.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.7 }}>{c.desc}</div>
                  <div style={{ marginTop: '1rem', color: 'var(--accent2)', fontSize: '0.82rem', fontWeight: 700 }}>Öffnen →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
