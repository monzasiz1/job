import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { TalentoMark, TalentoWordmark } from '@/components/TalentoLogo'

export default function Home() {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Navbar />

      {/* ═══════ HERO — Compact Brand Statement ═══════ */}
      <section className="hero" style={{position:'relative',overflow:'hidden',padding:'5rem 2rem 2.5rem'}}>
        <div className="hero-grid"/>
        <div className="hero-mesh-bg"/>

        <div style={{position:'relative',zIndex:2,maxWidth:800,margin:'0 auto',textAlign:'center'}}>

          <div className="anim" style={{display:'flex',justifyContent:'center',marginBottom:'1.5rem'}}>
            <div className="hero-logo-wrap">
              <div className="hero-logo-glow"/>
              <TalentoMark size={72} radius={20} />
            </div>
          </div>

          <div className="hero-pill anim d1">
            <span className="hero-pill-dot"/>
            Zwei Welten. Eine Plattform.
          </div>

          <h1 className="hero-h anim d1" style={{marginTop:'0.75rem',fontSize:'clamp(2rem,5vw,3.6rem)'}}>
            Jobs & Talente —<br/>
            <span className="hero-gradient-text">direkt in deiner Nähe.</span>
          </h1>

          <p className="hero-sub anim d2">
            Talento vereint intelligente Jobsuche und einen lokalen Marktplatz für Fähigkeiten & Dienstleistungen — alles mit KI-Unterstützung.
          </p>

          <div className="hero-ctas anim d3">
            <Link href="/register" className="btn btn-gold btn-xl hero-btn-glow">Kostenlos starten →</Link>
            <Link href="/jobs" className="btn btn-ghost btn-xl">Jobs entdecken</Link>
          </div>
        </div>
      </section>

      {/* ═══════ SPLIT SCREEN — Marktplatz & Jobs Showcase ═══════ */}
      <section style={{padding:'0 1.5rem 3.5rem'}}>
        <div className="lp-split">

          {/* ── LEFT: Marktplatz ── */}
          <div className="lp-panel lp-panel-markt">
            <div className="lp-panel-badge" style={{background:'var(--green-soft)',color:'var(--green)'}}>
              🏪 Marktplatz
            </div>
            <h2 className="lp-panel-title">Fähigkeiten &amp; Dienstleistungen</h2>
            <p className="lp-panel-desc">
              Entdecke lokale Angebote auf einer interaktiven Karte — von Nachhilfe über Handwerk bis Kreativ &amp; Design.
            </p>

            {/* Browser Mockup */}
            <div className="lp-mockup">
              <div className="lp-mockup-bar">
                <div className="lp-mockup-dot" style={{background:'#ff5f57'}}/>
                <div className="lp-mockup-dot" style={{background:'#febc2e'}}/>
                <div className="lp-mockup-dot" style={{background:'#28c840'}}/>
              </div>
              <div className="lp-mockup-content">
                <div className="lp-mock-split">
                  {/* Sidebar */}
                  <div className="lp-mock-sidebar">
                    <div className="lp-mock-search">🔍 Angebote durchsuchen...</div>
                    <div className="lp-mock-cats">
                      <span className="lp-cat active">Alle</span>
                      <span className="lp-cat">🔧 Handwerk</span>
                      <span className="lp-cat">📚 Nachhilfe</span>
                      <span className="lp-cat">💻 IT</span>
                    </div>
                    <div className="lp-mock-card-m">
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <span style={{fontSize:'0.85rem'}}>📚</span>
                        <div>
                          <div style={{fontWeight:700,fontSize:'0.68rem',color:'#fff'}}>Nachhilfe</div>
                          <div style={{fontSize:'0.55rem',color:'var(--text3)'}}>Krefeld · 5.1 km</div>
                        </div>
                      </div>
                      <div style={{fontSize:'0.62rem',color:'var(--gold)',fontWeight:700}}>🔥 10€</div>
                    </div>
                    <div className="lp-mock-card-m">
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <span style={{fontSize:'0.85rem'}}>🌿</span>
                        <div>
                          <div style={{fontWeight:700,fontSize:'0.68rem',color:'#fff'}}>Gartenarbeit</div>
                          <div style={{fontSize:'0.55rem',color:'var(--text3)'}}>Hamm · 90.3 km</div>
                        </div>
                      </div>
                      <div style={{fontSize:'0.62rem',color:'var(--gold)',fontWeight:700}}>🔥 20€</div>
                    </div>
                  </div>
                  {/* Map */}
                  <div className="lp-mock-map">
                    <div className="lp-mock-map-grid"/>
                    <div className="lp-mock-radius"/>
                    <div className="lp-mock-marker" style={{top:'38%',left:'42%',background:'var(--accent)',color:'var(--accent)'}}/>
                    <div className="lp-mock-marker" style={{top:'58%',left:'55%',background:'var(--green)',color:'var(--green)'}}/>
                    <div className="lp-mock-marker" style={{top:'28%',left:'68%',background:'var(--gold)',color:'var(--gold)'}}/>
                    <div className="lp-mock-popup">
                      <div style={{fontWeight:700,fontSize:'0.55rem',color:'#fff'}}>🌿 Gartenarbeit</div>
                      <div style={{fontSize:'0.5rem',color:'var(--gold)'}}>20€/std.</div>
                      <div style={{fontSize:'0.45rem',color:'var(--text3)',marginTop:1}}>📍 90.3 km entfernt</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lp-panel-features">
              <div className="lp-feat-item"><span>📍</span> Interaktive Karte</div>
              <div className="lp-feat-item"><span>🎯</span> Radius-Suche</div>
              <div className="lp-feat-item"><span>🧠</span> KI-Empfehlungen</div>
              <div className="lp-feat-item"><span>⚡</span> Sofort anbieten</div>
            </div>

            <Link href="/marktplatz" className="btn btn-xl lp-btn-markt">
              Zum Marktplatz →
            </Link>
          </div>

          {/* ── RIGHT: Jobs ── */}
          <div className="lp-panel lp-panel-jobs">
            <div className="lp-panel-badge" style={{background:'var(--accent-soft)',color:'#a080ff'}}>
              💼 Jobsuche
            </div>
            <h2 className="lp-panel-title">Stellenangebote mit KI-Matching</h2>
            <p className="lp-panel-desc">
              Durchsuche tausende Jobs mit intelligenten Filtern, Swipe-Modus und automatischem KI-Match-Score.
            </p>

            {/* Browser Mockup */}
            <div className="lp-mockup">
              <div className="lp-mockup-bar">
                <div className="lp-mockup-dot" style={{background:'#ff5f57'}}/>
                <div className="lp-mockup-dot" style={{background:'#febc2e'}}/>
                <div className="lp-mockup-dot" style={{background:'#28c840'}}/>
              </div>
              <div className="lp-mockup-content">
                <div className="lp-mock-jobs-wrap">
                  <div className="lp-mock-filters">
                    <span className="lp-filter active">Alle</span>
                    <span className="lp-filter">Remote</span>
                    <span className="lp-filter">Vollzeit</span>
                    <span className="lp-filter">Junior</span>
                    <span className="lp-filter">Tech</span>
                    <span className="lp-filter">Handwerk</span>
                  </div>
                  <div className="lp-mock-jobs-grid">
                    <div className="lp-mock-job">
                      <div className="lp-mock-job-header" style={{background:'linear-gradient(135deg,#1a1a3e,#2a2a5e)'}}>
                        <div className="lp-mock-company-logo" style={{background:'linear-gradient(135deg,var(--gold),#f0c060)'}}>💡</div>
                      </div>
                      <div className="lp-mock-job-body">
                        <div style={{fontWeight:700,fontSize:'0.68rem',color:'#fff'}}>Elektriker m/w/d</div>
                        <div style={{fontSize:'0.55rem',color:'var(--text3)'}}>Atelier Dreizehn</div>
                        <div style={{fontSize:'0.58rem',color:'var(--green)',fontWeight:600,marginTop:3}}>20.000–30.000 €</div>
                        <div style={{display:'flex',gap:3,marginTop:4,flexWrap:'wrap'}}>
                          <span className="lp-tag">Vor Ort</span>
                          <span className="lp-tag">Vollzeit</span>
                          <span className="lp-tag accent">Handwerk</span>
                        </div>
                      </div>
                    </div>
                    <div className="lp-mock-job">
                      <div className="lp-mock-job-header" style={{background:'linear-gradient(135deg,#1e1e40,#2e2e55)'}}>
                        <div className="lp-mock-company-logo" style={{background:'linear-gradient(135deg,var(--accent),#a080ff)'}}>✂️</div>
                      </div>
                      <div className="lp-mock-job-body">
                        <div style={{fontWeight:700,fontSize:'0.68rem',color:'#fff'}}>Friseur/in</div>
                        <div style={{fontSize:'0.55rem',color:'var(--text3)'}}>Atelier Dreizehn</div>
                        <div style={{fontSize:'0.58rem',color:'var(--green)',fontWeight:600,marginTop:3}}>35.000–40.000 €</div>
                        <div style={{display:'flex',gap:3,marginTop:4,flexWrap:'wrap'}}>
                          <span className="lp-tag">Vor Ort</span>
                          <span className="lp-tag">Vollzeit</span>
                          <span className="lp-tag accent">Mid</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lp-mock-detail">
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                      <span className="lp-benefit">✓ Jobrad</span>
                      <span className="lp-benefit">✓ Obstkorb</span>
                      <span className="lp-benefit">✓ Altersvorsorge</span>
                      <span className="lp-benefit">✓ Angenehmes Klima</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lp-panel-features">
              <div className="lp-feat-item"><span>🔍</span> Smarte Suche</div>
              <div className="lp-feat-item"><span>👆</span> Swipe-Modus</div>
              <div className="lp-feat-item"><span>🧠</span> KI-Match-Score</div>
              <div className="lp-feat-item"><span>🗺️</span> Kartenansicht</div>
            </div>

            <Link href="/jobs" className="btn btn-xl lp-btn-jobs">
              Jobs entdecken →
            </Link>
          </div>

        </div>
      </section>

      {/* ═══════ STATS BAR ═══════ */}
      <section style={{borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',background:'var(--surface)'}}>
        <div className="lp-stats">
          {[
            {n:'12.400+',l:'Aktive Jobs',icon:'🔥'},
            {n:'4.200+',l:'Unternehmen',icon:'🏢'},
            {n:'89%',l:'Erfolgsrate',icon:'🎯'},
            {n:'KI',l:'Assistent',icon:'🧠'},
          ].map(s=>(
            <div key={s.l} className="lp-stat">
              <span style={{fontSize:'1.1rem',marginBottom:2}}>{s.icon}</span>
              <div className="lp-stat-n">{s.n}</div>
              <div className="lp-stat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ KI FEATURES ═══════ */}
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
              {icon:'📍',title:'Umkreissuche',desc:'GPS-Radius — Jobs & Angebote in deiner Nähe finden.',color:'rgba(240,96,144,0.08)',border:'rgba(240,96,144,0.2)'},
              {icon:'🏪',title:'Marktplatz',desc:'Biete deine Fähigkeiten an oder finde lokale Dienstleistungen.',color:'rgba(61,186,126,0.08)',border:'rgba(61,186,126,0.2)'},
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
            <a href="/marktplatz">Marktplatz</a><a href="/jobs">Jobs</a><a href="/ki-tools">KI-Tools</a><a href="/register">Registrieren</a><a href="#">Datenschutz</a><a href="#">Impressum</a>
          </div>
          <div style={{fontSize:'0.78rem',color:'var(--text3)'}}>© 2026 Talento · Made in 🇩🇪</div>
        </div>
      </footer>
    </div>
  )
}
