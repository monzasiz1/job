'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { TalentoWordmark } from '@/components/TalentoLogo'

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const [profile, setProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
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
  const isActive = (href: string) => pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || '?'

  const navItems = profile?.role === 'employer'
    ? [
        { href: '/dashboard', icon: '▣', label: 'Dashboard' },
        { href: '/jobs', icon: '◈', label: 'Jobs anzeigen' },
        { href: '/post-job', icon: '+', label: 'Stelle inserieren' },
        { href: '/marktplatz', icon: '🗺', label: 'Marktplatz' },
        { href: '/ki-tools', icon: '✦', label: 'KI-Tools' },
      ]
    : [
        { href: '/dashboard', icon: '▣', label: 'Dashboard' },
        { href: '/jobs', icon: '◈', label: 'Jobs finden' },
        { href: '/marktplatz', icon: '🗺', label: 'Marktplatz' },
        { href: '/ki-tools', icon: '✦', label: 'KI-Assistent' },
        { href: `/bewerber/${user?.id || ''}`, icon: '◉', label: 'Mein Profil' },
      ]

  return (
    <aside className="sidebar">
      <Link href="/" className="sidebar-logo" onClick={onClose}>
        <TalentoWordmark size="sm" />
      </Link>

      {profile && (
        <div className="sidebar-user">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="sidebar-avatar" style={{ margin: 0 }}>
              {profile.avatar_url ? <img src={profile.avatar_url} alt="" /> : initials}
            </div>
            <div>
              <div className="sidebar-name">Hi, {profile.full_name?.split(' ')[0]}!</div>
              <div className="sidebar-sub">{profile.role === 'employer' ? `🏢 ${profile.company_name || 'Arbeitgeber'}` : '🔍 Auf Jobsuche'}</div>
            </div>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} className={`nav-link${isActive(item.href) ? ' active' : ''}`} onClick={onClose}>
            <span className="nav-link-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button onClick={logout} className="nav-link" style={{ color: 'var(--text3)' }}>
          <span className="nav-link-icon">⇥</span>
          Abmelden
        </button>
      </div>
    </aside>
  )
}
