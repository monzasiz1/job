'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { MarketplaceBooking, BOOKING_STATUS_META, BookingStatus, PAYMENT_STATUS_META, PaymentStatus } from '@/lib/types'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const PaymentModal = dynamic(() => import('@/components/PaymentForm'), { ssr: false })

type BookingWithRole = MarketplaceBooking & { role: 'provider' | 'client' }

export default function BookingsSection() {
  const supabase = createClient()
  const [incoming, setIncoming] = useState<MarketplaceBooking[]>([])
  const [outgoing, setOutgoing] = useState<MarketplaceBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [showDone, setShowDone] = useState(false)
  const [payBooking, setPayBooking] = useState<BookingWithRole | null>(null)

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
    } catch(e) { /* ignore */ }
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
        setMsg(meta.label)
        setTimeout(() => setMsg(''), 2500)
      } else {
        const err = await res.json()
        setMsg(err.error || 'Fehler')
      }
    } catch(e) { setMsg('Netzwerkfehler') }
    setActionLoading(null)
  }

  const allBookings: BookingWithRole[] = [
    ...incoming.map(b => ({ ...b, role: 'provider' as const })),
    ...outgoing.map(b => ({ ...b, role: 'client' as const })),
  ]

  // Bei Gesuchen entscheidet der Client (Ersteller), bei Angeboten der Provider
  const isDecider = (b: BookingWithRole) => {
    const isRequestBased = !!b.request_id
    return isRequestBased ? b.role === 'client' : b.role === 'provider'
  }

  const needsAction = allBookings.filter(b => b.status === 'requested' && isDecider(b))
  const needsPayment = allBookings.filter(b =>
    b.status === 'accepted' &&
    b.price_amount && b.price_amount > 0 &&
    (!b.payment_status || b.payment_status === 'none')
  )
  const needsPaymentIds = new Set(needsPayment.map(b => b.id))
  const active = allBookings.filter(b => ['accepted', 'in_progress'].includes(b.status) && !needsPaymentIds.has(b.id))
  const waiting = allBookings.filter(b => b.status === 'requested' && !isDecider(b))
  const done = allBookings.filter(b => ['completed', 'declined', 'cancelled'].includes(b.status))

  const total = allBookings.length

  if (loading && total === 0) return null
  if (total === 0 && !loading) return null

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 'clamp(0.85rem, 3vw, 0.95rem)', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Auftraege</span>
          {total > 0 && (
            <span style={{ padding: '2px 10px', background: 'rgba(124,104,250,0.15)', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, color: '#a080ff' }}>
              {total}
            </span>
          )}
          {(needsAction.length + needsPayment.length) > 0 && (
            <span style={{ padding: '2px 8px', background: 'rgba(240,96,144,0.15)', border: '1px solid rgba(240,96,144,0.25)', borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, color: '#f06090' }}>
              {needsAction.length + needsPayment.length} neu
            </span>
          )}
        </div>
        <Link href="/marktplatz" style={{ padding: '6px 14px', background: 'rgba(124,104,250,0.1)', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 999, color: '#a080ff', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
          Marktplatz
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 16 }}>
        <StatBox count={needsAction.length} label="Aktion" color="#f06090" />
        <StatBox count={active.length} label="Aktiv" color="#3dba7e" />
        <StatBox count={waiting.length} label="Wartend" color="#d4a843" />
        <StatBox count={done.length} label="Erledigt" color="#a080ff" />
      </div>

      {msg && (
        <div style={{ padding: '8px 14px', borderRadius: 10, marginBottom: 12, background: 'rgba(124,104,250,0.1)', border: '1px solid rgba(124,104,250,0.2)', color: '#a080ff', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center' }}>
          {msg}
        </div>
      )}

      {needsAction.length > 0 && (
        <>
          <SectionLabel color="#f06090" label={'Aktion noetig (' + needsAction.length + ')'} />
          {needsAction.map(b => (
            <ActionCard key={b.id} booking={b} onAction={updateStatus} actionLoading={actionLoading} />
          ))}
        </>
      )}

      {needsPayment.length > 0 && (
        <>
          <SectionLabel color="#d4a843" label={'Zahlung noetig (' + needsPayment.length + ')'} />
          {needsPayment.map(b => (
            <BookingCard key={b.id} booking={b} onAction={updateStatus} actionLoading={actionLoading} onPay={setPayBooking} />
          ))}
        </>
      )}

      {active.length > 0 && (
        <>
          <SectionLabel color="#3dba7e" label={'Laufend (' + active.length + ')'} />
          {active.map(b => (
            <BookingCard key={b.id} booking={b} onAction={updateStatus} actionLoading={actionLoading} onPay={setPayBooking} />
          ))}
        </>
      )}

      {waiting.length > 0 && (
        <>
          <SectionLabel color="#d4a843" label={'Warten auf Antwort (' + waiting.length + ')'} />
          {waiting.map(b => (
            <BookingCard key={b.id} booking={b} onAction={updateStatus} actionLoading={actionLoading} onPay={setPayBooking} />
          ))}
        </>
      )}

      {done.length > 0 && (
        <>
          <button
            onClick={() => setShowDone(!showDone)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0', marginTop: 16, border: 'none', background: 'none',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Abgeschlossen ({done.length})
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text3)', transform: showDone ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              &#9660;
            </span>
          </button>
          {showDone && done.slice(0, 8).map(b => (
            <BookingCard key={b.id} booking={b} onAction={updateStatus} actionLoading={actionLoading} onPay={setPayBooking} />
          ))}
        </>
      )}

      {total === 0 && !loading && (
        <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: 'clamp(1.5rem, 4vw, 2rem)', textAlign: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>Noch keine Auftraege. Schau im Marktplatz vorbei!</div>
          <Link href="/marktplatz" style={{ display: 'inline-block', marginTop: 12, padding: '8px 18px', background: 'rgba(124,104,250,0.15)', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 10, color: '#a080ff', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
            Zum Marktplatz
          </Link>
        </div>
      )}

      {payBooking && (
        <PaymentModal
          bookingId={payBooking.id}
          amount={calcPaymentAmount(payBooking)}
          priceType={payBooking.price_type || 'fixed'}
          onClose={() => setPayBooking(null)}
          onSuccess={() => { setPayBooking(null); loadBookings() }}
        />
      )}
    </div>
  )
}

function calcPaymentAmount(b: BookingWithRole): number {
  if (!b.price_amount) return 0
  if (b.price_type === 'hourly' && b.estimated_hours) {
    return Math.ceil(b.price_amount * Number(b.estimated_hours) * 1.2)
  }
  return b.price_amount
}

function StatBox({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <div style={{ background: color + '0a', border: '1px solid ' + color + '1a', borderRadius: 12, padding: '8px 6px', textAlign: 'center' }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: color }}>{count}</div>
      <div style={{ fontSize: '0.6rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
    </div>
  )
}

function SectionLabel({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ fontSize: '0.73rem', fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, marginTop: 16 }}>
      {label}
    </div>
  )
}

function RoleBadge({ role, isRequestBased }: { role: 'provider' | 'client'; isRequestBased?: boolean }) {
  // Bei Gesuchen: client = Ersteller, provider = Helfer
  // Bei Angeboten: provider = Anbieter, client = Anfragender
  let label: string
  let isGreen: boolean
  if (isRequestBased) {
    label = role === 'client' ? 'Dein Gesuch' : 'Du hilfst'
    isGreen = role === 'provider'
  } else {
    label = role === 'provider' ? 'Du bietest an' : 'Deine Anfrage'
    isGreen = role === 'provider'
  }
  return (
    <span style={{
      padding: '1px 7px', borderRadius: 6, fontSize: '0.62rem', fontWeight: 700,
      background: isGreen ? 'rgba(61,186,126,0.12)' : 'rgba(124,104,250,0.12)',
      color: isGreen ? '#3dba7e' : '#a080ff',
      border: '1px solid ' + (isGreen ? 'rgba(61,186,126,0.2)' : 'rgba(124,104,250,0.2)'),
    }}>
      {label}
    </span>
  )
}

function PaymentBadge({ status, amount }: { status?: PaymentStatus; amount?: number }) {
  if (!status || status === 'none') return null
  const meta = PAYMENT_STATUS_META[status] || PAYMENT_STATUS_META.none
  return (
    <span style={{
      padding: '1px 7px', borderRadius: 6, fontSize: '0.6rem', fontWeight: 700,
      background: meta.color + '15', color: meta.color,
      border: '1px solid ' + meta.color + '25',
      display: 'inline-flex', alignItems: 'center', gap: 3,
    }}>
      {meta.label}
      {amount ? (' ' + (amount / 100).toFixed(2).replace('.', ',') + ' EUR') : ''}
    </span>
  )
}

function BookingHeader({ booking: b }: { booking: BookingWithRole }) {
  const meta = BOOKING_STATUS_META[b.status]
  const otherPerson = b.role === 'client' ? b.provider : b.client
  const category = b.offering?.category || b.request?.category || ''

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        background: meta.color + '18', color: meta.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: '0.85rem', flexShrink: 0,
        border: '2px solid ' + meta.color + '30',
      }}>
        {(otherPerson?.full_name || '?')[0].toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: '0.86rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</span>
          <span style={{ padding: '2px 7px', borderRadius: 8, background: meta.color + '18', color: meta.color, fontSize: '0.64rem', fontWeight: 700 }}>
            {meta.label}
          </span>
          <RoleBadge role={b.role} isRequestBased={!!b.request_id} />
          <PaymentBadge status={b.payment_status as PaymentStatus} amount={b.price_amount} />
        </div>
        <div style={{ fontSize: '0.73rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          <span>{otherPerson?.full_name || 'Unbekannt'}</span>
          {category && <span style={{ opacity: 0.5 }}>/ {category}</span>}
          {b.price_amount ? (
            <span style={{ color: '#d4a843', fontWeight: 600 }}>
              {(b.price_amount / 100).toFixed(2).replace('.', ',')} EUR{b.price_type === 'hourly' ? '/Std.' : ''}
            </span>
          ) : b.price ? (
            <span style={{ color: '#d4a843', fontWeight: 600 }}>{b.price}</span>
          ) : null}
        </div>
        <div style={{ fontSize: '0.66rem', color: 'var(--text3)', marginTop: 2, opacity: 0.5 }}>
          {new Date(b.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

function ActionCard({ booking: b, onAction, actionLoading }: {
  booking: BookingWithRole
  onAction: (id: string, status: BookingStatus) => void
  actionLoading: string | null
}) {
  return (
    <div style={{
      background: '#17172a', border: '1px solid rgba(240,96,144,0.15)',
      borderRadius: 16, padding: '16px', marginBottom: 10,
      borderLeft: '3px solid #f06090',
    }}>
      <BookingHeader booking={b} />

      {b.message && (
        <div style={{ fontSize: '0.78rem', color: 'var(--text2)', fontStyle: 'italic', margin: '10px 0 0', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid rgba(124,104,250,0.3)' }}>
          &ldquo;{b.message}&rdquo;
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <button onClick={() => onAction(b.id, 'accepted')} disabled={actionLoading === b.id}
          style={{ flex: 1, padding: '10px 0', border: 'none', borderRadius: 10, background: actionLoading === b.id ? 'var(--surface3)' : '#3dba7e', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.82rem', cursor: actionLoading === b.id ? 'not-allowed' : 'pointer' }}>
          Annehmen
        </button>
        <button onClick={() => onAction(b.id, 'declined')} disabled={actionLoading === b.id}
          style={{ flex: 1, padding: '10px 0', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 10, background: 'transparent', color: '#f06090', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.82rem', cursor: actionLoading === b.id ? 'not-allowed' : 'pointer' }}>
          Ablehnen
        </button>
      </div>
    </div>
  )
}

function BookingCard({ booking: b, onAction, actionLoading, onPay }: {
  booking: BookingWithRole
  onAction: (id: string, status: BookingStatus) => void
  actionLoading: string | null
  onPay: (b: BookingWithRole) => void
}) {
  const meta = BOOKING_STATUS_META[b.status]
  const isActive = ['accepted', 'in_progress'].includes(b.status)
  const isDone = ['completed', 'declined', 'cancelled'].includes(b.status)
  const chatParams = 'employer=' + b.provider_id + '&applicant=' + b.client_id

  // Bei Gesuchen: client = Entscheider, provider = Initiator (umgekehrt zu Angeboten)
  const isRequestBased = !!b.request_id
  const isDecider = isRequestBased ? b.role === 'client' : b.role === 'provider'
  const isInitiator = !isDecider

  const awaitingPayment = b.status === 'accepted' &&
    b.price_amount && b.price_amount > 0 &&
    (!b.payment_status || b.payment_status === 'none')
  const showPayButton = b.role === 'client' && awaitingPayment

  return (
    <div style={{
      background: isDone ? 'rgba(23,23,42,0.6)' : '#17172a',
      border: '1px solid ' + (isActive ? meta.color + '25' : 'rgba(255,255,255,0.06)'),
      borderRadius: 14, padding: '14px 16px', marginBottom: 8,
      opacity: isDone ? 0.65 : 1, transition: 'all 0.2s',
    }}>
      <BookingHeader booking={b} />

      {b.message && (
        <div style={{ fontSize: '0.76rem', color: 'var(--text2)', fontStyle: 'italic', margin: '8px 0 0', padding: '6px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 8, borderLeft: '3px solid rgba(124,104,250,0.2)' }}>
          &ldquo;{b.message}&rdquo;
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        {showPayButton && (
          <button onClick={() => onPay(b)} style={{
            flex: 1, padding: '10px 0', border: 'none', borderRadius: 10,
            background: 'linear-gradient(135deg, #3dba7e, #2ea36d)',
            color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.82rem',
            cursor: 'pointer', minWidth: 140,
          }}>
            Jetzt bezahlen - {((b.price_amount || 0) / 100).toFixed(2).replace('.', ',')} EUR
          </button>
        )}

        {isActive && (
          <Link href={'/chat?' + chatParams} style={{
            flex: 1, padding: '8px 0', borderRadius: 10,
            background: 'rgba(124,104,250,0.15)', color: '#a080ff',
            fontFamily: 'inherit', fontWeight: 700, fontSize: '0.78rem',
            textDecoration: 'none', textAlign: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            border: '1px solid rgba(124,104,250,0.2)',
          }}>
            Chat oeffnen
          </Link>
        )}

        {b.role === 'provider' && b.status === 'accepted' && !awaitingPayment && (
          <>
            <button onClick={() => onAction(b.id, 'in_progress')} disabled={actionLoading === b.id}
              style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 10, background: '#7c68fa', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
              Starten
            </button>
            <button onClick={() => onAction(b.id, 'cancelled')} disabled={actionLoading === b.id}
              style={{ padding: '8px 12px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, background: 'transparent', color: 'var(--text3)', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
              X
            </button>
          </>
        )}
        {b.role === 'provider' && b.status === 'in_progress' && (
          <button onClick={() => onAction(b.id, 'completed')} disabled={actionLoading === b.id}
            style={{ flex: 1, padding: '8px 0', border: 'none', borderRadius: 10, background: '#3dba7e', color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
            Abschliessen
          </button>
        )}

        {isInitiator && b.status === 'requested' && (
          <button onClick={() => onAction(b.id, 'cancelled')} disabled={actionLoading === b.id}
            style={{ flex: 1, padding: '8px 0', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 10, background: 'transparent', color: '#f06090', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
            Stornieren
          </button>
        )}
        {isInitiator && b.status === 'accepted' && !showPayButton && (
          <button onClick={() => onAction(b.id, 'cancelled')} disabled={actionLoading === b.id}
            style={{ padding: '8px 12px', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 10, background: 'transparent', color: '#f06090', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>
            Stornieren
          </button>
        )}
      </div>

      {b.status === 'accepted' && !showPayButton && (
        <div style={{ fontSize: '0.7rem', color: awaitingPayment ? '#d4a843' : 'var(--text3)', marginTop: 8 }}>
          {awaitingPayment && b.role === 'provider'
            ? 'Warte auf Zahlung des Auftraggebers. Der Auftrag kann erst nach Zahlung gestartet werden.'
            : b.role === 'provider'
            ? 'Nutze den Chat um Details zu klaeren, dann starte den Auftrag.'
            : (b.payment_status === 'authorized'
              ? 'Zahlung reserviert. Der Anbieter kann den Auftrag starten.'
              : 'Angenommen! Nutze den Chat um Details zu klaeren.')}
        </div>
      )}
      {showPayButton && (
        <div style={{ fontSize: '0.7rem', color: '#d4a843', marginTop: 8 }}>
          Der Anbieter hat angenommen. Bezahle jetzt, damit der Auftrag starten kann.
          Das Geld wird erst nach Abschluss ausgezahlt (Treuhand).
        </div>
      )}
      {b.status === 'in_progress' && b.role === 'provider' && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 8 }}>
          Wenn du fertig bist, schliesse den Auftrag ab.
        </div>
      )}
      {b.status === 'completed' && b.payment_status === 'paid' && (
        <div style={{ fontSize: '0.7rem', color: '#3dba7e', marginTop: 8 }}>
          Zahlung erfolgreich abgeschlossen.
        </div>
      )}
    </div>
  )
}
