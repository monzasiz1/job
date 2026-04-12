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
        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', data.user.id).single()
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
        <div className="logo-dot" />
        WorkMatch
      </Link>
      <div className="nav-links">
        <Link href="/jobs">Jobs finden</Link>
        <Link href="/#arbeitgeber">Für Arbeitgeber</Link>
        <Link href="/#preise">Preise</Link>
      </div>
      <div className="nav-ctas">
        {user ? (
          <>
            <Link href="/dashboard" className="btn btn-outline">Dashboard</Link>
            {role === 'employer' && (
              <Link href="/post-job" className="btn btn-primary">+ Job inserieren</Link>
            )}
            <button onClick={logout} className="btn btn-dark">Abmelden</button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-outline">Anmelden</Link>
            <Link href="/register" className="btn btn-primary">Kostenlos starten</Link>
          </>
        )}
      </div>
    </nav>
  )
}
