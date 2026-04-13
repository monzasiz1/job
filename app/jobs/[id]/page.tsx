import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: job } = await supabase.from('jobs').select('*, profiles(full_name, company_name, email)').eq('id', params.id).single()
  if (!job) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <>
      <Navbar />
      <div className="page" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
        {/* MAIN */}
        <div>
          <Link href="/jobs" style={{ color: 'var(--ink2)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem' }}>← Zurück zu Jobs</Link>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div className="company-logo logo-b" style={{ width: 60, height: 60, fontSize: '1.2rem', borderRadius: 14 }}>{job.company.substring(0, 2).toUpperCase()}</div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>{job.title}</h1>
                <div style={{ color: 'var(--ink2)', fontWeight: 500 }}>{job.company} · {job.location}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {[job.type, job.contract, job.level, job.field].map(t => (
                <span key={t} className="badge badge-blue">{t}</span>
              ))}
            </div>
            <div style={{ fontSize: '1rem', color: 'var(--ink)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.description}</div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ position: 'sticky', top: 80 }}>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--green)', marginBottom: 4 }}>
              {job.salary_min.toLocaleString('de-DE')} – {job.salary_max.toLocaleString('de-DE')} €
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink2)', marginBottom: '1.5rem' }}>Jahresgehalt</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {[['📍', 'Ort', job.location], ['🏠', 'Arbeitsmodell', job.type], ['⏰', 'Anstellung', job.contract], ['🎯', 'Level', job.level]].map(([i, l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink2)' }}>{i} {l}</span>
                  <span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            {user ? (
              <a href={`mailto:${job.profiles?.email}?subject=Bewerbung: ${job.title}`} className="btn btn-primary btn-full btn-lg">Jetzt bewerben →</a>
            ) : (
              <Link href="/register" className="btn btn-primary btn-full btn-lg">Anmelden zum Bewerben →</Link>
            )}
          </div>
          <div className="card" style={{ fontSize: '0.85rem', color: 'var(--ink2)' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>Über {job.company}</div>
            <div>Inseriert am: {new Date(job.created_at).toLocaleDateString('de-DE')}</div>
          </div>
        </div>
      </div>
    </>
  )
}
