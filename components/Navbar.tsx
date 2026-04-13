'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user)
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
        if (profile) setRole(profile.role)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (!session) setRole(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav>
      <Link href="/" className="logo">
        <div className="logo-mark">
          <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 2L14.5 5.5V12.5L9 16L3.5 12.5V5.5L9 2Z" stroke="#0a1628" strokeWidth="1.5" fill="none"/>
            <path d="M9 5L12 7V11L9 13L6 11V7L9 5Z" fill="#0a1628"/>
          </svg>
        </div>
        WorkMatch
      </Link>

      <div className="nav-links">
        <Link href="/jobs">Jobs finden</Link>
        <Link href="/ki-tools">KI-Tools</Link>
        <Link href="/#arbeitgeber">Für Arbeitgeber</Link>
        <Link href="/#preise">Preise</Link>
      </div>

      <div className="nav-ctas">
        {user ? (
          <>
            <Link href="/dashboard" className="btn btn-ghost">Dashboard</Link>
            {role === 'employer' && <Link href="/post-job" className="btn btn-gold">+ Job inserieren</Link>}
            <button onClick={logout} className="btn btn-ghost">Abmelden</button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost">Anmelden</Link>
            <Link href="/register" className="btn btn-gold">Kostenlos starten</Link>
          </>
        )}
      </div>
    </nav>
  )
}
