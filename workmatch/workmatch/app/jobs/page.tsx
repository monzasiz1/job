import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import type { Job } from '@/lib/types'

function logoLetter(name: string) { return name.substring(0, 2).toUpperCase() }
const logoClasses = ['logo-a', 'logo-b', 'logo-c', 'logo-d']
function logoClass(i: number) { return logoClasses[i % logoClasses.length] }

function typeBadge(type: string) {
  if (type === 'Remote') return 'badge-green'
  if (type === 'Hybrid') return 'badge-blue'
  return 'badge-amber'
}
function levelBadge(level: string) {
  if (level === 'Senior') return 'badge-purple'
  if (level === 'Junior') return 'badge-pink'
  return 'badge-blue'
}

export default async function JobsPage({ searchParams }: { searchParams: { q?: string; location?: string; type?: string; level?: string } }) {
  const supabase = createClient()
  let query = supabase.from('jobs').select('*, profiles(full_name, company_name)').eq('is_active', true).order('created_at', { ascending: false })

  if (searchParams.q) query = query.ilike('title', `%${searchParams.q}%`)
  if (searchParams.location && searchParams.location !== 'Remote') query = query.ilike('location', `%${searchParams.location}%`)
  if (searchParams.location === 'Remote') query = query.eq('type', 'Remote')
  if (searchParams.type) query = query.eq('type', searchParams.type)
  if (searchParams.level) query = query.eq('level', searchParams.level)

  const { data: jobs } = await query
  const list: Job[] = jobs || []

  return (
    <>
      <Navbar />

      {/* SEARCH HEADER */}
      <section style={{ background: 'var(--ink)', padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ color: 'white', fontWeight: 800, fontSize: '2rem', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            {searchParams.q ? `Jobs für "${searchParams.q}"` : 'Alle Jobs'}
            <span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.5)', marginLeft: 12 }}>{list.length} Ergebnisse</span>
          </h1>
          <form className="search-bar" style={{ maxWidth: 800 }}>
            <input name="q" type="text" defaultValue={searchParams.q} placeholder="Jobtitel, Fähigkeit..." style={{ flex: 1 }} />
            <select name="location" defaultValue={searchParams.location}>
              <option value="">Alle Orte</option>
              <option>Berlin</option><option>München</option><option>Hamburg</option>
              <option>Frankfurt</option><option>Remote</option>
            </select>
            <select name="type" defaultValue={searchParams.type}>
              <option value="">Alle Typen</option>
              <option>Remote</option><option>Hybrid</option><option value="Vor Ort">Vor Ort</option>
            </select>
            <button type="submit" className="btn btn-primary" style={{ margin: 8, borderRadius: 10 }}>Suchen</button>
          </form>
        </div>
      </section>

      {/* FILTER TAGS */}
      <section style={{ background: 'var(--bg2)', padding: '1rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['Vollzeit', 'Teilzeit', 'Freelance', 'Senior', 'Mid', 'Junior'].map(f => {
            const isType = ['Vollzeit', 'Teilzeit', 'Freelance'].includes(f)
            const paramKey = isType ? 'type' : 'level'
            const paramVal = isType ? searchParams.type : searchParams.level
            const isActive = paramVal === f
            const params = new URLSearchParams(searchParams as any)
            if (isActive) { params.delete(paramKey) } else { params.set(paramKey, f) }
            return (
              <Link key={f} href={`/jobs?${params}`} className={`tag${isActive ? ' active' : ''}`}>{f}</Link>
            )
          })}
        </div>
      </section>

      {/* JOB LIST */}
      <div className="page">
        {list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--ink2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Keine Jobs gefunden</h3>
            <p>Ändere deine Suchfilter oder <Link href="/jobs" style={{ color: 'var(--accent)', fontWeight: 600 }}>zeige alle Jobs</Link></p>
          </div>
        ) : (
          <div className="job-grid">
            {list.map((job, i) => (
              <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="job-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div className={`company-logo ${logoClass(i)}`}>{logoLetter(job.company)}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span className={`badge ${typeBadge(job.type)}`}>{job.type}</span>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>{job.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ink2)', marginBottom: '1rem' }}>{job.company}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <span className={`badge ${typeBadge(job.type)}`}>{job.type}</span>
                    <span className="badge badge-blue">{job.contract}</span>
                    <span className={`badge ${levelBadge(job.level)}`}>{job.level}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--green)', fontSize: '0.95rem' }}>
                      {job.salary_min.toLocaleString('de-DE')} – {job.salary_max.toLocaleString('de-DE')} €
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--ink2)' }}>📍 {job.location}</span>
                  </div>
                </div>
              </Link>
            ))}
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
