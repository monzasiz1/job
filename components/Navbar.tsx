'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { TalentoWordmark } from '@/components/TalentoLogo'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  return (
    <>
      <nav style={{position:'sticky',top:0,zIndex:200,background:'rgba(15,15,23,0.97)',backdropFilter:'blur(24px)',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 1.5rem',height:60}}>
        <Link href="/" style={{display:'flex',alignItems:'center',textDecoration:'none'}}>
          <TalentoWordmark size="md" />
        </Link>

        {/* Desktop links */}
        <div className="pub-links">
          <Link href="/jobs" style={{color:'var(--text2)',fontWeight:500,fontSize:'0.85rem',textDecoration:'none'}}>Jobs</Link>
          <Link href="/marktplatz" style={{color:'var(--text2)',fontWeight:500,fontSize:'0.85rem',textDecoration:'none'}}>Marktplatz</Link>
          <Link href="/ki-tools" style={{color:'var(--text2)',fontWeight:500,fontSize:'0.85rem',textDecoration:'none'}}>KI-Tools</Link>
          <Link href="/#arbeitgeber" style={{color:'var(--text2)',fontWeight:500,fontSize:'0.85rem',textDecoration:'none'}}>Arbeitgeber</Link>
          <Link href="/#preise" style={{color:'var(--text2)',fontWeight:500,fontSize:'0.85rem',textDecoration:'none'}}>Preise</Link>
        </div>

        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {user ? (
            <Link href="/dashboard" style={{padding:'8px 16px',background:'var(--accent)',color:'#fff',borderRadius:999,fontWeight:700,fontSize:'0.82rem',textDecoration:'none'}}>Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="pub-ctas" style={{padding:'8px 14px',background:'transparent',border:'1px solid var(--border2)',color:'var(--text2)',borderRadius:999,fontWeight:600,fontSize:'0.82rem',textDecoration:'none'}}>Anmelden</Link>
              <Link href="/register" style={{padding:'8px 16px',background:'linear-gradient(135deg,#d4a843,#f0c060)',color:'#000',borderRadius:999,fontWeight:700,fontSize:'0.82rem',textDecoration:'none'}}>Starten</Link>
            </>
          )}
          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{display:'none',background:'none',border:'none',color:'var(--text)',fontSize:'1.2rem',cursor:'pointer',padding:6,marginLeft:4}} className="mob-menu-btn">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div style={{position:'fixed',top:60,left:0,right:0,zIndex:190,background:'rgba(23,23,42,0.98)',borderBottom:'1px solid var(--border)',padding:'1rem 1.5rem',display:'flex',flexDirection:'column',gap:4}}>
          {[['Jobs','/jobs'],['Marktplatz','/marktplatz'],['KI-Tools','/ki-tools'],['Arbeitgeber','/#arbeitgeber'],['Preise','/#preise']].map(([l,h])=>(
            <Link key={l} href={h} onClick={() => setMenuOpen(false)} style={{padding:'11px 0',color:'var(--text2)',fontWeight:600,fontSize:'0.9rem',textDecoration:'none',borderBottom:'1px solid var(--border)'}}>
              {l}
            </Link>
          ))}
          {!user && <Link href="/register" onClick={() => setMenuOpen(false)} style={{marginTop:'0.5rem',padding:'12px',background:'var(--accent)',color:'#fff',borderRadius:12,fontWeight:700,fontSize:'0.88rem',textDecoration:'none',textAlign:'center'}}>Kostenlos registrieren →</Link>}
        </div>
      )}

      <style>{`
        .pub-links{display:flex;gap:1.75rem}
        .mob-menu-btn{display:none !important}
        @media(max-width:768px){
          .pub-links{display:none !important}
          .pub-ctas{display:none !important}
          .mob-menu-btn{display:flex !important}
        }
      `}</style>
    </>
  )
}
