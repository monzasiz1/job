'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ChatsSection({ conversations, isEmp }: { conversations: any[], isEmp: boolean }) {
  const router = useRouter()
  const [chats, setChats] = useState(conversations)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    setDeleting(id)
    try {
      const res = await fetch(`/api/delete-conversation?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setChats(chats.filter(c => c.id !== id))
      }
    } catch (err) {
      console.error('Error deleting conversation:', err)
    } finally {
      setDeleting(null)
    }
  }

  if (chats.length === 0) {
    return (
      <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '2rem', textAlign: 'center' as const }}>
        <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Noch keine Chats</div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>
          {isEmp ? 'Wenn Bewerber interessiert sind, kannst du mit ihnen chatten.' : 'Wenn ein Arbeitgeber an dir interessiert ist, startet er einen Chat mit dir.'}
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 8, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
          <span>Chats</span>
          <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>{chats.length}</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
        {chats.map((conv: any) => {
          const otherUser = isEmp ? conv.applicant : conv.employer
          const params = `employer=${conv.employer_id}&applicant=${conv.applicant_id}&job=${conv.job_id}`
          
          return (
            <div key={conv.id} style={{ position: 'relative' }}>
              <Link href={`/chat?${params}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: '1rem', transition: 'border-color 0.18s', cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center' }}>
                  {otherUser?.avatar_url
                    ? <img src={otherUser.avatar_url} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                    : <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', flexShrink: 0 }}>
                        {(otherUser?.full_name || '?').slice(0,2).toUpperCase()}
                      </div>}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', marginBottom: 3 }}>
                      {isEmp ? otherUser?.full_name : otherUser?.company_name || otherUser?.full_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.last_message || 'Keine Nachrichten'}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>{conv.job?.title}</div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>→</div>
                </div>
              </Link>
              <button
                onClick={(e) => handleDelete(e, conv.id)}
                disabled={deleting === conv.id}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: deleting === conv.id ? 0.5 : 1,
                }}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
