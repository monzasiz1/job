'use client'

import { useState, useEffect } from 'react'

interface StripeStatus {
  connected: boolean
  onboarded: boolean
  accountId?: string
}

export default function StripeOnboarding() {
  const [status, setStatus] = useState<StripeStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [onboardLoading, setOnboardLoading] = useState(false)

  useEffect(() => { checkStatus() }, [])

  async function checkStatus() {
    try {
      const res = await fetch('/api/stripe/connect')
      if (res.ok) setStatus(await res.json())
    } catch(e) { /* ignore */ }
    setLoading(false)
  }

  async function startOnboarding() {
    setOnboardLoading(true)
    try {
      const res = await fetch('/api/stripe/connect', { method: 'POST' })
      if (res.ok) {
        const { url } = await res.json()
        if (url) window.location.href = url
      }
    } catch(e) { /* ignore */ }
    setOnboardLoading(false)
  }

  if (loading) return null

  if (status?.onboarded) {
    return (
      <div style={{
        background: 'rgba(61,186,126,0.06)', border: '1px solid rgba(61,186,126,0.15)',
        borderRadius: 14, padding: '14px 18px', marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(61,186,126,0.15)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '0.9rem', flexShrink: 0,
        }}>$</div>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#3dba7e' }}>
            Zahlungskonto aktiv
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>
            Du kannst Zahlungen empfangen.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)',
      borderRadius: 14, padding: '16px 18px', marginBottom: 12,
    }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#d4a843', marginBottom: 6 }}>
        Zahlungskonto einrichten
      </div>
      <div style={{ fontSize: '0.76rem', color: 'var(--text3)', marginBottom: 12, lineHeight: 1.5 }}>
        Um Zahlungen fuer deine Auftraege zu empfangen, richte dein Stripe-Konto ein.
        Die Einrichtung dauert nur wenige Minuten.
      </div>
      <button onClick={startOnboarding} disabled={onboardLoading} style={{
        padding: '10px 20px', border: 'none', borderRadius: 10,
        background: onboardLoading ? 'rgba(212,168,67,0.2)' : 'linear-gradient(135deg, #d4a843, #c49935)',
        color: '#fff', fontFamily: 'inherit', fontWeight: 700,
        fontSize: '0.82rem', cursor: onboardLoading ? 'not-allowed' : 'pointer',
      }}>
        {onboardLoading ? 'Wird geladen...' : (status?.connected ? 'Einrichtung fortsetzen' : 'Jetzt einrichten')}
      </button>
    </div>
  )
}