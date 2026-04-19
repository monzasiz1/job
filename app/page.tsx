import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { TalentoMark, TalentoWordmark } from '@/components/TalentoLogo'

export default function Home() {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      {/* ═══════ PROMO BAR ═══════ */}
      <div className="lp-promo-bar">
        <span>Für Bewerber komplett kostenlos — mit KI-Tools und Käuferschutz.</span>
        <Link href="/register" className="lp-promo-link">Jetzt starten</Link>
      </div>

      <Navbar />

      {/* ═══════ HERO mit Hintergrundbild ═══════ */}
      <section className="lp-hero-cc">
        <div className="lp-hero-cc-bg" />
        <div className="lp-hero-cc-inner">
          <div className="lp-hero-badge">
            <TalentoMark size={20} radius={5} />
            <span>Talento Plattform</span>
          </div>
          <h1 className="lp-hero-cc-h1">
            Dein nächster Job.<br/>
            Dein nächstes Talent.
          </h1>
          <p className="lp-hero-cc-sub">
            Intelligente Jobsuche, lokaler Marktplatz und KI-gestützte Karriere-Tools — 
            alles auf einer Plattform. Mit Treuhand-Zahlungen und Käuferschutz.
          </p>
          <div className="lp-hero-cc-ctas">
            <Link href="/register" className="lp-btn-outline">Kostenlos starten</Link>
            <Link href="/jobs" className="lp-btn-filled">Jobs entdecken</Link>
          </div>

          {/* Hero-Stats */}
          <div className="lp-hero-stats">
            <div className="lp-hero-stat">
              <div className="lp-hero-stat-n">5.000+</div>
              <div className="lp-hero-stat-l">Stellenangebote</div>
            </div>
            <div className="lp-hero-stat-sep" />
            <div className="lp-hero-stat">
              <div className="lp-hero-stat-n">12.000+</div>
              <div className="lp-hero-stat-l">Nutzer</div>
            </div>
            <div className="lp-hero-stat-sep" />
            <div className="lp-hero-stat">
              <div className="lp-hero-stat-n">98 %</div>
              <div className="lp-hero-stat-l">Zufriedenheit</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ZWEI SÄULEN: JOBSUCHE & MARKTPLATZ ═══════ */}
      <section className="lp-pillars">
        <div className="lp-pillars-grid">
          {/* Jobsuche */}
          <Link href="/jobs" className="lp-pillar">
            <div className="lp-pillar-img-wrap">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" alt="Team arbeitet zusammen" className="lp-pillar-img" />
              <div className="lp-pillar-img-overlay" />
            </div>
            <div className="lp-pillar-body">
              <span className="lp-pillar-tag">Jobsuche</span>
              <h3 className="lp-pillar-title">Finde deinen<br/>Traumjob mit KI</h3>
              <p className="lp-pillar-desc">
                Tausende Stellenangebote mit intelligentem Match-Score, Gehaltsfilter, Umkreissuche und interaktiver Kartenansicht.
              </p>
              <ul className="lp-pillar-features">
                <li><span className="lp-pillar-check">✓</span>KI-Match-Score pro Stelle</li>
                <li><span className="lp-pillar-check">✓</span>Swipe-Modus &amp; Kartenansicht</li>
                <li><span className="lp-pillar-check">✓</span>Gehalts- &amp; Umkreisfilter</li>
                <li><span className="lp-pillar-check">✓</span>Ein-Klick-Bewerbung</li>
              </ul>
              <span className="lp-pillar-cta">Jobs entdecken <span>→</span></span>
            </div>
          </Link>

          {/* Marktplatz */}
          <Link href="/marktplatz" className="lp-pillar">
            <div className="lp-pillar-img-wrap">
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80" alt="Handwerker bei der Arbeit" className="lp-pillar-img" />
              <div className="lp-pillar-img-overlay" />
            </div>
            <div className="lp-pillar-body">
              <span className="lp-pillar-tag lp-pillar-tag-green">Marktplatz</span>
              <h3 className="lp-pillar-title">Lokale Skills<br/>anbieten &amp; buchen</h3>
              <p className="lp-pillar-desc">
                Handwerk, Nachhilfe, Kreativarbeit und mehr — buche lokale Dienstleistungen oder biete deine Fähigkeiten an.
              </p>
              <ul className="lp-pillar-features">
                <li><span className="lp-pillar-check lp-check-green">✓</span>Treuhand-Zahlung mit Käuferschutz</li>
                <li><span className="lp-pillar-check lp-check-green">✓</span>Direktchat mit Anbietern</li>
                <li><span className="lp-pillar-check lp-check-green">✓</span>Bewertungen &amp; Verifizierung</li>
                <li><span className="lp-pillar-check lp-check-green">✓</span>Radius-Suche in deiner Stadt</li>
              </ul>
              <span className="lp-pillar-cta lp-pillar-cta-green">Zum Marktplatz <span>→</span></span>
            </div>
          </Link>
        </div>
      </section>

      {/* ═══════ FEATURES BENTO ═══════ */}
      <section className="lp-section-cc">
        <div className="lp-cc-container">
          <div className="lp-cc-eyebrow">Alles auf einer Plattform</div>
          <h2 className="lp-cc-h2">Mehr als eine Jobbörse.</h2>
          <p className="lp-cc-desc">Von der Jobsuche über den lokalen Marktplatz bis zu KI-Karriere-Tools — alles vernetzt.</p>
          <div className="lp-bento-cc">
            <div className="lp-bento-item lp-bento-wide">
              <div className="lp-bento-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h3 className="lp-bento-title">Smarte Jobsuche</h3>
              <p className="lp-bento-desc">Tausende Stellen mit KI-Match-Score, Swipe-Modus, Gehaltsfilter und interaktiver Kartenansicht. Finde den perfekten Job in Sekunden.</p>
            </div>
            <div className="lp-bento-item">
              <div className="lp-bento-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3 className="lp-bento-title">Interaktive Karte</h3>
              <p className="lp-bento-desc">Jobs und Marktplatz-Angebote auf einer Karte — mit Radius-Suche und Live-Filtern.</p>
            </div>
            <div className="lp-bento-item">
              <div className="lp-bento-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <h3 className="lp-bento-title">Lebenslauf-Analyse</h3>
              <p className="lp-bento-desc">KI analysiert dein Profil und gibt konkrete Verbesserungsvorschläge.</p>
            </div>
            <div className="lp-bento-item">
              <div className="lp-bento-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg>
              </div>
              <h3 className="lp-bento-title">KI-Assistent</h3>
              <p className="lp-bento-desc">Persönlicher Chatbot für Karrierefragen, Plattform-Hilfe und Vorstellungsgespräch-Tipps.</p>
            </div>
            <div className="lp-bento-item lp-bento-wide">
              <div className="lp-bento-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
              </div>
              <h3 className="lp-bento-title">Lokaler Marktplatz</h3>
              <p className="lp-bento-desc">Biete Fähigkeiten an oder buche lokale Dienstleistungen — von Nachhilfe über Handwerk bis Kreativarbeit. Mit Direktchat und Bewertungen.</p>
            </div>
            <div className="lp-bento-item">
              <div className="lp-bento-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3 className="lp-bento-title">Direktchat</h3>
              <p className="lp-bento-desc">Kommuniziere direkt mit Bewerbern, Arbeitgebern oder Dienstleistern — KI-moderiert.</p>
            </div>
            <div className="lp-bento-item">
              <div className="lp-bento-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="lp-bento-title">Käuferschutz</h3>
              <p className="lp-bento-desc">Treuhand-System, sichere Stripe-Zahlungen und kostenlose Stornierung.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SOCIAL PROOF ═══════ */}
      <section className="lp-section-cc lp-section-cc-alt">
        <div className="lp-cc-container">
          <div className="lp-cc-eyebrow">Das sagen unsere Nutzer</div>
          <h2 className="lp-cc-h2">Vertraut von Tausenden.</h2>
          <div className="lp-testimonials">
            {[
              {name:'Sarah M.', role:'UX Designerin', text:'Über Talento habe ich in 3 Tagen meinen Traumjob gefunden. Der KI-Match-Score war unfassbar genau.'},
              {name:'Marcus K.', role:'Elektriker, Marktplatz', text:'Als Handwerker bekomme ich regelmäßig Aufträge über den Marktplatz. Die Treuhand-Zahlung gibt mir Sicherheit.'},
              {name:'Lisa R.', role:'HR-Managerin', text:'Für 99 € pro Stelle erreichen wir bessere Kandidaten als auf StepStone für 1.300 €. Absolut empfehlenswert.'},
            ].map(t => (
              <div key={t.name} className="lp-testimonial">
                <p className="lp-testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="lp-testimonial-author">
                  <div className="lp-testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <div className="lp-testimonial-name">{t.name}</div>
                    <div className="lp-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SO FUNKTIONIERT'S ═══════ */}
      <section className="lp-section-cc">
        <div className="lp-cc-container">
          <div className="lp-cc-eyebrow">So einfach geht&apos;s</div>
          <h2 className="lp-cc-h2">In drei Schritten loslegen.</h2>
          <div className="lp-steps-cc">
            {[
              {num:'01', title:'Registrieren', desc:'Erstelle kostenlos dein Profil — als Bewerber immer gratis.', icon:<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
              {num:'02', title:'KI analysiert', desc:'Lade deinen Lebenslauf hoch und lass die KI passende Stellen finden.', icon:<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>},
              {num:'03', title:'Loslegen', desc:'Bewirb dich mit einem Klick oder biete deine Fähigkeiten an.', icon:<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>},
            ].map(s => (
              <div key={s.num} className="lp-step-cc">
                <div className="lp-step-cc-icon">{s.icon}</div>
                <div className="lp-step-cc-num">{s.num}</div>
                <h3 className="lp-step-cc-title">{s.title}</h3>
                <p className="lp-step-cc-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FÜR ARBEITGEBER ═══════ */}
      <section id="arbeitgeber" className="lp-section-cc lp-section-cc-alt">
        <div className="lp-cc-container">
          <div className="lp-employer-cc">
            <div className="lp-employer-cc-text">
              <div className="lp-cc-eyebrow">Für Arbeitgeber</div>
              <h2 className="lp-cc-h2" style={{textAlign:'left'}}>Bessere Talente.<br/>Niedrigere Kosten.</h2>
              <p className="lp-cc-desc" style={{textAlign:'left',maxWidth:480,margin:'0 0 2rem'}}>
                Talento kostet einen Bruchteil von StepStone oder Indeed — mit KI-gestütztem Matching und Live-Dashboard.
              </p>
              <div className="lp-employer-cc-feats">
                {[
                  ['KI-Matching','Beste Bewerber automatisch priorisiert'],
                  ['Live-Dashboard','Bewerbungen in Echtzeit verfolgen'],
                  ['Umkreis-Targeting','Regionale Bewerber gezielt erreichen'],
                  ['Direktchat','Sofort mit Bewerbern kommunizieren'],
                ].map(([t, d]) => (
                  <div key={t} className="lp-employer-cc-feat">
                    <span className="lp-employer-cc-check">✓</span>
                    <div>
                      <div className="lp-employer-cc-feat-t">{t}</div>
                      <div className="lp-employer-cc-feat-d">{d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register?role=employer" className="lp-btn-filled" style={{marginTop:'1.5rem',display:'inline-block'}}>
                Stelle inserieren
              </Link>
            </div>
            <div className="lp-pricing-cc" id="preise">
              <div className="lp-pricing-cc-label">Ab</div>
              <div className="lp-pricing-cc-price">99 €</div>
              <div className="lp-pricing-cc-period">pro Stellenanzeige · 30 Tage</div>
              <div className="lp-pricing-cc-compare">StepStone ab 1.299 € · Indeed ab 5 €/Klick</div>
              <div className="lp-pricing-cc-feats">
                {['KI-Matching inklusive','Live-Dashboard','Bis zu 50 Bewerbungen','Direktchat mit Bewerbern','Umkreis-Targeting','Kartenansicht'].map(f => (
                  <div key={f} className="lp-pricing-cc-feat">
                    <span style={{color:'var(--green)',fontWeight:600}}>✓</span> {f}
                  </div>
                ))}
              </div>
              <Link href="/register?role=employer" className="lp-btn-filled" style={{width:'100%',textAlign:'center',marginTop:'1.5rem'}}>
                Jetzt starten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA HERO MIT BILD ═══════ */}
      <section className="lp-cta-hero">
        <div className="lp-cta-hero-bg" />
        <div className="lp-cta-hero-inner">
          <h2 className="lp-cc-h2" style={{marginBottom:'1rem'}}>Bereit loszulegen?</h2>
          <p className="lp-cc-desc" style={{margin:'0 auto 2rem',color:'rgba(255,255,255,0.7)'}}>Für Bewerber immer kostenlos. KI-Tools und Käuferschutz inklusive.</p>
          <div className="lp-hero-cc-ctas" style={{justifyContent:'center'}}>
            <Link href="/register" className="lp-btn-filled">Kostenlos registrieren</Link>
            <Link href="/register?role=employer" className="lp-btn-outline">Stelle inserieren</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="foot-in">
          <div className="foot-logo"><TalentoWordmark size="sm" /></div>
          <div className="foot-links">
            <a href="/marktplatz">Marktplatz</a><a href="/jobs">Jobs</a><a href="/ki-tools">KI-Tools</a><a href="/register">Registrieren</a><a href="#">Datenschutz</a><a href="#">Impressum</a>
          </div>
          <div style={{fontSize:'0.78rem',color:'var(--text3)'}}>© 2026 Talento</div>
        </div>
      </footer>
    </div>
  )
}
