'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { MarketplaceBooking, BOOKING_STATUS_META, BookingStatus } from '@/lib/types'

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
    } catch { }
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
    } catch { setMsg('Netzwerkfehler') }
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

  if (loading && totalIncoming === 0 && totalOutgoing === 0) {
    return null // Don't render section if still loading
  }

  if (totalIncoming === 0 && totalOutgoing === 0 && !loading) {
    return null // No bookings at all, don't show section
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>📋 Aufträge & Anfragen</span>
          {(totalIncoming + totalOutgoing) > 0 && (
            <span style={{ padding: '2px 10px', background: 'rgba(124,104,250,0.15)', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, color: '#a080ff' }}>
              {totalIncoming + totalOutgoing}
            </span>
          )}
        </div>
      </div>

      {/* Tab Toggle */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 3 }}>
        <button onClick={() => setTab('incoming')} style={{
          flex: 1, padding: '8px 12px', borderRadius: 10, border: 'none',
          background: tab === 'incoming' ? 'rgba(124,104,250,0.2)' : 'transparent',
          color: tab === 'incoming' ? '#a080ff' : 'var(--text3)',
          fontFamily: 'inherit', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
        }}>
          📩 Eingehend {incomingPending.length > 0 && <span style={{ marginLeft: 4, padding: '1px 6px', background: '#d4a84330', borderRadius: 8, fontSize: '0.7rem', color: '#d4a843' }}>{incomingPending.length}</span>}
        </button>
        <button onClick={() => setTab('outgoing')} style={{
          flex: 1, padding: '8px 12px', borderRadius: 10, border: 'none',
          background: tab === 'outgoing' ? 'rgba(240,96,144,0.2)' : 'transparent',
          color: tab === 'outgoing' ? '#f06090' : 'var(--text3)',
          fontFamily: 'inherit', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
        }}>
          📤 Ausgehend {outgoingPending.length > 0 && <span style={{ marginLeft: 4, padding: '1px 6px', background: '#d4a84330', borderRadius: 8, fontSize: '0.7rem', color: '#d4a843' }}>{outgoingPending.length}</span>}
        </button>
      </div>

      {msg && (
        <div style={{ padding: '8px 14px', borderRadius: 10, marginBottom: 12, background: 'rgba(124,104,250,0.1)', border: '1px solid rgba(124,104,250,0.2)', color: '#a080ff', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' }}>
          {msg}
        </div>
      )}

      {/* ── EINGEHEND (Provider-Sicht) ── */}
      {tab === 'incoming' && (
        <div>
          {totalIncoming === 0 ? (
            <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📭</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>
                Noch keine eingehenden Anfragen. Erstelle Angebote im Marktplatz!
              </div>
            </div>
          ) : (
            <>
              {/* Warten auf Antwort (Swipe-to-Accept) */}
              {incomingPending.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d4a843', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>⏳ Warten auf deine Antwort</div>
                  {incomingPending.map(b => {
                    const progress = swipeProgress[b.id] || 0
                    return (
                      <div key={b.id} style={{
                        background: '#17172a', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 16, marginBottom: 10, overflow: 'hidden',
                      }}>
                        {/* Swipe Track */}
                        <div
                          style={{
                            position: 'relative', padding: '14px 16px',
                            background: progress > 0 ? `linear-gradient(90deg, rgba(61,186,126,${progress * 0.25}) 0%, transparent ${progress * 100}%)` : 'transparent',
                            transition: progress === 0 ? 'background 0.3s' : 'none',
                            touchAction: 'pan-y',
                          }}
                          onTouchStart={e => handleTouchStart(b.id, e)}
                          onTouchMove={handleTouchMove}
                          onTouchEnd={handleTouchEnd}
                        >
                          {/* Swipe Hint */}
                          {progress > 0 && (
                            <div style={{
                              position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                              fontSize: progress > 0.85 ? '1.2rem' : '0.9rem',
                              opacity: Math.min(progress * 2, 1),
                              transition: 'font-size 0.2s',
                            }}>
                              {progress > 0.85 ? '✅ Loslassen!' : '→ Wischen zum Annehmen'}
                            </div>
                          )}

                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%',
                              background: 'rgba(124,104,250,0.15)', color: '#a080ff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                            }}>
                              {(b.client?.full_name || '?')[0].toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff', marginBottom: 2 }}>{b.title}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 4 }}>
                                von {b.client?.full_name || 'Unbekannt'}
                                {b.price && <span style={{ color: '#d4a843', marginLeft: 8 }}>💰 {b.price}</span>}
                              </div>
                              {b.message && (
                                <div style={{ fontSize: '0.78rem', color: 'var(--text2)', fontStyle: 'italic', marginBottom: 6 }}>
                                  "{b.message}"
                                </div>
                              )}
                              <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>
                                {new Date(b.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <button
                              onClick={() => updateStatus(b.id, 'accepted')}
                              disabled={actionLoading === b.id}
                              style={{
                                flex: 1, padding: '8px 0', border: 'none', borderRadius: 10,
                                background: actionLoading === b.id ? 'var(--surface3)' : '#3dba7e',
                                color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.8rem',
                                cursor: actionLoading === b.id ? 'not-allowed' : 'pointer',
                              }}
                            >✅ Annehmen</button>
                            <button
                              onClick={() => updateStatus(b.id, 'declined')}
                              disabled={actionLoading === b.id}
                              style={{
                                flex: 1, padding: '8px 0', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 10,
                                background: 'transparent',
                                color: '#f06090', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.8rem',
                                cursor: actionLoading === b.id ? 'not-allowed' : 'pointer',
                              }}
                            >🚫 Ablehnen</button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Aktive Aufträge */}
              {incomingActive.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3dba7e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>⚡ Aktive Aufträge</div>
                  {incomingActive.map(b => (
                    <BookingCard key={b.id} booking={b} perspective="provider" onAction={updateStatus} actionLoading={actionLoading} />
                  ))}
                </div>
              )}

              {/* Abgeschlossen */}
              {incomingDone.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>📁 Abgeschlossen</div>
                  {incomingDone.slice(0, 5).map(b => (
                    <BookingCard key={b.id} booking={b} perspective="provider" onAction={updateStatus} actionLoading={actionLoading} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── AUSGEHEND (Client-Sicht) ── */}
      {tab === 'outgoing' && (
        <div>
          {totalOutgoing === 0 ? (
            <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📤</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>
                Noch keine gesendeten Anfragen. Stöbere im Marktplatz!
              </div>
            </div>
          ) : (
            <>
              {outgoingPending.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d4a843', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>⏳ Warten auf Antwort</div>
                  {outgoingPending.map(b => (
                    <BookingCard key={b.id} booking={b} perspective="client" onAction={updateStatus} actionLoading={actionLoading} />
                  ))}
                </div>
              )}
              {outgoingActive.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3dba7e', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>⚡ Aktive Aufträge</div>
                  {outgoingActive.map(b => (
                    <BookingCard key={b.id} booking={b} perspective="client" onAction={updateStatus} actionLoading={actionLoading} />
                  ))}
                </div>
              )}
              {outgoingDone.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>📁 Abgeschlossen</div>
                  {outgoingDone.slice(0, 5).map(b => (
                    <BookingCard key={b.id} booking={b} perspective="client" onAction={updateStatus} actionLoading={actionLoading} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Einzelne Booking Card ───
function BookingCard({ booking: b, perspective, onAction, actionLoading }: {
  booking: MarketplaceBooking
  perspective: 'client' | 'provider'
  onAction: (id: string, status: BookingStatus) => void
  actionLoading: string | null
}) {
  const meta = BOOKING_STATUS_META[b.status]
  const otherPerson = perspective === 'client' ? b.provider : b.client

  return (
    <div style={{
      background: '#17172a', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14, padding: '12px 16px', marginBottom: 8,
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: meta.color + '22', color: meta.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.9rem', flexShrink: 0,
      }}>{meta.emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{b.title}</span>
          <span style={{
            padding: '2px 8px', borderRadius: 8,
            background: meta.color + '18', color: meta.color,
            fontSize: '0.68rem', fontWeight: 700,
          }}>{meta.label}</span>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 4 }}>
          {perspective === 'client' ? 'An' : 'Von'}: {otherPerson?.full_name || 'Unbekannt'}
          {b.price && <span style={{ color: '#d4a843', marginLeft: 8 }}>💰 {b.price}</span>}
        </div>
        {b.message && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text2)', fontStyle: 'italic', marginBottom: 4 }}>"{b.message}"</div>
        )}
        <div style={{ fontSize: '0.68rem', color: 'var(--text3)' }}>
          {new Date(b.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </div>

        {/* Aktionen */}
        {perspective === 'provider' && b.status === 'accepted' && (
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => onAction(b.id, 'in_progress')} disabled={actionLoading === b.id}
              style={{ padding: '6px 14px', border: 'none', borderRadius: 8, background: '#7c68fa', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
              ⚡ Starten
            </button>
            <button onClick={() => onAction(b.id, 'cancelled')} disabled={actionLoading === b.id}
              style={{ padding: '6px 14px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, background: 'transparent', color: 'var(--text3)', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
              Stornieren
            </button>
          </div>
        )}
        {perspective === 'provider' && b.status === 'in_progress' && (
          <div style={{ marginTop: 8 }}>
            <button onClick={() => onAction(b.id, 'completed')} disabled={actionLoading === b.id}
              style={{ padding: '6px 14px', border: 'none', borderRadius: 8, background: '#3dba7e', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
              🏆 Abschließen
            </button>
          </div>
        )}
        {perspective === 'client' && b.status === 'requested' && (
          <div style={{ marginTop: 8 }}>
            <button onClick={() => onAction(b.id, 'cancelled')} disabled={actionLoading === b.id}
              style={{ padding: '6px 14px', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 8, background: 'transparent', color: '#f06090', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
              ❌ Stornieren
            </button>
          </div>
        )}
        {perspective === 'client' && b.status === 'accepted' && (
          <div style={{ marginTop: 8 }}>
            <button onClick={() => onAction(b.id, 'cancelled')} disabled={actionLoading === b.id}
              style={{ padding: '6px 14px', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 8, background: 'transparent', color: '#f06090', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
              ❌ Stornieren
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
