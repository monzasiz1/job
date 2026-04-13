import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AppShell from '@/components/AppShell'

export default async function FavoritenPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: favs } = await supabase
    .from('favorites')
    .select('*, jobs(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const jobs = (favs || []).map((f: any) => f.jobs).filter(Boolean)
  const lc = ['ja','jb','jc','jd','je','jf']
  const tb = (t: string) => t==='Remote'?'b-remote':t==='Hybrid'?'b-hybrid':'b-office'

  return (
    <AppShell>
      <div style={{position:'sticky',top:0,zIndex:100,background:'rgba(15,15,23,0.9)',backdropFilter:'blur(20px)',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:'0.75rem',padding:'0 1.5rem',height:60}}>
        <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'0.95rem',color:'#fff',flex:1}}>⭐ Meine Favoriten</span>
        <Link href="/jobs" style={{padding:'7px 14px',borderRadius:999,background:'var(--surface2)',border:'1px solid var(--border2)',color:'var(--text2)',fontSize:'0.8rem',fontWeight:600,textDecoration:'none'}}>Jobs entdecken</Link>
      </div>
      <div style={{maxWidth:860,margin:'0 auto',padding:'1.5rem'}}>
        {jobs.length===0?(
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:24,padding:'4rem 2rem',textAlign:'center'}}>
            <div style={{fontSize:'3rem',marginBottom:'1rem'}}>⭐</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',fontSize:'1.1rem',marginBottom:'0.5rem'}}>Noch keine Favoriten</div>
            <div style={{color:'var(--text2)',fontSize:'0.9rem',marginBottom:'1.5rem'}}>Klicke auf ★ bei einer Stelle um sie zu speichern.</div>
            <Link href="/jobs" style={{display:'inline-flex',padding:'11px 22px',background:'var(--accent)',color:'#fff',borderRadius:999,fontWeight:700,fontSize:'0.88rem',textDecoration:'none'}}>Jobs entdecken →</Link>
          </div>
        ):(
          <>
            <div style={{color:'var(--text3)',fontSize:'0.82rem',fontWeight:600,marginBottom:'1rem'}}>{jobs.length} gespeicherte {jobs.length===1?'Stelle':'Stellen'}</div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {jobs.map((job:any,i:number)=>(
                <div key={job.id} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:18,padding:'1.1rem 1.25rem',display:'flex',alignItems:'center',gap:'1rem'}}>
                  {job.company_logo_url
                    ?<img src={job.company_logo_url} alt="" style={{width:46,height:46,borderRadius:12,objectFit:'cover',flexShrink:0}}/>
                    :<div className={`jlogo ${lc[i%lc.length]}`} style={{width:46,height:46,flexShrink:0}}>{job.company.slice(0,2).toUpperCase()}</div>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',fontSize:'0.9rem',marginBottom:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{job.title}</div>
                    <div style={{fontSize:'0.78rem',color:'var(--text3)',marginBottom:5}}>{job.company} · {job.location}</div>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
                      <span className={`badge ${tb(job.type)}`}>{job.type}</span>
                      <span className="badge b-office">{job.contract}</span>
                      {job.salary_min>0&&<span style={{fontSize:'0.75rem',fontWeight:700,color:'var(--green)'}}>{job.salary_min.toLocaleString('de-DE')} – {job.salary_max.toLocaleString('de-DE')} €</span>}
                    </div>
                  </div>
                  <Link href={`/jobs/${job.id}`} style={{padding:'8px 16px',background:'var(--accent)',color:'#fff',borderRadius:999,fontSize:'0.8rem',fontWeight:700,textDecoration:'none',flexShrink:0}}>Ansehen →</Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppShell>
  )
}
