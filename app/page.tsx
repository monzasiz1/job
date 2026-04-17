import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { TalentoMark, TalentoWordmark } from '@/components/TalentoLogo'

export default function Home() {
  return (
    <div style={{minHeight:'100vh',background:'var(--bg)'}}>
      <Navbar />

      {/* ═══════ HERO ═══════ */}
      <section className="lp-apple-hero">
        <div className="lp-apple-hero-bg" />
        <div className="lp-apple-hero-inner">
          <div className="anim" style={{marginBottom:'2rem'}}>
            <TalentoMark size={56} radius={16} />
          </div>
          <h1 className="lp-apple-h1 anim d1">
            Jobs finden.<br />
            <span className="lp-apple-gradient">Talente entdecken.</span>
          </h1>
          <p className="lp-apple-sub anim d2">
            Intelligente Jobsuche und lokaler Marktplatz — vereint auf einer Plattform. Mit KI-Unterstützung und Käuferschutz.
          </p>
          <div className="lp-apple-ctas anim d3">
            <Link href="/register" className="btn btn-gold btn-xl">Kostenlos starten</Link>
            <Link href="/jobs" className="btn btn-ghost btn-xl">Jobs entdecken</Link>
          </div>
        </div>
      </section>

      {/* ═══════ ZWEI WELTEN ═══════ */}
      <section className="lp-apple-section">
        <div className="lp-apple-container">
          <p className="lp-apple-eyebrow">Zwei Welten. Eine Plattform.</p>
          <h2 className="lp-apple-h2">Alles, was du brauchst.</h2>
          <div className="lp-zwei-grid">

            <div className="lp-zwei-card">
              <div className="lp-zwei-icon" style={{background:'var(--green-soft)',color:'var(--green)'}}>🏪</div>
              <h3 className="lp-zwei-title">Marktplatz</h3>
              <p className="lp-zwei-desc">
                Lokale Dienstleistungen und Fähigkeiten — auf einer interaktiven Karte. Von Nachhilfe über Handwerk bis Kreativarbeit.
              </p>
              <div className="lp-zwei-features">
                <span>📍 Kartenansicht</span>
                <span>🎯 Radius-Suche</span>
                <span>🧠 KI-Empfehlungen</span>
                <span>💬 Direktchat</span>
              </div>
              <Link href="/marktplatz" className="lp-zwei-link" style={{color:'var(--green)'}}>
                Zum Marktplatz →
              </Link>
            </div>

            <div className="lp-zwei-card">
              <div className="lp-zwei-icon" style={{background:'var(--accent-soft)',color:'#a080ff'}}>💼</div>
              <h3 className="lp-zwei-title">Jobsuche</h3>
              <p className="lp-zwei-desc">
                Tausende Stellenangebote mit KI-Match-Score, Swipe-Modus und smarten Filtern. Dein nächster Job — in Sekunden.
              </p>
              <div className="lp-zwei-features">
                <span>🔍 Smarte Suche</span>
                <span>👆 Swipe-Modus</span>
                <span>🧠 KI-Matching</span>
                <span>🗺️ Kartenansicht</span>
              </div>
              <Link href="/jobs" className="lp-zwei-link" style={{color:'#a080ff'}}>
                Jobs entdecken →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════ KÄUFERSCHUTZ ═══════ */}
      <section className="lp-apple-section lp-apple-section-alt">
        <div className="lp-apple-container">
          <p className="lp-apple-eyebrow">Sicher handeln.</p>
          <h2 className="lp-apple-h2">Käuferschutz inklusive.</h2>
          <p className="lp-apple-desc">Jede Buchung auf dem Marktplatz ist abgesichert. Dein Geld wird erst freigegeben, wenn alles passt.</p>
          <div className="lp-trust-grid">
            {[
              {icon:'🛡️', title:'Treuhand-System', desc:'Zahlung wird sicher verwahrt, bis der Auftrag abgeschlossen ist.'},
              {icon:'💳', title:'Sichere Zahlung', desc:'Stripe-Zahlungsabwicklung mit Verschlüsselung und Betrugsschutz.'},
              {icon:'↩️', title:'Stornierung', desc:'Kostenlose Stornierung vor Auftragsstart — für beide Seiten.'},
              {icon:'🤖', title:'KI-Moderation', desc:'Chat wird KI-gestützt überwacht für ein sicheres Miteinander.'},
            ].map(t => (
              <div key={t.title} className="lp-trust-item">
                <div className="lp-trust-icon">{t.icon}</div>
                <div className="lp-trust-title">{t.title}</div>
                <div className="lp-trust-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SO FUNKTIONIERT'S ═══════ */}
      <section className="lp-apple-section">
        <div className="lp-apple-container">
          <p className="lp-apple-eyebrow">So einfach geht's.</p>
          <h2 className="lp-apple-h2">In drei Schritten loslegen.</h2>
          <div className="lp-steps-row">
            {[
              {num:'1', title:'Registrieren', desc:'Erstelle kostenlos dein Profil — als Bewerber immer gratis.'},
              {num:'2', title:'KI analysiert', desc:'Lade deinen Lebenslauf hoch und lass die KI passende Stellen finden.'},
              {num:'3', title:'Loslegen', desc:'Bewirb dich mit einem Klick oder biete deine Fähigkeiten an.'},
            ].map((s, i) => (
              <div key={s.num} className="lp-step-card">
                <div className="lp-step-num">{s.num}</div>
                <h3 className="lp-step-title">{s.title}</h3>
                <p className="lp-step-desc">{s.desc}</p>
                {i < 2 && <div className="lp-step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ KI-FEATURES ═══════ */}
      <section className="lp-apple-section lp-apple-section-alt">
        <div className="lp-apple-container">
          <p className="lp-apple-eyebrow">KI-gestützt.</p>
          <h2 className="lp-apple-h2">Mehr als eine Jobbörse.</h2>
          <p className="lp-apple-desc">Dein persönlicher Karriere-Assistent, der analysiert, matched und bewirbt.</p>
          <div className="lp-ki-grid">
            {[
              {icon:'🧠', title:'Lebenslauf-Analyse', desc:'Profil analysieren und konkrete Verbesserungsvorschläge erhalten.', color:'rgba(124,104,250,0.1)'},
              {icon:'🎯', title:'Job-Matching', desc:'Präziser Match-Score zeigt, wie gut du zur Stelle passt.', color:'rgba(212,168,67,0.08)'},
              {icon:'✍️', title:'Bewerbungs-Generator', desc:'KI erstellt individuelle Anschreiben in Sekunden.', color:'rgba(240,96,144,0.08)'},
              {icon:'🏪', title:'Marktplatz-KI', desc:'Intelligente Empfehlungen für Angebote und Gesuche.', color:'rgba(61,186,126,0.08)'},
            ].map(f => (
              <Link key={f.title} href="/ki-tools" className="lp-ki-card" style={{background:f.color}}>
                <div className="lp-ki-icon">{f.icon}</div>
                <div className="lp-ki-title">{f.title}</div>
                <div className="lp-ki-desc">{f.desc}</div>
                <span className="lp-ki-link">Ausprobieren →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FÜR ARBEITGEBER ═══════ */}
      <section id="arbeitgeber" className="lp-apple-section">
        <div className="lp-apple-container">
          <div className="lp-employer-grid">
            <div>
              <p className="lp-apple-eyebrow">Für Arbeitgeber.</p>
              <h2 className="lp-apple-h2" style={{textAlign:'left'}}>Bessere Talente.<br/>Niedrigere Kosten.</h2>
              <p className="lp-apple-desc" style={{textAlign:'left',maxWidth:480}}>
                Talento kostet einen Bruchteil von StepStone oder Indeed — mit KI-gestütztem Matching und Live-Dashboard.
              </p>
              <div className="lp-employer-feats">
                {[
                  ['🎯','KI-Matching','Beste Bewerber automatisch priorisiert'],
                  ['📊','Live-Dashboard','Bewerbungen in Echtzeit verfolgen'],
                  ['📍','Umkreis-Targeting','Regionale Bewerber gezielt erreichen'],
                ].map(([ic, t, d]) => (
                  <div key={t as string} className="lp-employer-feat">
                    <div className="lp-employer-feat-icon">{ic}</div>
                    <div>
                      <div className="lp-employer-feat-title">{t}</div>
                      <div className="lp-employer-feat-desc">{d}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/register?role=employer" className="btn btn-gold btn-lg" style={{marginTop:'1.5rem'}}>
                Stelle inserieren →
              </Link>
            </div>
            <div className="lp-pricing-box">
              <div className="lp-pricing-eyebrow">Ab</div>
              <div className="lp-pricing-price">99 €</div>
              <div className="lp-pricing-period">pro Stellenanzeige · 30 Tage</div>
              <div className="lp-pricing-compare">
                StepStone ab 1.299 € · Indeed ab 5 €/Klick
              </div>
              <div className="lp-pricing-features">
                {['KI-Matching inklusive','Live-Dashboard','Bis zu 50 Bewerbungen','Direktchat mit Bewerbern'].map(f => (
                  <div key={f} className="lp-pricing-feat-row">
                    <span style={{color:'var(--green)',fontWeight:700}}>✓</span> {f}
                  </div>
                ))}
              </div>
              <Link href="/register?role=employer" className="btn btn-accent btn-full" style={{marginTop:'1.5rem',borderRadius:'var(--r-lg)'}}>
                Jetzt starten
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="lp-apple-section lp-apple-section-alt" style={{textAlign:'center'}}>
        <div className="lp-apple-container" style={{maxWidth:600}}>
          <h2 className="lp-apple-h2">Bereit loszulegen?</h2>
          <p className="lp-apple-desc">Für Bewerber immer kostenlos. KI-Tools und Käuferschutz inklusive.</p>
          <div className="lp-apple-ctas" style={{justifyContent:'center'}}>
            <Link href="/register" className="btn btn-gold btn-lg">Kostenlos registrieren</Link>
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
