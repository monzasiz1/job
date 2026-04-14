'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const STYLES = `
  @media(max-width:999px) {
    .job-card { flex-direction: column !important; align-items: stretch !important; }
    .job-card-main { width: 100%; }
    .job-card-status { width: 100%; justify-content: flex-start; }
    .job-card-buttons { width: 100%; gap: clamp(4px, 1.5vw, 8px) !important; }
    .job-card-buttons a, .job-card-buttons button { flex: 1; text-align: center; }
  }
  @media(min-width:1000px) {
    .job-card { flex-direction: row; }
  }
`

export default function JobsManagement({ jobs, lc }: any) {
  const router = useRouter()
  const [jobsState, setJobsState] = useState(jobs)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (jobId: string) => {
    if (!confirm('Stelle wirklich löschen?')) return

    setDeletingId(jobId)
    try {
      const res = await fetch(`/api/delete-job?id=${jobId}`, { method: 'DELETE' })
      if (res.ok) {
        setJobsState(jobsState.filter((j: any) => j.id !== jobId))
      }
    } catch (err) {
      console.error('Error deleting job:', err)
      alert('Fehler beim Löschen')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <style>{STYLES}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1rem, 3vw, 1.1rem)', color: '#fff' }}>Meine Stellen</div>
        <Link href="/post-job" style={{ padding: '10px 18px', background: 'linear-gradient(135deg,var(--accent),rgba(124,104,250,0.8))', border: '1px solid rgba(124,104,250,0.3)', borderRadius: 12, color: '#fff', fontSize: 'clamp(0.82rem, 1.5vw, 0.88rem)', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.2s', fontFamily: "'Syne',sans-serif" }}>＋ Neue Stelle</Link>
      </div>
      {jobsState.length === 0 ? (
        <div style={{ background: 'linear-gradient(135deg,rgba(124,104,250,0.06),rgba(124,104,250,0.02))', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 24, padding: 'clamp(2rem, 4vw, 3rem)', textAlign: 'center' as const }}>
          <div style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', marginBottom: '1rem' }}>📋</div>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, color: '#fff', marginBottom: '0.6rem', fontSize: 'clamp(1rem, 2vw, 1.2rem)' }}>Noch keine Stellen veröffentlicht</div>
          <div style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>Schalten Sie Ihre erste Stelle live und erreichen Sie passende Kandidaten.</div>
          <Link href="/post-job" style={{ display: 'inline-flex', padding: '13px 26px', background: 'linear-gradient(135deg,var(--accent),rgba(124,104,250,0.8))', color: '#fff', borderRadius: 14, fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(0.88rem, 1.5vw, 0.95rem)', textDecoration: 'none' }}>Erste Stelle inserieren →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(6px, 1.5vw, 10px)' }}>
          {jobsState.map((j: any, i: number) => (
            <div key={j.id} className="job-card" style={{ background: 'var(--surface)', borderRadius: 'clamp(12px, 2vw, 18px)', border: '1px solid var(--border)', padding: 'clamp(0.8rem, 2vw, 1.2rem)', display: 'flex', gap: 'clamp(0.75rem, 2vw, 1rem)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between', transition: 'all 0.2s' }}>
              <div className="job-card-main" style={{ display: 'flex', gap: 'clamp(0.75rem, 2vw, 1rem)', alignItems: 'center', flex: 1, minWidth: 0 }}>
                {j.company_logo_url
                  ? <img src={j.company_logo_url} alt="" style={{ width: 'clamp(40px, 8vw, 48px)', height: 'clamp(40px, 8vw, 48px)', borderRadius: 'clamp(8px, 1.5vw, 12px)', objectFit: 'cover', flexShrink: 0 }} />
                  : <div className={`jlogo ${lc[i%4]}`} style={{ width: 'clamp(40px, 8vw, 48px)', height: 'clamp(40px, 8vw, 48px)', flexShrink: 0, borderRadius: 'clamp(8px, 1.5vw, 12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 'clamp(0.8rem, 2vw, 1.1rem)' }}>{j.company.slice(0,2).toUpperCase()}</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#fff', fontSize: 'clamp(0.8rem, 2.2vw, 0.95rem)', marginBottom: 'clamp(2px, 0.5vw, 4px)' }}>{j.title}</div>
                  <div style={{ fontSize: 'clamp(0.7rem, 1.6vw, 0.82rem)', color: 'var(--text3)', display: 'flex', gap: 'clamp(8px, 1.5vw, 12px)', flexWrap: 'wrap' }}>
                    <span>📍 {j.location}</span>
                    <span>⏰ {j.contract}</span>
                    {j.salary_min > 0 && <span>💰 {(j.salary_min / 1000).toFixed(0)}k€</span>}
                  </div>
                </div>
              </div>
              <span className="job-card-status" style={{ padding: 'clamp(3px, 0.8vw, 5px) clamp(8px, 1.5vw, 12px)', borderRadius: 999, fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', fontWeight: 700, background: j.is_active ? 'rgba(61,186,126,0.15)' : 'rgba(255,100,100,0.15)', color: j.is_active ? 'var(--green)' : '#ff6464', whiteSpace: 'nowrap', flexShrink: 0 }}>{j.is_active ? '● Aktiv' : '○ Inaktiv'}</span>
              <div className="job-card-buttons" style={{ display: 'flex', gap: 'clamp(4px, 1vw, 6px)', flexWrap: 'wrap', flexShrink: 0 }}>
                <Link href={`/jobs/${j.id}`} style={{ padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2vw, 14px)', background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 'clamp(8px, 1.5vw, 10px)', color: 'var(--text2)', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>Ansehen</Link>
                <Link href={`/post-job?edit=${j.id}`} style={{ padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2vw, 14px)', background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.25)', borderRadius: 'clamp(8px, 1.5vw, 10px)', color: 'var(--gold)', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>Edit</Link>
                <button 
                  onClick={() => handleDelete(j.id)} 
                  disabled={deletingId === j.id}
                  style={{ padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2vw, 14px)', background: 'rgba(240,96,144,0.15)', border: '1px solid rgba(240,96,144,0.25)', borderRadius: 'clamp(8px, 1.5vw, 10px)', color: '#f06090', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', fontWeight: 700, textDecoration: 'none', cursor: 'pointer', opacity: deletingId === j.id ? 0.5 : 1, transition: 'all 0.2s', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  {deletingId === j.id ? '...' : 'Löschen'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
