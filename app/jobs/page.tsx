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

export default async function JobsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const supabase = createClient()
  let query = supabase.from('jobs').select('*, profiles(full_name, company_name)').eq('is_active', true).order('created_at', { ascending: false })

  if (searchParams.q) query = query.ilike('title', `%${searchParams.q}%`)
  if (searchParams.city) query = query.ilike('location', `%${searchParams.city}%`)
  if (searchParams.type) query = query.eq('type', searchParams.type)
  if (searchParams.contract) query = query.eq('contract', searchParams.contract)
  if (searchParams.level) query = query.eq('level', searchParams.level)
  if (searchParams.field) query = query.ilike('field', `%${searchParams.field}%`)
  if (searchParams.salary_min) query = query.gte('salary_min', parseInt(searchParams.salary_min))

  const { data: jobs } = await query
  const list: Job[] = jobs || []

  const hasFilters = searchParams.q || searchParams.city || searchParams.type || searchParams.contract || searchParams.level || searchParams.field || searchParams.salary_min || searchParams.radius

  return (
    <>
      <Navbar />

      {/* SEARCH HEADER */}
      <section style={{ background: 'var(--ink)', padding: '2.5rem 2rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.8rem', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Jobs finden
            {list.length > 0 && <span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginLeft: 12 }}>{list.length} Ergebnisse</span>}
          </h1>

          <form method="get">
            {/* ROW 1: Stichwort + Stadt + Umkreis */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 180px', gap: 10, marginBottom: 10 }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
                <input
                  name="q" defaultValue={searchParams.q}
                  placeholder="Jobtitel, Fähigkeit, Unternehmen..."
                  style={{ width: '100%', padding: '13px 14px 13px 40px', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: '0.95rem', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>📍</span>
                <input
                  name="city" defaultValue={searchParams.city}
                  placeholder="Stadt oder PLZ (z.B. 47800, Krefeld)"
                  style={{ width: '100%', padding: '13px 14px 13px 40px', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: '0.95rem', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
                />
              </div>
              <select
                name="radius" defaultValue={searchParams.radius || ''}
                style={{ padding: '13px 14px', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: '0.95rem', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none', cursor: 'pointer' }}
              >
                <option value="">Umkreis</option>
                <option value="10">+ 10 km</option>
                <option value="25">+ 25 km</option>
                <option value="50">+ 50 km</option>
                <option value="100">+ 100 km</option>
                <option value="200">+ 200 km</option>
                <option value="999">Bundesweit</option>
              </select>
            </div>

            {/* ROW 2: Filter */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) auto', gap: 10, paddingBottom: '1.5rem' }}>
              <select name="type" defaultValue={searchParams.type || ''}
                style={{ padding: '11px 14px', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: '0.88rem', background: 'rgba(255,255,255,0.08)', color: 'white', outline: 'none', cursor: 'pointer' }}>
                <option value="">🏠 Arbeitsmodell</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Vor Ort">Vor Ort</option>
              </select>

              <select name="contract" defaultValue={searchParams.contract || ''}
                style={{ padding: '11px 14px', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: '0.88rem', background: 'rgba(255,255,255,0.08)', color: 'white', outline: 'none', cursor: 'pointer' }}>
                <option value="">⏰ Anstellung</option>
                <option value="Vollzeit">Vollzeit</option>
                <option value="Teilzeit">Teilzeit</option>
                <option value="Freelance">Freelance</option>
                <option value="Praktikum">Praktikum</option>
              </select>

              <select name="level" defaultValue={searchParams.level || ''}
                style={{ padding: '11px 14px', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: '0.88rem', background: 'rgba(255,255,255,0.08)', color: 'white', outline: 'none', cursor: 'pointer' }}>
                <option value="">🎯 Erfahrung</option>
                <option value="Junior">Junior (0–2 J.)</option>
                <option value="Mid">Mid (2–5 J.)</option>
                <option value="Senior">Senior (5+ J.)</option>
              </select>

              <select name="field" defaultValue={searchParams.field || ''}
                style={{ padding: '11px 14px', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: '0.88rem', background: 'rgba(255,255,255,0.08)', color: 'white', outline: 'none', cursor: 'pointer' }}>
                <option value="">💼 Bereich</option>
                <option>Tech & IT</option>
                <option>Marketing</option>
                <option>Finance</option>
                <option>Sales</option>
                <option>HR</option>
                <option>Design</option>
                <option>Handwerk</option>
                <option>Gesundheit</option>
                <option>Gastronomie</option>
                <option>Sonstiges</option>
              </select>

              <select name="salary_min" defaultValue={searchParams.salary_min || ''}
                style={{ padding: '11px 14px', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: '0.88rem', background: 'rgba(255,255,255,0.08)', color: 'white', outline: 'none', cursor: 'pointer' }}>
                <option value="">💶 Gehalt ab</option>
                <option value="20000">20.000 €</option>
                <option value="30000">30.000 €</option>
                <option value="40000">40.000 €</option>
                <option value="50000">50.000 €</option>
                <option value="60000">60.000 €</option>
                <option value="80000">80.000 €</option>
                <option value="100000">100.000 €</option>
              </select>

              <button type="submit"
                style={{ padding: '11px 24px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Suchen →
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ACTIVE FILTERS */}
      {hasFilters && (
        <div style={{ background: 'var(--bg2)', padding: '0.75rem 2rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--ink2)', fontWeight: 600 }}>Aktive Filter:</span>
            {searchParams.q && <span className="badge badge-blue">🔍 {searchParams.q}</span>}
            {searchParams.city && <span className="badge badge-blue">📍 {searchParams.city}{searchParams.radius ? ` +${searchParams.radius}km` : ''}</span>}
            {searchParams.type && <span className="badge badge-green">🏠 {searchParams.type}</span>}
            {searchParams.contract && <span className="badge badge-amber">⏰ {searchParams.contract}</span>}
            {searchParams.level && <span className="badge badge-purple">🎯 {searchParams.level}</span>}
            {searchParams.field && <span className="badge badge-blue">💼 {searchParams.field}</span>}
            {searchParams.salary_min && <span className="badge badge-green">💶 ab {parseInt(searchParams.salary_min).toLocaleString('de-DE')} €</span>}
            <Link href="/jobs" style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginLeft: 4 }}>✕ Alle zurücksetzen</Link>
          </div>
        </div>
      )}

      {/* QUICK FILTER TAGS */}
      <div style={{ background: 'white', padding: '0.75rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            ['Remote Jobs', '?type=Remote'],
            ['Vollzeit', '?contract=Vollzeit'],
            ['Junior Jobs', '?level=Junior'],
            ['Tech & IT', '?field=Tech+%26+IT'],
            ['Marketing', '?field=Marketing'],
            ['Handwerk', '?field=Handwerk'],
            ['ab 50.000 €', '?salary_min=50000'],
            ['Bundesweit', '?radius=999'],
          ].map(([label, href]) => (
            <Link key={label} href={`/jobs${href}`}
              style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--ink2)', textDecoration: 'none', transition: 'all 0.2s' }}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* JOB LIST */}
      <div className="page">
        {list.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--ink2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Keine Jobs gefunden</h3>
            <p style={{ marginBottom: '1.5rem' }}>Versuche einen größeren Umkreis oder weniger Filter.</p>
            <Link href="/jobs" style={{ color: 'var(--accent)', fontWeight: 600 }}>Alle Jobs anzeigen →</Link>
          </div>
        ) : (
          <div className="job-grid">
            {list.map((job, i) => (
              <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="job-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div className={`company-logo ${logoClass(i)}`}>{logoLetter(job.company)}</div>
                    <span className={`badge ${typeBadge(job.type)}`}>{job.type}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 4 }}>{job.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ink2)', marginBottom: '1rem' }}>{job.company}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <span className="badge badge-blue">{job.contract}</span>
                    <span className="badge badge-blue">{job.level}</span>
                    {job.field && <span className="badge" style={{ background: 'var(--bg2)', color: 'var(--ink2)' }}>{job.field}</span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--green)', fontSize: '0.95rem' }}>
                      {job.salary_min > 0 ? `${job.salary_min.toLocaleString('de-DE')} – ${job.salary_max.toLocaleString('de-DE')} €` : 'Gehalt n. V.'}
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
