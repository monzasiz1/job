'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const logoClasses = ['logo-a','logo-b','logo-c','logo-d','logo-e','logo-f']
function ll(n: string) { return n.substring(0,2).toUpperCase() }
function lc(i: number) { return logoClasses[i % logoClasses.length] }
function typeBadge(t: string) { return t==='Remote'?'badge-remote':t==='Hybrid'?'badge-hybrid':'badge-office' }

export default function JobsClient({ initialJobs, searchParams, user }: any) {
  const router = useRouter()
  const [jobs] = useState(initialJobs)
  const [selected, setSelected] = useState<any>(initialJobs[0] || null)
  const [geocoding, setGeocoding] = useState(false)
  const cityRef = useRef<HTMLInputElement>(null)
  const qRef = useRef<HTMLInputElement>(null)
  const radiusRef = useRef<HTMLSelectElement>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const city = cityRef.current?.value || ''
    const q = qRef.current?.value || ''
    const radius = radiusRef.current?.value || ''
    const form = e.target as HTMLFormElement
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (city) params.set('city', city)
    const type = (form.querySelector('[name=type]') as HTMLSelectElement)?.value
    const level = (form.querySelector('[name=level]') as HTMLSelectElement)?.value
    if (type) params.set('type', type)
    if (level) params.set('level', level)
    if (radius) params.set('radius', radius)
    if (city && radius && radius !== '999') {
      setGeocoding(true)
      try {
        const res = await fetch(`/api/geocode?city=${encodeURIComponent(city)}`)
        const data = await res.json()
        if (data.lat) { params.set('clat', data.lat); params.set('clng', data.lng) }
      } catch {}
      setGeocoding(false)
    }
    router.push(`/jobs?${params}`)
  }

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1 }}>
          <div className="topbar-search" style={{ flex: 1, maxWidth: 340 }}>
            <span style={{ fontSize: '1rem' }}>🔍</span>
            <input ref={qRef} defaultValue={searchParams.q} placeholder="Jobtitel, Skill, Unternehmen..." />
          </div>
          <div className="topbar-search" style={{ minWidth: 0 }}>
            <span style={{ fontSize: '1rem' }}>📍</span>
            <input ref={cityRef} defaultValue={searchParams.city} placeholder="Stadt oder PLZ..." style={{ width: 160 }} />
          </div>
          <select ref={radiusRef} name="radius" defaultValue={searchParams.radius||''} style={{ padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontFamily: 'inherit', fontSize: '0.85rem', background: 'white', color: 'var(--ink)', outline: 'none', cursor: 'pointer' }}>
            <option value="">Umkreis</option>
            <option value="10">+10 km</option>
            <option value="25">+25 km</option>
            <option value="50">+50 km</option>
            <option value="100">+100 km</option>
            <option value="999">Bundesweit</option>
          </select>
          <select name="type" defaultValue={searchParams.type||''} style={{ padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 12, fontFamily: 'inherit', fontSize: '0.85rem', background: 'white', color: 'var(--ink)', outline: 'none', cursor: 'pointer' }}>
            <option value="">Alle Typen</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Vor Ort">Vor Ort</option>
          </select>
          <button type="submit" className="btn btn-dark btn-sm" disabled={geocoding}>
            {geocoding ? '...' : 'Suchen'}
          </button>
        </form>
        <div className="topbar-actions" style={{ marginLeft: '1rem' }}>
          {!user && <Link href="/register" className="btn btn-gold btn-sm">Registrieren</Link>}
        </div>
      </div>

      {/* FILTER CHIPS */}
      <div style={{ padding: '1rem 2rem 0', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--ink3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginRight: 4 }}>Filter:</span>
        {[['Alle','/jobs'],['Remote','/jobs?type=Remote'],['Vollzeit','/jobs?contract=Vollzeit'],['Junior','/jobs?level=Junior'],['Senior','/jobs?level=Senior'],['Tech & IT','/jobs?field=Tech+%26+IT'],['Handwerk','/jobs?field=Handwerk']].map(([l,h]) => (
          <Link key={l} href={h} className="filter-chip">{l}</Link>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--ink3)', fontWeight: 600 }}>{jobs.length} Jobs gefunden</span>
      </div>

      {/* SPLIT VIEW */}
      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '1.25rem', padding: '1rem 2rem 2rem', minHeight: 'calc(100vh - 160px)' }}>

        {/* JOB LIST */}
        <div>
          {jobs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: '0.5rem' }}>Keine Jobs gefunden</div>
              <div style={{ color: 'var(--ink2)', fontSize: '0.88rem' }}>Versuche einen größeren Umkreis.</div>
              <Link href="/jobs" className="btn btn-dark btn-sm" style={{ marginTop: '1rem', borderRadius: 10 }}>Alle Jobs</Link>
            </div>
          ) : (
            <div className="job-list">
              {jobs.map((job: any, i: number) => (
                <div key={job.id} className={`job-card-row${selected?.id === job.id ? ' active' : ''}`} onClick={() => setSelected(job)}>
                  {job.company_logo_url ? (
                    <div className="job-logo"><img src={job.company_logo_url} alt={job.company} /></div>
                  ) : (
                    <div className={`job-logo ${lc(i)}`}>{ll(job.company)}</div>
                  )}
                  <div className="job-card-body">
                    <div className="job-card-title">{job.title}</div>
                    <div className="job-card-company">{job.company} · {job.location}</div>
                    <div className="job-card-salary">
                      {job.salary_min > 0 ? `${job.salary_min.toLocaleString('de-DE')} – ${job.salary_max.toLocaleString('de-DE')} €` : 'Gehalt n. V.'}
                    </div>
                    <div className="job-card-tags">
                      <span className={`badge ${typeBadge(job.type)}`}>{job.type}</span>
                      <span className="badge badge-office">{job.contract}</span>
                      {job.field && <span className="badge badge-accent">{job.field}</span>}
                    </div>
                  </div>
                  <div className="job-card-arrow">→</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* JOB DETAIL */}
        {selected ? (
          <div className="job-detail">
            {/* COVER */}
            <div style={{ position: 'relative', height: 160, background: 'linear-gradient(135deg, var(--dark), var(--dark3))', overflow: 'hidden' }}>
              {selected.cover_image_url && <img src={selected.cover_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,26,46,0.8), transparent)' }} />
              <button style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', borderRadius: 12, width: 36, height: 36, cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>★</button>
            </div>

            {/* LOGO + TITLE */}
            <div className="job-detail-body">
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', marginTop: '-1.5rem', position: 'relative', zIndex: 1 }}>
                {selected.company_logo_url ? (
                  <img src={selected.company_logo_url} alt={selected.company} className="job-detail-logo" />
                ) : (
                  <div className={`job-logo ${logoClasses[0]}`} style={{ width: 60, height: 60, borderRadius: 16, border: '3px solid white', boxShadow: 'var(--shadow)' }}>{ll(selected.company)}</div>
                )}
              </div>

              <div className="job-detail-title">{selected.title}</div>
              <div className="job-detail-salary">
                {selected.salary_min > 0 ? `${selected.salary_min.toLocaleString('de-DE')} – ${selected.salary_max.toLocaleString('de-DE')} €` : 'Gehalt nach Vereinbarung'}
              </div>
              <div className="job-detail-tags">
                <span className={`badge ${typeBadge(selected.type)}`}>{selected.type}</span>
                <span className="badge badge-office">{selected.contract}</span>
                <span className="badge badge-office">{selected.level}</span>
                {selected.field && <span className="badge badge-accent">{selected.field}</span>}
                <span className="badge badge-office">📍 {selected.location}</span>
              </div>

              {/* BENEFITS */}
              {selected.benefits?.length > 0 && (
                <div className="job-detail-section">
                  <h3>🎁 Benefits</h3>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {selected.benefits.map((b: string) => (
                      <span key={b} style={{ padding: '4px 12px', background: 'var(--light2)', borderRadius: 100, fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink2)' }}>✓ {b}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* DESCRIPTION */}
              <div className="job-detail-section">
                <h3>Stellenbeschreibung</h3>
                <div className="job-detail-desc" style={{ whiteSpace: 'pre-wrap' }}>{selected.description}</div>
              </div>

              {/* COMPANY */}
              {selected.company_description && (
                <div className="job-detail-section">
                  <h3>Über {selected.company}</h3>
                  <div className="job-detail-desc">{selected.company_description}</div>
                  {selected.company_website && <a href={selected.company_website} target="_blank" rel="noopener" style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', display: 'block', marginTop: 8 }}>{selected.company_website} →</a>}
                </div>
              )}

              {/* CTA */}
              <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                {user ? (
                  <a href={`mailto:?subject=Bewerbung: ${selected.title}`} className="btn btn-dark btn-lg" style={{ flex: 1, justifyContent: 'center', borderRadius: 14 }}>
                    Lebenslauf senden
                  </a>
                ) : (
                  <Link href="/register" className="btn btn-dark btn-lg" style={{ flex: 1, justifyContent: 'center', borderRadius: 14 }}>
                    Anmelden & bewerben
                  </Link>
                )}
                <Link href={`/ki-tools`} className="btn btn-light" style={{ borderRadius: 14 }}>
                  KI-Match ✦
                </Link>
                <Link href={`/jobs/${selected.id}`} className="btn btn-light" style={{ borderRadius: 14, padding: '0 14px' }}>↗</Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', minHeight: 400 }}>
            <div style={{ fontSize: '3rem' }}>◈</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>Stelle auswählen</div>
            <div style={{ color: 'var(--ink2)', fontSize: '0.88rem' }}>Klicke auf eine Stelle um Details zu sehen</div>
          </div>
        )}
      </div>
    </>
  )
}
