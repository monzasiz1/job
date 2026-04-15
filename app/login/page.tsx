'use client'
import {useState,Suspense} from 'react'
import Link from 'next/link'
import {useRouter,useSearchParams} from 'next/navigation'
import {createClient} from '@/lib/supabase-browser'
import { TalentoWordmark } from '@/components/TalentoLogo'

function Form() {
  const router = useRouter()
  const sp = useSearchParams()
  const red = sp.get('redirect')||'/dashboard'
  const [form,setForm] = useState({email:'',password:''})
  const [loading,setLoading] = useState(false)
  const [err,setErr] = useState('')
  const supabase = createClient()
  const set = (k:string)=>(e:any)=>setForm(f=>({...f,[k]:e.target.value}))
  const submit = async(e:any)=>{
    e.preventDefault();setLoading(true);setErr('')
    const {error} = await supabase.auth.signInWithPassword({email:form.email,password:form.password})
    if(error){setErr('Ungültige E-Mail oder Passwort.');setLoading(false);return}
    router.push(red)
  }
  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',background:'var(--bg)'}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:10,marginBottom:'2rem'}}>
            <TalentoWordmark size="lg" />
          </Link>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'1.75rem',color:'#fff',marginBottom:'0.4rem'}}>Willkommen zurück</h1>
          <p style={{color:'var(--text2)',fontSize:'0.88rem'}}>Melde dich an, um fortzufahren.</p>
        </div>
        {err&&<div className="alert alert-err">{err}</div>}
        <form onSubmit={submit} className="card" style={{background:'var(--surface)'}}>
          <div className="fg"><label className="fl">E-Mail</label><input className="fi" type="email" value={form.email} onChange={set('email')} placeholder="deine@email.de" required/></div>
          <div className="fg"><label className="fl">Passwort</label><input className="fi" type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required/></div>
          <button type="submit" className="f-sub" disabled={loading}>{loading?'Wird angemeldet...':'Anmelden →'}</button>
        </form>
        <p style={{textAlign:'center',marginTop:'1.25rem',color:'var(--text2)',fontSize:'0.86rem'}}>
          Noch kein Konto? <Link href="/register" style={{color:'#a080ff',fontWeight:700}}>Registrieren</Link>
        </p>
      </div>
    </div>
  )
}
export default function Page(){return <Suspense><Form/></Suspense>}
