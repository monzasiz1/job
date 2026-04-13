import {createClient} from '@/lib/supabase-server'
import {redirect} from 'next/navigation'
import Link from 'next/link'
import AppShell from '@/components/AppShell'

export default async function Dashboard() {
  const supabase = createClient()
  const {data:{user}} = await supabase.auth.getUser()
  if(!user) redirect('/login')
  const {data:profile} = await supabase.from('profiles').select('*').eq('id',user.id).single()
  if(!profile) redirect('/register')
  const isEmp = profile.role==='employer'
  let jobs:any[]=[]
  if(isEmp){const {data}=await supabase.from('jobs').select('*').eq('employer_id',user.id).order('created_at',{ascending:false});jobs=data||[]}
  const lc=['ja','jb','jc','jd']
  return (
    <AppShell>
      <div className="topbar">
        <span className="topbar-title">Dashboard</span>
        <div style={{display:'flex',gap:8}}>
          {isEmp&&<Link href="/post-job" className="btn btn-gold btn-sm">＋ Stelle inserieren</Link>}
          <Link href="/ki-tools" className="btn btn-accent btn-sm">✦ KI-Tools</Link>
        </div>
      </div>
      <div className="pg">
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12,marginBottom:'1.75rem'}}>
          {(isEmp?[
            [jobs.length,'Aktive Stellen','#7aa2f7'],
            [jobs.length*12,'Aufrufe','var(--green)'],
            [jobs.length*3,'Bewerbungen','var(--gold)'],
            ['–','KI-Matches','#a080ff'],
          ]:[
            ['0','Bewerbungen','#a080ff'],
            ['0','Gespeicherte','var(--green)'],
            ['–','Analysen','var(--gold)'],
            ['65%','Match-Score','var(--pink)'],
          ]).map(([n,l,c]:any)=>(
            <div key={l} className="stat">
              <div className="stat-n" style={{color:c}}>{n}</div>
              <div className="stat-l">{l}</div>
            </div>
          ))}
        </div>

        {isEmp?(
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'0.95rem',color:'#fff'}}>Meine Stellen</h2>
              <Link href="/post-job" className="btn btn-ghost btn-sm">＋ Neu</Link>
            </div>
            {jobs.length===0?(
              <div className="card" style={{textAlign:'center',padding:'3rem'}}>
                <div style={{fontSize:'2.5rem',marginBottom:'1rem'}}>📋</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',marginBottom:'0.5rem'}}>Noch keine Stellen</div>
                <div style={{color:'var(--text2)',fontSize:'0.86rem',marginBottom:'1.5rem'}}>Schalten Sie Ihre erste Stelle live.</div>
                <Link href="/post-job" className="btn btn-gold" style={{borderRadius:'var(--r-lg)'}}>Erste Stelle inserieren →</Link>
              </div>
            ):(
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {jobs.map((j,i)=>(
                  <div key={j.id} style={{display:'flex',alignItems:'center',gap:'1rem',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--r-lg)',padding:'0.9rem 1.1rem'}}>
                    {j.cover_image_url
                      ?<img src={j.cover_image_url} style={{width:42,height:42,borderRadius:'var(--r-md)',objectFit:'cover',flexShrink:0}} alt=""/>
                      :<div className={`jlogo ${lc[i%4]}`}>{j.company.slice(0,2).toUpperCase()}</div>}
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',fontSize:'0.87rem',marginBottom:3}}>{j.title}</div>
                      <div style={{fontSize:'0.75rem',color:'var(--text3)',display:'flex',gap:10,flexWrap:'wrap'}}><span>📍 {j.location}</span><span>⏰ {j.contract}</span></div>
                    </div>
                    <span className={`badge ${j.is_active?'b-remote':'b-office'}`}>{j.is_active?'Aktiv':'Inaktiv'}</span>
                    <Link href={`/jobs/${j.id}`} className="btn btn-ghost btn-sm" style={{borderRadius:'var(--r-md)'}}>Ansehen</Link>
                  </div>
                ))}
              </div>
            )}
          </>
        ):(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:14}}>
            {[
              {ic:'◈',t:'Jobs finden',d:'Tausende aktuelle Stellen in deiner Region.',h:'/jobs',c:'rgba(124,104,250,0.12)',b:'rgba(124,104,250,0.2)'},
              {ic:'✦',t:'KI-Assistent',d:'Lebenslauf analysieren, Stellen matchen, Anschreiben generieren.',h:'/ki-tools',c:'rgba(212,168,67,0.07)',b:'rgba(212,168,67,0.18)'},
              {ic:'◉',t:'Mein Profil',d:'Ergänze dein Profil für bessere Match-Ergebnisse.',h:`/bewerber/${user.id}`,c:'rgba(61,186,126,0.07)',b:'rgba(61,186,126,0.18)'},
            ].map(c=>(
              <Link key={c.t} href={c.h} style={{textDecoration:'none'}}>
                <div className="card card-hover" style={{background:c.c,borderColor:c.b,height:'100%'}}>
                  <div style={{fontSize:'1.75rem',marginBottom:'0.7rem',color:'#a080ff'}}>{c.ic}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',marginBottom:'0.35rem',fontSize:'0.92rem'}}>{c.t}</div>
                  <div style={{fontSize:'0.83rem',color:'var(--text2)',lineHeight:1.7}}>{c.d}</div>
                  <div style={{marginTop:'1rem',color:'#a080ff',fontSize:'0.79rem',fontWeight:700}}>Öffnen →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}
