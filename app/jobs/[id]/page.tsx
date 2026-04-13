import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: job } = await supabase.from('jobs').select('*, profiles(id, full_name, company_name, email, avatar_url, bio, location, website)').eq('id', params.id).single()
  if (!job) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  const logoClasses = ['logo-a', 'logo-b', 'logo-c', 'logo-d']
  const logoClass = logoClasses[job.company.length % 4]

  const typeBadge = job.type === 'Remote' ? 'badge-green' : job.type === 'Hybrid' ? 'badge-blue' : 'badge-amber'

  return (
    <>
      <Navbar />

      {/* COVER IMAGE OR NAVY HEADER */}
      <div style={{ position: 'relative', background: 'var(--navy)', minHeight: job.cover_image_url ? 340 : 220, display: 'flex', alignItems: 'flex-end' }}>
        {job.cover_image_url && (
          <>
            <img src={job.cover_image_url} alt={job.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,27,42,0.95) 0%, rgba(13,27,42,0.4) 60%, transparent 100%)' }} />
          </>
        )}
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '2rem 2.5rem', width: '100%', position: 'relative', zIndex: 1 }}>
          <Link href="/jobs" style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem' }}>← Alle Jobs</Link>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-end' }}>
            {job.company_logo_url ? (
              <img src={job.company_logo_url} alt={job.company} style={{ width: 72, height: 72, borderRadius: 18, objectFit: 'cover', border: '2px solid rgba(200,169,81,0.3)', flexShrink: 0 }} />
            ) : (
              <div className={`company-logo ${logoClass}`} style={{ width: 72, height: 72, fontSize: '1.3rem', border: '2px solid rgba(200,169,81,0.2)', flexShrink: 0 }}>{job.company.substring(0, 2).toUpperCase()}</div>
            )}
            <div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                <span className={`badge ${typeBadge}`}>{job.type}</span>
                <span className="badge badge-gray">{job.contract}</span>
                <span className="badge badge-gray">{job.level}</span>
                {job.field && <span className="badge badge-gold">{job.field}</span>}
              </div>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, color: 'white', lineHeight: 1.15, marginBottom: '0.4rem' }}>{job.title}</h1>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', fontWeight: 500 }}>{job.company} · {job.location}</div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="page" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* BESCHREIBUNG */}
          <div className="card">
            <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.25rem' }}>Über die Stelle</h2>
            <div style={{ fontSize: '0.95rem', color: 'var(--ink2)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{job.description}</div>
          </div>

          {/* BENEFITS */}
          {job.benefits?.length > 0 && (
            <div className="card">
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.25rem' }}>🎁 Benefits</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {job.benefits.map((b: string) => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-xs)', border: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--gold)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UNTERNEHMEN */}
          {(job.company_description || job.company_website) && (
            <div className="card card-gold">
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                {job.company_logo_url ? (
                  <img src={job.company_logo_url} alt={job.company} style={{ width: 56, height: 56, borderRadius: 14, objectFit: 'cover' }} />
                ) : (
                  <div className={`company-logo ${logoClass}`} style={{ width: 56, height: 56 }}>{job.company.substring(0, 2).toUpperCase()}</div>
                )}
                <div>
                  <h3 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.1rem' }}>{job.company}</h3>
                  {job.company_website && <a href={job.company_website} target="_blank" rel="noopener" style={{ fontSize: '0.85rem', color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>{job.company_website}</a>}
                </div>
              </div>
              {job.company_description && <p style={{ fontSize: '0.92rem', color: 'var(--ink2)', lineHeight: 1.8 }}>{job.company_description}</p>}
              <Link href={`/arbeitgeber/${job.employer_id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: '1rem', color: 'var(--navy)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}>
                Vollständiges Unternehmensprofil ansehen →
              </Link>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card card-gold">
            {job.salary_min > 0 ? (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink2)', marginBottom: 6 }}>Jahresgehalt</div>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: '1.8rem', fontWeight: 700, color: 'var(--green)' }}>
                  {job.salary_min.toLocaleString('de-DE')} – {job.salary_max.toLocaleString('de-DE')} €
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '1.25rem', fontWeight: 600, color: 'var(--ink2)' }}>Gehalt nach Vereinbarung</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem', fontSize: '0.88rem' }}>
              {[['📍', 'Ort', job.location], ['🏠', 'Modell', job.type], ['⏰', 'Anstellung', job.contract], ['🎯', 'Level', job.level], ['💼', 'Bereich', job.field]].map(([i, l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--ink2)' }}>{i} {l}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            {user ? (
              <a href={`mailto:${job.profiles?.email}?subject=Bewerbung: ${job.title} bei ${job.company}`}
                className="btn btn-gold btn-full btn-lg" style={{ borderRadius: 'var(--radius-sm)' }}>
                Jetzt bewerben →
              </a>
            ) : (
              <Link href="/register" className="btn btn-gold btn-full btn-lg" style={{ borderRadius: 'var(--radius-sm)' }}>
                Anmelden zum Bewerben →
              </Link>
            )}
            <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.78rem', color: 'var(--ink3)' }}>
              Inseriert am {new Date(job.created_at).toLocaleDateString('de-DE')}
            </div>
          </div>

          {/* KI TOOLS CTA */}
          <div className="ai-card" style={{ padding: '1.5rem' }}>
            <div className="ai-badge">✦ KI-Tool</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Eignung prüfen</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>Lass die KI prüfen ob du zu dieser Stelle passt.</div>
            <Link href="/ki-tools" className="btn btn-gold btn-full" style={{ borderRadius: 'var(--radius-xs)' }}>KI-Matching starten →</Link>
          </div>
        </div>
      </div>
    </>
  )
}
