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
    e.preventDefault(); setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
    if (err) { setError('Ungültige E-Mail oder Passwort.'); setLoading(false); return }
    router.push(redirect)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--dark)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '2rem' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,var(--gold),var(--gold2))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 20 20" fill="none" style={{ width: 18, height: 18 }}><path d="M10 2L16 5.5V13L10 16.5L4 13V5.5L10 2Z" stroke="#0d1b2a" strokeWidth="1.5"/><circle cx="10" cy="9" r="3" fill="#0d1b2a"/></svg>
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>WorkMatch</span>
          </Link>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.8rem', color: 'white', marginBottom: '0.4rem' }}>Willkommen zurück</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Melde dich an, um fortzufahren.</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit} className="card card-solid" style={{ border: '1px solid var(--border2)' }}>
          <div className="form-group">
            <label className="form-label">E-Mail</label>
            <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="deine@email.de" required />
          </div>
          <div className="form-group">
            <label className="form-label">Passwort</label>
            <input className="form-input" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required />
          </div>
          <button type="submit" className="form-submit" disabled={loading}>{loading ? 'Wird angemeldet...' : 'Anmelden →'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--text2)', fontSize: '0.88rem' }}>
          Noch kein Konto? <Link href="/register" style={{ color: 'var(--accent2)', fontWeight: 700 }}>Registrieren</Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense fallback={<div style={{ background: 'var(--dark)', minHeight: '100vh' }} />}><LoginForm /></Suspense>
}
