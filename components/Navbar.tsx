'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

const Mark = () => (
  <div className="pub-logo-mark">
    <svg viewBox="0 0 20 20" fill="none" style={{width:16,height:16}}>
      <path d="M10 2L16 5.8V12.8L10 16.5L4 12.8V5.8L10 2Z" stroke="#1a1a00" strokeWidth="1.8" fill="none"/>
      <circle cx="10" cy="9.5" r="2.8" fill="#1a1a00"/>
    </svg>
  </div>
)

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])
  return (
    <nav className="pub-nav">
      <Link href="/" className="pub-logo"><Mark/>WorkMatch</Link>
      <div className="pub-links">
        <Link href="/jobs">Jobs</Link>
        <Link href="/ki-tools">KI-Tools</Link>
        <Link href="/#arbeitgeber">Arbeitgeber</Link>
        <Link href="/#preise">Preise</Link>
      </div>
      <div className="pub-ctas">
        {user
          ? <Link href="/dashboard" className="btn btn-accent btn-sm">Dashboard</Link>
          : <><Link href="/login" className="btn btn-ghost btn-sm">Anmelden</Link><Link href="/register" className="btn btn-gold btn-sm">Starten</Link></>}
      </div>
    </nav>
  )
}
