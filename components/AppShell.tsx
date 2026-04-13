'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

const LogoMark = () => (
  <div className="s-logo-mark">
    <svg viewBox="0 0 20 20" fill="none" style={{width:18,height:18}}>
      <path d="M10 2L16 5.8V12.8L10 16.5L4 12.8V5.8L10 2Z" stroke="#1a1a00" strokeWidth="1.8" fill="none"/>
      <circle cx="10" cy="9.5" r="2.8" fill="#1a1a00"/>
    </svg>
  </div>
)

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [uid, setUid] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUid(data.user.id)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      setProfile(p)
    })
  }, [])

  const logout = async () => { await supabase.auth.signOut(); window.location.href = '/' }
  const active = (h: string) => pathname === h || (h.length > 1 && pathname.startsWith(h)) ? 'on' : ''
  const initials = profile?.full_name?.split(' ').map((n:string)=>n[0]).join('').slice(0,2).toUpperCase() || '?'

  const links = profile?.role === 'employer'
    ? [{h:'/dashboard',i:'⊞',l:'Dashboard'},{h:'/jobs',i:'◈',l:'Jobs'},{h:'/post-job',i:'＋',l:'Stelle inserieren'},{h:'/ki-tools',i:'✦',l:'KI-Tools'}]
    : [{h:'/dashboard',i:'⊞',l:'Dashboard'},{h:'/jobs',i:'◈',l:'Jobs finden'},{h:'/ki-tools',i:'✦',l:'KI-Assistent'},{h:`/bewerber/${uid}`,i:'◉',l:'Mein Profil'}]

  const SidebarContent = () => (
    <>
      <Link href="/" className="s-logo" onClick={()=>setOpen(false)}>
        <LogoMark /><span className="s-logo-text">WorkMatch</span>
      </Link>
      {profile && (
        <div className="s-user">
          <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
            <div className="s-avatar">{profile.avatar_url?<img src={profile.avatar_url} alt=""/>:initials}</div>
            <div>
              <div className="s-name">Hi, {profile.full_name?.split(' ')[0]}!</div>
              <div className="s-role">{profile.role==='employer'?`🏢 ${profile.company_name||'Arbeitgeber'}`:'Auf Jobsuche'}</div>
            </div>
          </div>
        </div>
      )}
      <nav className="s-nav">
        <div className="s-section">Menü</div>
        {links.map(({h,i,l}) => (
          <Link key={h} href={h} className={`s-link ${active(h)}`} onClick={()=>setOpen(false)}>
            <span className="s-icon">{i}</span>{l}
          </Link>
        ))}
      </nav>
      <div className="s-bottom">
        <button onClick={logout} className="s-link" style={{color:'var(--text3)',width:'100%'}}>
          <span className="s-icon">⇥</span>Abmelden
        </button>
      </div>
    </>
  )

  return (
    <div className="shell">
      {/* Mobile overlay */}
      <div className={`mob-overlay${open?' show':''}`} onClick={()=>setOpen(false)} />

      {/* Sidebar desktop */}
      <aside className={`sidebar${open?' open':''}`}><SidebarContent /></aside>

      <div className="main">
        {/* Mobile topbar */}
        <div className="mob-bar">
          <button className="mob-btn" onClick={()=>setOpen(true)}>☰</button>
          <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1rem',color:'#fff'}}>WorkMatch</span>
          <div style={{width:36}}/>
        </div>
        {children}
      </div>
    </div>
  )
}
