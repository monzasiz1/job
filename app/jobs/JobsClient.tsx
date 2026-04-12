'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Job } from '@/lib/types'

function logoLetter(name: string) { return name.substring(0, 2).toUpperCase() }
const logoClasses = ['logo-a', 'logo-b', 'logo-c', 'logo-d']
function logoClass(i: number) { return logoClasses[i % logoClasses.length] }
function typeBadge(t: string) { return t === 'Remote' ? 'badge-green' : t === 'Hybrid' ? 'badge-blue' : 'badge-amber' }

interface Props {
  initialJobs: Job[]
  searchParams: Record<string, string>
  hasFilters: boolean
}

export default function JobsClient({ initialJobs, searchParams, hasFilters }: Props) {
  const router = useRouter()
  const [geocoding, setGeocoding] = useState(false)
  const [geoError, setGeoError] = useState('')
  const cityRef = useRef<HTMLInputElement>(null)
  const radiusRef = useRef<HTMLSelectElement>(null)
  const qRef = useRef<HTMLInputElement>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const city = cityRef.current?.value || ''
    const radius = radiusRef.current?.value || ''
    const q = qRef.current?.value || ''

    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (city) params.set('city', city)

    // Holen der Formular-Felder
    const form = e.target as HTMLFormElement
    const type = (form.querySelector('[name=type]') as HTMLSelectElement)?.value
    const contract = (form.querySelector('[name=contract]') as HTMLSelectElement)?.value
    const level = (form.querySelector('[name=level]') as HTMLSelectElement)?.value
    const field = (form.querySelector('[name=field]') as HTMLSelectElement)?.value
    const salary_min = (form.querySelector('[name=salary_min]') as HTMLSelectElement)?.value

    if (type) params.set('type', type)
    if (contract) params.set('contract', contract)
    if (level) params.set('level', level)
    if (field) params.set('field', field)
    if (salary_min) params.set('salary_min', salary_min)
    if (radius) params.set('radius', radius)

    // Wenn Stadt + Umkreis → Geocoding
    if (city && radius && radius !== '999') {
      setGeocoding(true)
      setGeoError('')
      try {
        const res = await fetch(`/api/geocode?city=${encodeURIComponent(city)}`)
        const data = await res.json()
        if (data.lat) {
          params.set('clat', data.lat.toString())
          params.set('clng', data.lng.toString())
        } else {
          setGeoError(`"${city}" konnte nicht gefunden werden. Bitte genauere Angabe.`)
        }
      } catch {
        setGeoError('Standort konnte nicht ermittelt werden.')
      }
      setGeocoding(false)
    }

    router.push(`/jobs?${params.toString()}`)
  }

  const jobs = initialJobs

  return (
    <>
      {/* SEARCH HEADER */}
      <section style={{ background: 'var(--ink)', padding: '2.5rem 2rem 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.8rem', marginBottom: '1.5rem', letterSpacing: '-0.03em' }}>
            Jobs finden
            <span style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginLeft: 12 }}>{jobs.length} Ergebnisse</span>
          </h1>

          <form onSubmit={handleSearch}>
            {/* ROW 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: 10, marginBottom: 10 }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>🔍</span>
                <input ref={qRef} name="q" defaultValue={searchParams.q} placeholder="Jobtitel, Fähigkeit..."
                  style={{ width: '100%', padding: '13px 14px 13px 40px', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: '0.95rem', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>📍</span>
                <input ref={cityRef} name="city" defaultValue={searchParams.city} placeholder="Stadt oder PLZ (z.B. 47800 oder Willich)"
                  style={{ width: '100%', padding: '13px 14px 13px 40px', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: '0.95rem', background: 'rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
              </div>
              <select ref={radiusRef} name="radius" defaultValue={searchParams.radius || ''}
                style={{ padding: '13px 14px', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: '0.95rem', background: 'rgba(255,255,255,0.15)', color: 'white', outline: 'none', cursor: 'pointer' }}>
                <option value="">📏 Umkreis wählen</option>
                <option value="5">📍 exakt diese Stadt</option>
                <option value="10">+ 10 km Umkreis</option>
                <option value="25">+ 25 km Umkreis</option>
                <option value="50">+ 50 km Umkreis</option>
                <option value="100">+ 100 km Umkreis</option>
                <option value="200">+ 200 km Umkreis</option>
                <option value="999">🇩🇪 Bundesweit</option>
              </select>
            </div>

            {geoError && <div style={{ color: '#ff7a50', fontSize: '0.85rem', marginBottom: 8 }}>⚠️ {geoError}</div>}

            {/* ROW 2 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr) auto', gap: 10, paddingBottom: '1.5rem' }}>
              {[
                { name: 'type', label: '🏠 Arbeitsmodell', options: [['', 'Alle'], ['Remote','Remote'], ['Hybrid','Hybrid'], ['Vor Ort','Vor Ort']] },
                { name: 'contract', label: '⏰ Anstellung', options: [['','Alle'], ['Vollzeit','Vollzeit'], ['Teilzeit','Teilzeit'], ['Freelance','Freelance'], ['Praktikum','Praktikum']] },
                { name: 'level', label: '🎯 Erfahrung', options: [['','Alle'], ['Junior','Junior (0–2 J.)'], ['Mid','Mid (2–5 J.)'], ['Senior','Senior (5+ J.)']] },
                { name: 'field', label: '💼 Bereich', options: [['','Alle'], ['Tech & IT','Tech & IT'], ['Marketing','Marketing'], ['Finance','Finance'], ['Sales','Sales'], ['HR','HR'], ['Design','Design'], ['Handwerk','Handwerk'], ['Gesundheit','Gesundheit'], ['Gastronomie','Gastronomie'], ['Sonstiges','Sonstiges']] },
                { name: 'salary_min', label: '💶 Gehalt ab', options: [['','Alle'], ['20000','20.000 €'], ['30000','30.000 €'], ['40000','40.000 €'], ['50000','50.000 €'], ['60000','60.000 €'], ['80000','80.000 €'], ['100000','100.000 €']] },
              ].map(f => (
                <select key={f.name} name={f.name} defaultValue={searchParams[f.name] || ''}
                  style={{ padding: '11px 14px', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: '0.85rem', background: 'rgba(255,255,255,0.08)', color: 'white', outline: 'none', cursor: 'pointer' }}>
                  {f.options.map(([v, l]) => <option key={v} value={v}>{l === 'Alle' ? f.label : l}</option>)}
                </select>
              ))}
              <button type="submit" disabled={geocoding}
                style={{ padding: '11px 24px', background: geocoding ? 'rgba(255,255,255,0.2)' : 'var(--accent)', color: 'white', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontWeight: 700, fontSize: '0.95rem', cursor: geocoding ? 'wait' : 'pointer', whiteSpace: 'nowrap' }}>
                {geocoding ? '📍 Ort wird gesucht...' : 'Suchen →'}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* AKTIVE FILTER */}
      {hasFilters && (
        <div style={{ background: 'var(--bg2)', padding: '0.75rem 2rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--ink2)', fontWeight: 600 }}>Aktive Filter:</span>
            {searchParams.q && <span className="badge badge-blue">🔍 {searchParams.q}</span>}
            {searchParams.city && <span className="badge badge-blue">📍 {searchParams.city}{searchParams.radius && searchParams.radius !== '999' ? ` +${searchParams.radius} km` : searchParams.radius === '999' ? ' (Bundesweit)' : ''}</span>}
            {searchParams.type && <span className="badge badge-green">{searchParams.type}</span>}
            {searchParams.contract && <span className="badge badge-amber">{searchParams.contract}</span>}
            {searchParams.level && <span className="badge badge-purple">{searchParams.level}</span>}
            {searchParams.field && <span className="badge badge-blue">{searchParams.field}</span>}
            {searchParams.salary_min && <span className="badge badge-green">ab {parseInt(searchParams.salary_min).toLocaleString('de-DE')} €</span>}
            <Link href="/jobs" style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginLeft: 4 }}>✕ Zurücksetzen</Link>
          </div>
        </div>
      )}

      {/* QUICK TAGS */}
      <div style={{ background: 'white', padding: '0.75rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['Remote Jobs','?type=Remote'],['Vollzeit','?contract=Vollzeit'],['Junior','?level=Junior'],['Tech & IT','?field=Tech+%26+IT'],['Handwerk','?field=Handwerk'],['Gastronomie','?field=Gastronomie'],['ab 40.000 €','?salary_min=40000'],['Bundesweit','?radius=999']].map(([l,h]) => (
            <Link key={l} href={`/jobs${h}`} style={{ padding: '6px 14px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600, border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--ink2)', textDecoration: 'none' }}>{l}</Link>
          ))}
        </div>
      </div>

      {/* JOB GRID */}
      <div className="page">
        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--ink2)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Keine Jobs in diesem Umkreis gefunden</h3>
            <p style={{ marginBottom: '1.5rem' }}>Versuche einen größeren Umkreis oder andere Filter.</p>
            <Link href="/jobs" style={{ color: 'var(--accent)', fontWeight: 600 }}>Alle Jobs anzeigen →</Link>
          </div>
        ) : (
          <div className="job-grid">
            {jobs.map((job, i) => (
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
    </>
  )
}
