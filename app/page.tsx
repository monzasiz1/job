import Link from 'next/link'
import Navbar from '@/components/Navbar'

const Mark = () => (
  <div style={{width:28,height:28,background:'linear-gradient(135deg,#d4a843,#f0c060)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
    <svg viewBox="0 0 20 20" fill="none" style={{width:14,height:14}}>
      <path d="M10 2L16 5.8V12.8L10 16.5L4 12.8V5.8L10 2Z" stroke="#1a1a00" strokeWidth="1.8" fill="none"/>
      <circle cx="10" cy="9.5" r="2.8" fill="#1a1a00"/>
    </svg>
  </div>
)

export default function Home() {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid"/>
        <div style={{position:'relative',zIndex:1,maxWidth:860,margin:'0 auto'}}>
          <div className="hero-pill anim">✦ Deutschlands smarteste Jobbörse</div>
          <h1 className="hero-h anim d1">Finde deinen Job —<br/><span className="hero-gold">mit KI-Unterstützung.</span></h1>
          <p className="hero-sub anim d2">Talento kombiniert präzise Stellensuche mit KI-Analyse und intelligentem Job-Matching.</p>
          <div className="hero-ctas anim d3">
            <Link href="/register" className="btn btn-gold btn-xl">Kostenlos starten →</Link>
            <Link href="/jobs" className="btn btn-ghost btn-xl">Jobs entdecken</Link>
          </div>
          <div style={{marginTop:'2.5rem'}} className="anim d3">
            <div className="hero-stats">
              {[['12.400+','Aktive Jobs'],['4.200+','Firmen'],['89%','Erfolgsrate'],['KI','Assistent']].map(([n,l])=>(
                <div key={l} className="hstat">
                  <div className="hstat-n">{n}</div>
                  <div className="hstat-l">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <div style={{background:'var(--surface)',borderBottom:'1px solid var(--border)',padding:'1.5rem 1.5rem'}}>
        <form action="/jobs" method="get" className="search-bar">
          <div className="sf" style={{flex:2}}>
            <span style={{color:'var(--text3)',fontSize:'1rem',flexShrink:0}}>🔍</span>
            <input name="q" placeholder="Jobtitel, Fähigkeit, Unternehmen..."/>
          </div>
          <div className="sf-div"/>
          <div className="sf" style={{flex:1}}>
            <span style={{color:'var(--text3)',fontSize:'1rem',flexShrink:0}}>📍</span>
            <select name="city" style={{color:'var(--text2)',flex:1,border:'none',outline:'none',background:'transparent',fontFamily:'inherit',fontSize:'0.88rem'}}>
              <option value="">Alle Orte</option>
              <option>Berlin</option><option>München</option><option>Hamburg</option>
              <option>Köln</option><option>Düsseldorf</option><option>Frankfurt</option>
              <option>Krefeld</option><option>Remote</option>
            </select>
          </div>
          <button type="submit" style={{padding:'11px 22px',background:'var(--accent)',color:'#fff',border:'none',borderRadius:'var(--r-lg)',fontFamily:'inherit',fontWeight:700,fontSize:'0.88rem',cursor:'pointer',width:'100%',maxWidth:140}}>Suchen</button>
        </form>
      </div>

      {/* KI FEATURES */}
      <section style={{padding:'4rem 1.5rem',background:'var(--bg)'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
            <span className="section-tag">✦ KI-Features</span>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(1.6rem,3.5vw,2.4rem)',color:'#fff',letterSpacing:'-0.02em'}}>Mehr als eine Jobbörse</h2>
            <p style={{color:'var(--text2)',marginTop:'0.7rem',maxWidth:460,margin:'0.7rem auto 0',fontSize:'0.92rem',lineHeight:1.75}}>Dein persönlicher Karriere-Assistent analysiert, matched und bewirbt — vollautomatisch.</p>
          </div>
          <div className="feat-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
            {[
              {icon:'🧠',title:'Lebenslauf-Analyse',desc:'KI analysiert dein Profil und gibt konkrete Verbesserungsvorschläge.',color:'rgba(124,104,250,0.12)',border:'rgba(124,104,250,0.2)'},
              {icon:'🎯',title:'Job-Matching',desc:'Präziser Match-Score — sieh sofort wie gut du zur Stelle passt.',color:'rgba(212,168,67,0.08)',border:'rgba(212,168,67,0.2)'},
              {icon:'📍',title:'Umkreissuche',desc:'GPS-Radius — Jobs in Willich finden, die auch in Krefeld sind.',color:'rgba(240,96,144,0.08)',border:'rgba(240,96,144,0.2)'},
            ].map(f=>(
              <Link key={f.title} href="/ki-tools" style={{textDecoration:'none'}}>
                <div className="feat" style={{background:f.color,borderColor:f.border,height:'100%'}}>
                  <div className="feat-icon" style={{background:'rgba(255,255,255,0.05)'}}>{f.icon}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:'0.95rem',color:'#fff',marginBottom:'0.4rem'}}>{f.title}</div>
                  <div style={{fontSize:'0.84rem',color:'var(--text2)',lineHeight:1.7}}>{f.desc}</div>
                  <div style={{marginTop:'1rem',color:'#a080ff',fontSize:'0.8rem',fontWeight:700}}>Ausprobieren →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section style={{padding:'4rem 1.5rem',background:'var(--surface)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
        <div style={{maxWidth:860,margin:'0 auto',textAlign:'center'}}>
          <span className="section-tag">✦ So einfach</span>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(1.6rem,3vw,2.2rem)',color:'#fff',marginBottom:'2.5rem'}}>In 3 Schritten zum Job</h2>
          <div className="step-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:14}}>
            {[['01','Profil erstellen','Kostenlos registrieren — für Bewerber immer gratis.'],['02','KI analysiert','Lebenslauf hochladen, Stellen matchen lassen.'],['03','Bewerben','Stellen abspeichern und in 2 Minuten bewerben.']].map(([n,t,d])=>(
              <div key={n} className="card" style={{textAlign:'left',position:'relative'}}>
                <div style={{position:'absolute',top:'1rem',right:'1.25rem',fontFamily:"'Syne',sans-serif",fontSize:'2.5rem',fontWeight:800,color:'var(--border2)',lineHeight:1}}>{n}</div>
                <div style={{width:34,height:34,background:'var(--accent)',borderRadius:'var(--r-md)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'0.82rem',color:'#fff',marginBottom:'1rem'}}>{n}</div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',marginBottom:'0.35rem'}}>{t}</div>
                <div style={{fontSize:'0.84rem',color:'var(--text2)',lineHeight:1.7}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARBEITGEBER */}
      <section id="arbeitgeber" style={{padding:'4rem 1.5rem',background:'var(--bg)'}}>
        <div className="arb-grid" style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem',alignItems:'center'}}>
          <div>
            <span className="section-tag">✦ Für Arbeitgeber</span>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(1.6rem,3vw,2.2rem)',color:'#fff',marginBottom:'1rem'}}>Bessere Talente. Niedrigere Kosten.</h2>
            <p style={{color:'var(--text2)',lineHeight:1.8,marginBottom:'1.75rem',fontSize:'0.92rem'}}>Talento kostet einen Bruchteil von StepStone oder Indeed — mit KI-gestütztem Matching.</p>
            {[['🎯','KI-Matching','Beste Bewerber automatisch priorisiert'],['📊','Live-Dashboard','Bewerbungen in Echtzeit verfolgen'],['📍','Umkreis-Targeting','Regionale Bewerber gezielt ansprechen']].map(([ic,t,d])=>(
              <div key={t} style={{display:'flex',gap:'0.9rem',marginBottom:'0.9rem',alignItems:'flex-start'}}>
                <div style={{width:38,height:38,background:'var(--surface2)',border:'1px solid var(--border2)',borderRadius:'var(--r-md)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{ic}</div>
                <div><div style={{fontWeight:700,color:'#fff',marginBottom:2,fontSize:'0.88rem'}}>{t}</div><div style={{fontSize:'0.82rem',color:'var(--text2)'}}>{d}</div></div>
              </div>
            ))}
            <Link href="/register?role=employer" className="btn btn-gold btn-lg" style={{marginTop:'1rem',display:'inline-flex'}}>Stelle inserieren →</Link>
          </div>
          <div className="card" style={{background:'var(--surface)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem',paddingBottom:'0.9rem',borderBottom:'1px solid var(--border)'}}>
              <div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',fontSize:'0.88rem'}}>Marketing Manager</div><div style={{fontSize:'0.73rem',color:'var(--text3)'}}>Hamburg · Vollzeit</div></div>
              <span className="badge b-remote">Aktiv</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:'1rem'}}>
              {[['247','Aufrufe','#7aa2f7'],['43','Bewerbungen','var(--green)'],['8','Matches','var(--gold)']].map(([n,l,c])=>(
                <div key={l} style={{background:'var(--surface2)',borderRadius:'var(--r-md)',padding:'0.65rem',textAlign:'center'}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:'1.2rem',fontWeight:800,color:c}}>{n}</div>
                  <div style={{fontSize:'0.65rem',color:'var(--text3)',marginTop:2,fontWeight:600}}>{l}</div>
                </div>
              ))}
            </div>
            {[['SK','Sara K.','95%','rgba(30,60,175,0.2)','#7aa2f7'],['TM','Thomas M.','91%','var(--green-soft)','var(--green)'],['LH','Lena H.','88%','var(--gold-soft)','var(--gold)']].map(([i,n,s,bg,c])=>(
              <div key={n} style={{display:'flex',alignItems:'center',gap:9,padding:'7px 0',borderBottom:'1px solid var(--border)'}}>
                <div style={{width:30,height:30,borderRadius:'var(--r-sm)',background:bg,color:c,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.7rem',flexShrink:0}}>{i}</div>
                <div style={{flex:1,fontWeight:600,fontSize:'0.84rem',color:'#fff'}}>{n}</div>
                <div style={{fontWeight:700,fontSize:'0.78rem',color:c}}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREISE */}
      <section id="preise" style={{padding:'4rem 1.5rem',background:'var(--surface)',borderTop:'1px solid var(--border)'}}>
        <div style={{maxWidth:980,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
            <span className="section-tag">✦ Preise</span>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(1.6rem,3vw,2.2rem)',color:'#fff'}}>Bis zu 80% günstiger</h2>
            <p style={{color:'var(--text2)',marginTop:'0.5rem',fontSize:'0.88rem'}}>StepStone ab 1.299 € · Indeed ab 5 €/Klick · Talento ab 99 €</p>
          </div>
          <div className="price-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:14}}>
            {[
              {name:'Starter',price:'99€',period:'pro Anzeige · 30 Tage',feats:['1 Stellenanzeige','KI-Matching','50 Bewerbungen','Basis-Dashboard'],featured:false},
              {name:'Professional',price:'199€',period:'pro Monat · unbegrenzt',feats:['Unbegrenzte Anzeigen','Premium KI-Matching','Live-Dashboard','Direktchat','Videointerviews','Priority-Support'],featured:true},
              {name:'Enterprise',price:'499€',period:'pro Monat · Teams',feats:['Alles aus Professional','Multi-User-Zugang','ATS-Integration','Account-Manager'],featured:false},
            ].map(p=>(
              <div key={p.name} className={`price-card${p.featured?' featured':''}`}>
                {p.featured&&<div style={{display:'inline-block',background:'var(--accent)',color:'#fff',fontSize:'0.68rem',fontWeight:800,padding:'3px 11px',borderRadius:'var(--r-full)',marginBottom:'0.85rem',textTransform:'uppercase' as const,letterSpacing:'0.06em'}}>Beliebtestes</div>}
                <div style={{fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase' as const,letterSpacing:'0.09em',color:'var(--text3)',marginBottom:'0.6rem'}}>{p.name}</div>
                <div className="price-n">{p.price}</div>
                <div style={{fontSize:'0.78rem',color:'var(--text3)',marginBottom:'1.25rem'}}>{p.period}</div>
                <div style={{marginBottom:'1.5rem'}}>{p.feats.map(f=><div key={f} className="price-row"><span className="pc">✓</span>{f}</div>)}</div>
                <Link href="/register?role=employer" className={`btn btn-full${p.featured?' btn-accent':' btn-ghost'}`} style={{borderRadius:'var(--r-lg)'}}>Jetzt starten</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'4rem 1.5rem',background:'var(--bg)',textAlign:'center',borderTop:'1px solid var(--border)'}}>
        <div style={{maxWidth:540,margin:'0 auto'}}>
          <div className="ai-pill" style={{marginBottom:'1.5rem'}}>✦ Kostenlos starten</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(1.7rem,4vw,2.6rem)',color:'#fff',marginBottom:'1rem',letterSpacing:'-0.02em'}}>Bereit für deinen Traumjob?</h2>
          <p style={{color:'var(--text2)',fontSize:'0.92rem',marginBottom:'2rem',lineHeight:1.75}}>Für Bewerber immer kostenlos. KI-Tools inklusive.</p>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" className="btn btn-gold btn-lg">Als Bewerber starten</Link>
            <Link href="/register?role=employer" className="btn btn-ghost btn-lg">Stelle inserieren</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="foot-in">
          <div className="foot-logo"><Mark/>Talento</div>
          <div className="foot-links">
            <a href="/jobs">Jobs</a><a href="/ki-tools">KI-Tools</a><a href="/register">Registrieren</a><a href="#">Datenschutz</a><a href="#">Impressum</a>
          </div>
          <div style={{fontSize:'0.78rem',color:'var(--text3)'}}>© 2026 Talento · Made in 🇩🇪</div>
        </div>
      </footer>
    </div>
  )
}
