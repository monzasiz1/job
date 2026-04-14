'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import FavoriteButton from '@/components/FavoriteButton'
import ShareButton from '@/components/ShareButton'

const LC = ['ja','jb','jc','jd','je','jf']
const ll = (n: string) => n.slice(0,2).toUpperCase()
const lc = (i: number) => LC[i % LC.length]
const tb = (t: string) => t==='Remote'?'b-remote':t==='Hybrid'?'b-hybrid':'b-office'

const STYLES = `
  @keyframes slideInUp {
    from { opacity: 0; transform: scale(0.92) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes slideOutDown {
    from { opacity: 1; transform: scale(1) translateY(0); }
    to { opacity: 0; transform: scale(0.88) translateY(20px); }
  }
  @keyframes throwLeft {
    from { opacity: 1; transform: translateX(0) rotate(0deg); }
    to { opacity: 0; transform: translateX(-120%) rotate(-25deg); }
  }
  @keyframes selectPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  .anime-in { animation: slideInUp 0.4s ease-out; }
  .anime-out { animation: slideOutDown 0.4s ease-out; }
  .anime-throw { animation: throwLeft 0.45s ease-in forwards; }
  .anime-select { animation: selectPulse 0.6s ease-out; }
`

export default function JobsClient({ jobs, searchParams, user }: any) {
  const router = useRouter()
  const [sel, setSel] = useState<any>(jobs[0] || null)
  const [geo, setGeo] = useState(false)
  const [swipeMode, setSwipeMode] = useState(false)
  const [swipeIdx, setSwipeIdx] = useState(0)
  const [swipes, setSwipes] = useState<Record<string,string>>({})
  const [aiFilter, setAiFilter] = useState(false)
  const [filteredJobs, setFilteredJobs] = useState(jobs)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const [selectedNewJob, setSelectedNewJob] = useState(false)
  const [nopingJobId, setNopingJobId] = useState<string | null>(null)
  const qR = useRef<HTMLInputElement>(null)
  const cR = useRef<HTMLInputElement>(null)
  const rR = useRef<HTMLSelectElement>(null)
  const tR = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    setFilteredJobs(jobs)
  }, [jobs])

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

  const saveInterest = async (jobId: string, action: string) => {
    try {
      await fetch('/api/save-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, action })
      })
    } catch (err) {
      console.error('Error saving interest:', err)
    }
  }

  const handleSwipe = (action: 'like'|'maybe'|'nope') => {
    const job = filteredJobs[swipeIdx]
    if (!job) return
    
    if (action === 'nope') {
      setNopingJobId(job.id)
      setTimeout(() => {
        setSwipes({...swipes, [job.id]: action})
        saveInterest(job.id, action)
        if (swipeIdx < filteredJobs.length - 1) {
          setNopingJobId(null)
          setIsAnimatingOut(true)
          setTimeout(() => {
            setSwipeIdx(swipeIdx + 1)
            setIsAnimatingOut(false)
            setSelectedNewJob(true)
            setTimeout(() => setSelectedNewJob(false), 400)
          }, 300)
        } else {
          setSwipeMode(false)
          setSwipeIdx(0)
          setNopingJobId(null)
        }
      }, 300)
    } else {
      setIsAnimatingOut(true)
      setTimeout(() => {
        setSwipes({...swipes, [job.id]: action})
        saveInterest(job.id, action)
        if (swipeIdx < filteredJobs.length - 1) {
          setSwipeIdx(swipeIdx + 1)
          setIsAnimatingOut(false)
          setSelectedNewJob(true)
          setTimeout(() => setSelectedNewJob(false), 400)
        } else {
          setSwipeMode(false)
          setSwipeIdx(0)
          setIsAnimatingOut(false)
        }
      }, 150)
    }
  }

  const toggleAiFilter = () => {
    if (!aiFilter) {
      const reranked = [...jobs].sort((a, b) => {
        const aScore = (swipes[a.id] === 'like' ? 100 : swipes[a.id] === 'maybe' ? 50 : swipes[a.id] === 'nope' ? -100 : 0)
        const bScore = (swipes[b.id] === 'like' ? 100 : swipes[b.id] === 'maybe' ? 50 : swipes[b.id] === 'nope' ? -100 : 0)
        return bScore - aScore || jobs.indexOf(a) - jobs.indexOf(b)
      }).filter(j => swipes[j.id] !== 'nope')
      setFilteredJobs(reranked)
      setAiFilter(true)
    } else {
      setFilteredJobs(jobs)
      setAiFilter(false)
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      {/* TOPBAR */}
      <div style={{position:'sticky',top:0,zIndex:100,background:'rgba(15,15,23,0.92)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--border)',padding:'clamp(0.5rem, 2vw, 1.25rem)',display:'flex',alignItems:'center',gap:'clamp(0.5rem, 2vw, 1rem)'}}>
        <form onSubmit={search} style={{display:'flex',gap:'clamp(0.5rem, 2vw, 1rem)',flex:1,flexWrap:'wrap',alignItems:'center'}}>
          <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--surface2)',border:'1px solid var(--border2)',borderRadius:12,padding:'clamp(6px, 1.5vw, 10px) clamp(10px, 2vw, 16px)',flex:'1 1 clamp(180px, 35vw, 220px)',minWidth:0}}>
            <span style={{color:'var(--text3)',flexShrink:0,fontSize:'clamp(0.95rem, 2vw, 1.1rem)'}}>🔍</span>
            <input ref={qR} defaultValue={searchParams.q} placeholder="Job, Firma..." style={{border:'none',outline:'none',background:'transparent',color:'var(--text)',fontFamily:"'DM Sans',sans-serif",fontSize:'clamp(0.75rem, 2vw, 0.86rem)',flex:1,minWidth:0}}/>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--surface2)',border:'1px solid var(--border2)',borderRadius:12,padding:'clamp(6px, 1.5vw, 10px) clamp(10px, 2vw, 16px)',flex:'1 1 clamp(140px, 30vw, 180px)',minWidth:0}}>
            <span style={{color:'var(--text3)',flexShrink:0,fontSize:'clamp(0.95rem, 2vw, 1.1rem)'}}>📍</span>
            <input ref={cR} defaultValue={searchParams.city} placeholder="Stadt / PLZ..." style={{border:'none',outline:'none',background:'transparent',color:'var(--text)',fontFamily:"'DM Sans',sans-serif",fontSize:'clamp(0.75rem, 2vw, 0.86rem)',flex:1,minWidth:0}}/>
          </div>
          <select ref={rR} defaultValue={searchParams.radius||''} style={{padding:'clamp(6px, 1.5vw, 10px) clamp(8px, 1.5vw, 12px)',border:'1px solid var(--border2)',borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:'clamp(0.7rem, 1.8vw, 0.82rem)',background:'var(--surface2)',color:'var(--text2)',outline:'none',cursor:'pointer',flexShrink:0}}>
            <option value="">Umkreis</option>
            <option value="10">+10 km</option><option value="25">+25 km</option>
            <option value="50">+50 km</option><option value="100">+100 km</option>
            <option value="999">Bundesweit</option>
          </select>
          <select ref={tR} defaultValue={searchParams.type||''} style={{padding:'clamp(6px, 1.5vw, 10px) clamp(8px, 1.5vw, 12px)',border:'1px solid var(--border2)',borderRadius:10,fontFamily:"'DM Sans',sans-serif",fontSize:'clamp(0.7rem, 1.8vw, 0.82rem)',background:'var(--surface2)',color:'var(--text2)',outline:'none',cursor:'pointer',flexShrink:0}}>
            <option value="">Alle Typen</option>
            <option value="Remote">Remote</option><option value="Hybrid">Hybrid</option><option value="Vor Ort">Vor Ort</option>
          </select>
          <button type="submit" disabled={geo} style={{padding:'clamp(7px, 1.5vw, 10px) clamp(12px, 2vw, 18px)',background:'var(--accent)',color:'#fff',border:'none',borderRadius:999,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:'clamp(0.7rem, 1.8vw, 0.82rem)',cursor:'pointer',flexShrink:0,whiteSpace:'nowrap'}}>
            {geo ? '...' : 'Suchen'}
          </button>
          <button onClick={toggleAiFilter} style={{padding:'clamp(7px, 1.5vw, 10px) clamp(12px, 2vw, 18px)',background:aiFilter?'var(--accent)':'var(--surface2)',color:aiFilter?'#fff':'var(--text2)',border:`1px solid ${aiFilter?'transparent':'var(--border2)'}`,borderRadius:999,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:'clamp(0.65rem, 1.6vw, 0.82rem)',cursor:'pointer',flexShrink:0,whiteSpace:'nowrap'}}>
            {aiFilter?'✓ KI':'KI-Filter'}
          </button>
          <button onClick={() => {setSwipeMode(!swipeMode); setSwipeIdx(0)}} style={{padding:'clamp(7px, 1.5vw, 10px) clamp(12px, 2vw, 18px)',background:swipeMode?'var(--accent)':'var(--surface2)',color:swipeMode?'#fff':'var(--text2)',border:`1px solid ${swipeMode?'transparent':'var(--border2)'}`,borderRadius:999,fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:'clamp(0.65rem, 1.6vw, 0.82rem)',cursor:'pointer',flexShrink:0,whiteSpace:'nowrap'}}>
            {swipeMode?'Liste':'💫 Swipe'}
          </button>
        </form>
      </div>

      {/* CHIPS */}
      <div style={{padding:'clamp(0.5rem, 2vw, 0.7rem) clamp(0.75rem, 3vw, 1.25rem)',display:'flex',gap:'clamp(0.4rem, 1.5vw, 0.7rem)',flexWrap:'wrap',alignItems:'center',borderBottom:'1px solid var(--border)',overflowX:'auto'}}>
        {[['Alle','/jobs'],['Remote','/jobs?type=Remote'],['Vollzeit','/jobs?contract=Vollzeit'],['Junior','/jobs?level=Junior'],['Senior','/jobs?level=Senior'],['Tech','/jobs?field=Tech+%26+IT'],['Handwerk','/jobs?field=Handwerk']].map(([l,h])=>(
          <Link key={l} href={h} style={{padding:'clamp(4px, 1vw, 6px) clamp(10px, 2vw, 14px)',borderRadius:999,fontSize:'clamp(0.65rem, 1.5vw, 0.75rem)',fontWeight:700,border:'1px solid var(--border2)',background:'var(--surface)',color:'var(--text2)',textDecoration:'none',whiteSpace:'nowrap'}}>{l}</Link>
        ))}
        <span style={{marginLeft:'auto',fontSize:'clamp(0.65rem, 1.5vw, 0.76rem)',color:'var(--text3)',fontWeight:600,whiteSpace:'nowrap'}}>{filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} {aiFilter && '(KI)'}</span>
      </div>

      {/* SPLIT VIEW oder SWIPE */}
      {swipeMode ? (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'calc(100vh - 130px)',padding:'1.5rem',background:'linear-gradient(135deg,rgba(124,104,250,0.03),rgba(212,168,67,0.02))'}}>
          {filteredJobs.length > 0 && swipeIdx < filteredJobs.length ? (
            <div style={{maxWidth:520,width:'100%'}}>
              {(() => {
                const j = filteredJobs[swipeIdx]
                return (
                  <div className={nopingJobId === j.id ? 'anime-throw' : isAnimatingOut ? 'anime-out' : selectedNewJob ? 'anime-in' : ''} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:28,overflow:'hidden',boxShadow:'0 25px 80px rgba(0,0,0,0.5)'}}>
                    <div style={{height:320,background:'linear-gradient(135deg,var(--surface2),var(--surface3))',position:'relative',overflow:'hidden'}}>
                      {j.cover_image_url && <img src={j.cover_image_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.7}}/>}
                      <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(23,23,42,0.6),rgba(23,23,42,0.95))'}}/>
                      <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'2.5rem 1.75rem 1.75rem'}}>
                        <div style={{display:'flex',gap:'1rem',alignItems:'flex-end',marginBottom:'1.25rem'}}>
                          {j.company_logo_url
                            ?<img src={j.company_logo_url} style={{width:72,height:72,borderRadius:16,border:'3px solid var(--surface)',objectFit:'cover',boxShadow:'0 8px 24px rgba(0,0,0,0.4)'}} alt=""/>
                            :<div className={`jlogo ${lc(0)}`} style={{width:72,height:72,borderRadius:16,border:'3px solid var(--surface)',fontSize:'1.35rem',boxShadow:'0 8px 24px rgba(0,0,0,0.4)'}}>{ll(j.company)}</div>}
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:'1.4rem',color:'#fff',marginBottom:2,lineHeight:1.2}}>{j.title}</div>
                            <div style={{fontSize:'0.88rem',color:'rgba(255,255,255,0.75)',fontWeight:500}}>{j.company}</div>
                          </div>
                        </div>
                        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                          {j.salary_min>0 && <span className="badge b-accent" style={{background:'rgba(212,168,67,0.2)',color:'var(--gold)',border:'1px solid rgba(212,168,67,0.4)'}}>{j.salary_min.toLocaleString('de-DE')} – {j.salary_max.toLocaleString('de-DE')} €</span>}
                          <span className={`badge ${tb(j.type)}`}>{j.type}</span>
                          <span className="badge b-office">{j.contract}</span>
                          <span className="badge b-office">📍 {j.location}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{padding:'2rem 1.75rem'}}>
                      <p style={{fontSize:'0.9rem',color:'var(--text2)',lineHeight:1.8,marginBottom:'2rem',display:'-webkit-box',WebkitLineClamp:4,WebkitBoxOrient:'vertical' as any,overflow:'hidden'}}>{j.description}</p>
                      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:'1.75rem'}}>
                        <button onClick={() => handleSwipe('like')} style={{padding:'15px 18px',background:'linear-gradient(135deg,rgba(61,186,126,0.2),rgba(61,186,126,0.08))',border:'2px solid rgba(61,186,126,0.4)',color:'var(--green)',borderRadius:16,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'0.95rem',cursor:'pointer',transition:'all 0.25s'}}>
                          Interessiert – Speichern
                        </button>
                        <button onClick={() => handleSwipe('maybe')} style={{padding:'15px 18px',background:'linear-gradient(135deg,rgba(212,168,67,0.15),rgba(212,168,67,0.05))',border:'2px solid rgba(212,168,67,0.3)',color:'var(--gold)',borderRadius:16,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'0.95rem',cursor:'pointer',transition:'all 0.25s'}}>
                          Vielleicht später
                        </button>
                        <button onClick={() => handleSwipe('nope')} style={{padding:'15px 18px',background:'transparent',border:'2px solid rgba(240,96,144,0.3)',color:'var(--pink)',borderRadius:16,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'0.95rem',cursor:'pointer',transition:'all 0.25s'}}>
                          Nicht passend
                        </button>
                      </div>
                      <Link href={`/jobs/${j.id}`} style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'12px 18px',background:'var(--surface2)',border:'1px solid var(--border)',color:'var(--text2)',borderRadius:14,fontFamily:"'Syne',sans-serif",fontWeight:600,fontSize:'0.88rem',textDecoration:'none',transition:'all 0.2s'}}>
                        Vollständiges Profil → 
                      </Link>
                      <div style={{marginTop:'1.75rem',paddingTop:'1.75rem',borderTop:'1px solid var(--border)',textAlign:'center'}}>
                        <div style={{fontSize:'0.75rem',color:'var(--text3)',fontWeight:600,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:'0.5rem'}}>Fortschritt</div>
                        <div style={{fontSize:'0.95rem',color:'#fff',fontWeight:800}}>{swipeIdx + 1} / {filteredJobs.length}</div>
                        <div style={{marginTop:'0.75rem',height:4,background:'var(--surface2)',borderRadius:999,overflow:'hidden'}}>
                          <div style={{height:'100%',background:'linear-gradient(90deg,var(--green),var(--accent))',width:`${((swipeIdx + 1) / filteredJobs.length) * 100}%`,transition:'width 0.3s ease'}}/>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          ) : (
            <div style={{textAlign:'center',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:24,padding:'3rem 2rem',maxWidth:480}}>
              <div style={{width:80,height:80,background:'linear-gradient(135deg,var(--accent),rgba(124,104,250,0.5))',borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.5rem',fontSize:'2.5rem'}}>✓</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.3rem',color:'#fff',marginBottom:'0.6rem'}}>Alle Jobs bewertet!</div>
              <div style={{color:'var(--text2)',fontSize:'0.9rem',marginBottom:'2rem',lineHeight:1.6}}>Nutze den KI-Filter um die besten Matches zu priorisieren, oder starte eine neue Suche mit anderen Kriterien.</div>
              <button onClick={() => setSwipeMode(false)} style={{padding:'12px 24px',background:'var(--accent)',color:'#fff',border:'none',borderRadius:14,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'0.9rem',cursor:'pointer'}}>
                Zurück zur Übersicht
              </button>
            </div>
          )}
        </div>
      ) : (
      <div style={{display:'grid',gridTemplateColumns:'420px 1fr',gap:'1.5rem',padding:'1.5rem',minHeight:'calc(100vh - 130px)',background:'linear-gradient(135deg,rgba(124,104,250,0.02),rgba(212,168,67,0.01))'}} className="split">

        {/* JOB LIST */}
        <div style={{display:'flex',flexDirection:'column',gap:12,overflowY:'auto',paddingRight:'0.5rem'}}>
          {filteredJobs.length === 0 ? (
            <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:24,padding:'3rem 2rem',textAlign:'center'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>🔍</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',marginBottom:'0.4rem'}}>Keine Jobs gefunden</div>
              <div style={{color:'var(--text2)',fontSize:'0.84rem',marginBottom:'1rem'}}>Größeren Umkreis versuchen.</div>
              <Link href="/jobs" style={{display:'inline-block',padding:'10px 20px',background:'var(--accent)',color:'#fff',border:'none',borderRadius:12,fontSize:'0.85rem',fontWeight:700,textDecoration:'none'}}>Alle Jobs</Link>
            </div>
          ) : filteredJobs.map((j: any, i: number) => (
            <div key={j.id} onClick={() => { if(window.innerWidth < 1000) router.push(`/jobs/${j.id}`); else { setSelectedNewJob(true); setTimeout(() => setSelectedNewJob(false), 400); setSel(j) } }}
              style={{position:'relative',overflow:'hidden',cursor:'pointer',transition:'all 0.25s',borderRadius:20,background:'var(--surface)',border:`2px solid ${sel?.id===j.id?'var(--accent)':'var(--border)'}`,boxShadow:sel?.id===j.id?'0 10px 40px rgba(124,104,250,0.2)':'0 4px 15px rgba(0,0,0,0.1)'}}>
              {/* COVER */}
              <div style={{height:140,background:'linear-gradient(135deg,var(--surface2),var(--surface3))',position:'relative',overflow:'hidden'}}>
                {j.cover_image_url && <img src={j.cover_image_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',opacity:0.6}}/>}
                <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(23,23,42,0.3),rgba(23,23,42,0.8))'}}/>
                <div style={{position:'absolute',top:12,right:12,display:'flex',gap:8}}>
                  <ShareButton jobId={j.id} jobTitle={j.title} jobCompany={j.company} />
                  <FavoriteButton jobId={j.id} />
                </div>
              </div>
              {/* CONTENT */}
              <div style={{padding:'1.2rem'}}>
                <div style={{display:'flex',gap:'0.75rem',alignItems:'flex-start',marginBottom:'0.9rem',marginTop:'-2.8rem',position:'relative',zIndex:2}}>
                  {j.company_logo_url
                    ? <img src={j.company_logo_url} alt="" style={{width:56,height:56,borderRadius:14,border:'3px solid var(--surface)',flexShrink:0,objectFit:'cover',boxShadow:'0 8px 24px rgba(0,0,0,0.3)'}}/>
                    : <div className={`jlogo ${lc(i)}`} style={{width:56,height:56,borderRadius:14,border:'3px solid var(--surface)',flexShrink:0,fontSize:'1.4rem',boxShadow:'0 8px 24px rgba(0,0,0,0.3)'}}>{ll(j.company)}</div>}
                </div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'0.95rem',color:'#fff',marginBottom:'0.35rem',lineHeight:1.3}}>{j.title}</div>
                <div style={{fontSize:'0.78rem',color:'var(--text3)',marginBottom:'0.6rem',fontWeight:500}}>{j.company}</div>
                {j.salary_min>0 && <div style={{fontSize:'0.88rem',fontWeight:700,color:'var(--gold)',marginBottom:'0.6rem'}}>{j.salary_min.toLocaleString('de-DE')} – {j.salary_max.toLocaleString('de-DE')} €</div>}
                <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:'0.8rem'}}>
                  <span className={`badge ${tb(j.type)}`}>{j.type}</span>
                  <span className="badge b-office">{j.contract}</span>
                  {j.level && <span className="badge b-office">{j.level}</span>}
                </div>
                <div style={{fontSize:'0.78rem',color:'var(--text2)',display:'flex',alignItems:'center',gap:4}}>📍 {j.location}</div>
              </div>
              {sel?.id===j.id && <div style={{position:'absolute',left:0,right:0,bottom:0,height:3,background:'linear-gradient(90deg,var(--green),var(--accent))'}}/>}
            </div>
          ))}
        </div>

        {/* DETAIL */}
        {sel ? (
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:24,overflow:'hidden',display:'flex',flexDirection:'column',position:'sticky',top:80,maxHeight:'calc(100vh - 96px)',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
            {/* HERO COVER */}
            <div style={{height:220,background:'linear-gradient(135deg,var(--surface2),var(--surface3))',position:'relative',overflow:'hidden',flexShrink:0}}>
              {sel.cover_image_url && <img src={sel.cover_image_url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>}
              <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(23,23,42,0.5),rgba(23,23,42,0.85))'}}/>
              <div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'2rem 1.5rem'}}>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:'1.5rem',color:'#fff',lineHeight:1.2,marginBottom:'0.5rem'}}>{sel.title}</div>
                <div style={{color:'rgba(255,255,255,0.7)',fontSize:'0.95rem',fontWeight:500}}>{sel.company} · {sel.location}</div>
              </div>
              <div style={{position:'absolute',top:16,right:16,display:'flex',gap:8}}>
                <ShareButton jobId={sel.id} jobTitle={sel.title} jobCompany={sel.company} />
                <FavoriteButton jobId={sel.id} />
                <Link href={`/jobs/${sel.id}`} style={{width:40,height:40,background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.25)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'1rem',textDecoration:'none',backdropFilter:'blur(10px)',transition:'all 0.2s'}}>↗</Link>
              </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div style={{overflowY:'auto',flex:1,display:'flex',flexDirection:'column'}}>
              <div style={{padding:'1.75rem 1.75rem'}}>
                {/* LOGO + SALARY */}
                <div style={{display:'flex',gap:'1rem',alignItems:'flex-start',marginBottom:'1.5rem',marginTop:'-2.5rem',position:'relative',zIndex:2}}>
                  {sel.company_logo_url
                    ?<img src={sel.company_logo_url} style={{width:64,height:64,borderRadius:16,border:'3px solid var(--surface)',boxShadow:'0 10px 30px rgba(0,0,0,0.4)',flexShrink:0,objectFit:'cover'}} alt=""/>
                    :<div className={`jlogo ${lc(0)}`} style={{width:64,height:64,borderRadius:16,border:'3px solid var(--surface)',boxShadow:'0 10px 30px rgba(0,0,0,0.4)',flexShrink:0,fontSize:'1.5rem'}}>{ll(sel.company)}</div>}
                  <div style={{flex:1}}>
                    {sel.salary_min>0 && <div style={{fontSize:'1.25rem',fontWeight:800,color:'var(--gold)',marginBottom:'0.4rem'}}>{sel.salary_min.toLocaleString('de-DE')}–{sel.salary_max.toLocaleString('de-DE')} €</div>}
                    <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                      <span className={`badge ${tb(sel.type)}`}>{sel.type}</span>
                      <span className="badge b-office">{sel.contract}</span>
                      {sel.level&&<span className="badge b-office">{sel.level}</span>}
                      {sel.field&&<span className="badge b-accent">{sel.field}</span>}
                    </div>
                  </div>
                </div>

                {/* BENEFITS */}
                {sel.benefits?.length>0&&(
                  <div style={{marginBottom:'1.75rem',paddingBottom:'1.75rem',borderBottom:'1px solid var(--border)'}}>
                    <div style={{fontSize:'0.75rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--text3)',marginBottom:'0.75rem'}}>🎁 Benefits</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                      {sel.benefits.slice(0,6).map((b:string)=><div key={b} style={{padding:'8px 12px',background:'linear-gradient(135deg,rgba(61,186,126,0.15),rgba(61,186,126,0.05))',borderRadius:12,border:'1px solid rgba(61,186,126,0.2)',display:'flex',alignItems:'center',gap:8,fontSize:'0.8rem',fontWeight:600,color:'var(--green)'}}>✓ {b}</div>)}
                    </div>
                  </div>
                )}

                {/* BESCHREIBUNG */}
                <div style={{marginBottom:'1.75rem',paddingBottom:'1.75rem',borderBottom:'1px solid var(--border)'}}>
                  <div style={{fontSize:'0.75rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--text3)',marginBottom:'0.75rem'}}>📝 Aufgaben</div>
                  <div style={{fontSize:'0.9rem',color:'var(--text2)',lineHeight:1.8,whiteSpace:'pre-wrap'}}>{sel.description}</div>
                </div>

                {/* COMPANY */}
                {sel.company_description&&(
                  <div>
                    <div style={{fontSize:'0.75rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'var(--text3)',marginBottom:'0.75rem'}}>🏢 Über {sel.company}</div>
                    <div style={{fontSize:'0.9rem',color:'var(--text2)',lineHeight:1.8}}>{sel.company_description}</div>
                  </div>
                )}
              </div>
            </div>

            {/* ACTION FOOTER */}
            <div style={{padding:'1.25rem 1.75rem',borderTop:'1px solid var(--border)',display:'flex',gap:10,flexShrink:0,background:'var(--surface)',justifyContent:'stretch'}}>
              {user
                ?<a href={`mailto:?subject=Bewerbung: ${sel.title}`} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'13px 16px',background:'linear-gradient(135deg,var(--accent),rgba(124,104,250,0.8))',color:'#fff',borderRadius:14,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'0.9rem',textDecoration:'none',transition:'all 0.2s'}}>💌 Bewerben →</a>
                :<Link href="/register" style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:'13px 16px',background:'linear-gradient(135deg,var(--accent),rgba(124,104,250,0.8))',color:'#fff',borderRadius:14,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'0.9rem',textDecoration:'none',transition:'all 0.2s'}}>Anmelden →</Link>}
              <Link href="/ki-tools" style={{padding:'13px 16px',background:'var(--surface2)',border:'1px solid var(--border2)',color:'var(--text2)',borderRadius:14,fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'0.9rem',textDecoration:'none',flexShrink:0,transition:'all 0.2s'}}>KI-Match ✦</Link>
            </div>
          </div>
        ):(
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:24,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'1rem',minHeight:400,textAlign:'center',boxShadow:'0 10px 40px rgba(124,104,250,0.1)'}}>
            <div style={{fontSize:'4rem',opacity:0.15}}>◈</div>
            <div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:'var(--text3)',fontSize:'1rem',marginBottom:'0.4rem'}}>Stelle auswählen</div>
              <div style={{color:'var(--text3)',fontSize:'0.85rem'}}>Klick auf einen Job links</div>
            </div>
          </div>
        )}
      </div>
      )}
    </>
  )
}
