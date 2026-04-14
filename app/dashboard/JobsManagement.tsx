'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 'clamp(0.9rem, 3vw, 0.95rem)', color: '#fff' }}>Meine Stellen</div>
        <Link href="/post-job" style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>＋ Neu</Link>
      </div>
      {jobsState.length === 0 ? (
        <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 'clamp(1.5rem, 4vw, 3rem)', textAlign: 'center' as const }}>
          <div style={{ fontSize: 'clamp(1.8rem, 6vw, 2.5rem)', marginBottom: '1rem' }}>📋</div>
          <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Noch keine Stellen</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Schalten Sie Ihre erste Stelle live.</div>
          <Link href="/post-job" style={{ padding: '11px 22px', background: '#d4a843', color: '#000', borderRadius: 999, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>Erste Stelle inserieren →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
          {jobsState.map((j: any, i: number) => (
            <div key={j.id} style={{ background: '#17172a', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(0.75rem, 2vw, 1.1rem)', display: 'flex', gap: 'clamp(0.75rem, 2vw, 1rem)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 'clamp(0.75rem, 2vw, 1rem)', alignItems: 'center', flex: 1, minWidth: 0 }}>
                {j.cover_image_url
                  ? <img src={j.cover_image_url} alt="" style={{ width: 'clamp(40px, 10vw, 44px)', height: 'clamp(40px, 10vw, 44px)', borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                  : <div className={`jlogo ${lc[i%4]}`} style={{ width: 'clamp(40px, 10vw, 44px)', height: 'clamp(40px, 10vw, 44px)', flexShrink: 0, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>{j.company.slice(0,2).toUpperCase()}</div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: 'clamp(0.8rem, 2vw, 0.88rem)', marginBottom: 3 }}>{j.title}</div>
                  <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.76rem)', color: 'rgba(255,255,255,0.3)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span>📍 {j.location}</span><span>⏰ {j.contract}</span>
                    <span>{new Date(j.created_at).toLocaleDateString('de-DE')}</span>
                  </div>
                </div>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: j.is_active ? 'rgba(61,186,126,0.15)' : 'rgba(255,255,255,0.07)', color: j.is_active ? '#3dba7e' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{j.is_active ? 'Aktiv' : 'Inaktiv'}</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
                <Link href={`/jobs/${j.id}`} style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>Ansehen</Link>
                <Link href={`/post-job?edit=${j.id}`} style={{ padding: '7px 14px', background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 999, color: '#d4a843', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>✏️ Bearbeiten</Link>
                <button 
                  onClick={() => handleDelete(j.id)} 
                  disabled={deletingId === j.id}
                  style={{ padding: '7px 14px', background: 'rgba(240,96,144,0.15)', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 999, color: '#f06090', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', cursor: 'pointer', opacity: deletingId === j.id ? 0.5 : 1 }}>
                  {deletingId === j.id ? '...' : '✕ Löschen'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
