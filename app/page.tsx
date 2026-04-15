import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { TalentoMark, TalentoWordmark } from '@/components/TalentoLogo'

export default function Home() {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Navbar />

      {/* ═══════ HERO mit Netzwerk-Visualisierung ═══════ */}
      <section className="hero" style={{position:'relative',overflow:'hidden',padding:'5rem 2rem 4rem'}}>
        <div className="hero-grid"/>

        {/* ── Hintergrund-Glow ── */}
        <div style={{position:'absolute',top:'-15%',left:'50%',transform:'translateX(-50%)',width:'min(900px, 130vw)',height:'min(900px, 130vw)',background:'radial-gradient(ellipse at center, rgba(124,104,250,0.12) 0%, rgba(168,85,200,0.06) 35%, rgba(212,168,67,0.03) 55%, transparent 70%)',pointerEvents:'none',zIndex:0}}/>

        {/* ── Netzwerk-Partikel (CSS animated, absolut positioniert) ── */}
        <div className="hero-network" style={{position:'absolute',inset:0,zIndex:0,overflow:'hidden',pointerEvents:'none'}}>
          {/* SVG Verbindungslinien */}
          <svg style={{position:'absolute',inset:0,width:'100%',height:'100%'}} viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
            {/* Linie Logo-Mitte → links-oben */}
            <line x1="600" y1="320" x2="220" y2="140" stroke="url(#ln1)" strokeWidth="1" opacity="0.35" className="anim-line"/>
            <line x1="600" y1="320" x2="980" y2="120" stroke="url(#ln2)" strokeWidth="1" opacity="0.3" className="anim-line d2"/>
            <line x1="600" y1="320" x2="130" y2="420" stroke="url(#ln1)" strokeWidth="0.8" opacity="0.25" className="anim-line d3"/>
            <line x1="600" y1="320" x2="1060" y2="460" stroke="url(#ln2)" strokeWidth="0.8" opacity="0.25" className="anim-line d1"/>
            <line x1="600" y1="320" x2="350" y2="560" stroke="url(#ln1)" strokeWidth="0.7" opacity="0.2" className="anim-line"/>
            <line x1="600" y1="320" x2="860" y2="580" stroke="url(#ln2)" strokeWidth="0.7" opacity="0.2" className="anim-line d2"/>
            {/* Sekundäre Querverbindungen */}
            <line x1="220" y1="140" x2="980" y2="120" stroke="rgba(124,104,250,0.08)" strokeWidth="0.5" strokeDasharray="6 8"/>
            <line x1="130" y1="420" x2="350" y2="560" stroke="rgba(212,168,67,0.06)" strokeWidth="0.5" strokeDasharray="6 8"/>
            <line x1="1060" y1="460" x2="860" y2="580" stroke="rgba(168,85,200,0.06)" strokeWidth="0.5" strokeDasharray="6 8"/>
            <defs>
              <linearGradient id="ln1" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7c68fa" stopOpacity="0.6"/><stop offset="100%" stopColor="#d4a843" stopOpacity="0.1"/></linearGradient>
              <linearGradient id="ln2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#d4a843" stopOpacity="0.1"/><stop offset="100%" stopColor="#7c68fa" stopOpacity="0.6"/></linearGradient>
            </defs>
          </svg>

          {/* Schwebende Knoten (Job-Kategorien) */}
          {[
            {x:'18%',y:'18%',label:'Marketing',color:'#7c68fa',delay:'0s',size:52},
            {x:'82%',y:'15%',label:'Entwicklung',color:'#a855c8',delay:'1.5s',size:52},
            {x:'9%',y:'58%',label:'Design',color:'#d4a843',delay:'0.8s',size:46},
            {x:'89%',y:'62%',label:'Vertrieb',color:'#3dba7e',delay:'2.2s',size:46},
            {x:'28%',y:'78%',label:'Handwerk',color:'#f06090',delay:'0.4s',size:42},
            {x:'72%',y:'80%',label:'Finanzen',color:'#7aa2f7',delay:'1.8s',size:42},
          ].map(n=>(
            <div key={n.label} className="hero-node" style={{
              position:'absolute',left:n.x,top:n.y,transform:'translate(-50%,-50%)',
              animationDelay:n.delay,
              display:'flex',flexDirection:'column',alignItems:'center',gap:4,
            }}>
              <div style={{
                width:n.size,height:n.size,borderRadius:'50%',
                background:`radial-gradient(circle at 35% 35%, ${n.color}44, ${n.color}18)`,
                border:`1.5px solid ${n.color}55`,
                backdropFilter:'blur(6px)',
                display:'flex',alignItems:'center',justifyContent:'center',
                boxShadow:`0 0 24px ${n.color}30, inset 0 0 12px ${n.color}15`,
              }}>
                <div style={{width:10,height:10,borderRadius:'50%',background:n.color,boxShadow:`0 0 8px ${n.color}90`}}/>
              </div>
              <span style={{fontSize:'0.62rem',fontWeight:700,color:`${n.color}bb`,letterSpacing:'0.05em',textTransform:'uppercase'}}>{n.label}</span>
            </div>
          ))}
        </div>

        {/* ── Haupt-Content ── */}
        <div style={{position:'relative',zIndex:1,maxWidth:860,margin:'0 auto',textAlign:'center'}}>

          {/* Großes Logo als Hero-Centerpiece */}
          <div className="anim" style={{display:'flex',justifyContent:'center',marginBottom:'1.5rem'}}>
            <div style={{position:'relative'}}>
              <div style={{position:'absolute',inset:-18,borderRadius:32,background:'radial-gradient(circle, rgba(124,104,250,0.2) 0%, rgba(212,168,67,0.08) 50%, transparent 70%)',filter:'blur(16px)',pointerEvents:'none'}}/>
              <TalentoMark size={88} radius={22} />
            </div>
          </div>

          <div className="hero-pill anim d1">✦ Deutschlands smarteste Jobbörse</div>
          <h1 className="hero-h anim d1" style={{marginTop:'0.5rem'}}>Finde deinen Job —<br/><span className="hero-gold">mit KI-Unterstützung.</span></h1>
          <p className="hero-sub anim d2">Talento kombiniert präzise Stellensuche mit KI-Analyse und intelligentem Job-Matching — dein ganzes Karriere-Netzwerk, eine Plattform.</p>
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
          <div className="foot-logo"><TalentoWordmark size="sm" /></div>
          <div className="foot-links">
            <a href="/jobs">Jobs</a><a href="/ki-tools">KI-Tools</a><a href="/register">Registrieren</a><a href="#">Datenschutz</a><a href="#">Impressum</a>
          </div>
          <div style={{fontSize:'0.78rem',color:'var(--text3)'}}>© 2026 Talento · Made in 🇩🇪</div>
        </div>
      </footer>
    </div>
  )
}
