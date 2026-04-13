'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

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
    e.preventDefault(); setLoading(true); setError('')
    const { data, error: err } = await supabase.auth.signUp({ email: form.email, password: form.password, options: { emailRedirectTo: `${location.origin}/dashboard` } })
    if (err) { setError(err.message); setLoading(false); return }
    if (data.user) {
      const { error: pErr } = await supabase.from('profiles').insert({ id: data.user.id, email: form.email, full_name: form.full_name, role, company_name: role === 'employer' ? form.company_name : null })
      if (pErr) { setError(pErr.message); setLoading(false); return }
    }
    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--dark)' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '2rem' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,var(--gold),var(--gold2))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 20 20" fill="none" style={{ width: 18, height: 18 }}><path d="M10 2L16 5.5V13L10 16.5L4 13V5.5L10 2Z" stroke="#0d1b2a" strokeWidth="1.5"/><circle cx="10" cy="9" r="3" fill="#0d1b2a"/></svg>
            </div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>WorkMatch</span>
          </Link>
          <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1.8rem', color: 'white', marginBottom: '0.4rem' }}>Konto erstellen</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Kostenlos starten — in unter 2 Minuten.</p>
        </div>

        {/* ROLE TOGGLE */}
        <div className="tab-bar" style={{ marginBottom: '1.25rem' }}>
          {(['jobseeker','employer'] as const).map(r => (
            <button key={r} onClick={() => setRole(r)} className={`tab-btn${role===r?' active':''}`}>
              {r === 'jobseeker' ? '🔍 Bewerber' : '🏢 Arbeitgeber'}
            </button>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={submit} className="card card-solid" style={{ border: '1px solid var(--border2)' }}>
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
          <button type="submit" className="form-submit" disabled={loading} style={{ background: role === 'employer' ? 'var(--gold)' : 'var(--accent)', color: role === 'employer' ? 'var(--dark)' : 'white' }}>
            {loading ? 'Wird registriert...' : role === 'employer' ? '14 Tage kostenlos testen →' : 'Kostenlos registrieren →'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.25rem', color: 'var(--text2)', fontSize: '0.88rem' }}>
          Bereits registriert? <Link href="/login" style={{ color: 'var(--accent2)', fontWeight: 700 }}>Anmelden</Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return <Suspense fallback={<div style={{ background: 'var(--dark)', minHeight: '100vh' }} />}><RegisterForm /></Suspense>
}
