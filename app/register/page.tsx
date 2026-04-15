'use client'
import {useState,Suspense} from 'react'
import Link from 'next/link'
import {useRouter,useSearchParams} from 'next/navigation'
import {createClient} from '@/lib/supabase-browser'

function Form() {
  const router = useRouter()
  const sp = useSearchParams()
  const [role,setRole] = useState(sp.get('role')==='employer'?'employer':'jobseeker')
  const [form,setForm] = useState({full_name:'',company_name:'',email:'',password:''})
  const [loading,setLoading] = useState(false)
  const [err,setErr] = useState('')
  const supabase = createClient()
  const set = (k:string)=>(e:any)=>setForm(f=>({...f,[k]:e.target.value}))
  const submit = async(e:any)=>{
    e.preventDefault();setLoading(true);setErr('')
    const {data,error} = await supabase.auth.signUp({email:form.email,password:form.password,options:{emailRedirectTo:`${location.origin}/dashboard`}})
    if(error){setErr(error.message);setLoading(false);return}
    if(data.user){
      const {error:pe} = await supabase.from('profiles').insert({id:data.user.id,email:form.email,full_name:form.full_name,role,company_name:role==='employer'?form.company_name:null})
      if(pe){setErr(pe.message);setLoading(false);return}
    }
    router.push('/dashboard')
  }
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',background:'var(--bg)'}}>
      <div style={{width:'100%',maxWidth:440}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:10,marginBottom:'2rem'}}>
            <div style={{width:36,height:36,background:'linear-gradient(135deg,#d4a843,#f0c060)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg viewBox="0 0 20 20" fill="none" style={{width:18,height:18}}><path d="M10 2L16 5.8V12.8L10 16.5L4 12.8V5.8L10 2Z" stroke="#1a1a00" strokeWidth="1.8" fill="none"/><circle cx="10" cy="9.5" r="2.8" fill="#1a1a00"/></svg>
            </div>
            <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.15rem',color:'#fff'}}>Talento</span>
          </Link>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.75rem',color:'#fff',marginBottom:'0.4rem'}}>Konto erstellen</h1>
          <p style={{color:'var(--text2)',fontSize:'0.88rem'}}>Kostenlos starten — in unter 2 Minuten.</p>
        </div>
        <div className="tabs" style={{marginBottom:'1.1rem'}}>
          {(['jobseeker','employer'] as const).map(r=>(
            <button key={r} onClick={()=>setRole(r)} className={`tab${role===r?' on':''}`}>
              {r==='jobseeker'?'🔍 Bewerber':'🏢 Arbeitgeber'}
            </button>
          ))}
        </div>
        {err&&<div className="alert alert-err">{err}</div>}
        <form onSubmit={submit} className="card" style={{background:'var(--surface)'}}>
          <div className="fg"><label className="fl">{role==='employer'?'Ihr Name':'Vollständiger Name'}</label><input className="fi" value={form.full_name} onChange={set('full_name')} placeholder="Max Mustermann" required/></div>
          {role==='employer'&&<div className="fg"><label className="fl">Firmenname</label><input className="fi" value={form.company_name} onChange={set('company_name')} placeholder="Muster GmbH" required/></div>}
          <div className="fg"><label className="fl">E-Mail</label><input className="fi" type="email" value={form.email} onChange={set('email')} placeholder="max@email.de" required/></div>
          <div className="fg"><label className="fl">Passwort (mind. 8 Zeichen)</label><input className="fi" type="password" value={form.password} onChange={set('password')} placeholder="Sicheres Passwort" minLength={8} required/></div>
          <button type="submit" className="f-sub" disabled={loading} style={{background:role==='employer'?'var(--gold)':'var(--accent)',color:role==='employer'?'#000':'#fff'}}>
            {loading?'Wird registriert...':role==='employer'?'14 Tage kostenlos testen →':'Kostenlos registrieren →'}
          </button>
        </form>
        <p style={{textAlign:'center',marginTop:'1.25rem',color:'var(--text2)',fontSize:'0.86rem'}}>
          Bereits registriert? <Link href="/login" style={{color:'#a080ff',fontWeight:700}}>Anmelden</Link>
        </p>
      </div>
    </div>
  )
}
export default function Page(){return <Suspense><Form/></Suspense>}
