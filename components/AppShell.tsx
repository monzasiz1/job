'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

const Mark = () => (
  <div style={{width:32,height:32,background:'linear-gradient(135deg,#d4a843,#f0c060)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
    <svg viewBox="0 0 20 20" fill="none" style={{width:16,height:16}}>
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

  // Close sidebar on route change
  useEffect(() => { setOpen(false) }, [pathname])

  const logout = async () => { await supabase.auth.signOut(); window.location.href = '/' }
  const active = (h: string) => pathname === h || (h.length > 1 && pathname.startsWith(h))
  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  const links = profile?.role === 'employer'
    ? [
        { h: '/dashboard', i: '⊞', l: 'Dashboard' },
        { h: '/jobs', i: '◈', l: 'Jobs' },
        { h: '/post-job', i: '＋', l: 'Stelle inserieren' },
        { h: '/ki-tools', i: '✦', l: 'KI-Tools' },
        { h: '/dashboard/profil', i: '✏️', l: 'Profil bearbeiten' },
      ]
    : [
        { h: '/dashboard', i: '⊞', l: 'Dashboard' },
        { h: '/jobs', i: '◈', l: 'Jobs finden' },
        { h: '/favoriten', i: '⭐', l: 'Favoriten' },
        { h: '/ki-tools', i: '✦', l: 'KI-Assistent' },
        { h: '/dashboard/profil', i: '✏️', l: 'Profil bearbeiten' },
      ]

  const SidebarContent = () => (
    <div style={{width:240,background:'var(--surface)',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',height:'100%',overflowY:'auto'}}>
      <Link href="/" style={{display:'flex',alignItems:'center',gap:10,padding:'1.25rem 1.1rem',borderBottom:'1px solid var(--border)',textDecoration:'none',flexShrink:0}}>
        <Mark/><span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.05rem',color:'#fff'}}>WorkMatch</span>
      </Link>

      {profile && (
        <div style={{padding:'1rem 1.1rem',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:'0.7rem',flexShrink:0}}>
          <div style={{width:42,height:42,borderRadius:12,background:'linear-gradient(135deg,var(--accent),#a080ff)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'0.88rem',color:'#fff',flexShrink:0,overflow:'hidden'}}>
            {profile.avatar_url ? <img src={profile.avatar_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : initials}
          </div>
          <div style={{minWidth:0}}>
            <div style={{fontWeight:700,fontSize:'0.84rem',color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Hi, {profile.full_name?.split(' ')[0]}!</div>
            <div style={{fontSize:'0.7rem',color:'var(--text3)',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{profile.role==='employer'?profile.company_name:'Auf Jobsuche'}</div>
          </div>
        </div>
      )}

      <nav style={{padding:'0.75rem',flex:1,display:'flex',flexDirection:'column',gap:2}}>
        <div style={{fontSize:'0.62rem',fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--text3)',padding:'0.5rem 0.5rem 0.2rem'}}>Menü</div>
        {links.map(({h,i,l}) => (
          <Link key={h} href={h}
            style={{display:'flex',alignItems:'center',gap:10,padding:'9px 11px',borderRadius:12,color:active(h)?'var(--accent)':'var(--text2)',background:active(h)?'var(--accent-soft)':'transparent',fontWeight:600,fontSize:'0.83rem',textDecoration:'none',transition:'all 0.15s'}}>
            <span style={{width:16,textAlign:'center',fontSize:'0.9rem',flexShrink:0}}>{i}</span>{l}
          </Link>
        ))}
      </nav>

      <div style={{padding:'0.75rem',borderTop:'1px solid var(--border)',flexShrink:0}}>
        <button onClick={logout} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 11px',borderRadius:12,color:'var(--text3)',background:'none',border:'none',fontWeight:600,fontSize:'0.83rem',cursor:'pointer',width:'100%',fontFamily:"'DM Sans',sans-serif"}}>
          <span style={{width:16,textAlign:'center',flexShrink:0}}>⇥</span>Abmelden
        </button>
      </div>
    </div>
  )

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--bg)'}}>
      {/* Mobile overlay */}
      {open && <div onClick={() => setOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:280,backdropFilter:'blur(4px)'}}/>}

      {/* Desktop sidebar */}
      <div className="sidebar-wrap" style={{width:240,flexShrink:0}}>
        <div style={{position:'fixed',top:0,left:0,bottom:0,width:240,zIndex:200}}>
          <SidebarContent />
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className="sidebar-mobile" style={{position:'fixed',top:0,left:0,bottom:0,width:240,zIndex:300,transform:open?'translateX(0)':'translateX(-100%)',transition:'transform 0.28s ease',display:'none'}}>
        <SidebarContent />
      </div>

      {/* Main content */}
      <div style={{flex:1,minHeight:'100vh',minWidth:0}}>
        {/* Mobile top bar */}
        <div className="mob-bar" style={{position:'sticky',top:0,zIndex:200,background:'rgba(23,23,42,0.97)',borderBottom:'1px solid var(--border)',padding:'0 1rem',height:52,alignItems:'center',justifyContent:'space-between',display:'none'}}>
          <button onClick={() => setOpen(!open)} style={{background:'none',border:'none',color:'var(--text)',fontSize:'1.3rem',cursor:'pointer',padding:'6px',lineHeight:1}}>
            {open ? '✕' : '☰'}
          </button>
          <Link href="/" style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1rem',color:'#fff',textDecoration:'none',display:'flex',alignItems:'center',gap:8}}>
            <Mark/>WorkMatch
          </Link>
          <Link href="/dashboard/profil" style={{width:34,height:34,background:'var(--surface2)',border:'1px solid var(--border2)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text2)',fontSize:'0.85rem',textDecoration:'none'}}>✏️</Link>
        </div>
        {children}
      </div>

      <style>{`
        @media(max-width:768px){
          .sidebar-wrap{display:none !important}
          .sidebar-mobile{display:block !important}
          .mob-bar{display:flex !important}
        }
      `}</style>
    </div>
  )
}
