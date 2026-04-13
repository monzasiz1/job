import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import FavoriteButton from '@/components/FavoriteButton'

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: job } = await supabase
    .from('jobs')
    .select('*, profiles(id, full_name, company_name, email, avatar_url, bio, website)')
    .eq('id', params.id)
    .single()
  if (!job) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  const lc = ['ja','jb','jc','jd']
  const logoClass = lc[job.company.length % 4]
  const typeBadge = job.type === 'Remote' ? 'b-remote' : job.type === 'Hybrid' ? 'b-hybrid' : 'b-office'

  return (
    <>
      <Navbar />

      {/* HERO */}
      <div style={{
        position: 'relative',
        background: job.cover_image_url ? 'var(--surface)' : 'linear-gradient(135deg, #1a1a35 0%, #12122a 100%)',
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
      }}>
        {job.cover_image_url && (
          <>
            <img src={job.cover_image_url} alt={job.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,25,0.97) 0%, rgba(10,10,25,0.6) 50%, rgba(10,10,25,0.2) 100%)' }} />
          </>
        )}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: '1.5rem 2rem 2rem' }}>
          <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1.5rem', padding: '6px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)' }}>
            ← Alle Jobs
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {job.company_logo_url
              ? <img src={job.company_logo_url} alt={job.company} style={{ width: 72, height: 72, borderRadius: 18, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.15)', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }} />
              : <div className={`jlogo ${logoClass}`} style={{ width: 72, height: 72, fontSize: '1.3rem', borderRadius: 18, border: '3px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>{job.company.slice(0,2).toUpperCase()}</div>}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                <span className={`badge ${typeBadge}`}>{job.type}</span>
                <span className="badge b-office">{job.contract}</span>
                <span className="badge b-office">{job.level}</span>
                {job.field && <span className="badge b-accent">{job.field}</span>}
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '0.4rem' }}>{job.title}</h1>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', fontWeight: 500 }}>{job.company} · {job.location}</div>
            </div>
            <div style={{ flexShrink: 0 }}>
              <FavoriteButton jobId={job.id} />
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }} className="detail-grid">

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '1.75rem' }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '1rem' }}>Über die Stelle</h2>
            <div style={{ fontSize: '0.9rem', color: 'var(--text2)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{job.description}</div>
          </div>

          {job.benefits?.length > 0 && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '1.75rem' }}>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '1rem' }}>🎁 Benefits</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                {job.benefits.map((b: string) => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--green-soft)', borderRadius: 12, border: '1px solid rgba(61,186,126,0.15)' }}>
                    <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: '0.87rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(job.company_description || job.profiles?.website) && (
            <div style={{ background: 'var(--surface)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 20, padding: '1.75rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.1rem' }}>
                {job.company_logo_url
                  ? <img src={job.company_logo_url} alt={job.company} style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                  : <div className={`jlogo ${logoClass}`} style={{ width: 48, height: 48, flexShrink: 0 }}>{job.company.slice(0,2).toUpperCase()}</div>}
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{job.company}</div>
                  {job.company_website && <a href={job.company_website} target="_blank" rel="noopener" style={{ fontSize: '0.8rem', color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>{job.company_website}</a>}
                </div>
              </div>
              {job.company_description && <p style={{ fontSize: '0.88rem', color: 'var(--text2)', lineHeight: 1.8 }}>{job.company_description}</p>}
              <Link href={`/arbeitgeber/${job.employer_id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: '1rem', color: 'var(--gold)', fontWeight: 600, fontSize: '0.84rem', textDecoration: 'none' }}>
                Vollständiges Firmenprofil →
              </Link>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid rgba(212,168,67,0.25)', borderRadius: 20, padding: '1.5rem' }}>
            {job.salary_min > 0 ? (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: 6 }}>Jahresgehalt</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.7rem', fontWeight: 800, color: 'var(--green)' }}>
                  {job.salary_min.toLocaleString('de-DE')} – {job.salary_max.toLocaleString('de-DE')} €
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '1.25rem', fontWeight: 600, color: 'var(--text2)', fontSize: '0.9rem' }}>Gehalt nach Vereinbarung</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: '1.25rem' }}>
              {[['📍','Ort',job.location],['🏠','Modell',job.type],['⏰','Anstellung',job.contract],['🎯','Level',job.level],['💼','Bereich',job.field]].map(([ic,l,v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.83rem', color: 'var(--text3)' }}>{ic} {l}</span>
                  <span style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>
            {user ? (
              <a href={`mailto:${job.profiles?.email}?subject=Bewerbung: ${job.title} bei ${job.company}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '13px', background: 'var(--accent)', color: '#fff', borderRadius: 14, fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none', width: '100%' }}>
                Jetzt bewerben →
              </a>
            ) : (
              <Link href="/register"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '13px', background: 'var(--accent)', color: '#fff', borderRadius: 14, fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none', width: '100%' }}>
                Anmelden & bewerben →
              </Link>
            )}
            <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text3)' }}>
              Inseriert am {new Date(job.created_at).toLocaleDateString('de-DE')}
            </div>
          </div>

          <div style={{ background: 'rgba(124,104,250,0.08)', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 20, padding: '1.25rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--accent-soft)', border: '1px solid rgba(124,104,250,0.2)', color: '#a080ff', borderRadius: 999, padding: '3px 10px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>✦ KI-Tool</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#fff', marginBottom: '0.4rem', fontSize: '0.95rem' }}>Eignung prüfen</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>Lass die KI prüfen ob du zu dieser Stelle passt.</div>
            <Link href="/ki-tools" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px', background: 'var(--accent)', color: '#fff', borderRadius: 12, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', width: '100%' }}>
              KI-Matching starten →
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE CTA */}
      <div style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem 1.25rem', background: 'rgba(15,15,23,0.97)', borderTop: '1px solid var(--border)', backdropFilter: 'blur(20px)', zIndex: 100, gap: 10 }} className="mob-cta">
        {user
          ? <a href={`mailto:?subject=Bewerbung: ${job.title}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '13px', background: 'var(--accent)', color: '#fff', borderRadius: 14, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>Jetzt bewerben →</a>
          : <Link href="/register" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '13px', background: 'var(--accent)', color: '#fff', borderRadius: 14, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>Anmelden & bewerben →</Link>}
        <Link href="/ki-tools" style={{ padding: '13px 16px', background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--text2)', borderRadius: 14, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', flexShrink: 0 }}>✦ KI</Link>
      </div>

      <style>{`
        @media(max-width:860px){
          .detail-grid { grid-template-columns: 1fr !important; }
          .mob-cta { display: flex !important; }
          body { padding-bottom: 80px; }
        }
      `}</style>
    </>
  )
}
