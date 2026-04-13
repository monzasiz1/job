import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
          <div className="hero-tag animate">✦ Deutschlands smarteste Jobbörse</div>
          <h1 className="hero-title animate delay-1">
            Dein Job.<br />
            <span className="hero-gold">KI-gestützt gefunden.</span>
          </h1>
          <p className="hero-sub animate delay-2">
            WorkMatch kombiniert präzise Stellensuche mit KI-Analyse, automatischen Bewerbungsschreiben und intelligentem Job-Matching — alles auf einer Plattform.
          </p>
          <div className="hero-ctas animate delay-3">
            <Link href="/register" className="btn btn-gold btn-lg">Kostenlos starten →</Link>
            <Link href="/jobs" className="btn btn-ghost btn-lg">Jobs entdecken</Link>
          </div>
          <div className="hero-stats animate delay-3">
            {[['12.400+','Aktive Jobs'],['4.200+','Unternehmen'],['89%','Vermittlungsrate'],['KI','Assistent']].map(([n,l]) => (
              <div key={l} className="hero-stat">
                <div className="hero-stat-num">{n}</div>
                <div className="hero-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section style={{ background: 'var(--dark2)', padding: '2rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <form action="/jobs" method="get" style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="search-wrap">
            <div className="search-field" style={{ flex: 2 }}>
              <span style={{ fontSize: '1rem' }}>🔍</span>
              <input name="q" placeholder="Jobtitel, Fähigkeit oder Unternehmen..." />
            </div>
            <div className="search-divider" />
            <div className="search-field" style={{ flex: 1 }}>
              <span style={{ fontSize: '1rem' }}>📍</span>
              <select name="location" style={{ border: 'none', outline: 'none', background: 'transparent', color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.9rem', flex: 1 }}>
                <option value="">Alle Orte</option>
                <option>Berlin</option><option>München</option><option>Hamburg</option>
                <option>Köln</option><option>Düsseldorf</option><option>Frankfurt</option>
                <option>Krefeld</option><option>Remote</option>
              </select>
            </div>
            <button type="submit" className="btn btn-accent" style={{ borderRadius: 12 }}>Suchen</button>
          </div>
        </form>
      </section>

      {/* KI FEATURES */}
      <section style={{ padding: '5rem 2rem', background: 'var(--dark)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">✦ KI-Features</span>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: 'white', letterSpacing: '-0.02em' }}>Mehr als eine Jobbörse</h2>
            <p style={{ color: 'var(--text2)', marginTop: '0.75rem', maxWidth: 500, margin: '0.75rem auto 0' }}>Dein persönlicher KI-Karriereassistent analysiert, matched und bewirbt — damit du deinen Traumjob findest.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { icon: '🧠', title: 'Lebenslauf-Analyse', desc: 'KI analysiert deine Stärken, Schwächen und gibt konkrete Verbesserungsvorschläge.', color: 'rgba(124,106,247,0.2)', border: 'rgba(124,106,247,0.3)' },
              { icon: '🎯', title: 'Job-Matching Score', desc: 'Erhalte einen präzisen Match-Score und siehst sofort welche Skills dir noch fehlen.', color: 'rgba(200,169,81,0.12)', border: 'rgba(200,169,81,0.25)' },
              { icon: '✍️', title: 'Anschreiben-Generator', desc: 'KI generiert ein maßgeschneidertes Anschreiben auf Basis deines Lebenslaufs.', color: 'rgba(76,175,125,0.12)', border: 'rgba(76,175,125,0.25)' },
              { icon: '📍', title: 'Umkreissuche', desc: 'Echte GPS-Umkreissuche — finde Jobs in Willich, die auch in Krefeld sind.', color: 'rgba(244,115,138,0.12)', border: 'rgba(244,115,138,0.25)' },
            ].map(f => (
              <Link key={f.title} href="/ki-tools" style={{ textDecoration: 'none' }}>
                <div className="feature-card" style={{ background: f.color, borderColor: f.border, height: '100%' }}>
                  <div className="feature-icon" style={{ background: 'rgba(255,255,255,0.06)' }}>{f.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '1rem', color: 'white', marginBottom: '0.5rem' }}>{f.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.7 }}>{f.desc}</div>
                  <div style={{ marginTop: '1.25rem', color: 'var(--accent2)', fontSize: '0.82rem', fontWeight: 700 }}>Jetzt testen →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '5rem 2rem', background: 'var(--dark2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <span className="section-label">✦ So einfach</span>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: 'white', marginBottom: '3rem' }}>In 3 Schritten zum Job</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              ['01', 'Profil erstellen', 'Registriere dich kostenlos. Für Arbeitnehmer immer gratis.'],
              ['02', 'KI analysiert', 'Lade deinen Lebenslauf hoch — die KI prüft deine Eignung für tausende Jobs.'],
              ['03', 'Bewerben', 'Generiere ein Anschreiben per KI und bewirb dich in unter 2 Minuten.'],
            ].map(([n, t, d]) => (
              <div key={n} className="card" style={{ textAlign: 'left', position: 'relative' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '3rem', fontWeight: 800, color: 'var(--border2)', position: 'absolute', top: '1rem', right: '1.25rem', lineHeight: 1 }}>{n}</div>
                <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '0.85rem', marginBottom: '1rem' }}>{n}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'white', marginBottom: '0.4rem' }}>{t}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.7 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARBEITGEBER */}
      <section id="arbeitgeber" style={{ padding: '5rem 2rem', background: 'var(--dark)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <span className="section-label">✦ Für Arbeitgeber</span>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3vw,2.4rem)', color: 'white', marginBottom: '1rem' }}>Bessere Talente. Günstigere Preise.</h2>
            <p style={{ color: 'var(--text2)', lineHeight: 1.8, marginBottom: '2rem' }}>WorkMatch kostet einen Bruchteil von StepStone oder Indeed — mit KI-gestütztem Matching für schnellere, bessere Ergebnisse.</p>
            {[['🎯','KI-Matching','Beste Kandidaten automatisch herausgefiltert'],['📊','Live-Dashboard','Bewerbungen in Echtzeit verfolgen'],['📍','Umkreis-Targeting','Bewerber aus der Region gezielt erreichen']].map(([i,t,d]) => (
              <div key={t} style={{ display: 'flex', gap: '1rem', marginBottom: '1.1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 42, height: 42, background: 'var(--dark3)', border: '1px solid var(--border2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{i}</div>
                <div><div style={{ fontWeight: 700, color: 'white', marginBottom: 3 }}>{t}</div><div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>{d}</div></div>
              </div>
            ))}
            <Link href="/register?role=employer" className="btn btn-gold btn-lg" style={{ marginTop: '0.5rem' }}>Stelle inserieren →</Link>
          </div>
          <div className="card card-solid" style={{ border: '1px solid var(--border2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'white' }}>Marketing Manager</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Hamburg · Vollzeit</div>
              </div>
              <span className="badge badge-remote">Aktiv</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: '1.25rem' }}>
              {[['247','Aufrufe','#7aa2f7'],['43','Bewerbungen','#9ece6a'],['8','Top-Matches','var(--gold2)']].map(([n,l,c]) => (
                <div key={l} style={{ background: 'var(--dark3)', borderRadius: 10, padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.3rem', fontWeight: 800, color: c }}>{n}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text3)', marginTop: 2, fontWeight: 600 }}>{l}</div>
                </div>
              ))}
            </div>
            {[['SK','Sara K.','95%','rgba(30,64,175,0.25)','#7aa2f7'],['TM','Thomas M.','91%','rgba(76,175,125,0.2)','#9ece6a'],['LH','Lena H.','88%','rgba(200,169,81,0.2)','var(--gold2)']].map(([i,n,s,bg,c]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: bg, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>{i}</div>
                <div style={{ flex: 1, fontWeight: 600, fontSize: '0.88rem', color: 'white' }}>{n}</div>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: c }}>{s} Match</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREISE */}
      <section id="preise" style={{ padding: '5rem 2rem', background: 'var(--dark2)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-label">✦ Transparente Preise</span>
            <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: 'white' }}>Bis zu 80% günstiger</h2>
            <p style={{ color: 'var(--text2)', marginTop: '0.5rem' }}>StepStone: ab 1.299 € · Indeed: ab 5 €/Klick · WorkMatch: ab 99 €</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { name:'Starter', price:'99€', period:'pro Anzeige · 30 Tage', features:['1 Stellenanzeige','KI-Matching','50 Bewerbungen','Basis-Dashboard'], featured:false },
              { name:'Professional', price:'199€', period:'pro Monat · unbegrenzt', features:['Unbegrenzte Anzeigen','Premium-KI-Matching','Live-Dashboard','Direktchat','Videointerviews','Priority-Support'], featured:true },
              { name:'Enterprise', price:'499€', period:'pro Monat · Teams', features:['Alles aus Professional','Multi-User','ATS-Integration','Account-Manager'], featured:false },
            ].map(p => (
              <div key={p.name} className={`price-card${p.featured?' featured':''}`}>
                {p.featured && <div style={{ display: 'inline-block', background: 'var(--accent)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '3px 12px', borderRadius: 100, marginBottom: '1rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Beliebtestes</div>}
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text3)', marginBottom: '0.75rem' }}>{p.name}</div>
                <div className="price-amount">{p.price}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginBottom: '1.5rem' }}>{p.period}</div>
                <div style={{ marginBottom: '1.5rem' }}>
                  {p.features.map(f => <div key={f} className="price-feature"><span className="price-check">✓</span>{f}</div>)}
                </div>
                <Link href="/register?role=employer" className={`btn btn-full${p.featured?' btn-accent':' btn-dark'}`} style={{ borderRadius: 12 }}>Jetzt starten</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 2rem', background: 'var(--dark)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: 'rgba(124,106,247,0.12)', border: '1px solid rgba(124,106,247,0.25)', color: 'var(--accent2)', borderRadius: 100, padding: '5px 15px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>✦ Kostenlos starten</div>
          <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem,4vw,3rem)', color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Bereit für deinen Traumjob?</h2>
          <p style={{ color: 'var(--text2)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.75 }}>Für Arbeitnehmer immer kostenlos. KI-Tools inklusive.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-gold btn-lg">Als Bewerber starten</Link>
            <Link href="/register?role=employer" className="btn btn-ghost btn-lg">Stelle inserieren</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-logo">
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,var(--gold),var(--gold2))', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 20 20" fill="none" style={{ width: 14, height: 14 }}><path d="M10 2L16 5.5V13L10 16.5L4 13V5.5L10 2Z" stroke="#0d1b2a" strokeWidth="1.5"/><circle cx="10" cy="9" r="3" fill="#0d1b2a"/></svg>
            </div>
            WorkMatch
          </div>
          <div className="footer-links">
            <a href="/jobs">Jobs</a><a href="/ki-tools">KI-Tools</a><a href="/register">Registrieren</a><a href="#">Datenschutz</a><a href="#">Impressum</a>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>© 2026 WorkMatch · Made in 🇩🇪</div>
        </div>
      </footer>
    </>
  )
}
