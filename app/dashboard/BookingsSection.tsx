'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { MarketplaceBooking, BOOKING_STATUS_META, BookingStatus } from '@/lib/types'
import Link from 'next/link'

export default function BookingsSection() {
  const supabase = createClient()
  const [incoming, setIncoming] = useState<MarketplaceBooking[]>([])
  const [outgoing, setOutgoing] = useState<MarketplaceBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'incoming' | 'outgoing'>('incoming')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  // Swipe state
  const swipeRef = useRef<{ id: string; startX: number; currentX: number } | null>(null)
  const [swipeProgress, setSwipeProgress] = useState<Record<string, number>>({})

  useEffect(() => { loadBookings() }, [])

  async function loadBookings() {
    setLoading(true)
    try {
      const [incRes, outRes] = await Promise.all([
        fetch('/api/bookings?role=provider'),
        fetch('/api/bookings?role=client'),
      ])
      if (incRes.ok) {
        const d = await incRes.json()
        setIncoming(Array.isArray(d) ? d : d.bookings || [])
      }
      if (outRes.ok) {
        const d = await outRes.json()
        setOutgoing(Array.isArray(d) ? d : d.bookings || [])
      }
    } catch(e) { }
    setLoading(false)
  }

  async function updateStatus(bookingId: string, status: BookingStatus) {
    setActionLoading(bookingId)
    setMsg('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status }),
      })
      if (res.ok) {
        await loadBookings()
        const meta = BOOKING_STATUS_META[status]
        setMsg(`${meta.emoji} ${meta.label}`)
        setTimeout(() => setMsg(''), 2500)
      } else {
        const err = await res.json()
        setMsg(err.error || 'Fehler')
      }
    } catch(e) { setMsg('Netzwerkfehler') }
    setActionLoading(null)
  }

  // Swipe-to-accept handlers
  function handleTouchStart(id: string, e: React.TouchEvent) {
    swipeRef.current = { id, startX: e.touches[0].clientX, currentX: e.touches[0].clientX }
  }
  function handleTouchMove(e: React.TouchEvent) {
    if (!swipeRef.current) return
    const x = e.touches[0].clientX
    swipeRef.current.currentX = x
    const delta = Math.max(0, x - swipeRef.current.startX)
    const pct = Math.min(delta / 200, 1)
    setSwipeProgress(p => ({ ...p, [swipeRef.current!.id]: pct }))
  }
  function handleTouchEnd() {
    if (!swipeRef.current) return
    const { id } = swipeRef.current
    const pct = swipeProgress[id] || 0
    if (pct > 0.85) {
      updateStatus(id, 'accepted')
    }
    setSwipeProgress(p => ({ ...p, [id]: 0 }))
    swipeRef.current = null
  }

  const incomingPending = incoming.filter(b => b.status === 'requested')
  const incomingActive = incoming.filter(b => ['accepted', 'in_progress'].includes(b.status))
  const incomingDone = incoming.filter(b => ['completed', 'declined', 'cancelled'].includes(b.status))

  const outgoingPending = outgoing.filter(b => b.status === 'requested')
  const outgoingActive = outgoing.filter(b => ['accepted', 'in_progress'].includes(b.status))
  const outgoingDone = outgoing.filter(b => ['completed', 'declined', 'cancelled'].includes(b.status))

  const totalIncoming = incoming.length
  const totalOutgoing = outgoing.length

  if (loading && totalIncoming === 0 && totalOutgoing === 0) return null
  if (totalIncoming === 0 && totalOutgoing === 0 && !loading) return null

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>ðŸ“‹ AuftrÃ¤ge & Anfragen</span>
          {(totalIncoming + totalOutgoing) > 0 && (
            <span style={{ padding: '2px 10px', background: 'rgba(124,104,250,0.15)', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, color: '#a080ff' }}>
              {totalIncoming + totalOutgoing}
            </span>
          )}
          {incomingPending.length > 0 && (
            <span style={{ padding: '2px 8px', background: 'rgba(240,96,144,0.15)', border: '1px solid rgba(240,96,144,0.25)', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, color: '#f06090' }}>
              {incomingPending.length} neu
            </span>
          )}
        </div>
        <Link href="/marktplatz" style={{ padding: '6px 14px', background: 'rgba(124,104,250,0.1)', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 999, color: '#a080ff', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
          ðŸ—ºï¸ Marktplatz
        </Link>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
        <div style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.12)', borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#d4a843' }}>{incomingPending.length + outgoingPending.length}</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Offen</div>
        </div>
        <div style={{ background: 'rgba(61,186,126,0.06)', border: '1px solid rgba(61,186,126,0.12)', borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3dba7e' }}>{incomingActive.length + outgoingActive.length}</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Aktiv</div>
        </div>
        <div style={{ background: 'rgba(124,104,250,0.06)', border: '1px solid rgba(124,104,250,0.12)', borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a080ff' }}>{incomingDone.length + outgoingDone.length}</div>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Erledigt</div>
        </div>
      </div>

      {/* Tab Toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 3 }}>
        <button onClick={() => setTab('incoming')} style={{
          flex: 1, padding: '9px 12px', borderRadius: 10, border: 'none',
          background: tab === 'incoming' ? 'rgba(124,104,250,0.2)' : 'transparent',
          color: tab === 'incoming' ? '#a080ff' : 'var(--text3)',
          fontFamily: 'inherit', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
        }}>
          ðŸ“© Eingehend ({totalIncoming})
        </button>
        <button onClick={() => setTab('outgoing')} style={{
          flex: 1, padding: '9px 12px', borderRadius: 10, border: 'none',
          background: tab === 'outgoing' ? 'rgba(240,96,144,0.2)' : 'transparent',
          color: tab === 'outgoing' ? '#f06090' : 'var(--text3)',
          fontFamily: 'inherit', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
        }}>
          ðŸ“¤ Ausgehend ({totalOutgoing})
        </button>
      </div>

      {msg && (
        <div style={{ padding: '8px 14px', borderRadius: 10, marginBottom: 12, background: 'rgba(124,104,250,0.1)', border: '1px solid rgba(124,104,250,0.2)', color: '#a080ff', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' }}>
          {msg}
        </div>
      )}

      {/* â”€â”€ EINGEHEND â”€â”€ */}
      {tab === 'incoming' && (
        <div>
          {totalIncoming === 0 ? (
            <EmptyState emoji="ðŸ“­" text="Noch keine eingehenden Anfragen. Erstelle Angebote im Marktplatz!" />
          ) : (
            <>
              {incomingPending.length > 0 && (
                <SectionLabel color="#d4a843" icon="â³" label={`Warten auf deine Antwort (${incomingPending.length})`} />
              )}
              {incomingPending.map(b => {
                const progress = swipeProgress[b.id] || 0
                return (
                  <div key={b.id} style={{
                    background: '#17172a', border: `1px solid ${progress > 0.5 ? 'rgba(61,186,126,0.3)' : 'rgba(212,168,67,0.15)'}`,
                    borderRadius: 16, marginBottom: 10, overflow: 'hidden', transition: 'border-color 0.3s',
                  }}>
                    <div
                      style={{
                        position: 'relative', padding: '16px',
                        background: progress > 0 ? `linear-gradient(90deg, rgba(61,186,126,${progress * 0.25}) 0%, transparent ${progress * 100}%)` : 'transparent',
                        transition: progress === 0 ? 'background 0.3s' : 'none',
                        touchAction: 'pan-y',
                      }}
                      onTouchStart={e => handleTouchStart(b.id, e)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      {progress > 0 && (
                        <div style={{
                          position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                          fontSize: progress > 0.85 ? '1.1rem' : '0.85rem', opacity: Math.min(progress * 2, 1),
                          color: progress > 0.85 ? '#3dba7e' : 'var(--text3)', fontWeight: 700,
                        }}>
                          {progress > 0.85 ? 'âœ… Loslassen!' : 'â†’ Wischen zum Annehmen'}
                        </div>
                      )}

                      <BookingHeader booking={b} perspective="provider" />

                      {b.message && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--text2)', fontStyle: 'italic', margin: '8px 0', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid rgba(124,104,250,0.3)' }}>
                          &ldquo;{b.message}&rdquo;
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <button onClick={() => updateStatus(b.id, 'accepted')} disabled={actionLoading === b.id}
                          style={{ flex: 1, padding: '9px 0', border: 'none', borderRadius: 10, background: actionLoading === b.id ? 'var(--surface3)' : '#3dba7e', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.82rem', cursor: actionLoading === b.id ? 'not-allowed' : 'pointer' }}>
                          âœ… Annehmen
                        </button>
                        <button onClick={() => updateStatus(b.id, 'declined')} disabled={actionLoading === b.id}
                          style={{ flex: 1, padding: '9px 0', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 10, background: 'transparent', color: '#f06090', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.82rem', cursor: actionLoading === b.id ? 'not-allowed' : 'pointer' }}>
                          ðŸš« Ablehnen
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}

              {incomingActive.length > 0 && (
                <>
                  <SectionLabel color="#3dba7e" icon="âš¡" label={`Aktive AuftrÃ¤ge (${incomingActive.length})`} />
                  {incomingActive.map(b => (
                    <BookingCard key={b.id} booking={b} perspective="provider" onAction={updateStatus} actionLoading={actionLoading} />
                  ))}
                </>
              )}

              {incomingDone.length > 0 && (
                <>
                  <SectionLabel color="var(--text3)" icon="ðŸ“" label={`Abgeschlossen (${incomingDone.length})`} />
                  {incomingDone.slice(0, 5).map(b => (
                    <BookingCard key={b.id} booking={b} perspective="provider" onAction={updateStatus} actionLoading={actionLoading} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* â”€â”€ AUSGEHEND â”€â”€ */}
      {tab === 'outgoing' && (
        <div>
          {totalOutgoing === 0 ? (
            <EmptyState emoji="ðŸ“¤" text="Noch keine gesendeten Anfragen. StÃ¶bere im Marktplatz!" />
          ) : (
            <>
              {outgoingPending.length > 0 && (
                <>
                  <SectionLabel color="#d4a843" icon="â³" label={`Warten auf Antwort (${outgoingPending.length})`} />
                  {outgoingPending.map(b => (
                    <BookingCard key={b.id} booking={b} perspective="client" onAction={updateStatus} actionLoading={actionLoading} />
                  ))}
                </>
              )}
              {outgoingActive.length > 0 && (
                <>
                  <SectionLabel color="#3dba7e" icon="âš¡" label={`Aktive AuftrÃ¤ge (${outgoingActive.length})`} />
                  {outgoingActive.map(b => (
                    <BookingCard key={b.id} booking={b} perspective="client" onAction={updateStatus} actionLoading={actionLoading} />
                  ))}
                </>
              )}
              {outgoingDone.length > 0 && (
                <>
                  <SectionLabel color="var(--text3)" icon="ðŸ“" label={`Abgeschlossen (${outgoingDone.length})`} />
                  {outgoingDone.slice(0, 5).map(b => (
                    <BookingCard key={b.id} booking={b} perspective="client" onAction={updateStatus} actionLoading={actionLoading} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// â”€â”€â”€ Sub-Components â”€â”€â”€

function SectionLabel({ color, icon, label }: { color: string; icon: string; label: string }) {
  return (
    <div style={{ fontSize: '0.73rem', fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
      <span>{icon}</span> {label}
    </div>
  )
}

function EmptyState({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{emoji}</div>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>{text}</div>
      <Link href="/marktplatz" style={{ display: 'inline-block', marginTop: 12, padding: '8px 18px', background: 'rgba(124,104,250,0.15)', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 10, color: '#a080ff', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
        ðŸ—ºï¸ Zum Marktplatz
      </Link>
    </div>
  )
}

function BookingHeader({ booking: b, perspective }: { booking: MarketplaceBooking; perspective: 'client' | 'provider' }) {
  const meta = BOOKING_STATUS_META[b.status]
  const otherPerson = perspective === 'client' ? b.provider : b.client
  const category = b.offering?.category || b.request?.category || ''

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: `${meta.color}18`, color: meta.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
        border: `2px solid ${meta.color}30`,
      }}>
        {(otherPerson?.full_name || '?')[0].toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</span>
          <span style={{ padding: '2px 8px', borderRadius: 8, background: `${meta.color}18`, color: meta.color, fontSize: '0.67rem', fontWeight: 700 }}>
            {meta.emoji} {meta.label}
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>
          {perspective === 'client' ? 'â†’' : 'â†'} {otherPerson?.full_name || 'Unbekannt'}
          {category && <span style={{ marginLeft: 6, opacity: 0.6 }}>Â· {category}</span>}
          {b.price && <span style={{ color: '#d4a843', marginLeft: 8, fontWeight: 600 }}>ðŸ’° {b.price}</span>}
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginTop: 2, opacity: 0.6 }}>
          {new Date(b.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

function BookingCard({ booking: b, perspective, onAction, actionLoading }: {
  booking: MarketplaceBooking
  perspective: 'client' | 'provider'
  onAction: (id: string, status: BookingStatus) => void
  actionLoading: string | null
}) {
  const meta = BOOKING_STATUS_META[b.status]
  const isActive = ['accepted', 'in_progress'].includes(b.status)
  const isDone = ['completed', 'declined', 'cancelled'].includes(b.status)

  // Chat link: provider = employer, client = applicant
  const chatParams = `employer=${b.provider_id}&applicant=${b.client_id}`

  return (
    <div style={{
      background: isDone ? 'rgba(23,23,42,0.6)' : '#17172a',
      border: `1px solid ${isActive ? meta.color + '25' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 14, padding: '14px 16px', marginBottom: 8,
      opacity: isDone ? 0.7 : 1, transition: 'all 0.2s',
    }}>
      <BookingHeader booking={b} perspective={perspective} />

      {b.message && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text2)', fontStyle: 'italic', margin: '8px 0 0', padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid rgba(124,104,250,0.2)' }}>
          &ldquo;{b.message}&rdquo;
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {isActive && (
          <Link href={`/chat?${chatParams}`} style={{
            flex: 1, padding: '8px 0', borderRadius: 10,
            background: 'rgba(124,104,250,0.15)', color: '#a080ff',
            fontFamily: 'inherit', fontWeight: 700, fontSize: '0.8rem',
            textDecoration: 'none', textAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            border: '1px solid rgba(124,104,250,0.2)',
          }}>
            ðŸ’¬ Chat Ã¶ffnen
          </Link>
        )}

        {perspective === 'provider' && b.status === 'accepted' && (
          <>
            <button onClick={() => onAction(b.id, 'in_progress')} disabled={actionLoading === b.id}
              style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 10, background: '#7c68fa', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
              âš¡ Starten
            </button>
            <button onClick={() => onAction(b.id, 'cancelled')} disabled={actionLoading === b.id}
              style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, background: 'transparent', color: 'var(--text3)', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
              âœ•
            </button>
          </>
        )}
        {perspective === 'provider' && b.status === 'in_progress' && (
          <button onClick={() => onAction(b.id, 'completed')} disabled={actionLoading === b.id}
            style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 10, background: '#3dba7e', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
            ðŸ† AbschlieÃŸen
          </button>
        )}

        {perspective === 'client' && b.status === 'requested' && (
          <button onClick={() => onAction(b.id, 'cancelled')} disabled={actionLoading === b.id}
            style={{ flex: 1, padding: '8px 0', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 10, background: 'transparent', color: '#f06090', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
            âŒ Stornieren
          </button>
        )}
        {perspective === 'client' && b.status === 'accepted' && (
          <button onClick={() => onAction(b.id, 'cancelled')} disabled={actionLoading === b.id}
            style={{ padding: '8px 12px', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 10, background: 'transparent', color: '#f06090', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
            âœ• Stornieren
          </button>
        )}
      </div>

      {b.status === 'accepted' && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          ðŸ’¡ {perspective === 'provider'
            ? 'Nutze den Chat um Details zu klÃ¤ren, dann starte den Auftrag.'
            : 'Der Anbieter hat angenommen! Nutze den Chat um Details zu klÃ¤ren.'}
        </div>
      )}
      {b.status === 'in_progress' && perspective === 'provider' && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          ðŸ’¡ Wenn du fertig bist, schlieÃŸe den Auftrag ab.
        </div>
      )}
    </div>
  )
}
