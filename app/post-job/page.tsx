'use client'
import {useState,useEffect,useRef} from 'react'
import {useRouter} from 'next/navigation'
import {createClient} from '@/lib/supabase-browser'
import AppShell from '@/components/AppShell'
import Link from 'next/link'

export default function PostJob(){
  const router=useRouter()
  const supabase=createClient()
  const [loading,setLoading]=useState(false)
  const [uploading,setUploading]=useState(false)
  const [err,setErr]=useState('')
  const [ok,setOk]=useState(false)
  const [profile,setProfile]=useState<any>(null)
  const [cover,setCover]=useState('')
  const [logo,setLogo]=useState('')
  const coverRef=useRef<HTMLInputElement>(null)
  const logoRef=useRef<HTMLInputElement>(null)
  const [form,setForm]=useState({title:'',location:'',type:'Vor Ort',contract:'Vollzeit',level:'Mid',field:'Sonstiges',salary_min:'',salary_max:'',description:'',company_description:'',company_website:'',benefits:'',cover_image_url:'',company_logo_url:''})
  useEffect(()=>{
    supabase.auth.getUser().then(async({data})=>{
      if(!data.user){router.push('/login');return}
      const {data:p}=await supabase.from('profiles').select('*').eq('id',data.user.id).single()
      if(!p||p.role!=='employer'){router.push('/dashboard');return}
      setProfile(p)
    })
  },[])
  const set=(k:string)=>(e:any)=>setForm(f=>({...f,[k]:e.target.value}))
  const upload=async(file:File,bucket:string)=>{
    const n=`${Date.now()}.${file.name.split('.').pop()}`
    const {error}=await supabase.storage.from(bucket).upload(n,file,{upsert:true})
    if(error)throw error
    return supabase.storage.from(bucket).getPublicUrl(n).data.publicUrl
  }
  const onCover=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0];if(!f)return
    setCover(URL.createObjectURL(f));setUploading(true)
    try{const u=await upload(f,'job-images');setForm(x=>({...x,cover_image_url:u}))}catch{setErr('Bild-Upload fehlgeschlagen')}
    setUploading(false)
  }
  const onLogo=async(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0];if(!f)return
    setLogo(URL.createObjectURL(f));setUploading(true)
    try{const u=await upload(f,'job-images');setForm(x=>({...x,company_logo_url:u}))}catch{setErr('Logo-Upload fehlgeschlagen')}
    setUploading(false)
  }
  const submit=async(e:any)=>{
    e.preventDefault();setLoading(true);setErr('')
    const {data:{user}}=await supabase.auth.getUser()
    if(!user){setErr('Nicht angemeldet');setLoading(false);return}
    let lat=null,lng=null
    if(form.location&&form.type!=='Remote'){try{const r=await fetch(`/api/geocode?city=${encodeURIComponent(form.location)}`);const g=await r.json();if(g.lat){lat=g.lat;lng=g.lng}}catch{}}
    const benefits=form.benefits.split('\n').map((b:string)=>b.trim()).filter(Boolean)
    const {error}=await supabase.from('jobs').insert({employer_id:user.id,title:form.title,company:profile?.company_name||'Unbekannt',location:form.location,type:form.type,contract:form.contract,level:form.level,field:form.field,salary_min:parseInt(form.salary_min)||0,salary_max:parseInt(form.salary_max)||0,description:form.description,company_description:form.company_description,company_website:form.company_website,cover_image_url:form.cover_image_url,company_logo_url:form.company_logo_url,benefits,is_active:true,lat,lng})
    if(error){setErr(error.message);setLoading(false);return}
    setOk(true);setTimeout(()=>router.push('/dashboard'),1800)
  }
  if(!profile)return<AppShell><div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'50vh',color:'var(--text2)'}}>Laden...</div></AppShell>
  return(
    <AppShell>
      <div className="topbar">
        <Link href="/dashboard" style={{color:'var(--text2)',fontSize:'0.85rem',display:'inline-flex',alignItems:'center',gap:6}}>← Dashboard</Link>
        <span className="topbar-title" style={{flex:1}}>Stelle inserieren</span>
      </div>
      <div style={{maxWidth:660,margin:'0 auto',padding:'1.5rem'}}>
        {err&&<div className="alert alert-err">{err}</div>}
        {ok&&<div className="alert alert-ok">✓ Stelle live! Weiterleitung...</div>}
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>

          {/* COVER */}
          <div className="card" style={{padding:0,overflow:'hidden'}}>
            <div style={{padding:'1.1rem 1.25rem',borderBottom:'1px solid var(--border)'}}>
              <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',fontSize:'0.9rem'}}>📸 Cover-Bild <span style={{fontWeight:400,fontSize:'0.8rem',color:'var(--text3)'}}>optional</span></div>
            </div>
            <div style={{padding:'1.25rem'}}>
              {cover
                ?<div style={{position:'relative'}}><img src={cover} style={{width:'100%',height:200,objectFit:'cover',borderRadius:'var(--r-lg)'}} alt=""/><button type="button" onClick={()=>{setCover('');setForm(f=>({...f,cover_image_url:''}))}} style={{position:'absolute',top:8,right:8,background:'rgba(0,0,0,0.7)',color:'#fff',border:'none',borderRadius:'var(--r-sm)',padding:'5px 10px',cursor:'pointer',fontSize:'0.8rem'}}>Ändern</button></div>
                :<div className="upload-zone" onClick={()=>coverRef.current?.click()}>
                  <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>🖼️</div>
                  <div style={{fontWeight:600,color:'var(--text2)',fontSize:'0.88rem'}}>Cover-Bild hochladen</div>
                  <div style={{fontSize:'0.78rem',color:'var(--text3)',marginTop:4}}>JPG, PNG · max. 5 MB</div>
                  <input ref={coverRef} type="file" accept="image/*" onChange={onCover} style={{display:'none'}}/>
                </div>}
            </div>
          </div>

          {/* FIRMA */}
          <div className="card">
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',marginBottom:'1.1rem',fontSize:'0.9rem'}}>🏢 Unternehmensprofil</div>
            <div style={{display:'grid',gridTemplateColumns:'70px 1fr',gap:'1rem',alignItems:'start',marginBottom:'1rem'}}>
              <div>
                <div className="fl">Logo</div>
                {logo
                  ?<img src={logo} onClick={()=>logoRef.current?.click()} style={{width:68,height:68,borderRadius:'var(--r-lg)',objectFit:'cover',cursor:'pointer',border:'1px solid var(--border2)'}} alt=""/>
                  :<div onClick={()=>logoRef.current?.click()} style={{width:68,height:68,borderRadius:'var(--r-lg)',border:'2px dashed rgba(124,104,250,0.25)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',background:'var(--accent-soft)',gap:3,color:'#a080ff',fontSize:'0.72rem',fontWeight:700}}>＋<br/>LOGO</div>}
                <input ref={logoRef} type="file" accept="image/*" onChange={onLogo} style={{display:'none'}}/>
              </div>
              <div>
                <div className="fg"><label className="fl">Firmenname</label><input className="fi" value={profile?.company_name||''} disabled style={{opacity:0.5}}/></div>
                <div className="fg" style={{marginBottom:0}}><label className="fl">Website</label><input className="fi" value={form.company_website} onChange={set('company_website')} placeholder="https://meinefirma.de"/></div>
              </div>
            </div>
            <div className="fg" style={{marginBottom:0}}><label className="fl">Über das Unternehmen</label><textarea className="fi" value={form.company_description} onChange={set('company_description')} placeholder="Mission, Kultur, Team..." rows={3} style={{resize:'vertical'}}/></div>
          </div>

          {/* STELLE */}
          <div className="card">
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',marginBottom:'1.1rem',fontSize:'0.9rem'}}>📋 Stellendetails</div>
            <div className="fg"><label className="fl">Jobtitel *</label><input className="fi" value={form.title} onChange={set('title')} placeholder="z.B. Friseur/in, Software Engineer..." required/></div>
            <div className="fg"><label className="fl">Ort *</label><input className="fi" value={form.location} onChange={set('location')} placeholder="z.B. Krefeld, Berlin, Remote..." required/></div>
            <div className="f-row">
              <div className="fg"><label className="fl">Arbeitsmodell</label><select className="fi" value={form.type} onChange={set('type')}><option value="Vor Ort">🏢 Vor Ort</option><option value="Remote">🌐 Remote</option><option value="Hybrid">🔀 Hybrid</option></select></div>
              <div className="fg"><label className="fl">Anstellung</label><select className="fi" value={form.contract} onChange={set('contract')}><option>Vollzeit</option><option>Teilzeit</option><option>Freelance</option><option>Praktikum</option><option>Ausbildung</option></select></div>
            </div>
            <div className="f-row">
              <div className="fg"><label className="fl">Level</label><select className="fi" value={form.level} onChange={set('level')}><option value="Junior">Junior (0–2 J.)</option><option value="Mid">Mid (2–5 J.)</option><option value="Senior">Senior (5+ J.)</option></select></div>
              <div className="fg"><label className="fl">Bereich</label><select className="fi" value={form.field} onChange={set('field')}><option>Tech & IT</option><option>Marketing</option><option>Finance</option><option>Sales</option><option>HR</option><option>Design</option><option>Handwerk</option><option>Gesundheit</option><option>Gastronomie</option><option>Logistik</option><option>Sonstiges</option></select></div>
            </div>
            <div className="fg"><label className="fl">Jahresgehalt € <span style={{fontWeight:400,textTransform:'none',letterSpacing:0,fontSize:'0.75rem',color:'var(--text3)'}}>(0 = n. V.)</span></label>
              <div className="f-row" style={{marginBottom:0}}><input className="fi" value={form.salary_min} onChange={set('salary_min')} placeholder="Min. z.B. 30000" type="number" min="0"/><input className="fi" value={form.salary_max} onChange={set('salary_max')} placeholder="Max. z.B. 42000" type="number" min="0"/></div>
            </div>
          </div>

          {/* BESCHREIBUNG */}
          <div className="card">
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',marginBottom:'1.1rem',fontSize:'0.9rem'}}>✍️ Beschreibung & Benefits</div>
            <div className="fg"><label className="fl">Stellenbeschreibung *</label><textarea className="fi" value={form.description} onChange={set('description')} placeholder="Aufgaben, Anforderungen, was die Stelle besonders macht..." rows={7} required style={{resize:'vertical'}}/></div>
            <div className="fg" style={{marginBottom:0}}><label className="fl">Benefits <span style={{fontWeight:400,textTransform:'none',letterSpacing:0,fontSize:'0.75rem',color:'var(--text3)'}}>— ein Benefit pro Zeile</span></label><textarea className="fi" value={form.benefits} onChange={set('benefits')} placeholder={"30 Tage Urlaub\nHome Office\nFirmenwagen"} rows={4} style={{resize:'vertical'}}/></div>
          </div>

          <button type="submit" className="f-sub" disabled={loading||ok||uploading}>
            {uploading?'⏳ Bild lädt...':loading?'⏳ Wird veröffentlicht...':'🚀 Stelle live schalten'}
          </button>
        </form>
      </div>
    </AppShell>
  )
}
