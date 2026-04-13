'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [menu, setMenu] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user)
        const { data: p } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
        if (p) setRole(p.role)
      }
    })
  }, [])

  return (
    <nav className="pub-nav">
      <Link href="/" className="pub-logo">
        <div className="pub-logo-mark">
          <svg viewBox="0 0 20 20" fill="none" style={{ width: 16, height: 16 }}>
            <path d="M10 2L16 5.5V13L10 16.5L4 13V5.5L10 2Z" stroke="#0d1b2a" strokeWidth="1.5"/>
            <circle cx="10" cy="9" r="3" fill="#0d1b2a"/>
          </svg>
        </div>
        WorkMatch
      </Link>
      <div className="pub-nav-links">
        <Link href="/jobs">Jobs</Link>
        <Link href="/ki-tools">KI-Tools</Link>
        <Link href="/#arbeitgeber">Arbeitgeber</Link>
        <Link href="/#preise">Preise</Link>
      </div>
      <div className="pub-nav-ctas">
        {user ? (
          <Link href="/dashboard" className="btn btn-accent btn-sm">Dashboard</Link>
        ) : (
          <>
            <Link href="/login" className="btn btn-ghost btn-sm">Anmelden</Link>
            <Link href="/register" className="btn btn-gold btn-sm">Kostenlos starten</Link>
          </>
        )}
      </div>
    </nav>
  )
}
