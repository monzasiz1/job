'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'

export default function LoginPage() {
  const router = useRouter()
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
    router.push('/dashboard')
  }

  return (
    <>
      <Navbar />
      <div className="page-sm">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Willkommen zurück</h1>
          <p style={{ color: 'var(--ink2)' }}>Melde dich an, um fortzufahren.</p>
        </div>

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

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--ink2)', fontSize: '0.9rem' }}>
          Noch kein Konto? <Link href="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Registrieren</Link>
        </p>
      </div>
    </>
  )
}
