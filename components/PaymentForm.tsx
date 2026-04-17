'use client'

import { useState, useEffect } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { getStripe } from '@/lib/stripe-client'

interface PaymentModalProps {
  bookingId: string
  amount: number
  priceType: 'fixed' | 'hourly'
  onClose: () => void
  onSuccess: () => void
}

export default function PaymentModal({ bookingId, amount, priceType, onClose, onSuccess }: PaymentModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function createIntent() {
      setLoading(true)
      setError('')
      try {
        const res = await fetch('/api/stripe/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ booking_id: bookingId }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Fehler beim Erstellen der Zahlung')
          setLoading(false)
          return
        }
        setClientSecret(data.clientSecret)
      } catch(e) {
        setError('Netzwerkfehler')
      }
      setLoading(false)
    }
    createIntent()
  }, [bookingId])

  const stripePromise = getStripe()

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      padding: 16,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#1a1a2e', border: '1px solid rgba(124,104,250,0.2)',
        borderRadius: 20, padding: 'clamp(20px, 4vw, 32px)',
        width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
            Zahlung
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--text3)',
            fontSize: '1.2rem', cursor: 'pointer', padding: 4,
          }}>X</button>
        </div>

        <div style={{
          background: 'rgba(124,104,250,0.08)', border: '1px solid rgba(124,104,250,0.15)',
          borderRadius: 12, padding: '14px 16px', marginBottom: 20,
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 4 }}>
            {priceType === 'hourly' ? 'Reservierter Betrag (inkl. 20% Puffer)' : 'Gesamtbetrag'}
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            {(amount / 100).toFixed(2).replace('.', ',')} EUR
          </div>
          {priceType === 'hourly' && (
            <div style={{ fontSize: '0.7rem', color: '#d4a843', marginTop: 4 }}>
              Bei Stundenlohn wird der finale Betrag erst nach Abschluss berechnet.
              Ueberschuessiges Geld wird zurueckerstattet.
            </div>
          )}
          <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginTop: 6 }}>
            10% Plattformgebuehr inbegriffen
          </div>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 10, marginBottom: 16,
            background: 'rgba(240,96,144,0.1)', border: '1px solid rgba(240,96,144,0.2)',
            color: '#f06090', fontSize: '0.82rem', fontWeight: 600,
          }}>
            {error}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: 32, color: 'var(--text3)' }}>
            Zahlungsformular wird geladen...
          </div>
        )}

        {clientSecret && (
          <Elements stripe={stripePromise} options={{
            clientSecret,
            appearance: {
              theme: 'night',
              variables: {
                colorPrimary: '#7c68fa',
                colorBackground: '#12121e',
                colorText: '#e0e0e0',
                colorDanger: '#f06090',
                borderRadius: '10px',
                fontFamily: 'DM Sans, system-ui, sans-serif',
              },
              rules: {
                '.Input': { border: '1px solid rgba(124,104,250,0.2)', backgroundColor: '#17172a' },
                '.Input:focus': { borderColor: '#7c68fa', boxShadow: '0 0 0 2px rgba(124,104,250,0.2)' },
                '.Tab': { border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#17172a' },
                '.Tab--selected': { borderColor: '#7c68fa', backgroundColor: 'rgba(124,104,250,0.1)' },
                '.Label': { color: 'rgba(255,255,255,0.5)' },
              },
            },
          }}>
            <CheckoutForm bookingId={bookingId} onSuccess={onSuccess} onClose={onClose} />
          </Elements>
        )}
      </div>
    </div>
  )
}

function CheckoutForm({ bookingId, onSuccess, onClose }: { bookingId: string; onSuccess: () => void; onClose: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError('')

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || 'Validierungsfehler')
      setProcessing(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: window.location.origin + '/dashboard?payment=success&booking=' + bookingId,
      },
    })

    if (confirmError) {
      setError(confirmError.message || 'Zahlung fehlgeschlagen')
      setProcessing(false)
      return
    }

    // Payment confirmed - verify on server
    try {
      await fetch('/api/stripe/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId }),
      })
    } catch(e) { /* webhook will handle it */ }

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement options={{
        layout: 'tabs',
        wallets: { applePay: 'auto', googlePay: 'auto' },
      }} />

      {error && (
        <div style={{
          padding: '10px 14px', borderRadius: 10, marginTop: 12,
          background: 'rgba(240,96,144,0.1)', border: '1px solid rgba(240,96,144,0.2)',
          color: '#f06090', fontSize: '0.82rem',
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button type="button" onClick={onClose} style={{
          flex: 0, padding: '12px 20px', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12, background: 'transparent', color: 'var(--text3)',
          fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
        }}>
          Abbrechen
        </button>
        <button type="submit" disabled={processing || !stripe} style={{
          flex: 1, padding: '12px 20px', border: 'none', borderRadius: 12,
          background: processing ? 'rgba(124,104,250,0.3)' : 'linear-gradient(135deg, #7c68fa, #a080ff)',
          color: '#fff', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.9rem',
          cursor: processing ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
        }}>
          {processing ? 'Wird verarbeitet...' : 'Jetzt bezahlen'}
        </button>
      </div>
    </form>
  )
}