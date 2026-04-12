import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-blob" />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,77,28,0.2)', border: '1px solid rgba(255,77,28,0.4)', color: '#ff7a50', borderRadius: 100, padding: '6px 16px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            ✦ Jobbörse der nächsten Generation
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.5rem', color: 'white', maxWidth: 700 }}>
            Deinen Job <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', color: 'var(--accent)' }}>smarter</em> finden. Nicht teurer.
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', maxWidth: 520, marginBottom: '2.5rem' }}>
            WorkMatch verbindet Talente mit Top-Arbeitgebern — schneller, günstiger und intelligenter als jede herkömmliche Jobbörse.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '3rem' }}>
            <Link href="/register" className="btn btn-primary btn-lg">Jetzt kostenlos bewerben</Link>
            <Link href="/register?role=employer" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}>Job inserieren →</Link>
          </div>
          <div style={{ display: 'flex', gap: '2.5rem' }}>
            {[['12.400+', 'Aktive Jobs'], ['4.200+', 'Unternehmen'], ['89%', 'Vermittlungsrate']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'white' }}>{n}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section style={{ background: 'var(--bg2)', padding: '2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink2)', marginBottom: '0.75rem' }}>Jobs suchen</p>
          <form action="/jobs" method="get" className="search-bar">
            <input name="q" type="text" placeholder="Jobtitel, Fähigkeit oder Unternehmen..." style={{ flex: 1 }} />
            <select name="location">
              <option value="">Alle Orte</option>
              <option>Berlin</option><option>München</option><option>Hamburg</option>
              <option>Frankfurt</option><option>Remote</option>
            </select>
            <button type="submit" className="btn btn-dark" style={{ margin: 8, borderRadius: 10 }}>Suchen</button>
          </form>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-label">✦ So einfach geht's</div>
          <h2 className="section-title">In 3 Schritten zum neuen Job</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
            {[
              ['1', 'Profil erstellen', 'Lade deinen Lebenslauf hoch oder erstelle dein Profil in unter 3 Minuten.'],
              ['2', 'Passende Jobs entdecken', 'Unser Matching-Algorithmus zeigt dir Jobs, die wirklich zu dir passen.'],
              ['3', 'Direkt bewerben', 'Mit einem Klick bewerben. Kein Doppel-Upload, kein Kopieren.'],
            ].map(([n, t, d]) => (
              <div key={n} className="card">
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--ink)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, marginBottom: '1.25rem' }}>{n}</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{t}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--ink2)' }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARBEITGEBER */}
      <section id="arbeitgeber" style={{ background: 'var(--bg2)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div className="section-label">✦ Für Arbeitgeber</div>
            <h2 className="section-title">Bessere Kandidaten. Niedrigere Kosten.</h2>
            <p style={{ color: 'var(--ink2)', marginBottom: '2rem' }}>Schalten Sie Ihr Stellenangebot für einen Bruchteil des Preises von StepStone oder Indeed — mit besseren Ergebnissen.</p>
            {[['🎯', 'KI-gestütztes Matching', 'Unser Algorithmus filtert automatisch die besten Kandidaten heraus.'],
              ['📊', 'Live-Dashboard', 'Verfolgen Sie Bewerbungen in Echtzeit.'],
              ['💬', 'Direktkommunikation', 'Chatten Sie direkt mit Kandidaten.']
            ].map(([icon, t, d]) => (
              <div key={t} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'white', border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{icon}</div>
                <div><div style={{ fontWeight: 700, marginBottom: 4 }}>{t}</div><div style={{ fontSize: '0.9rem', color: 'var(--ink2)' }}>{d}</div></div>
              </div>
            ))}
            <Link href="/register?role=employer" className="btn btn-dark btn-lg" style={{ marginTop: '1rem' }}>Jetzt Job inserieren →</Link>
          </div>
          <div className="card" style={{ boxShadow: '8px 8px 0 var(--ink)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 700 }}>Marketing Manager — Hamburg</span>
              <span className="badge badge-green">Aktiv</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: '1.25rem' }}>
              {[['247', 'Aufrufe', 'var(--blue)'], ['43', 'Bewerbungen', 'var(--green)'], ['8', 'Shortlist', 'var(--amber)']].map(([n, l, c]) => (
                <div key={l} style={{ background: 'var(--bg)', borderRadius: 10, padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: c }}>{n}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--ink2)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink2)', marginBottom: 10 }}>Top-Kandidaten</div>
            {[['SK', 'Sara Kaya', '5 Jahre · München', '95%', '#e8edfc', 'var(--blue)'],
              ['TM', 'Thomas M.', '7 Jahre · Hamburg', '91%', '#e8f5ec', 'var(--green)'],
              ['LH', 'Lena H.', '4 Jahre · Remote', '88%', '#f0ebff', '#6b3fa0']
            ].map(([i, n, r, s, bg, c]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--bg2)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: bg, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>{i}</div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{n}</div><div style={{ fontSize: '0.78rem', color: 'var(--ink2)' }}>{r}</div></div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--green)' }}>{s} Match</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREISE */}
      <section id="preise" style={{ background: 'var(--ink)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-label" style={{ color: 'rgba(255,255,255,0.4)' }}>✦ Transparente Preise</div>
          <h2 className="section-title" style={{ color: 'white' }}>Bis zu 80% günstiger als die Konkurrenz</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginTop: '3rem' }}>
            {[
              { name: 'Starter', price: '99€', period: 'pro Anzeige · 30 Tage', features: ['1 Stellenanzeige', 'KI-Matching', 'Bis zu 50 Bewerbungen', 'Basis-Dashboard', 'E-Mail-Support'], featured: false },
              { name: 'Professional ⭐', price: '199€', period: 'pro Monat · unbegrenzt', features: ['Unbegrenzte Anzeigen', 'Premium-KI-Matching', 'Unbegrenzte Bewerbungen', 'Live-Dashboard + Analytics', 'Direktchat', 'Videointerviews', 'Priority-Support'], featured: true },
              { name: 'Enterprise', price: '499€', period: 'pro Monat · für Teams', features: ['Alles aus Professional', 'Multi-User Zugang', 'ATS-Integration', 'Eigenes Branding', 'Account-Manager', 'SLA-Garantie'], featured: false },
            ].map((p) => (
              <div key={p.name} style={{ borderRadius: 'var(--radius)', padding: '2rem', border: `1.5px solid ${p.featured ? 'var(--accent)' : 'rgba(255,255,255,0.1)'}`, background: p.featured ? 'var(--accent)' : 'rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>{p.name}</div>
                <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'white' }}>{p.price}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>{p.period}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '2rem' }}>
                  {p.features.map(f => <li key={f} style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', display: 'flex', gap: 8 }}><span style={{ color: '#6ed48a', fontWeight: 700 }}>✓</span>{f}</li>)}
                </ul>
                <Link href="/register?role=employer" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', background: p.featured ? 'white' : 'rgba(255,255,255,0.1)', color: p.featured ? 'var(--accent)' : 'white', border: p.featured ? 'none' : '1.5px solid rgba(255,255,255,0.2)' }}>
                  Jetzt starten
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--accent)', padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: '1rem' }}>Bereit für deinen nächsten Job?</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2rem' }}>Kostenlos registrieren — für Arbeitnehmer immer gratis.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" className="btn btn-dark btn-lg">Als Bewerber starten</Link>
          <Link href="/register?role=employer" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)' }}>Job inserieren</Link>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-logo-wrap"><div className="logo-dot" />WorkMatch</div>
          <div className="footer-links">
            <a href="/jobs">Jobs</a>
            <a href="/register">Registrieren</a>
            <a href="/#preise">Preise</a>
            <a href="#">Datenschutz</a>
            <a href="#">Impressum</a>
          </div>
          <div style={{ fontSize: '0.82rem' }}>© 2026 WorkMatch · Made in 🇩🇪</div>
        </div>
      </footer>
    </>
  )
}
