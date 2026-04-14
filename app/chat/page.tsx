'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [msgText, setMsgText] = useState('')
  const [loading, setLoading] = useState(true)
  const [otherUser, setOtherUser] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const employer = searchParams.get('employer')
  const applicant = searchParams.get('applicant')
  const job = searchParams.get('job')

  useEffect(() => {
    const initChat = async () => {
      try {
        // Hole aktuelle User
        const userRes = await fetch('/api/auth/user')
        if (!userRes.ok) {
          router.push('/login')
          return
        }
        const user = await userRes.json()
        setCurrentUser(user)

        // Finde oder erstelle Konversation
        const convRes = await fetch(
          `/api/chat/conversations?applicant_id=${applicant}&job_id=${job}`
        )
        const convData = await convRes.json()
        setConversationId(convData.conversation_id)

        // Hole andere Person's Profil
        const otherRes = await fetch(`/api/user/${applicant}`)
        const otherData = await otherRes.json()
        setOtherUser(otherData)

        // Lade Nachrichten
        const msgRes = await fetch(
          `/api/chat/messages?conversation_id=${convData.conversation_id}`
        )
        const msgData = await msgRes.json()
        setMessages(msgData || [])

        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }

    if (applicant) {
      initChat()
    }
  }, [applicant, job, router])

  useEffect(() => {
    // Auto-scroll zu letzter Nachricht
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!msgText.trim() || !conversationId || !currentUser) return

    const newMsg = {
      id: Date.now().toString(),
      conversation_id: conversationId,
      sender_id: currentUser.id,
      content: msgText,
      created_at: new Date().toISOString(),
    }

    setMessages([...messages, newMsg])
    setMsgText('')

    try {
      await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation_id: conversationId,
          sender_id: currentUser.id,
          content: msgText,
        }),
      })
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }}>💬</div>
            <div style={{ color: 'rgba(255,255,255,0.4)' }}>Chat wird geladen...</div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1rem', height: 'calc(100vh - 60px)', background: 'rgba(15,15,23,0.5)' }}>
        {/* CHAT BEREICH */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface, #17172a)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          {/* HEADER */}
          <div style={{ padding: '1rem 1.5rem', background: 'var(--surface, #17172a)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
              {otherUser?.avatar_url ? (
                <img
                  src={otherUser.avatar_url}
                  alt=""
                  style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(240,96,144,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#f06090',
                  }}
                >
                  {(otherUser?.full_name || '?').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                  {otherUser?.full_name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Online</div>
              </div>
            </div>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '0.9rem' }}>
              ✕
            </Link>
          </div>

          {/* MESSAGES */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', paddingTop: '3rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.2 }}>💬</div>
                <div style={{ fontSize: '0.85rem' }}>Starten Sie das Gespräch!</div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent:
                      msg.sender_id === currentUser?.id ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '65%',
                      padding: '10px 14px',
                      borderRadius: '16px',
                      background:
                        msg.sender_id === currentUser?.id
                          ? 'linear-gradient(135deg, rgba(124,104,250,0.3), rgba(124,104,250,0.15))'
                          : 'rgba(255,255,255,0.08)',
                      border:
                        msg.sender_id === currentUser?.id
                          ? '1px solid rgba(124,104,250,0.3)'
                          : '1px solid rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      wordWrap: 'break-word',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
            <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                placeholder="Nachricht..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  color: '#fff',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 18px',
                  background: 'var(--accent, #7c68fa)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Senden
              </button>
            </form>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', overflowY: 'auto' }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#fff', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Profil
          </div>
          <div style={{ background: 'var(--surface, #17172a)', borderRadius: 16, padding: '1rem', marginBottom: '1rem' }}>
            {otherUser?.bio && (
              <>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                  Über
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {otherUser.bio}
                </div>
              </>
            )}
            {otherUser?.location && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ flexShrink: 0 }}>📍</span>
                <span>{otherUser.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
