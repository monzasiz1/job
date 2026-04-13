'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import Navbar from '@/components/Navbar'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') === 'employer' ? 'employer' : 'jobseeker'

  const [role, setRole] = useState(defaultRole)
  const [form, setForm] = useState({ full_name: '', company_name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e: any) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { data, error: signUpErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { emailRedirectTo: `${location.origin}/dashboard` }
    })
    if (signUpErr) { setError(signUpErr.message); setLoading(false); return }
    if (data.user) {
      const { error: profileErr } = await supabase.from('profiles').insert({
        id: data.user.id,
        email: form.email,
        full_name: form.full_name,
        role,
        company_name: role === 'employer' ? form.company_name : null,
      })
      if (profileErr) { setError(profileErr.message); setLoading(false); return }
    }
    router.push('/dashboard')
  }

  return (
    <div className="page-sm">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>Konto erstellen</h1>
        <p style={{ color: 'var(--ink2)' }}>Kostenlos — in unter 2 Minuten.</p>
      </div>

      <div style={{ display: 'flex', background: 'var(--bg2)', borderRadius: 12, padding: 4, marginBottom: '2rem' }}>
        {(['jobseeker', 'employer'] as const).map(r => (
          <button key={r} onClick={() => setRole(r)} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontFamily: 'inherit', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
            background: role === r ? 'white' : 'transparent',
            color: role === r ? 'var(--ink)' : 'var(--ink2)',
            boxShadow: role === r ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
          }}>
            {r === 'jobseeker' ? '🔍 Bewerber' : '🏢 Arbeitgeber'}
          </button>
        ))}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={submit} className="card">
        <div className="form-group">
          <label className="form-label">{role === 'employer' ? 'Ihr Name' : 'Vollständiger Name'}</label>
          <input className="form-input" value={form.full_name} onChange={set('full_name')} placeholder="Max Mustermann" required />
        </div>
        {role === 'employer' && (
          <div className="form-group">
            <label className="form-label">Firmenname</label>
            <input className="form-input" value={form.company_name} onChange={set('company_name')} placeholder="Muster GmbH" required />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">E-Mail</label>
          <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="max@email.de" required />
        </div>
        <div className="form-group">
          <label className="form-label">Passwort (mind. 8 Zeichen)</label>
          <input className="form-input" type="password" value={form.password} onChange={set('password')} placeholder="Sicheres Passwort" minLength={8} required />
        </div>
        <button type="submit" className="form-submit" disabled={loading} style={{ background: role === 'employer' ? 'var(--accent)' : 'var(--ink)' }}>
          {loading ? 'Wird registriert...' : role === 'employer' ? '14 Tage kostenlos testen →' : 'Kostenlos registrieren →'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--ink2)', fontSize: '0.9rem' }}>
        Bereits registriert? <Link href="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Anmelden</Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="page-sm" style={{ textAlign: 'center', paddingTop: '5rem' }}>Laden...</div>}>
        <RegisterForm />
      </Suspense>
    </>
  )
}
