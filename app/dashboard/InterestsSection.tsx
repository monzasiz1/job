'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function InterestsSection({ myInterests }: { myInterests: any[] }) {
  const router = useRouter()
  const [interests, setInterests] = useState(myInterests)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    setDeleting(id)
    try {
      const res = await fetch(`/api/delete-interest?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setInterests(interests.filter(i => i.id !== id))
      }
    } catch (err) {
      console.error('Error deleting interest:', err)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
          <span>Interessen</span>
          {interests.length > 0 && <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{interests.length}</span>}
        </div>
      </div>
      {interests.length === 0 ? (
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '2rem', textAlign: 'center' as const }}>
          <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Noch keine Interessen</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Markiere Jobs als "Interessiert", um sie hier zu sehen.</div>
          <Link href="/jobs" style={{ padding: '11px 22px', background: '#fff', color: '#000', borderRadius: 8, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>Stellen ansehen</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {interests.map((interest: any) => (
            <div key={interest.id} style={{ position: 'relative' }}>
              <Link href={`/jobs/${interest.job?.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '1rem', transition: 'border-color 0.18s', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' as const }}>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{interest.job?.title}</div>
                  <div style={{ fontSize: '0.77rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {interest.job?.company}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', display: 'flex', gap: 8, marginBottom: 'auto', flexWrap: 'wrap' }}>
                    {interest.job?.location && <span>{interest.job.location}</span>}
                    {interest.job?.salary_min > 0 && <span>{(interest.job.salary_min / 1000).toFixed(0)}k€</span>}
                  </div>
                  <div style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: 600 }}>→ Zum Job</div>
                </div>
              </Link>
              <button
                onClick={(e) => handleDelete(e, interest.id)}
                disabled={deleting === interest.id}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: 'rgba(240,96,144,0.2)',
                  border: '1px solid rgba(240,96,144,0.3)',
                  color: '#f06090',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: deleting === interest.id ? 0.5 : 1,
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
