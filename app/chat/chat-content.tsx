'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [msgText, setMsgText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [otherUser, setOtherUser] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [deleting, setDeleting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [booking, setBooking] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Sichere Parameter-Extraktion
  const employer = searchParams?.get('employer') || ''
  const applicant = searchParams?.get('applicant') || ''
  const job = searchParams?.get('job') || ''

  useEffect(() => {
    // Warte bis Parameter verfügbar sind
    if (!employer || !applicant) {
      setLoading(false)
      return
    }
    
    const initChat = async () => {
      try {
        setError(null)
        setLoading(true)
        
        // Hole aktuelle User
        const userRes = await fetch('/api/auth/user')
        if (!userRes.ok) {
          router.push('/login')
          return
        }
        const user = await userRes.json()
        setCurrentUser(user)

        // Finde oder erstelle Konversation
        const convUrl = job
          ? `/api/chat/conversations?employer_id=${employer}&applicant_id=${applicant}&job_id=${job}`
          : `/api/chat/conversations?employer_id=${employer}&applicant_id=${applicant}`
        const convRes = await fetch(convUrl, { cache: 'no-store' })
        if (!convRes.ok) {
          const errData = await convRes.json()
          throw new Error(errData.error || 'Konversation konnte nicht erstellt werden')
        }
        const convData = await convRes.json()
        if (!convData.conversation_id) {
          throw new Error('Keine Konversations-ID erhalten')
        }
        setConversationId(convData.conversation_id)

        // Hole andere Person's Profil (Bewerber sieht Arbeitgeber, Arbeitgeber sieht Bewerber)
        const otherUserId = user.id === employer ? applicant : employer
        const otherRes = await fetch(`/api/user/${otherUserId}`, { cache: 'no-store' })
        if (!otherRes.ok) {
          throw new Error('Benutzerprofil konnte nicht geladen werden')
        }
        const otherData = await otherRes.json()
        setOtherUser(otherData)

        // Lade Nachrichten
        const msgRes = await fetch(
          `/api/chat/messages?conversation_id=${convData.conversation_id}`,
          { cache: 'no-store' }
        )
        if (!msgRes.ok) {
          throw new Error('Nachrichten konnten nicht geladen werden')
        }
        const msgData = await msgRes.json()
        setMessages(msgData || [])

        // Lade Buchung zwischen den beiden Nutzern
        try {
          const bookRes = await fetch('/api/bookings')
          if (bookRes.ok) {
            const bookings = await bookRes.json()
            const relevant = (Array.isArray(bookings) ? bookings : []).find((b: any) =>
              (b.provider_id === employer && b.client_id === applicant) ||
              (b.provider_id === applicant && b.client_id === employer)
            )
            if (relevant) setBooking(relevant)
          }
        } catch(e) { /* ignore */ }

        setLoading(false)
      } catch (err: any) {
        console.error('Chat Init Error:', err)
        setError(err.message || 'Ein Fehler ist aufgetreten')
        setLoading(false)
      }
    }

    initChat()
  }, [employer, applicant, job, router])

  useEffect(() => {
    // Auto-scroll zu letzter Nachricht
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!msgText.trim() || !conversationId || !currentUser) return

    const msgToSend = msgText
    const newMsg = {
      id: Date.now().toString(),
      conversation_id: conversationId,
      sender_id: currentUser.id,
      content: msgToSend,
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
          content: msgToSend,
        }),
      })
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const handleDeleteChat = async () => {
    if (!conversationId || !window.confirm('Chat wirklich löschen?')) return
    
    setDeleting(true)
    try {
      const res = await fetch(`/api/delete-conversation?id=${conversationId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Error deleting conversation:', err)
      setDeleting(false)
    }
  }

  if (!employer || !applicant) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <div style={{ color: '#f06090', marginBottom: '1rem' }}>Parameter fehlen (employer/applicant)</div>
          <Link href="/" style={{ color: '#a080ff', textDecoration: 'none', fontWeight: 700 }}>← Zurück</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }}>💬</div>
          <div style={{ color: 'rgba(255,255,255,0.4)' }}>Chat wird geladen...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️</div>
          <div style={{ color: '#f06090', marginBottom: '1rem' }}>{error}</div>
          <Link href="/" style={{ color: '#a080ff', textDecoration: 'none', fontWeight: 700 }}>← Zurück</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: isMobile ? '1fr' : '1fr 280px', 
      gap: isMobile ? 0 : '1rem', 
      height: 'calc(100vh - 60px)', 
      background: 'rgba(15,15,23,0.5)' 
    }}>
      {/* CHAT BEREICH */}
      <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface, #17172a)', borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.06)' }}>
        {/* HEADER */}
        <div style={{ 
          padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem', 
          background: 'var(--surface, #17172a)', 
          borderBottom: '1px solid rgba(255,255,255,0.06)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? '0.75rem' : '1rem', 
          justifyContent: 'space-between' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0.75rem' : '1rem', flex: 1, minWidth: 0 }}>
            {otherUser?.avatar_url ? (
              <img
                src={otherUser.avatar_url}
                alt=""
                style={{ 
                  width: isMobile ? 36 : 44, 
                  height: isMobile ? 36 : 44, 
                  borderRadius: 12, 
                  objectFit: 'cover',
                  flexShrink: 0
                }}
              />
            ) : (
              <div style={{ 
                width: isMobile ? 36 : 44, 
                height: isMobile ? 36 : 44, 
                borderRadius: 12, 
                background: 'rgba(240,96,144,0.15)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 700, 
                color: '#f06090',
                flexShrink: 0,
                fontSize: isMobile ? '0.75rem' : '0.9rem'
              }}>
                {(otherUser?.full_name || '?').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: isMobile ? '0.85rem' : '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {otherUser?.full_name}
              </div>
              <div style={{ fontSize: isMobile ? '0.65rem' : '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Online</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: isMobile ? 4 : 8, alignItems: 'center' }}>
            <button
              onClick={handleDeleteChat}
              disabled={deleting}
              style={{
                padding: isMobile ? '4px 8px' : '6px 10px',
                background: 'rgba(240,96,144,0.15)',
                border: '1px solid rgba(240,96,144,0.3)',
                color: '#f06090',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: isMobile ? '0.65rem' : '0.8rem',
                opacity: deleting ? 0.5 : 1,
                whiteSpace: 'nowrap'
              }}
            >
              {isMobile ? '✕' : '✕ Löschen'}
            </button>
            {isMobile && (
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                style={{
                  padding: '4px 8px',
                  background: 'rgba(160,128,255,0.15)',
                  border: '1px solid rgba(160,128,255,0.3)',
                  color: '#a080ff',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 700
                }}
              >
                ℹ️
              </button>
            )}
            <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: isMobile ? '0.9rem' : '0.9rem', fontWeight: 700 }}>
              ✕
            </Link>
          </div>
        </div>

        {/* AUFTRAGS-STATUS BAR */}
        {booking && <BookingStatusBar booking={booking} currentUserId={currentUser?.id} />}

        {/* MESSAGES */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: isMobile ? '1rem 1rem' : '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '0.75rem' : '1rem',
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
                    maxWidth: isMobile ? '85%' : '65%',
                    padding: isMobile ? '8px 12px' : '10px 14px',
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
                    fontSize: isMobile ? '0.85rem' : '0.9rem',
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
        <div style={{ padding: isMobile ? '0.75rem 1rem' : '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: isMobile ? '0.5rem' : '0.75rem' }}>
            <input
              type="text"
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Nachricht..."
              style={{
                flex: 1,
                padding: isMobile ? '8px 12px' : '10px 14px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                color: '#fff',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                padding: isMobile ? '8px 12px' : '10px 18px',
                background: 'var(--accent, #7c68fa)',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: isMobile ? '0.75rem' : '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {isMobile ? 'Senden' : 'Senden'}
            </button>
          </form>
        </div>
      </div>

      {/* SIDEBAR */}
      {(!isMobile || showSidebar) && (
        <div style={{ 
          padding: isMobile ? '1rem' : '1.5rem', 
          background: isMobile ? 'var(--surface, #17172a)' : 'rgba(0,0,0,0.2)', 
          overflowY: 'auto',
          borderTop: isMobile ? '1px solid rgba(255,255,255,0.06)' : 'none',
          maxHeight: isMobile ? '50vh' : 'auto'
        }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#fff', marginBottom: '1rem', fontSize: isMobile ? '0.85rem' : '0.9rem' }}>
            Profil
          </div>
          <div style={{ background: isMobile ? 'rgba(0,0,0,0.3)' : 'var(--surface, #17172a)', borderRadius: 16, padding: isMobile ? '0.75rem' : '1rem', marginBottom: '1rem' }}>
            {otherUser?.bio && (
              <>
                <div style={{ fontSize: isMobile ? '0.7rem' : '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>
                  Über
                </div>
                <div style={{ fontSize: isMobile ? '0.8rem' : '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {otherUser.bio}
                </div>
              </>
            )}
            {otherUser?.location && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', fontSize: isMobile ? '0.8rem' : '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ flexShrink: 0 }}>📍</span>
                <span>{otherUser.location}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const STATUS_INFO: Record<string, { label: string; color: string; emoji: string }> = {
  requested:   { label: 'Angefragt', color: '#d4a843', emoji: '📩' },
  accepted:    { label: 'Angenommen', color: '#3dba7e', emoji: '✅' },
  in_progress: { label: 'In Arbeit', color: '#7c68fa', emoji: '⚡' },
  completed:   { label: 'Abgeschlossen', color: '#3dba7e', emoji: '🏆' },
  cancelled:   { label: 'Storniert', color: '#888', emoji: '❌' },
  declined:    { label: 'Abgelehnt', color: '#f06090', emoji: '🚫' },
}

const PAYMENT_INFO: Record<string, { label: string; color: string }> = {
  none:       { label: 'Nicht bezahlt', color: '#888' },
  authorized: { label: 'Zahlung reserviert', color: '#d4a843' },
  captured:   { label: 'Zahlung eingezogen', color: '#7c68fa' },
  paid:       { label: 'Bezahlt', color: '#3dba7e' },
  cancelled:  { label: 'Zahlung storniert', color: '#f06090' },
  refunded:   { label: 'Erstattet', color: '#888' },
}

function BookingStatusBar({ booking, currentUserId }: { booking: any; currentUserId?: string }) {
  const status = STATUS_INFO[booking.status] || STATUS_INFO.requested
  const payment = booking.payment_status ? PAYMENT_INFO[booking.payment_status] : null
  const isProvider = booking.provider_id === currentUserId
  const priceAmount = booking.price_amount

  return (
    <div style={{
      padding: '8px 16px',
      background: 'rgba(0,0,0,0.25)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
      fontSize: '0.76rem',
    }}>
      <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontSize: '0.65rem', letterSpacing: '0.04em' }}>
        Auftrag:
      </span>

      <span style={{
        padding: '2px 8px', borderRadius: 6,
        background: status.color + '18', color: status.color,
        fontWeight: 700, fontSize: '0.72rem',
      }}>
        {status.emoji} {status.label}
      </span>

      {payment && payment.label !== 'Nicht bezahlt' && (
        <span style={{
          padding: '2px 8px', borderRadius: 6,
          background: payment.color + '18', color: payment.color,
          fontWeight: 700, fontSize: '0.72rem',
        }}>
          {payment.label}
        </span>
      )}

      {priceAmount > 0 && (
        <span style={{ color: '#d4a843', fontWeight: 600, fontSize: '0.72rem' }}>
          {(priceAmount / 100).toFixed(2).replace('.', ',')} EUR
          {booking.price_type === 'hourly' ? '/Std.' : ''}
        </span>
      )}

      <span style={{
        marginLeft: 'auto',
        padding: '2px 8px', borderRadius: 6,
        background: isProvider ? 'rgba(61,186,126,0.12)' : 'rgba(124,104,250,0.12)',
        color: isProvider ? '#3dba7e' : '#a080ff',
        fontWeight: 700, fontSize: '0.65rem',
        border: '1px solid ' + (isProvider ? 'rgba(61,186,126,0.2)' : 'rgba(124,104,250,0.2)'),
      }}>
        {isProvider ? 'Du bietest an' : 'Deine Anfrage'}
      </span>
    </div>
  )
}
