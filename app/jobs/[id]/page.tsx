import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import FavoriteButton from '@/components/FavoriteButton'
import ShareButton from '@/components/ShareButton'

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
        background: job.cover_image_url
          ? 'var(--surface)'
          : 'linear-gradient(135deg, rgba(124,104,250,0.1), rgba(212,168,67,0.05))',
        minHeight: 'clamp(280px, 50vh, 320px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'visible',
        zIndex: 10,
      }}>
        {job.cover_image_url && (
          <>
            <img src={job.cover_image_url} alt={job.title}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(10,10,25,0.4) 0%, rgba(10,10,25,0.8) 50%, rgba(10,10,25,0.95) 100%)' }} />
          </>
        )}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', width: '100%', padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1.5rem, 4vw, 3rem)' }}>
          <Link href="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 700, marginBottom: '2rem', padding: '8px 14px', background: 'rgba(255,255,255,0.08)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.2s' }}>
            ← Alle Jobs durchsuchen
          </Link>
          <div style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 1.5rem)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
              {job.company_logo_url
                ? <img src={job.company_logo_url} alt={job.company} style={{ width: 'clamp(64px, 12vw, 92px)', height: 'clamp(64px, 12vw, 92px)', borderRadius: 20, objectFit: 'cover', border: '4px solid rgba(255,255,255,0.2)', flexShrink: 0, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} />
                : <div className={`jlogo ${['ja','jb','jc','jd'][job.company.length % 4]}`} style={{ width: 'clamp(64px, 12vw, 92px)', height: 'clamp(64px, 12vw, 92px)', borderRadius: 20, fontSize: '2rem', border: '4px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className={`badge ${job.type === 'Remote' ? 'b-remote' : job.type === 'Hybrid' ? 'b-hybrid' : 'b-office'}`}>{job.type}</span>
                <span className="badge b-office">{job.contract}</span>
                <span className="badge b-office">{job.level}</span>
                {job.field && <span className="badge b-accent">{job.field}</span>}
              </div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.2rem, 3.5vw, 2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.2, marginBottom: '0.6rem', textShadow: '0 2px 10px rgba(0,0,0,0.3)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>{job.title}</h1>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'clamp(0.95rem, 2vw, 1.05rem)', fontWeight: 600 }}>{job.company} · {job.location}</div>
              {job.salary_min > 0 && <div style={{ color: 'var(--gold)', fontSize: 'clamp(1.1rem, 3vw, 1.4rem)', fontWeight: 800, marginTop: '0.8rem' }}>{job.salary_min.toLocaleString('de-DE')}–{job.salary_max.toLocaleString('de-DE')} €</div>}
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
              <ShareButton jobId={job.id} jobTitle={job.title} jobCompany={job.company} />
              <FavoriteButton jobId={job.id} />
              <Link href={`/jobs/${job.id}`} style={{display:'none',width:40,height:40,background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.25)',borderRadius:12,alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'1rem',textDecoration:'none',backdropFilter:'blur(10px)',transition:'all 0.2s'}} className="desktop-icon-link">↗</Link>
              <Link href={`/jobs/${job.id}`} style={{display:'none',padding:'10px 16px',background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.25)',borderRadius:12,color:'#fff',fontSize:'0.85rem',fontWeight:700,textDecoration:'none',backdropFilter:'blur(10px)',transition:'all 0.2s',whiteSpace:'nowrap'}} className="mobile-text-link">Inserat öffnen →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(2rem, 4vw, 3rem)', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start', position: 'relative', zIndex: 1 }} className="detail-grid">

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* BESCHREIBUNG */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--accent-soft)', border: '1px solid rgba(124,104,250,0.2)', color: '#a080ff', borderRadius: 999, padding: '4px 12px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>📝 Aufgaben</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.15rem, 2vw, 1.3rem)', color: '#fff', marginBottom: '1.2rem' }}>{job.title}</h2>
            <div style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1rem)', color: 'var(--text2)', lineHeight: 2, whiteSpace: 'pre-wrap' }}>{job.description}</div>
          </div>

          {/* VIER STRUKTURIERTE ABSCHNITTE */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 45vw, 320px), 1fr))', gap: '1.5rem' }}>
            {/* DEIN PROFIL */}
            <div style={{ background: 'linear-gradient(135deg, rgba(124,104,250,0.08), rgba(124,104,250,0.02))', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 24, padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(124,104,250,0.15)', border: '1px solid rgba(124,104,250,0.3)', color: '#a080ff', borderRadius: 999, padding: '4px 12px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>👤 Profil</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#fff', marginBottom: '1rem' }}>Dein Profil</h3>
              <div style={{ fontSize: 'clamp(0.88rem, 1.2vw, 0.95rem)', color: 'var(--text2)', lineHeight: 1.8, whiteSpace: 'pre-wrap', minHeight: '100px' }}>{job.requirements || 'Keine spezifischen Anforderungen angegeben.'}</div>
            </div>

            {/* WIR BIETEN DIR */}
            <div style={{ background: 'linear-gradient(135deg, rgba(61,186,126,0.08), rgba(61,186,126,0.02))', border: '1px solid rgba(61,186,126,0.2)', borderRadius: 24, padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(61,186,126,0.15)', border: '1px solid rgba(61,186,126,0.3)', color: 'var(--green)', borderRadius: 999, padding: '4px 12px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>🎁 Bieten</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#fff', marginBottom: '1rem' }}>Wir bieten dir</h3>
              <div style={{ fontSize: 'clamp(0.88rem, 1.2vw, 0.95rem)', color: 'var(--text2)', lineHeight: 1.8, whiteSpace: 'pre-wrap', minHeight: '100px' }}>{job.offers || 'Kompetitives Gehalt und attraktive Leistungen.'}</div>
            </div>

            {/* WAS ERWARTET DICH */}
            <div style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.08), rgba(212,168,67,0.03))', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 24, padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)', color: 'var(--gold)', borderRadius: 999, padding: '4px 12px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>🚀 Zukunft</div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#fff', marginBottom: '1rem' }}>Was erwartet dich?</h3>
              <div style={{ fontSize: 'clamp(0.88rem, 1.2vw, 0.95rem)', color: 'var(--text2)', lineHeight: 1.8, whiteSpace: 'pre-wrap', minHeight: '100px' }}>{job.expectations || 'Spannende Herausforderungen und Wachstumspotenzial.'}</div>
            </div>
          </div>

          {/* BENEFITS */}
          {job.benefits?.length > 0 && (
            <div style={{ background: 'linear-gradient(135deg, rgba(61,186,126,0.08), rgba(61,186,126,0.03))', border: '1px solid rgba(61,186,126,0.2)', borderRadius: 24, padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(61,186,126,0.15)', border: '1px solid rgba(61,186,126,0.3)', color: 'var(--green)', borderRadius: 999, padding: '4px 12px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>🎁 Highlights</div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.15rem, 2vw, 1.3rem)', color: '#fff', marginBottom: '1.2rem' }}>Das erwartet dich</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(160px, 30vw, 200px), 1fr))', gap: 12 }}>
                {job.benefits.map((b: string) => (
                  <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'clamp(0.9rem, 2vw, 1.25rem)', background: 'rgba(61,186,126,0.12)', border: '1px solid rgba(61,186,126,0.25)', borderRadius: 16, transition: 'all 0.2s' }}>
                    <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 'clamp(0.82rem, 1.5vw, 0.95rem)', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UNTERNEHMEN */}
          {(job.company_description || job.profiles?.website) && (
            <div style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.08), rgba(212,168,67,0.03))', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 24, padding: 'clamp(1.5rem, 3vw, 2rem)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)', color: 'var(--gold)', borderRadius: 999, padding: '4px 12px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>🏢 Arbeitgeber</div>
              <div style={{ display: 'flex', gap: 'clamp(1rem, 2vw, 1.5rem)', alignItems: 'center', marginBottom: 'clamp(1rem, 2vw, 1.5rem)' }}>
                {job.company_logo_url
                  ? <img src={job.company_logo_url} alt={job.company} style={{ width: 60, height: 60, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }} />
                  : <div className={`jlogo ${['ja','jb','jc','jd'][job.company.length % 4]}`} style={{ width: 60, height: 60, flexShrink: 0, fontSize: '1.5rem' }} />}
                <div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: '#fff', fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}>{job.company}</div>
                  {job.company_website && <a href={job.company_website} target="_blank" rel="noopener" style={{ fontSize: '0.85rem', color: 'var(--gold)', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', gap: 4, marginTop: 4 }}>Website ↗</a>}
                </div>
              </div>
              {job.company_description && <p style={{ fontSize: 'clamp(0.88rem, 1.5vw, 0.95rem)', color: 'var(--text2)', lineHeight: 1.8, marginBottom: '1.5rem' }}>{job.company_description}</p>}
              <Link href={`/arbeitgeber/${job.employer_id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 0, padding: 'clamp(10px, 2vw, 13px) clamp(14px, 3vw, 20px)', background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)', color: 'var(--gold)', fontWeight: 700, fontSize: 'clamp(0.82rem, 1.5vw, 0.95rem)', textDecoration: 'none', borderRadius: 12, transition: 'all 0.2s' }}>
                Vollständiges Profil →
              </Link>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* GEHALT & BEWERBEN */}
          <div style={{ background: 'linear-gradient(135deg, rgba(124,104,250,0.1), rgba(124,104,250,0.02))', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 24, padding: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
            {job.salary_min > 0 && (
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(124,104,250,0.15)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(160,128,255,0.7)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>💰 Jahresgehalt</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 900, color: 'var(--gold)' }}>
                  {job.salary_min.toLocaleString('de-DE')} €
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: 4 }}>bis {job.salary_max.toLocaleString('de-DE')} €</div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(124,104,250,0.15)' }}>
              {[
                { ic: '📍', label: 'Ort', value: job.location },
                { ic: '🏠', label: 'Modell', value: job.type },
                { ic: '⏰', label: 'Anstellung', value: job.contract },
                { ic: '🎯', label: 'Level', value: job.level },
                { ic: '💼', label: 'Bereich', value: job.field }
              ].map(({ic, label, value}) => value ? (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid rgba(124,104,250,0.08)' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text3)', fontWeight: 600 }}>{ic} {label}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#fff' }}>{value}</span>
                </div>
              ) : null)}
            </div>

            {user ? (
              <a href={`mailto:${job.profiles?.email}?subject=Bewerbung: ${job.title} bei ${job.company}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 2vw, 15px)', background: 'linear-gradient(135deg, var(--accent), rgba(124,104,250,0.8))', color: '#fff', borderRadius: 14, fontWeight: 800, fontSize: 'clamp(0.88rem, 1.5vw, 0.95rem)', textDecoration: 'none', width: '100%', transition: 'all 0.2s', border: '1px solid rgba(124,104,250,0.3)', cursor: 'pointer' }}>
                💌 Jetzt bewerben →
              </a>
            ) : (
              <Link href="/register"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 2vw, 15px)', background: 'linear-gradient(135deg, var(--accent), rgba(124,104,250,0.8))', color: '#fff', borderRadius: 14, fontWeight: 800, fontSize: 'clamp(0.88rem, 1.5vw, 0.95rem)', textDecoration: 'none', width: '100%', border: '1px solid rgba(124,104,250,0.3)' }}>
                Anmelden & bewerben →
              </Link>
            )}
            <div style={{ textAlign: 'center', marginTop: '0.9rem', fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600 }}>
              Inseriert am {new Date(job.created_at).toLocaleDateString('de-DE')}
            </div>
          </div>

          {/* KI CARD */}
          <div style={{ background: 'linear-gradient(135deg, rgba(61,186,126,0.1), rgba(61,186,126,0.02))', border: '1px solid rgba(61,186,126,0.2)', borderRadius: 24, padding: 'clamp(1.25rem, 2vw, 1.75rem)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(61,186,126,0.15)', border: '1px solid rgba(61,186,126,0.3)', color: 'var(--green)', borderRadius: 999, padding: '4px 12px', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>✦ KI-Analyse</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: '#fff', marginBottom: '0.5rem', fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)' }}>Pass-Analyse</div>
            <div style={{ fontSize: 'clamp(0.8rem, 1.3vw, 0.88rem)', color: 'var(--text2)', marginBottom: '1.25rem', lineHeight: 1.6 }}>Lass die KI deine Qualifikationen mit dieser Stelle abgleichen.</div>
            <Link href="/ki-tools" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(10px, 2vw, 13px)', background: 'linear-gradient(135deg, rgba(61,186,126,0.2), rgba(61,186,126,0.05))', border: '1px solid rgba(61,186,126,0.3)', color: 'var(--green)', borderRadius: 12, fontWeight: 800, fontSize: 'clamp(0.82rem, 1.5vw, 0.9rem)', textDecoration: 'none', width: '100%', transition: 'all 0.2s' }}>
              Jetzt analysieren ↗
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE CTA sticky bottom */}
      <div style={{ display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem 1.25rem', background: 'rgba(15,15,23,0.97)', borderTop: '1px solid var(--border)', backdropFilter: 'blur(20px)', zIndex: 100, gap: 10 }} className="mob-cta">
        {user
          ? <a href={`mailto:?subject=Bewerbung: ${job.title}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '13px', background: 'var(--accent)', color: '#fff', borderRadius: 14, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>Jetzt bewerben →</a>
          : <Link href="/register" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '13px', background: 'var(--accent)', color: '#fff', borderRadius: 14, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>Anmelden & bewerben →</Link>}
        <Link href="/ki-tools" style={{ padding: '13px 16px', background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--text2)', borderRadius: 14, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', flexShrink: 0 }}>✦ KI</Link>
      </div>

      <style>{`
        @media(max-width:860px){
          .detail-grid { grid-template-columns: 1fr !important; }
          .mob-cta { display: none !important; }
          .desktop-icon-link { display: none !important; }
          .mobile-text-link { display: inline-flex !important; }
        }
        @media(min-width:861px){
          .mobile-text-link { display: none !important; }
          .desktop-icon-link { display: flex !important; }
        }
      `}</style>
    </>
  )
}
