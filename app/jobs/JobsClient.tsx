'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import FavoriteButton from '@/components/FavoriteButton'

const LC = ['ja','jb','jc','jd','je','jf']
const ll = (n: string) => n.slice(0,2).toUpperCase()
const lc = (i: number) => LC[i % LC.length]
const tb = (t: string) => t==='Remote'?'b-remote':t==='Hybrid'?'b-hybrid':'b-office'

export default function JobsClient({ jobs, searchParams, user }: any) {
  const router = useRouter()
  const [sel, setSel] = useState<any>(jobs[0] || null)
  const [geo, setGeo] = useState(false)
  const qR = useRef<HTMLInputElement>(null)
  const cR = useRef<HTMLInputElement>(null)
  const rR = useRef<HTMLSelectElement>(null)
  const tR = useRef<HTMLSelectElement>(null)

  const search = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = qR.current?.value||'', city = cR.current?.value||'', radius = rR.current?.value||'', type = tR.current?.value||''
    const p = new URLSearchParams()
    if (q) p.set('q',q); if (city) p.set('city',city); if (radius) p.set('radius',radius); if (type) p.set('type',type)
    if (city && radius && radius !== '999') {
      setGeo(true)
      try { const r = await fetch(`/api/geocode?city=${encodeURIComponent(city)}`); const d = await r.json(); if (d.lat) { p.set('clat',d.lat); p.set('clng',d.lng) } } catch {}
      setGeo(false)
    }
    router.push(`/jobs?${p}`)
  }

  return (
    <>
      {/* TOPBAR */}
      <div style={{position:'sticky',top:0,zIndex:100,background:'rgba(15,15,23,0.92)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--border)',padding:'0 1.25rem',height:60,display:'flex',alignItems:'center',gap:8}}>
        <form onSubmit={search} style={{display:'flex',gap:8,flex:1,flexWrap:'wrap',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--surface2)',border:'1px solid var(--border2)',borderRadius:12,padding:'8px 13px',flex:'1 1 200px',minWidth:0}}>
            <span style={{color:'var(--text3)',flexShrink:0}}>🔍</span>
            <input ref={qR} defaultValue={searchParams.q} placeholder="Jobtitel, Firma..." style={{border:'none',outline:'none',background:'transparent',color:'var(--text)',fontFamily:"'DM Sans',sans-serif",fontSize:'0.86rem',flex:1,minWidth:0}}/>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--surface2)',border:'1px solid var(--border2)',borderRadius:12,padding:'8px 13px',flex:'1 1 140px',minWidth:0}}>
            <span style={{color:'var(--text3)',flexShrink:0}}>📍</span>
            <input ref={cR} defaultValue={searchParams.city} placeholder="Stadt / PLZ..." style={{border:'none',outline:'none',background:'transparent',color:'var(--text)',fontFamily:"'DM Sans',sans-serif",fontSize:'0.86rem',flex:1,minWidth:0}}/>
          </div>
          <select ref={rR} defaultValue={searchParams.radius||''} style={{padding:'8px 11px',border:'1px solid var(--border2)',borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:'0.82rem',background:'var(--surface2)',color:'var(--text2)',outline:'none',cursor:'pointer',flexShrink:0}}>
            <option value="">Umkreis</option>
            <option value="10">+10 km</option><option value="25">+25 km</option>
            <option value="50">+50 km</option><option value="100">+100 km</option>
            <option value="999">Bundesweit</option>
          </select>
          <select ref={tR} defaultValue={searchParams.type||''} style={{padding:'8px 11px',border:'1px solid var(--border2)',borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:'0.82rem',background:'var(--surface2)',color:'var(--text2)',outline:'none',cursor:'pointer',flexShrink:0}}>
            <option value="">Alle Typen</option>
            <option value="Remote">Remote</option><option value="Hybrid">Hybrid</option><option value="Vor Ort">Vor Ort</option>
          </select>
          <button type="submit" disabled={geo} style={{padding:'8px 18px',background:'var(--accent)',color:'#fff',border:'none',borderRadius:999,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:'0.82rem',cursor:'pointer',flexShrink:0}}>
            {geo ? '...' : 'Suchen'}
          </button>
        </form>
      </div>

      {/* CHIPS */}
      <div style={{padding:'0.7rem 1.25rem',display:'flex',gap:7,flexWrap:'wrap',alignItems:'center',borderBottom:'1px solid var(--border)',overflowX:'auto'}}>
        {[['Alle','/jobs'],['Remote','/jobs?type=Remote'],['Vollzeit','/jobs?contract=Vollzeit'],['Junior','/jobs?level=Junior'],['Senior','/jobs?level=Senior'],['Tech','/jobs?field=Tech+%26+IT'],['Handwerk','/jobs?field=Handwerk']].map(([l,h])=>(
          <Link key={l} href={h} style={{padding:'5px 13px',borderRadius:999,fontSize:'0.75rem',fontWeight:700,border:'1px solid var(--border2)',background:'var(--surface)',color:'var(--text2)',textDecoration:'none',whiteSpace:'nowrap'}}>{l}</Link>
        ))}
        <span style={{marginLeft:'auto',fontSize:'0.76rem',color:'var(--text3)',fontWeight:600,whiteSpace:'nowrap'}}>{jobs.length} Jobs</span>
      </div>

      {/* SPLIT VIEW */}
      <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:'1rem',padding:'1rem 1.25rem',minHeight:'calc(100vh - 130px)'}} className="split">

        {/* JOB LIST */}
        <div style={{display:'flex',flexDirection:'column',gap:8,overflowY:'auto'}}>
          {jobs.length === 0 ? (
            <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:20,padding:'3rem',textAlign:'center'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>🔍</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',marginBottom:'0.4rem'}}>Keine Jobs gefunden</div>
              <div style={{color:'var(--text2)',fontSize:'0.84rem',marginBottom:'1rem'}}>Größeren Umkreis versuchen.</div>
              <Link href="/jobs" style={{padding:'8px 18px',background:'var(--surface2)',border:'1px solid var(--border2)',color:'var(--text2)',borderRadius:999,fontSize:'0.8rem',fontWeight:700,textDecoration:'none'}}>Alle Jobs</Link>
            </div>
          ) : jobs.map((j: any, i: number) => (
            <div key={j.id} onClick={() => setSel(j)}
              style={{background:'var(--surface)',border:`1px solid ${sel?.id===j.id?'var(--accent)':'var(--border)'}`,borderRadius:16,padding:'0.9rem 1rem',display:'flex',alignItems:'center',gap:'0.85rem',cursor:'pointer',transition:'all 0.18s',position:'relative',overflow:'hidden',background:sel?.id===j.id?'rgba(124,104,250,0.07)':'var(--surface)'}}>
              {sel?.id===j.id && <div style={{position:'absolute',left:0,top:0,bottom:0,width:3,background:'var(--accent)'}}/>}
              {j.company_logo_url
                ? <div style={{width:42,height:42,borderRadius:12,overflow:'hidden',flexShrink:0}}><img src={j.company_logo_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
                : <div className={`jlogo ${lc(i)}`} style={{width:42,height:42,flexShrink:0}}>{ll(j.company)}</div>}
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'0.86rem',color:'#fff',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',marginBottom:2}}>{j.title}</div>
                <div style={{fontSize:'0.73rem',color:'var(--text3)',marginBottom:4}}>{j.company} · {j.location}</div>
                <div style={{fontSize:'0.79rem',fontWeight:600,color:'var(--text2)',marginBottom:5}}>{j.salary_min>0?`${j.salary_min.toLocaleString('de-DE')} – ${j.salary_max.toLocaleString('de-DE')} €`:'Gehalt n. V.'}</div>
                <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                  <span className={`badge ${tb(j.type)}`}>{j.type}</span>
                  <span className="badge b-office">{j.contract}</span>
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6,flexShrink:0}}>
                <FavoriteButton jobId={j.id} size="sm" />
                <div style={{width:30,height:30,background:'var(--surface3)',border:'1px solid var(--border)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text2)',fontSize:'0.8rem',transition:'all 0.18s'}}>→</div>
              </div>
            </div>
          ))}
        </div>

        {/* DETAIL */}
        {sel ? (
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:20,overflow:'hidden',display:'flex',flexDirection:'column',position:'sticky',top:70,maxHeight:'calc(100vh - 86px)'}}>
            <div style={{height:150,background:'linear-gradient(135deg,var(--surface2),var(--surface3))',position:'relative',overflow:'hidden',flexShrink:0}}>
              {sel.cover_image_url && <img src={sel.cover_image_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.55}}/>}
              <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(23,23,42,0.9),transparent)'}}/>
              <div style={{position:'absolute',top:10,right:10,display:'flex',gap:6}}>
                <FavoriteButton jobId={sel.id} />
                <Link href={`/jobs/${sel.id}`} style={{width:36,height:36,background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'0.85rem',textDecoration:'none',backdropFilter:'blur(8px)'}}>↗</Link>
              </div>
            </div>

            <div style={{overflowY:'auto',flex:1}}>
              <div style={{padding:'1.1rem 1.25rem'}}>
                <div style={{display:'flex',gap:'0.75rem',alignItems:'flex-start',marginBottom:'0.9rem',marginTop:'-1.25rem',position:'relative',zIndex:1}}>
                  {sel.company_logo_url
                    ?<img src={sel.company_logo_url} style={{width:54,height:54,borderRadius:14,border:'3px solid var(--surface)',boxShadow:'var(--shadow)',flexShrink:0,objectFit:'cover'}} alt=""/>
                    :<div className={`jlogo ${lc(0)}`} style={{width:54,height:54,borderRadius:14,border:'3px solid var(--surface)',boxShadow:'var(--shadow)',flexShrink:0,fontSize:'1rem'}}>{ll(sel.company)}</div>}
                </div>

                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.1rem',color:'#fff',marginBottom:4}}>{sel.title}</div>
                <div style={{fontSize:'0.88rem',color:'var(--text2)',fontWeight:500,marginBottom:'0.85rem'}}>{sel.salary_min>0?`${sel.salary_min.toLocaleString('de-DE')} – ${sel.salary_max.toLocaleString('de-DE')} €`:'Gehalt nach Vereinbarung'}</div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:'1rem'}}>
                  <span className={`badge ${tb(sel.type)}`}>{sel.type}</span>
                  <span className="badge b-office">{sel.contract}</span>
                  <span className="badge b-office">{sel.level}</span>
                  {sel.field&&<span className="badge b-accent">{sel.field}</span>}
                  <span className="badge b-office">📍 {sel.location}</span>
                </div>

                {sel.benefits?.length>0&&(
                  <div style={{marginBottom:'1rem'}}>
                    <div style={{fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'var(--text3)',marginBottom:'0.5rem'}}>Benefits</div>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                      {sel.benefits.map((b:string)=><span key={b} style={{padding:'3px 10px',background:'var(--green-soft)',borderRadius:999,fontSize:'0.74rem',fontWeight:700,color:'var(--green)'}}>✓ {b}</span>)}
                    </div>
                  </div>
                )}

                <div style={{fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'var(--text3)',marginBottom:'0.5rem'}}>Beschreibung</div>
                <div style={{fontSize:'0.86rem',color:'var(--text2)',lineHeight:1.8,whiteSpace:'pre-wrap',marginBottom:'1rem'}}>{sel.description}</div>

                {sel.company_description&&(
                  <>
                    <div style={{fontSize:'0.7rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'var(--text3)',marginBottom:'0.5rem'}}>Über {sel.company}</div>
                    <div style={{fontSize:'0.86rem',color:'var(--text2)',lineHeight:1.8,marginBottom:'1rem'}}>{sel.company_description}</div>
                  </>
                )}
              </div>
            </div>

            <div style={{padding:'1rem 1.25rem',borderTop:'1px solid var(--border)',display:'flex',gap:8,flexShrink:0,background:'var(--surface)'}}>
              {user
                ?<a href={`mailto:?subject=Bewerbung: ${sel.title}`} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'11px',background:'var(--accent)',color:'#fff',borderRadius:14,fontWeight:700,fontSize:'0.86rem',textDecoration:'none'}}>Jetzt bewerben →</a>
                :<Link href="/register" style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'11px',background:'var(--accent)',color:'#fff',borderRadius:14,fontWeight:700,fontSize:'0.86rem',textDecoration:'none'}}>Anmelden & bewerben →</Link>}
              <Link href="/ki-tools" style={{padding:'11px 16px',background:'var(--surface2)',border:'1px solid var(--border2)',color:'var(--text2)',borderRadius:14,fontWeight:700,fontSize:'0.82rem',textDecoration:'none',flexShrink:0}}>KI-Match ✦</Link>
            </div>
          </div>
        ):(
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'0.75rem',minHeight:400,textAlign:'center'}}>
            <div style={{fontSize:'2.5rem',opacity:0.2}}>◈</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'var(--text3)',fontSize:'0.88rem'}}>Stelle auswählen</div>
          </div>
        )}
      </div>
    </>
  )
}
