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
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-grid"/>
        <div style={{position:'relative',zIndex:1,maxWidth:860,margin:'0 auto'}}>
          <div className="hero-pill anim">✦ Deutschlands smarteste Jobbörse</div>
          <h1 className="hero-h anim d1">Finde deinen Job —<br/><span className="hero-gold">mit KI-Unterstützung.</span></h1>
          <p className="hero-sub anim d2">WorkMatch kombiniert präzise Stellensuche mit KI-Lebenslaufanalyse, intelligentem Job-Matching und automatischen Bewerbungsschreiben.</p>
          <div className="hero-ctas anim d3">
            <Link href="/register" className="btn btn-gold btn-xl">Kostenlos starten →</Link>
            <Link href="/jobs" className="btn btn-ghost btn-xl">Jobs entdecken</Link>
          </div>
          <div className="hero-stats anim d3">
            {[['12.400+','Aktive Jobs'],['4.200+','Firmen'],['89%','Erfolgsrate'],['KI','Assistent']].map(([n,l])=>(
              <div key={l} className="hstat">
                <div className="hstat-n">{n}</div>
                <div className="hstat-l">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEARCH ── */}
      <div style={{background:'var(--surface)',borderBottom:'1px solid var(--border)',padding:'1.5rem 2rem'}}>
        <form action="/jobs" method="get" className="search-bar">
          <div className="sf" style={{flex:2}}>
            <span style={{color:'var(--text3)',fontSize:'1rem'}}>🔍</span>
            <input name="q" placeholder="Jobtitel, Fähigkeit, Unternehmen..."/>
          </div>
          <div className="sf-div"/>
          <div className="sf" style={{flex:1}}>
            <span style={{color:'var(--text3)',fontSize:'1rem'}}>📍</span>
            <select name="city" style={{color:'var(--text2)'}}>
              <option value="">Alle Orte</option>
              <option>Berlin</option><option>München</option><option>Hamburg</option>
              <option>Köln</option><option>Düsseldorf</option><option>Frankfurt</option>
              <option>Krefeld</option><option>Remote</option>
            </select>
          </div>
          <button type="submit" className="btn btn-accent" style={{borderRadius:'var(--r-lg)',padding:'11px 22px'}}>Suchen</button>
        </form>
      </div>

      {/* ── KI FEATURES ── */}
      <section style={{padding:'5rem 2rem',background:'var(--bg)'}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <span className="section-tag">✦ KI-Features</span>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(1.8rem,3.5vw,2.6rem)',color:'#fff',letterSpacing:'-0.02em'}}>Mehr als eine Jobbörse</h2>
            <p style={{color:'var(--text2)',marginTop:'0.7rem',maxWidth:460,margin:'0.7rem auto 0',lineHeight:1.75,fontSize:'0.95rem'}}>Dein persönlicher Karriere-Assistent analysiert, matched und bewirbt — vollautomatisch.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:14}}>
            {[
              {icon:'🧠',title:'Lebenslauf-Analyse',desc:'KI analysiert dein Profil und gibt konkrete Verbesserungsvorschläge.',color:'rgba(124,104,250,0.12)',border:'rgba(124,104,250,0.2)'},
              {icon:'🎯',title:'Job-Matching',desc:'Präziser Match-Score — sieh sofort wie gut du zu einer Stelle passt.',color:'rgba(212,168,67,0.08)',border:'rgba(212,168,67,0.2)'},
              {icon:'✍️',title:'Anschreiben-KI',desc:'Maßgeschneidertes Anschreiben per KI — in Sekunden fertig.',color:'rgba(61,186,126,0.08)',border:'rgba(61,186,126,0.2)'},
              {icon:'📍',title:'Umkreissuche',desc:'Echter GPS-Radius — Jobs in Willich finden, die in Krefeld sind.',color:'rgba(240,96,144,0.08)',border:'rgba(240,96,144,0.2)'},
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

      {/* ── STEPS ── */}
      <section style={{padding:'5rem 2rem',background:'var(--surface)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
        <div style={{maxWidth:860,margin:'0 auto',textAlign:'center'}}>
          <span className="section-tag">✦ So einfach</span>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(1.7rem,3vw,2.4rem)',color:'#fff',marginBottom:'3rem'}}>In 3 Schritten zum Job</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:14}}>
            {[['01','Profil erstellen','Kostenlos registrieren — für Bewerber immer gratis.'],['02','KI analysiert','Lebenslauf hochladen, Stellen matchen lassen.'],['03','Bewerben','Anschreiben generieren und in 2 Minuten bewerben.']].map(([n,t,d])=>(
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

      {/* ── ARBEITGEBER ── */}
      <section id="arbeitgeber" style={{padding:'5rem 2rem',background:'var(--bg)'}}>
        <div style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3.5rem',alignItems:'center'}}>
          <div>
            <span className="section-tag">✦ Für Arbeitgeber</span>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(1.7rem,3vw,2.4rem)',color:'#fff',marginBottom:'1rem'}}>Bessere Talente. Niedrigere Kosten.</h2>
            <p style={{color:'var(--text2)',lineHeight:1.8,marginBottom:'2rem',fontSize:'0.93rem'}}>WorkMatch kostet einen Bruchteil von StepStone oder Indeed — mit KI-gestütztem Matching für schnellere Ergebnisse.</p>
            {[['🎯','KI-Kandidaten-Matching','Beste Bewerber automatisch priorisiert'],['📊','Live-Dashboard','Bewerbungen in Echtzeit verfolgen'],['📍','Umkreis-Targeting','Regionale Bewerber gezielt ansprechen']].map(([ic,t,d])=>(
              <div key={t} style={{display:'flex',gap:'1rem',marginBottom:'1rem',alignItems:'flex-start'}}>
                <div style={{width:40,height:40,background:'var(--surface2)',border:'1px solid var(--border2)',borderRadius:'var(--r-md)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.05rem',flexShrink:0}}>{ic}</div>
                <div><div style={{fontWeight:700,color:'#fff',marginBottom:3,fontSize:'0.9rem'}}>{t}</div><div style={{fontSize:'0.83rem',color:'var(--text2)'}}>{d}</div></div>
              </div>
            ))}
            <Link href="/register?role=employer" className="btn btn-gold btn-lg" style={{marginTop:'0.75rem'}}>Stelle inserieren →</Link>
          </div>
          <div className="card" style={{background:'var(--surface)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.1rem',paddingBottom:'1rem',borderBottom:'1px solid var(--border)'}}>
              <div><div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',fontSize:'0.9rem'}}>Marketing Manager</div><div style={{fontSize:'0.75rem',color:'var(--text3)'}}>Hamburg · Vollzeit</div></div>
              <span className="badge b-remote">Aktiv</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:'1.1rem'}}>
              {[['247','Aufrufe','#7aa2f7'],['43','Bewerbungen','var(--green)'],['8','Matches','var(--gold)']].map(([n,l,c])=>(
                <div key={l} style={{background:'var(--surface2)',borderRadius:'var(--r-md)',padding:'0.7rem',textAlign:'center'}}>
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:'1.25rem',fontWeight:800,color:c}}>{n}</div>
                  <div style={{fontSize:'0.67rem',color:'var(--text3)',marginTop:2,fontWeight:600}}>{l}</div>
                </div>
              ))}
            </div>
            {[['SK','Sara K.','95%','rgba(30,60,175,0.2)','#7aa2f7'],['TM','Thomas M.','91%','var(--green-soft)','var(--green)'],['LH','Lena H.','88%','var(--gold-soft)','var(--gold)']].map(([i,n,s,bg,c])=>(
              <div key={n} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 0',borderBottom:'1px solid var(--border)'}}>
                <div style={{width:32,height:32,borderRadius:'var(--r-sm)',background:bg,color:c,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.72rem',flexShrink:0}}>{i}</div>
                <div style={{flex:1,fontWeight:600,fontSize:'0.85rem',color:'#fff'}}>{n}</div>
                <div style={{fontWeight:700,fontSize:'0.8rem',color:c}}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREISE ── */}
      <section id="preise" style={{padding:'5rem 2rem',background:'var(--surface)',borderTop:'1px solid var(--border)'}}>
        <div style={{maxWidth:980,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <span className="section-tag">✦ Preise</span>
            <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(1.7rem,3vw,2.4rem)',color:'#fff'}}>Bis zu 80% günstiger</h2>
            <p style={{color:'var(--text2)',marginTop:'0.5rem',fontSize:'0.9rem'}}>StepStone ab 1.299 € · Indeed ab 5 €/Klick · WorkMatch ab 99 €</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:14}}>
            {[
              {name:'Starter',price:'99€',period:'pro Anzeige · 30 Tage',feats:['1 Stellenanzeige','KI-Matching','50 Bewerbungen','Basis-Dashboard'],featured:false},
              {name:'Professional',price:'199€',period:'pro Monat · unbegrenzt',feats:['Unbegrenzte Anzeigen','Premium KI-Matching','Live-Dashboard','Direktchat','Videointerviews','Priority-Support'],featured:true},
              {name:'Enterprise',price:'499€',period:'pro Monat · Teams',feats:['Alles aus Professional','Multi-User-Zugang','ATS-Integration','Account-Manager'],featured:false},
            ].map(p=>(
              <div key={p.name} className={`price-card${p.featured?' featured':''}`}>
                {p.featured&&<div style={{display:'inline-block',background:'var(--accent)',color:'#fff',fontSize:'0.68rem',fontWeight:800,padding:'3px 11px',borderRadius:'var(--r-full)',marginBottom:'0.85rem',letterSpacing:'0.06em',textTransform:'uppercase'}}>Beliebtestes</div>}
                <div style={{fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.09em',color:'var(--text3)',marginBottom:'0.6rem'}}>{p.name}</div>
                <div className="price-n">{p.price}</div>
                <div style={{fontSize:'0.78rem',color:'var(--text3)',marginBottom:'1.25rem'}}>{p.period}</div>
                <div style={{marginBottom:'1.5rem'}}>{p.feats.map(f=><div key={f} className="price-row"><span className="pc">✓</span>{f}</div>)}</div>
                <Link href="/register?role=employer" className={`btn btn-full${p.featured?' btn-accent':' btn-ghost'}`} style={{borderRadius:'var(--r-lg)'}}>Jetzt starten</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{padding:'5rem 2rem',background:'var(--bg)',textAlign:'center',borderTop:'1px solid var(--border)'}}>
        <div style={{maxWidth:540,margin:'0 auto'}}>
          <div className="ai-pill" style={{marginBottom:'1.5rem'}}>✦ Kostenlos starten</div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(1.8rem,4vw,2.8rem)',color:'#fff',marginBottom:'1rem',letterSpacing:'-0.02em'}}>Bereit für deinen Traumjob?</h2>
          <p style={{color:'var(--text2)',fontSize:'0.95rem',marginBottom:'2rem',lineHeight:1.75}}>Für Bewerber immer kostenlos. KI-Tools inklusive.</p>
          <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" className="btn btn-gold btn-xl">Als Bewerber starten</Link>
            <Link href="/register?role=employer" className="btn btn-ghost btn-xl">Stelle inserieren</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="foot-in">
          <div className="foot-logo"><Mark/>WorkMatch</div>
          <div className="foot-links">
            <a href="/jobs">Jobs</a><a href="/ki-tools">KI-Tools</a><a href="/register">Registrieren</a><a href="#">Datenschutz</a><a href="#">Impressum</a>
          </div>
          <div style={{fontSize:'0.78rem',color:'var(--text3)'}}>© 2026 WorkMatch · Made in 🇩🇪</div>
        </div>
      </footer>
    </>
  )
}
