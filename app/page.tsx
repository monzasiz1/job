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

      {/* ═══════ HERO ═══════ */}
      <section className="lp-hero-cc">
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
            alles auf einer Plattform. Mit Treuhand-Zahlungen und Käuferschutz für sichere Buchungen.
          </p>
          <div className="lp-hero-cc-ctas">
            <Link href="/register" className="lp-btn-outline">Kostenlos starten</Link>
            <Link href="/jobs" className="lp-btn-filled">Jobs entdecken</Link>
          </div>
        </div>
      </section>

      {/* ═══════ SHOWCASE GRID ═══════ */}
      <section className="lp-showcase">
        <div className="lp-showcase-grid">
          <div className="lp-showcase-card lp-showcase-wide">
            <div className="lp-showcase-label">Jobsuche</div>
            <h3 className="lp-showcase-title">KI-Match-Score zeigt dir<br/>die besten Stellen</h3>
            <p className="lp-showcase-desc">Tausende Stellenangebote mit Swipe-Modus, smarten Filtern und Kartenansicht.</p>
            <Link href="/jobs" className="lp-showcase-link">Jobs entdecken →</Link>
          </div>
          <div className="lp-showcase-card">
            <div className="lp-showcase-label">Marktplatz</div>
            <h3 className="lp-showcase-title">Lokale Skills<br/>anbieten & buchen</h3>
            <p className="lp-showcase-desc">Von Nachhilfe über Handwerk bis Kreativarbeit — alles auf einer interaktiven Karte.</p>
            <Link href="/marktplatz" className="lp-showcase-link">Zum Marktplatz →</Link>
          </div>
          <div className="lp-showcase-card">
            <div className="lp-showcase-label">KI-Tools</div>
            <h3 className="lp-showcase-title">Lebenslauf analysieren,<br/>Bewerbung generieren</h3>
            <p className="lp-showcase-desc">Dein persönlicher Karriere-Assistent, der analysiert, matched und bewirbt.</p>
            <Link href="/ki-tools" className="lp-showcase-link">Ausprobieren →</Link>
          </div>
        </div>
      </section>

      {/* ═══════ KÄUFERSCHUTZ ═══════ */}
      <section className="lp-section-cc">
        <div className="lp-cc-container">
          <div className="lp-cc-eyebrow">Sicher handeln</div>
          <h2 className="lp-cc-h2">Käuferschutz inklusive.</h2>
          <p className="lp-cc-desc">Jede Buchung auf dem Marktplatz ist abgesichert. Dein Geld wird erst freigegeben, wenn alles passt.</p>
          <div className="lp-trust-cc-grid">
            {[
              {title:'Treuhand-System', desc:'Zahlung wird sicher verwahrt, bis der Auftrag abgeschlossen ist.'},
              {title:'Sichere Zahlung', desc:'Stripe-Zahlungsabwicklung mit Verschlüsselung und Betrugsschutz.'},
              {title:'Stornierung', desc:'Kostenlose Stornierung vor Auftragsstart — für beide Seiten.'},
              {title:'KI-Moderation', desc:'Chat wird KI-gestützt überwacht für ein sicheres Miteinander.'},
            ].map(t => (
              <div key={t.title} className="lp-trust-cc-item">
                <div className="lp-trust-cc-title">{t.title}</div>
                <div className="lp-trust-cc-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SO FUNKTIONIERT'S ═══════ */}
      <section className="lp-section-cc lp-section-cc-alt">
        <div className="lp-cc-container">
          <div className="lp-cc-eyebrow">So einfach geht's</div>
          <h2 className="lp-cc-h2">In drei Schritten loslegen.</h2>
          <div className="lp-steps-cc">
            {[
              {num:'01', title:'Registrieren', desc:'Erstelle kostenlos dein Profil — als Bewerber immer gratis.'},
              {num:'02', title:'KI analysiert', desc:'Lade deinen Lebenslauf hoch und lass die KI passende Stellen finden.'},
              {num:'03', title:'Loslegen', desc:'Bewirb dich mit einem Klick oder biete deine Fähigkeiten an.'},
            ].map(s => (
              <div key={s.num} className="lp-step-cc">
                <div className="lp-step-cc-num">{s.num}</div>
                <h3 className="lp-step-cc-title">{s.title}</h3>
                <p className="lp-step-cc-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FÜR ARBEITGEBER ═══════ */}
      <section id="arbeitgeber" className="lp-section-cc">
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
                {['KI-Matching inklusive','Live-Dashboard','Bis zu 50 Bewerbungen','Direktchat mit Bewerbern'].map(f => (
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

      {/* ═══════ CTA ═══════ */}
      <section className="lp-section-cc lp-section-cc-alt" style={{textAlign:'center'}}>
        <div className="lp-cc-container" style={{maxWidth:600}}>
          <h2 className="lp-cc-h2">Bereit loszulegen?</h2>
          <p className="lp-cc-desc" style={{margin:'0 auto 2rem'}}>Für Bewerber immer kostenlos. KI-Tools und Käuferschutz inklusive.</p>
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
