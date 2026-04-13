'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (err) { setError('Ungültige E-Mail oder Passwort.'); setLoading(false); return }

    // Warte kurz, damit die Session gespeichert wird
    await new Promise(resolve => setTimeout(resolve, 500))
    router.push(redirect)
  }

  return (
    <div className="page-sm">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold)', borderRadius: 100, padding: '5px 14px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>✦ Willkommen zurück</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Anmelden</h1>
        <p style={{ color: 'var(--ink2)', fontSize: '0.9rem' }}>Noch kein Konto? <Link href="/register" style={{ color: 'var(--gold)', fontWeight: 600 }}>Kostenlos registrieren</Link></p>
      </div>

      {redirect !== '/dashboard' && (
        <div className="alert" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--navy)', marginBottom: '1.5rem' }}>
          🔒 Bitte melde dich an um fortzufahren.
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={submit} className="card">
        <div className="form-group">
          <label className="form-label">E-Mail</label>
          <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="deine@email.de" required />
        </div>
        <div className="form-group">
          <label className="form-label">Passwort</label>
          <input className="form-input" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
        </div>
        <button type="submit" className="form-submit" disabled={loading}>
          {loading ? 'Wird angemeldet...' : 'Anmelden →'}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="page-sm" style={{ textAlign: 'center', paddingTop: '5rem' }}>Laden...</div>}>
        <LoginForm />
      </Suspense>
    </>
  )
}
