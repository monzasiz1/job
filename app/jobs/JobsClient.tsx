'use client'
import {useState,useRef} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'

const LC=['ja','jb','jc','jd','je','jf']
const ll=(n:string)=>n.slice(0,2).toUpperCase()
const lc=(i:number)=>LC[i%LC.length]
const tb=(t:string)=>t==='Remote'?'b-remote':t==='Hybrid'?'b-hybrid':'b-office'

export default function JobsClient({jobs,searchParams,user}:any){
  const router=useRouter()
  const [sel,setSel]=useState<any>(jobs[0]||null)
  const [geo,setGeo]=useState(false)
  const qR=useRef<HTMLInputElement>(null)
  const cR=useRef<HTMLInputElement>(null)
  const rR=useRef<HTMLSelectElement>(null)
  const tR=useRef<HTMLSelectElement>(null)

  const search=async(e:React.FormEvent)=>{
    e.preventDefault()
    const q=qR.current?.value||'',city=cR.current?.value||'',radius=rR.current?.value||'',type=tR.current?.value||''
    const p=new URLSearchParams()
    if(q)p.set('q',q);if(city)p.set('city',city);if(radius)p.set('radius',radius);if(type)p.set('type',type)
    if(city&&radius&&radius!=='999'){
      setGeo(true)
      try{const r=await fetch(`/api/geocode?city=${encodeURIComponent(city)}`);const d=await r.json();if(d.lat){p.set('clat',d.lat);p.set('clng',d.lng)}}catch{}
      setGeo(false)
    }
    router.push(`/jobs?${p}`)
  }

  return(
    <>
      {/* TOPBAR */}
      <div className="topbar" style={{gap:'0.75rem',flexWrap:'wrap'}}>
        <form onSubmit={search} style={{display:'flex',gap:8,flex:1,flexWrap:'wrap',alignItems:'center'}}>
          <div className="t-search" style={{flex:'1 1 220px'}}>
            <span style={{color:'var(--text3)'}}>🔍</span>
            <input ref={qR} defaultValue={searchParams.q} placeholder="Jobtitel, Firma..."/>
          </div>
          <div className="t-search" style={{flex:'1 1 160px'}}>
            <span style={{color:'var(--text3)'}}>📍</span>
            <input ref={cR} defaultValue={searchParams.city} placeholder="Stadt / PLZ..."/>
          </div>
          <select ref={rR} defaultValue={searchParams.radius||''} className="fi" style={{flex:'0 0 auto',width:'auto',padding:'9px 12px',border:'1px solid var(--border2)',background:'var(--surface2)'}}>
            <option value="">Umkreis</option><option value="10">+10 km</option><option value="25">+25 km</option>
            <option value="50">+50 km</option><option value="100">+100 km</option><option value="999">Bundesweit</option>
          </select>
          <select ref={tR} defaultValue={searchParams.type||''} className="fi" style={{flex:'0 0 auto',width:'auto',padding:'9px 12px',border:'1px solid var(--border2)',background:'var(--surface2)'}}>
            <option value="">Alle Typen</option><option value="Remote">Remote</option><option value="Hybrid">Hybrid</option><option value="Vor Ort">Vor Ort</option>
          </select>
          <button type="submit" className="btn btn-accent btn-sm" disabled={geo} style={{borderRadius:'var(--r-md)',flexShrink:0}}>{geo?'...':'Suchen'}</button>
        </form>
      </div>

      {/* CHIPS */}
      <div style={{padding:'0.75rem 1.5rem',display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',borderBottom:'1px solid var(--border)'}}>
        {[['Alle','/jobs'],['Remote','/jobs?type=Remote'],['Vollzeit','/jobs?contract=Vollzeit'],['Junior','/jobs?level=Junior'],['Senior','/jobs?level=Senior'],['Tech','/jobs?field=Tech+%26+IT'],['Handwerk','/jobs?field=Handwerk']].map(([l,h])=>(
          <Link key={l} href={h} className="chip">{l}</Link>
        ))}
        <span style={{marginLeft:'auto',fontSize:'0.78rem',color:'var(--text3)',fontWeight:600}}>{jobs.length} Jobs</span>
      </div>

      {/* SPLIT */}
      <div className="pg split" style={{display:'grid',gridTemplateColumns:'380px 1fr',gap:'1rem',alignItems:'start'}}>
        {/* LIST */}
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {jobs.length===0?(
            <div className="card" style={{textAlign:'center',padding:'3rem'}}>
              <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>🔍</div>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',marginBottom:'0.5rem'}}>Keine Jobs gefunden</div>
              <div style={{color:'var(--text2)',fontSize:'0.85rem',marginBottom:'1.25rem'}}>Versuche einen größeren Umkreis.</div>
              <Link href="/jobs" className="btn btn-ghost btn-sm" style={{borderRadius:'var(--r-md)'}}>Alle Jobs</Link>
            </div>
          ):jobs.map((j:any,i:number)=>(
            <div key={j.id} className={`jrow${sel?.id===j.id?' sel':''}`} onClick={()=>setSel(j)}>
              {j.company_logo_url?<div className="jlogo"><img src={j.company_logo_url} alt=""/></div>:<div className={`jlogo ${lc(i)}`}>{ll(j.company)}</div>}
              <div className="jbody">
                <div className="jtitle">{j.title}</div>
                <div className="jco">{j.company} · {j.location}</div>
                <div className="jsal">{j.salary_min>0?`${j.salary_min.toLocaleString('de-DE')} – ${j.salary_max.toLocaleString('de-DE')} €`:'Gehalt n. V.'}</div>
                <div style={{display:'flex',gap:5,flexWrap:'wrap',marginTop:5}}>
                  <span className={`badge ${tb(j.type)}`}>{j.type}</span>
                  <span className="badge b-office">{j.contract}</span>
                </div>
              </div>
              <div className="jarr">→</div>
            </div>
          ))}
        </div>

        {/* DETAIL */}
        {sel?(
          <div className="detail detail-sticky" style={{position:'sticky',top:72,maxHeight:'calc(100vh - 88px)'}}>
            <div className="detail-cover">
              {sel.cover_image_url&&<img src={sel.cover_image_url} alt=""/>}
              <div className="detail-cover-grad"/>
              <button style={{position:'absolute',top:10,right:10,background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.15)',color:'#fff',borderRadius:'var(--r-md)',width:34,height:34,cursor:'pointer',fontSize:'1rem',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(8px)'}}>★</button>
            </div>
            <div className="detail-scroll">
              <div className="detail-body">
                <div style={{display:'flex',gap:'0.75rem',alignItems:'flex-start',marginBottom:'1rem',marginTop:'-1.5rem',position:'relative',zIndex:1}}>
                  {sel.company_logo_url
                    ?<img src={sel.company_logo_url} style={{width:58,height:58,borderRadius:'var(--r-lg)',border:'3px solid var(--surface)',boxShadow:'var(--shadow)',flexShrink:0,objectFit:'cover'}} alt=""/>
                    :<div className={`jlogo ${lc(0)}`} style={{width:58,height:58,borderRadius:'var(--r-lg)',border:'3px solid var(--surface)',boxShadow:'var(--shadow)',flexShrink:0,fontSize:'1.05rem'}}>{ll(sel.company)}</div>}
                </div>
                <div className="detail-title">{sel.title}</div>
                <div className="detail-sal">{sel.salary_min>0?`${sel.salary_min.toLocaleString('de-DE')} – ${sel.salary_max.toLocaleString('de-DE')} €`:'Gehalt nach Vereinbarung'}</div>
                <div className="detail-tags">
                  <span className={`badge ${tb(sel.type)}`}>{sel.type}</span>
                  <span className="badge b-office">{sel.contract}</span>
                  <span className="badge b-office">{sel.level}</span>
                  {sel.field&&<span className="badge b-accent">{sel.field}</span>}
                  <span className="badge b-office">📍 {sel.location}</span>
                </div>
                {sel.benefits?.length>0&&(
                  <><div className="detail-h">Benefits</div>
                  <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:'0.5rem'}}>
                    {sel.benefits.map((b:string)=><span key={b} style={{padding:'3px 11px',background:'var(--green-soft)',borderRadius:'var(--r-full)',fontSize:'0.75rem',fontWeight:700,color:'var(--green)'}}>✓ {b}</span>)}
                  </div></>
                )}
                <div className="detail-h">Beschreibung</div>
                <div className="detail-desc">{sel.description}</div>
                {sel.company_description&&<><div className="detail-h">Über {sel.company}</div><div className="detail-desc">{sel.company_description}</div></>}
              </div>
            </div>
            <div className="detail-footer">
              {user
                ?<a href={`mailto:?subject=Bewerbung: ${sel.title}`} className="btn btn-accent btn-full" style={{borderRadius:'var(--r-lg)',flex:1}}>Jetzt bewerben →</a>
                :<Link href="/register" className="btn btn-accent btn-full" style={{borderRadius:'var(--r-lg)',flex:1}}>Anmelden & bewerben →</Link>}
              <Link href="/ki-tools" className="btn btn-ghost" style={{borderRadius:'var(--r-lg)',flexShrink:0}}>KI-Match ✦</Link>
              <Link href={`/jobs/${sel.id}`} className="btn btn-ghost btn-icon" style={{borderRadius:'var(--r-lg)',flexShrink:0}}>↗</Link>
            </div>
          </div>
        ):(
          <div className="card" style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'0.75rem',minHeight:380,textAlign:'center'}}>
            <div style={{fontSize:'2.5rem',opacity:0.3}}>◈</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'var(--text2)',fontSize:'0.9rem'}}>Stelle auswählen</div>
          </div>
        )}
      </div>
    </>
  )
}
