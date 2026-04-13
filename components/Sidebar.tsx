'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'

export default function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user)
        const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
        setProfile(p)
      }
    })
  }, [])

  const logout = async () => { await supabase.auth.signOut(); window.location.href = '/' }
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || '?'

  const navItems = profile?.role === 'employer' ? [
    { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { href: '/post-job', icon: '+', label: 'Job inserieren' },
    { href: '/jobs', icon: '◈', label: 'Alle Jobs' },
    { href: '/ki-tools', icon: '✦', label: 'KI-Tools' },
  ] : [
    { href: '/dashboard', icon: '⊞', label: 'Dashboard' },
    { href: '/jobs', icon: '◈', label: 'Jobs finden' },
    { href: '/ki-tools', icon: '✦', label: 'KI-Assistent' },
    { href: `/bewerber/${user?.id}`, icon: '◉', label: 'Mein Profil' },
  ]

  return (
    <aside className="sidebar">
      {/* LOGO */}
      <Link href="/" className="sidebar-logo">
        <div className="sidebar-logo-mark">
          <svg viewBox="0 0 20 20" fill="none">
            <path d="M10 2L16 5.5V13L10 16.5L4 13V5.5L10 2Z" stroke="#0d1b2a" strokeWidth="1.5"/>
            <circle cx="10" cy="9" r="3" fill="#0d1b2a"/>
          </svg>
        </div>
        <span className="sidebar-logo-text">WorkMatch</span>
      </Link>

      {/* USER */}
      {profile && (
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.full_name} /> : initials}
          </div>
          <div className="sidebar-name">Hi, {profile.full_name?.split(' ')[0]}!</div>
          <div className="sidebar-role">{profile.role === 'employer' ? `🏢 ${profile.company_name || 'Arbeitgeber'}` : 'Dein Job wartet!'}</div>
        </div>
      )}

      {/* NAV */}
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <Link key={item.href} href={item.href} className={`sidebar-link${isActive(item.href) ? ' active' : ''}`}>
            <span className="sidebar-link-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        {/* KI MATCH RING — nur für Bewerber */}
        {profile?.role === 'jobseeker' && (
          <div className="sidebar-match" style={{ marginTop: '1rem' }}>
            <div className="match-ring-wrap">
              <svg viewBox="0 0 90 90" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"/>
                <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(200,169,81,0.6)" strokeWidth="7" strokeLinecap="round" strokeDasharray="239" strokeDashoffset="86"/>
                <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(244,115,138,0.6)" strokeWidth="7" strokeLinecap="round" strokeDasharray="239" strokeDashoffset="191" style={{ transform: 'rotate(144deg)', transformOrigin: '45px 45px' }}/>
              </svg>
              <div className="match-ring-label">65%</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
              <span style={{ color: 'rgba(200,169,81,0.8)' }}>● 32%</span>
              <span style={{ color: 'rgba(124,106,247,0.8)' }}>● 10%</span>
              <span style={{ color: 'rgba(244,115,138,0.8)' }}>● 23%</span>
            </div>
          </div>
        )}
      </nav>

      {/* BOTTOM */}
      <div className="sidebar-bottom">
        <button onClick={logout} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <span className="sidebar-link-icon">⇥</span>
          Abmelden
        </button>
      </div>
    </aside>
  )
}
