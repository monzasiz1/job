import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 720 }}>
            <div className="animate" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold2)', borderRadius: 100, padding: '6px 16px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2rem' }}>
              ✦ Deutschlands intelligenteste Jobbörse
            </div>
            <h1 className="animate delay-1" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '1.5rem', color: 'white' }}>
              Deine Karriere.<br />
              <span style={{ background: 'linear-gradient(135deg, var(--gold), var(--gold3))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KI-gestützt.</span>
            </h1>
            <p className="animate delay-2" style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.6)', maxWidth: 560, marginBottom: '2.5rem', lineHeight: 1.7 }}>
              WorkMatch kombiniert präzise Jobsuche mit KI-Analyse, automatischen Bewerbungsschreiben und intelligentem Matching — alles auf einer Plattform.
            </p>
            <div className="animate delay-3" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '4rem' }}>
              <Link href="/register" className="btn btn-gold btn-lg">Kostenlos starten →</Link>
              <Link href="/jobs" className="btn btn-ghost btn-lg">Jobs entdecken</Link>
            </div>
            <div className="animate delay-3" style={{ display: 'flex', gap: '3rem' }}>
              {[['12.400+','Aktive Jobs'],['4.200+','Unternehmen'],['89%','Vermittlungsrate'],['KI','Bewerbungsassistent']].map(([n,l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 700, color: 'var(--gold2)' }}>{n}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: 2, letterSpacing: '0.04em' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section style={{ background: 'var(--navy2)', padding: '2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <form action="/jobs" method="get" className="search-bar">
            <input name="q" type="text" placeholder="Jobtitel, Fähigkeit oder Unternehmen..." style={{ flex: 1 }} />
            <select name="location" style={{ borderLeft: '1px solid var(--border)' }}>
              <option value="">📍 Alle Orte</option>
              <option>Berlin</option><option>München</option><option>Hamburg</option><option>Frankfurt</option><option>Köln</option><option>Düsseldorf</option><option>Krefeld</option><option>Remote</option>
            </select>
            <button type="submit" className="btn btn-gold" style={{ margin: 8, borderRadius: 10 }}>Suchen</button>
          </form>
        </div>
      </section>

      {/* KI FEATURES */}
      <section style={{ padding: '6rem 2rem', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>✦ KI-Powered Features</div>
            <h2 className="section-title" style={{ color: 'white' }}>Mehr als eine Jobbörse</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 540, margin: '0 auto' }}>Dein persönlicher KI-Karriereassistent analysiert, matched und bewirbt — damit du dich auf das Wesentliche konzentrierst.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { icon: '🧠', title: 'KI-Lebenslauf Analyse', desc: 'Lade deinen Lebenslauf hoch — die KI analysiert Stärken, Schwächen und gibt konkrete Verbesserungsvorschläge.', href: '/ki-tools', badge: 'AI' },
              { icon: '🎯', title: 'Job-Matching Score', desc: 'Paste eine Stellenanzeige — du bekommst sofort einen Match-Score und siehst welche Skills dir fehlen.', href: '/ki-tools', badge: 'AI' },
              { icon: '✍️', title: 'Bewerbungsschreiben', desc: 'Die KI generiert ein maßgeschneidertes Anschreiben auf Basis deines Lebenslaufs und der Stelle.', href: '/ki-tools', badge: 'AI' },
              { icon: '📍', title: 'Umkreissuche', desc: 'Suche Jobs in deiner Nähe — mit echter GPS-Umkreisberechnung bis 200 km.', href: '/jobs', badge: 'NEU' },
            ].map(f => (
              <Link key={f.title} href={f.href} style={{ textDecoration: 'none' }}>
                <div className="ai-card" style={{ height: '100%', cursor: 'pointer', transition: 'all 0.3s' }}>
                  <div className="ai-badge">✦ {f.badge}</div>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{f.icon}</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.15rem', color: 'white', marginBottom: '0.75rem' }}>{f.title}</div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</div>
                  <div style={{ marginTop: '1.5rem', color: 'var(--gold2)', fontSize: '0.85rem', fontWeight: 600 }}>Jetzt ausprobieren →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-label">✦ So funktioniert's</div>
          <h2 className="section-title st-dark">In 3 Schritten zum Traumjob</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
            {[
              ['01', 'Profil & Lebenslauf', 'Erstelle dein Profil und lade deinen Lebenslauf hoch. Die KI extrahiert automatisch deine Qualifikationen.'],
              ['02', 'KI analysiert & matcht', 'Unsere KI vergleicht dein Profil mit tausenden Jobs und zeigt dir deinen persönlichen Match-Score.'],
              ['03', 'Bewerben mit einem Klick', 'Generiere ein maßgeschneidertes Anschreiben per KI und bewirb dich direkt — in unter 2 Minuten.'],
            ].map(([n, t, d]) => (
              <div key={n} className="card" style={{ position: 'relative', paddingTop: '2rem' }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 800, color: 'var(--border)', position: 'absolute', top: '1rem', right: '1.5rem', lineHeight: 1 }}>{n}</div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ color: 'var(--gold2)', fontWeight: 800, fontSize: '0.85rem' }}>{n}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>{t}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--ink2)', lineHeight: 1.7 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARBEITGEBER */}
      <section id="arbeitgeber" style={{ background: 'var(--bg2)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div>
            <div className="section-label">✦ Für Arbeitgeber</div>
            <h2 className="section-title">Die besten Talente. Zum besten Preis.</h2>
            <p style={{ color: 'var(--ink2)', marginBottom: '2rem', lineHeight: 1.8 }}>Schalten Sie Ihr Stellenangebot für einen Bruchteil des Preises von StepStone oder Indeed — mit KI-gestütztem Matching für bessere Ergebnisse.</p>
            {[['🎯','KI-Kandidaten-Matching','Automatische Vorauswahl der besten Bewerber.'],['📊','Live-Dashboard','Bewerbungen in Echtzeit verfolgen.'],['📍','Umkreis-Targeting','Bewerber aus der Region gezielt ansprechen.']].map(([i,t,d]) => (
              <div key={t} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0, boxShadow: 'var(--shadow)' }}>{i}</div>
                <div><div style={{ fontWeight: 700, marginBottom: 4 }}>{t}</div><div style={{ fontSize: '0.88rem', color: 'var(--ink2)' }}>{d}</div></div>
              </div>
            ))}
            <Link href="/register?role=employer" className="btn btn-navy btn-lg" style={{ marginTop: '1rem' }}>Jetzt Job inserieren →</Link>
          </div>
          <div className="card card-gold" style={{ boxShadow: '8px 8px 0 var(--navy)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Marketing Manager</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ink2)' }}>Hamburg · Vollzeit</div>
              </div>
              <span className="badge badge-gold">Aktiv</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: '1.25rem' }}>
              {[['247','Aufrufe','var(--navy)'],['43','Bewerbungen','#2d6a3f'],['8','Top-Matches','var(--gold)']].map(([n,l,c]) => (
                <div key={l} style={{ background: 'var(--bg)', borderRadius: 10, padding: '0.75rem', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 700, color: c }}>{n}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--ink2)', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
            {[['SK','Sara Kaya','95% Match','#e8f0fc','var(--navy)'],['TM','Thomas M.','91% Match','#e8f5ec','#2d6a3f'],['LH','Lena H.','88% Match','rgba(201,168,76,0.15)','var(--gold)']].map(([i,n,s,bg,c]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--bg2)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: bg, color: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0, fontFamily: "'Playfair Display', serif" }}>{i}</div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{n}</div></div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: c }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PREISE */}
      <section id="preise" style={{ background: 'var(--navy)', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="section-label" style={{ display: 'flex', justifyContent: 'center' }}>✦ Transparente Preise</div>
            <h2 className="section-title" style={{ color: 'white' }}>Bis zu 80% günstiger</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>StepStone: ab 1.299 € · Indeed: ab 5 €/Klick · WorkMatch: ab 99 €</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {[
              { name:'Starter', price:'99€', period:'pro Anzeige · 30 Tage', features:['1 Stellenanzeige','KI-Matching','50 Bewerbungen','Basis-Dashboard','E-Mail-Support'], featured:false },
              { name:'Professional', price:'199€', period:'pro Monat · unbegrenzt', features:['Unbegrenzte Anzeigen','Premium-KI-Matching','Direktchat','Live-Dashboard','Videointerviews','Priority-Support'], featured:true },
              { name:'Enterprise', price:'499€', period:'pro Monat · Teams', features:['Alles aus Professional','Multi-User','ATS-Integration','Eigenes Branding','Account-Manager'], featured:false },
            ].map(p => (
              <div key={p.name} style={{ borderRadius: 'var(--radius)', padding: '2rem', border: `1px solid ${p.featured ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}`, background: p.featured ? 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.06))' : 'rgba(255,255,255,0.03)', position: 'relative' }}>
                {p.featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, var(--gold), var(--gold2))', color: 'var(--navy)', fontSize: '0.7rem', fontWeight: 800, padding: '4px 16px', borderRadius: 100, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Beliebtestes</div>}
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>{p.name}</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 700, color: p.featured ? 'var(--gold2)' : 'white', letterSpacing: '-0.02em' }}>{p.price}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>{p.period}</div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '2rem' }}>
                  {p.features.map(f => <li key={f} style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.75)', display: 'flex', gap: 8 }}><span style={{ color: 'var(--gold)', fontWeight: 700 }}>✓</span>{f}</li>)}
                </ul>
                <Link href="/register?role=employer" style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', background: p.featured ? 'linear-gradient(135deg, var(--gold), var(--gold2))' : 'rgba(255,255,255,0.08)', color: p.featured ? 'var(--navy)' : 'white', border: p.featured ? 'none' : '1px solid rgba(255,255,255,0.15)' }}>
                  Jetzt starten
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%)', padding: '6rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>Bereit für deinen nächsten Job?</h2>
          <p style={{ color: 'rgba(10,22,40,0.7)', fontSize: '1.1rem', marginBottom: '2rem' }}>Für Arbeitnehmer immer kostenlos. KI-Tools inklusive.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-navy btn-lg">Als Bewerber starten</Link>
            <Link href="/register?role=employer" className="btn btn-lg" style={{ background: 'rgba(10,22,40,0.15)', color: 'var(--navy)', border: '2px solid rgba(10,22,40,0.2)' }}>Job inserieren</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-logo-wrap">
            <div className="logo-mark" style={{ width: 24, height: 24 }}>
              <svg viewBox="0 0 18 18" fill="none"><path d="M9 2L14.5 5.5V12.5L9 16L3.5 12.5V5.5L9 2Z" stroke="#0a1628" strokeWidth="1.5" fill="none"/><path d="M9 5L12 7V11L9 13L6 11V7L9 5Z" fill="#0a1628"/></svg>
            </div>
            WorkMatch
          </div>
          <div className="footer-links">
            <a href="/jobs">Jobs</a><a href="/ki-tools">KI-Tools</a><a href="/register">Registrieren</a><a href="/#preise">Preise</a><a href="#">Datenschutz</a><a href="#">Impressum</a>
          </div>
          <div style={{ fontSize: '0.82rem' }}>© 2026 WorkMatch · Made in 🇩🇪</div>
        </div>
      </footer>
    </>
  )
}
