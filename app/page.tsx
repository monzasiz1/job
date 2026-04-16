import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { TalentoMark, TalentoWordmark } from '@/components/TalentoLogo'

export default function Home() {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Navbar />

      {/* ═══════ HERO — Full-Screen Immersive ═══════ */}
      <section className="lp-hero">
        <div className="lp-hero-aurora"/>
        <div className="lp-hero-grid"/>
        <div className="lp-hero-glow lp-hero-glow-1"/>
        <div className="lp-hero-glow lp-hero-glow-2"/>
        <div className="lp-hero-glow lp-hero-glow-3"/>

        {/* Orbital Rings */}
        <div className="lp-hero-orbital">
          <div className="lp-orbital-ring lp-ring-1"/>
          <div className="lp-orbital-ring lp-ring-2"/>
          <div className="lp-orbital-ring lp-ring-3"/>
          <div className="lp-orbital-dot lp-dot-1"/>
          <div className="lp-orbital-dot lp-dot-2"/>
          <div className="lp-orbital-dot lp-dot-3"/>
          <div className="lp-orbital-dot lp-dot-4"/>
        </div>

        {/* Floating Glass Cards */}
        <div className="lp-float-card lp-float-1">
          <span>🧠</span><span style={{fontSize:'0.72rem',fontWeight:600,color:'#ccc'}}>KI-Match 95%</span>
        </div>
        <div className="lp-float-card lp-float-2">
          <span>📍</span><span style={{fontSize:'0.72rem',fontWeight:600,color:'#ccc'}}>3.2 km entfernt</span>
        </div>
        <div className="lp-float-card lp-float-3">
          <span>⚡</span><span style={{fontSize:'0.72rem',fontWeight:600,color:'#ccc'}}>Sofort verfügbar</span>
        </div>

        <div className="lp-hero-content">
          <div className="anim" style={{display:'flex',justifyContent:'center',marginBottom:'2rem'}}>
            <div className="lp-hero-logo-wrap">
              <div className="lp-hero-logo-pulse"/>
              <TalentoMark size={80} radius={22} />
            </div>
          </div>

          <div className="lp-hero-pill anim d1">
            <span className="lp-hero-pill-dot"/>
            Die Zukunft der Jobsuche
          </div>

          <h1 className="lp-hero-h1 anim d1">
            Finde Jobs. Entdecke Talente.<br/>
            <span className="lp-hero-gradient">Alles mit KI.</span>
          </h1>

          <p className="lp-hero-sub anim d2">
            Talento vereint die smarteste Jobsuche Deutschlands mit einem lokalen Marktplatz für Fähigkeiten — powered by KI.
          </p>

          <div className="lp-hero-ctas anim d3">
            <Link href="/register" className="lp-hero-btn-primary">
              <span>Kostenlos starten</span>
              <span className="lp-hero-btn-arrow">→</span>
            </Link>
            <Link href="/jobs" className="lp-hero-btn-secondary">Jobs entdecken</Link>
          </div>

          {/* Inline Stats */}
          <div className="lp-hero-stats anim d3">
            {[
              {n:'12.400+',l:'Aktive Jobs'},
              {n:'4.200+',l:'Unternehmen'},
              {n:'89%',l:'Erfolgsrate'},
            ].map(s=>(
              <div key={s.l} className="lp-hero-stat">
                <div className="lp-hero-stat-n">{s.n}</div>
                <div className="lp-hero-stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-hero-scroll-hint">
          <div className="lp-scroll-mouse">
            <div className="lp-scroll-dot"/>
          </div>
        </div>
      </section>

      {/* ═══════ TRUST BAR — Marquee ═══════ */}
      <section className="lp-trust-bar">
        <div className="lp-trust-label">Vertraut von innovativen Teams</div>
        <div className="lp-marquee-wrap">
          <div className="lp-marquee">
            {['TechVentures','DigitalFirst','Kreativbüro','InnoLabs','SmartHire','FlexWork','CodeCraft','GrowthHQ','TechVentures','DigitalFirst','Kreativbüro','InnoLabs','SmartHire','FlexWork','CodeCraft','GrowthHQ'].map((name,i)=>(
              <div key={i} className="lp-trust-logo">
                <span style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'0.85rem',color:'var(--text3)',letterSpacing:'-0.02em'}}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SPLIT SCREEN — Premium Showcase ═══════ */}
      <section className="lp-showcase-section">
        <div style={{textAlign:'center',marginBottom:'3.5rem',position:'relative',zIndex:2}}>
          <div className="lp-section-tag">✦ Zwei Welten. Eine Plattform.</div>
          <h2 className="lp-section-h2">
            Wähle deinen <span className="lp-hero-gradient">Weg</span>
          </h2>
        </div>

        <div className="lp-split">
          {/* ── LEFT: Marktplatz ── */}
          <div className="lp-panel lp-panel-markt">
            <div className="lp-panel-glow lp-panel-glow-green"/>
            <div className="lp-panel-badge" style={{background:'var(--green-soft)',color:'var(--green)'}}>
              🏪 Marktplatz
            </div>
            <h2 className="lp-panel-title">Fähigkeiten &amp; Dienstleistungen</h2>
            <p className="lp-panel-desc">
              Entdecke lokale Angebote auf einer interaktiven Karte — von Nachhilfe über Handwerk bis Kreativ &amp; Design.
            </p>

            {/* Browser Mockup */}
            <div className="lp-mockup lp-mockup-float">
              <div className="lp-mockup-bar">
                <div className="lp-mockup-dot" style={{background:'#ff5f57'}}/>
                <div className="lp-mockup-dot" style={{background:'#febc2e'}}/>
                <div className="lp-mockup-dot" style={{background:'#28c840'}}/>
                <div className="lp-mockup-url">talento.de/marktplatz</div>
              </div>
              <div className="lp-mockup-content">
                <div className="lp-mock-split">
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
                          <div style={{fontWeight:700,fontSize:'0.68rem',color:'#fff'}}>Nachhilfe Mathe</div>
                          <div style={{fontSize:'0.55rem',color:'var(--text3)'}}>Krefeld · 5.1 km</div>
                        </div>
                      </div>
                      <div style={{fontSize:'0.62rem',color:'var(--green)',fontWeight:700}}>15€/h</div>
                    </div>
                    <div className="lp-mock-card-m">
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <span style={{fontSize:'0.85rem'}}>🌿</span>
                        <div>
                          <div style={{fontWeight:700,fontSize:'0.68rem',color:'#fff'}}>Gartenarbeit</div>
                          <div style={{fontSize:'0.55rem',color:'var(--text3)'}}>Düsseldorf · 12 km</div>
                        </div>
                      </div>
                      <div style={{fontSize:'0.62rem',color:'var(--green)',fontWeight:700}}>20€/h</div>
                    </div>
                  </div>
                  <div className="lp-mock-map">
                    <div className="lp-mock-map-grid"/>
                    <div className="lp-mock-radius"/>
                    <div className="lp-mock-marker" style={{top:'38%',left:'42%',background:'var(--accent)',color:'var(--accent)'}}/>
                    <div className="lp-mock-marker" style={{top:'58%',left:'55%',background:'var(--green)',color:'var(--green)'}}/>
                    <div className="lp-mock-marker" style={{top:'28%',left:'68%',background:'var(--gold)',color:'var(--gold)'}}/>
                    <div className="lp-mock-marker" style={{top:'72%',left:'35%',background:'var(--pink)',color:'var(--pink)'}}/>
                    <div className="lp-mock-popup">
                      <div style={{fontWeight:700,fontSize:'0.55rem',color:'#fff'}}>🌿 Gartenarbeit</div>
                      <div style={{fontSize:'0.5rem',color:'var(--green)'}}>20€/std.</div>
                      <div style={{fontSize:'0.45rem',color:'var(--text3)',marginTop:1}}>📍 12 km entfernt</div>
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
            <div className="lp-panel-glow lp-panel-glow-purple"/>
            <div className="lp-panel-badge" style={{background:'var(--accent-soft)',color:'#a080ff'}}>
              💼 Jobsuche
            </div>
            <h2 className="lp-panel-title">Stellenangebote mit KI-Matching</h2>
            <p className="lp-panel-desc">
              Durchsuche tausende Jobs mit intelligenten Filtern, Swipe-Modus und automatischem KI-Match-Score.
            </p>

            <div className="lp-mockup lp-mockup-float">
              <div className="lp-mockup-bar">
                <div className="lp-mockup-dot" style={{background:'#ff5f57'}}/>
                <div className="lp-mockup-dot" style={{background:'#febc2e'}}/>
                <div className="lp-mockup-dot" style={{background:'#28c840'}}/>
                <div className="lp-mockup-url">talento.de/jobs</div>
              </div>
              <div className="lp-mockup-content">
                <div className="lp-mock-jobs-wrap">
                  <div className="lp-mock-filters">
                    <span className="lp-filter active">Alle</span>
                    <span className="lp-filter">Remote</span>
                    <span className="lp-filter">Vollzeit</span>
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
                        <div style={{fontSize:'0.55rem',color:'var(--text3)'}}>TechVentures GmbH</div>
                        <div style={{fontSize:'0.58rem',color:'var(--green)',fontWeight:600,marginTop:3}}>45.000–55.000 €</div>
                        <div style={{display:'flex',gap:3,marginTop:4,flexWrap:'wrap'}}>
                          <span className="lp-tag">Vor Ort</span>
                          <span className="lp-tag accent">95% Match</span>
                        </div>
                      </div>
                    </div>
                    <div className="lp-mock-job">
                      <div className="lp-mock-job-header" style={{background:'linear-gradient(135deg,#1e1e40,#2e2e55)'}}>
                        <div className="lp-mock-company-logo" style={{background:'linear-gradient(135deg,var(--accent),#a080ff)'}}>✂️</div>
                      </div>
                      <div className="lp-mock-job-body">
                        <div style={{fontWeight:700,fontSize:'0.68rem',color:'#fff'}}>Friseur/in</div>
                        <div style={{fontSize:'0.55rem',color:'var(--text3)'}}>Salon Kreativ</div>
                        <div style={{fontSize:'0.58rem',color:'var(--green)',fontWeight:600,marginTop:3}}>35.000–40.000 €</div>
                        <div style={{display:'flex',gap:3,marginTop:4,flexWrap:'wrap'}}>
                          <span className="lp-tag">Vollzeit</span>
                          <span className="lp-tag accent">88% Match</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="lp-mock-detail">
                    <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                      <span className="lp-benefit">✓ Jobrad</span>
                      <span className="lp-benefit">✓ Altersvorsorge</span>
                      <span className="lp-benefit">✓ Remote Option</span>
                      <span className="lp-benefit">✓ 30 Tage Urlaub</span>
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

      {/* ═══════ BENTO GRID — KI Features ═══════ */}
      <section className="lp-bento-section">
        <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
          <div className="lp-section-tag">✦ KI-Superkräfte</div>
          <h2 className="lp-section-h2">
            Dein unfairer <span className="lp-hero-gradient">Vorteil</span>
          </h2>
          <p style={{color:'var(--text2)',marginTop:'0.75rem',maxWidth:480,margin:'0.75rem auto 0',fontSize:'0.95rem',lineHeight:1.75}}>
            Talento nutzt künstliche Intelligenz, um dir den perfekten Job oder das beste Angebot zu finden.
          </p>
        </div>

        <div className="lp-bento">
          <div className="lp-bento-card lp-bento-wide">
            <div className="lp-bento-icon lp-bento-icon-purple">🧠</div>
            <h3 className="lp-bento-title">KI-Lebenslauf-Analyse</h3>
            <p className="lp-bento-desc">Lade deinen Lebenslauf hoch und erhalte sofort konkrete Verbesserungsvorschläge — powered by AI.</p>
            <div className="lp-bento-visual">
              <div className="lp-bento-bar" style={{width:'92%',background:'linear-gradient(90deg,var(--accent),#a78bfa)'}}/>
              <div className="lp-bento-bar" style={{width:'78%',background:'linear-gradient(90deg,var(--gold),#f0c060)'}}/>
              <div className="lp-bento-bar" style={{width:'85%',background:'linear-gradient(90deg,var(--green),#6ee7b7)'}}/>
            </div>
          </div>
          <div className="lp-bento-card">
            <div className="lp-bento-icon lp-bento-icon-gold">🎯</div>
            <h3 className="lp-bento-title">Job-Matching</h3>
            <p className="lp-bento-desc">Match-Score zeigt dir sofort, wie gut du auf die Stelle passt.</p>
            <div className="lp-bento-ring">
              <span className="lp-bento-ring-n">95%</span>
            </div>
          </div>
          <div className="lp-bento-card">
            <div className="lp-bento-icon lp-bento-icon-pink">📍</div>
            <h3 className="lp-bento-title">Umkreissuche</h3>
            <p className="lp-bento-desc">GPS-basierte Radius-Suche für Jobs &amp; Marktplatz-Angebote.</p>
          </div>
          <div className="lp-bento-card">
            <div className="lp-bento-icon lp-bento-icon-green">🏪</div>
            <h3 className="lp-bento-title">Marktplatz</h3>
            <p className="lp-bento-desc">Biete deine Skills an oder finde Dienstleistungen in deiner Nähe.</p>
          </div>
          <div className="lp-bento-card lp-bento-wide">
            <div className="lp-bento-icon lp-bento-icon-blue">✨</div>
            <h3 className="lp-bento-title">KI-Bewerbungsgenerator</h3>
            <p className="lp-bento-desc">Generiere perfekte Anschreiben in Sekunden — individuell auf jede Stelle zugeschnitten.</p>
            <div className="lp-bento-typing">
              <div className="lp-typing-line lp-typing-1"/>
              <div className="lp-typing-line lp-typing-2"/>
              <div className="lp-typing-line lp-typing-3"/>
              <div className="lp-typing-cursor"/>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ STEPS — Timeline ═══════ */}
      <section style={{padding:'5rem 1.5rem',background:'var(--surface)',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',position:'relative',overflow:'hidden'}}>
        <div className="lp-steps-glow"/>
        <div style={{maxWidth:900,margin:'0 auto',textAlign:'center',position:'relative',zIndex:2}}>
          <div className="lp-section-tag">✦ So einfach</div>
          <h2 className="lp-section-h2" style={{marginBottom:'3.5rem'}}>
            In 3 Schritten zum <span className="lp-hero-gradient">Traumjob</span>
          </h2>
          <div className="lp-steps">
            {[
              {n:'01',icon:'🚀',t:'Profil erstellen',d:'Kostenlos registrieren, Lebenslauf hochladen — für Bewerber immer gratis.'},
              {n:'02',icon:'🧠',t:'KI analysiert',d:'Unsere KI matched dich automatisch mit den besten Stellen und Angeboten.'},
              {n:'03',icon:'🎯',t:'Durchstarten',d:'Bewirb dich in 2 Minuten oder biete deine Fähigkeiten auf dem Marktplatz an.'},
            ].map((s,i)=>(
              <div key={s.n} className="lp-step">
                <div className="lp-step-number-wrap">
                  <div className="lp-step-number">{s.n}</div>
                  {i < 2 && <div className="lp-step-line"/>}
                </div>
                <div className="lp-step-icon">{s.icon}</div>
                <h3 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,color:'#fff',marginBottom:'0.4rem',fontSize:'1.1rem'}}>{s.t}</h3>
                <p style={{fontSize:'0.88rem',color:'var(--text2)',lineHeight:1.7}}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ ARBEITGEBER ═══════ */}
      <section id="arbeitgeber" style={{padding:'5rem 1.5rem',background:'var(--bg)',position:'relative',overflow:'hidden'}}>
        <div className="arb-grid" style={{maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem',alignItems:'center'}}>
          <div>
            <div className="lp-section-tag">✦ Für Arbeitgeber</div>
            <h2 className="lp-section-h2" style={{textAlign:'left',marginBottom:'1rem'}}>
              Bessere Talente.<br/><span className="lp-hero-gradient">Niedrigere Kosten.</span>
            </h2>
            <p style={{color:'var(--text2)',lineHeight:1.8,marginBottom:'2rem',fontSize:'0.95rem'}}>
              Talento kostet einen Bruchteil von StepStone oder Indeed — mit KI-gestütztem Matching für präzisere Ergebnisse.
            </p>
            {[
              ['🎯','KI-Matching','Beste Bewerber automatisch priorisiert'],
              ['📊','Live-Dashboard','Bewerbungen in Echtzeit verfolgen'],
              ['📍','Umkreis-Targeting','Regionale Bewerber gezielt ansprechen'],
            ].map(([ic,t,d])=>(
              <div key={t} className="lp-arb-feat">
                <div className="lp-arb-feat-icon">{ic}</div>
                <div>
                  <div style={{fontWeight:700,color:'#fff',marginBottom:2,fontSize:'0.9rem'}}>{t}</div>
                  <div style={{fontSize:'0.84rem',color:'var(--text2)'}}>{d}</div>
                </div>
              </div>
            ))}
            <Link href="/register?role=employer" className="lp-hero-btn-primary" style={{marginTop:'1.5rem',display:'inline-flex'}}>
              <span>Stelle inserieren</span>
              <span className="lp-hero-btn-arrow">→</span>
            </Link>
          </div>
          <div className="lp-arb-mockup">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.2rem',paddingBottom:'1rem',borderBottom:'1px solid var(--border)'}}>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,color:'#fff',fontSize:'0.95rem'}}>Marketing Manager</div>
                <div style={{fontSize:'0.75rem',color:'var(--text3)',marginTop:2}}>Hamburg · Vollzeit · Remote</div>
              </div>
              <span className="badge b-remote" style={{fontSize:'0.72rem',padding:'5px 12px'}}>✓ Aktiv</span>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:'1.2rem'}}>
              {[['247','Aufrufe','#7aa2f7'],['43','Bewerbungen','var(--green)'],['8','Top-Matches','var(--gold)']].map(([n,l,c])=>(
                <div key={l} className="lp-arb-stat">
                  <div style={{fontFamily:"'Syne',sans-serif",fontSize:'1.4rem',fontWeight:800,color:c}}>{n}</div>
                  <div style={{fontSize:'0.68rem',color:'var(--text3)',marginTop:3,fontWeight:600}}>{l}</div>
                </div>
              ))}
            </div>
            {[['SK','Sara K.','95%','rgba(124,104,250,0.15)','var(--accent)'],['TM','Thomas M.','91%','var(--green-soft)','var(--green)'],['LH','Lena H.','88%','var(--gold-soft)','var(--gold)']].map(([i,n,s,bg,c])=>(
              <div key={n} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid var(--border)'}}>
                <div style={{width:34,height:34,borderRadius:'var(--r-md)',background:bg,color:c,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.75rem',flexShrink:0}}>{i}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:'0.88rem',color:'#fff'}}>{n}</div>
                  <div style={{fontSize:'0.68rem',color:'var(--text3)'}}>Beworben vor 2h</div>
                </div>
                <div style={{fontWeight:800,fontSize:'0.85rem',color:c}}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PREISE ═══════ */}
      <section id="preise" style={{padding:'5rem 1.5rem',background:'var(--surface)',borderTop:'1px solid var(--border)',position:'relative',overflow:'hidden'}}>
        <div className="lp-pricing-glow"/>
        <div style={{maxWidth:1000,margin:'0 auto',position:'relative',zIndex:2}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div className="lp-section-tag">✦ Preise</div>
            <h2 className="lp-section-h2">
              Bis zu <span className="lp-hero-gradient">80% günstiger</span>
            </h2>
            <p style={{color:'var(--text2)',marginTop:'0.6rem',fontSize:'0.92rem'}}>
              StepStone ab 1.299 € · Indeed ab 5 €/Klick · <strong style={{color:'var(--gold)'}}>Talento ab 99 €</strong>
            </p>
          </div>
          <div className="price-grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:18}}>
            {[
              {name:'Starter',price:'99€',period:'pro Anzeige · 30 Tage',feats:['1 Stellenanzeige','KI-Matching','50 Bewerbungen','Basis-Dashboard'],featured:false},
              {name:'Professional',price:'199€',period:'pro Monat · unbegrenzt',feats:['Unbegrenzte Anzeigen','Premium KI-Matching','Live-Dashboard','Direktchat','Videointerviews','Priority-Support'],featured:true},
              {name:'Enterprise',price:'499€',period:'pro Monat · Teams',feats:['Alles aus Professional','Multi-User-Zugang','ATS-Integration','Account-Manager'],featured:false},
            ].map(p=>(
              <div key={p.name} className={`lp-price-card${p.featured?' lp-price-featured':''}`}>
                {p.featured&&<div className="lp-price-badge">Beliebtestes</div>}
                <div className="lp-price-name">{p.name}</div>
                <div className="lp-price-amount">{p.price}</div>
                <div style={{fontSize:'0.8rem',color:'var(--text3)',marginBottom:'1.5rem'}}>{p.period}</div>
                <div style={{marginBottom:'1.75rem'}}>
                  {p.feats.map(f=>(
                    <div key={f} className="lp-price-row"><span className="lp-price-check">✓</span>{f}</div>
                  ))}
                </div>
                <Link href="/register?role=employer" className={p.featured ? 'lp-hero-btn-primary lp-price-cta' : 'lp-hero-btn-secondary lp-price-cta'}>
                  {p.featured ? <><span>Jetzt starten</span><span className="lp-hero-btn-arrow">→</span></> : 'Jetzt starten'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA — Final ═══════ */}
      <section className="lp-final-cta">
        <div className="lp-final-cta-bg"/>
        <div style={{position:'relative',zIndex:2,maxWidth:600,margin:'0 auto',textAlign:'center'}}>
          <div className="lp-hero-pill" style={{marginBottom:'1.5rem'}}>
            <span className="lp-hero-pill-dot"/>
            Kostenlos für Bewerber
          </div>
          <h2 style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:'clamp(2rem,4.5vw,3.2rem)',color:'#fff',marginBottom:'1rem',letterSpacing:'-0.03em',lineHeight:1.1}}>
            Bereit für deinen<br/><span className="lp-hero-gradient">Traumjob?</span>
          </h2>
          <p style={{color:'var(--text2)',fontSize:'1rem',marginBottom:'2.5rem',lineHeight:1.75}}>
            Registriere dich jetzt und nutze alle KI-Tools — komplett kostenlos.
          </p>
          <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" className="lp-hero-btn-primary">
              <span>Jetzt registrieren</span>
              <span className="lp-hero-btn-arrow">→</span>
            </Link>
            <Link href="/register?role=employer" className="lp-hero-btn-secondary">Stelle inserieren</Link>
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
