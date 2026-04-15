
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { TalentoWordmark } from '@/components/TalentoLogo'

type Tab = 'analyse' | 'matching' | 'history'

export default function KIToolsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState<Tab>('analyse')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [resumeText, setResumeText] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [matchResult, setMatchResult] = useState<any>(null)
  const [nearbyJobs, setNearbyJobs] = useState<any[]>([])
  const [history, setHistory] = useState<any[]>([])
  const [city, setCity] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      setProfile(p)
      loadHistory(data.user.id)
    })
  }, [])

  const loadHistory = async (uid: string) => {
    const [{ data: matches }, { data: apps }] = await Promise.all([
      supabase.from('job_matches').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(5),
      supabase.from('applications').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(5),
    ])
    setHistory([...(matches || []).map((m: any) => ({ ...m, type: 'match' })), ...(apps || []).map((a: any) => ({ ...a, type: 'application' }))].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
  }

  const findNearbyJobs = async (score: number) => {
    if (score < 50) return
    try {
      let q = supabase.from('jobs').select('*').eq('is_active', true).limit(3)
      if (city.trim()) q = q.ilike('location', `%${city.trim()}%`)
      const { data } = await q
      setNearbyJobs(data || [])
    } catch { setNearbyJobs([]) }
  }

  const analyzeResume = async () => {
    if (!resumeText.trim()) return
    setLoading(true); setAnalysis(null)
    try {
      const res = await fetch('/api/analyze-resume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeText }) })
      const data = await res.json()
      setAnalysis(data)
      if (user) await supabase.from('resumes').upsert({ user_id: user.id, extracted_text: resumeText, file_url: '' })
    } catch { setAnalysis({ error: 'Fehler bei der Analyse' }) }
    setLoading(false)
  }

  const matchJob = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) return
    setLoading(true); setMatchResult(null); setNearbyJobs([])
    try {
      const res = await fetch('/api/job-match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeText, jobDescription: jobDesc }) })
      const data = await res.json()
      setMatchResult(data)
      if (user) { await supabase.from('job_matches').insert({ user_id: user.id, job_description: jobDesc, match_score: data.score, analysis: JSON.stringify(data) }); loadHistory(user.id) }
      await findNearbyJobs(data.score)
    } catch { setMatchResult({ error: 'Fehler' }) }
    setLoading(false)
  }



  const logout = async () => { await supabase.auth.signOut(); window.location.href = '/' }
  const sc = (s: number) => s >= 70 ? 'mr-hi' : s >= 40 ? 'mr-md' : 'mr-lo'
  const sl = (s: number) => s >= 70 ? '🟢 Sehr gut' : s >= 50 ? '🟡 Gut' : s >= 30 ? '🟠 Teilweise' : '🔴 Wenig geeignet'
  const initials = profile?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'
  const lc = ['ja', 'jb', 'jc', 'jd']

  const navLinks = profile?.role === 'employer'
    ? [{ h: '/dashboard', i: '⊞', l: 'Dashboard' }, { h: '/jobs', i: '◈', l: 'Jobs' }, { h: '/post-job', i: '＋', l: 'Stelle inserieren' }, { h: '/ki-tools', i: '✦', l: 'KI-Tools' }]
    : [{ h: '/dashboard', i: '⊞', l: 'Dashboard' }, { h: '/jobs', i: '◈', l: 'Jobs finden' }, { h: '/ki-tools', i: '✦', l: 'KI-Assistent' }, { h: `/bewerber/${user?.id || ''}`, i: '◉', l: 'Mein Profil' }]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', fontFamily: "'DM Sans', sans-serif" }}>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 280, backdropFilter: 'blur(4px)' }} />}

      {/* SIDEBAR */}
      <aside style={{
        width: 240, background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 300,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
        transition: 'transform 0.28s ease',
      }} className="sidebar">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '1.25rem', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}>
          <TalentoWordmark size="sm" />
        </Link>

        {profile && (
          <div style={{ padding: '1rem 1.1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,var(--accent),#a080ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '0.88rem', color: '#fff', flexShrink: 0 }}>{initials}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#fff' }}>Hi, {profile.full_name?.split(' ')[0]}!</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 1 }}>{profile.role === 'employer' ? profile.company_name : 'Auf Jobsuche'}</div>
            </div>
          </div>
        )}

        <nav style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', padding: '0.5rem 0.5rem 0.2rem' }}>Menü</div>
          {navLinks.map(({ h, i, l }) => (
            <Link key={h} href={h} onClick={() => setSidebarOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 12, color: h === '/ki-tools' ? 'var(--accent)' : 'var(--text2)', background: h === '/ki-tools' ? 'var(--accent-soft)' : 'transparent', fontWeight: 600, fontSize: '0.83rem', textDecoration: 'none', transition: 'all 0.15s' }}>
              <span style={{ width: 16, textAlign: 'center', fontSize: '0.9rem' }}>{i}</span>{l}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 11px', borderRadius: 12, color: 'var(--text3)', background: 'none', border: 'none', fontWeight: 600, fontSize: '0.83rem', cursor: 'pointer', width: '100%', fontFamily: "'DM Sans',sans-serif" }}>
            <span style={{ width: 16, textAlign: 'center' }}>⇥</span>Abmelden
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="main">
        {/* MOBILE BAR */}
        <div style={{ display: 'none', position: 'sticky', top: 0, zIndex: 200, background: 'rgba(23,23,42,0.97)', borderBottom: '1px solid var(--border)', padding: '0 1rem', height: 52, alignItems: 'center', justifyContent: 'space-between' }} className="mob-bar">
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--text)', fontSize: '1.2rem', cursor: 'pointer', padding: 8 }}>☰</button>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>KI-Tools</span>
          <div style={{ width: 36 }} />
        </div>

        {/* TOPBAR */}
        <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,15,23,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 1.5rem', height: 60 }}>
          <span className="ai-pill">✦ KI-Tools</span>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '0.95rem', color: '#fff', flex: 1 }}>Karriere-Assistent</span>
          <Link href="/jobs" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 999, background: 'var(--surface2)', border: '1px solid var(--border2)', color: 'var(--text2)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>← Zu den Jobs</Link>
        </div>

        {/* CONTENT */}
        <div style={{ flex: 1, padding: '1.5rem', maxWidth: 900, width: '100%', margin: '0 auto' }}>

          {/* TABS */}
          <div style={{ display: 'flex', gap: 2, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 4, marginBottom: '1.25rem', overflowX: 'auto' }}>
            {[{ id: 'analyse', l: '🧠 Lebenslauf' }, { id: 'matching', l: '🎯 Matching' }, { id: 'history', l: '📋 Verlauf' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as Tab)} style={{ flex: '1 1 auto', textAlign: 'center', padding: '9px 14px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '0.8rem', transition: 'all 0.15s', background: tab === t.id ? 'var(--surface3)' : 'transparent', color: tab === t.id ? '#fff' : 'var(--text3)', whiteSpace: 'nowrap' }}>{t.l}</button>
            ))}
          </div>

          {/* LEBENSLAUF */}
          {tab !== 'history' && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Dein Lebenslauf</label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Text einfügen oder tippen</span>
              </div>
              <textarea value={resumeText} onChange={e => setResumeText(e.target.value)}
                placeholder="Füge hier deinen Lebenslauf-Text ein..." rows={5}
                style={{ width: '100%', border: '1px solid var(--border2)', outline: 'none', borderRadius: 12, padding: '11px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: '0.88rem', background: 'var(--surface2)', color: 'var(--text)', resize: 'vertical', lineHeight: 1.6 }} />
            </div>
          )}

          {/* ANALYSE */}
          {tab === 'analyse' && (
            <div>
              <button onClick={analyzeResume} disabled={loading || !resumeText.trim()}
                style={{ padding: '12px 22px', background: loading ? 'var(--surface3)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: loading ? 'not-allowed' : 'pointer', opacity: !resumeText.trim() ? 0.4 : 1, marginBottom: '1.25rem' }}>
                {loading ? '🧠 Analysiere...' : '🧠 Lebenslauf analysieren'}
              </button>
              {analysis && !analysis.error && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                  {[
                    { title: '✅ Stärken', items: analysis.strengths, color: 'var(--green)', bg: 'var(--green-soft)' },
                    { title: '⚠️ Schwächen', items: analysis.weaknesses, color: 'var(--pink)', bg: 'var(--pink-soft)' },
                  ].map(s => (
                    <div key={s.title} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: `3px solid ${s.color}`, borderRadius: 18, padding: '1.1rem' }}>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: s.color, marginBottom: '0.75rem', fontSize: '0.88rem' }}>{s.title}</div>
                      {(s.items || []).map((item: string, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.84rem', color: 'var(--text2)', marginBottom: 6 }}>
                          <span style={{ color: s.color, flexShrink: 0, marginTop: 1 }}>•</span>{item}
                        </div>
                      ))}
                    </div>
                  ))}
                  <div style={{ background: 'var(--surface)', border: '1px solid rgba(212,168,67,0.25)', borderTop: '3px solid var(--gold)', borderRadius: 18, padding: '1.1rem', gridColumn: '1 / -1' }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'var(--gold)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>💡 Verbesserungsvorschläge</div>
                    {(analysis.improvements || []).map((item: string, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: 8, fontSize: '0.84rem', color: 'var(--text2)', marginBottom: 6 }}>
                        <span style={{ color: 'var(--gold)', flexShrink: 0 }}>→</span>{item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {analysis?.error && <div style={{ padding: '11px 14px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 600, background: 'var(--pink-soft)', color: 'var(--pink)', border: '1px solid rgba(240,96,144,0.2)' }}>{analysis.error}</div>}
            </div>
          )}

          {/* MATCHING */}
          {tab === 'matching' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginBottom: '1rem' }}>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: '1.1rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Stellenanzeige</label>
                  <textarea value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Stellenanzeige einfügen..." rows={5}
                    style={{ width: '100%', border: '1px solid var(--border2)', outline: 'none', borderRadius: 10, padding: '10px 13px', fontFamily: "'DM Sans',sans-serif", fontSize: '0.87rem', background: 'var(--surface2)', color: 'var(--text)', resize: 'vertical' }} />
                </div>
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: '1.1rem' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text2)', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Deine Stadt</label>
                  <input value={city} onChange={e => setCity(e.target.value)} placeholder="z.B. Krefeld, Düsseldorf..."
                    style={{ width: '100%', border: '1px solid var(--border2)', outline: 'none', borderRadius: 10, padding: '10px 13px', fontFamily: "'DM Sans',sans-serif", fontSize: '0.87rem', background: 'var(--surface2)', color: 'var(--text)' }} />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 8 }}>Für Job-Vorschläge in deiner Nähe</div>
                </div>
              </div>
              <button onClick={matchJob} disabled={loading || !resumeText.trim() || !jobDesc.trim()}
                style={{ padding: '12px 22px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', opacity: (!resumeText.trim() || !jobDesc.trim()) ? 0.4 : 1, marginBottom: '1.25rem' }}>
                {loading ? '🎯 Analysiere...' : '🎯 Eignung prüfen'}
              </button>

              {matchResult && !matchResult.error && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'start' }}>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 18, padding: '1.25rem', textAlign: 'center', minWidth: 140 }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text3)', marginBottom: '0.75rem' }}>Match</div>
                      <div className={`mring ${sc(matchResult.score)}`} style={{ margin: '0 auto 0.75rem' }}>{matchResult.score}%</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text2)', fontWeight: 600 }}>{sl(matchResult.score)}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1rem' }}>
                        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#fff' }}>Erklärung</div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.75 }}>{matchResult.explanation}</p>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {matchResult.matchingSkills?.length > 0 && (
                          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--green)', borderRadius: 14, padding: '0.9rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>✅ Passende Skills</div>
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                              {matchResult.matchingSkills.map((s: string) => <span key={s} style={{ padding: '3px 9px', background: 'var(--green-soft)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, color: 'var(--green)' }}>{s}</span>)}
                            </div>
                          </div>
                        )}
                        {matchResult.missingSkills?.length > 0 && (
                          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: '3px solid var(--pink)', borderRadius: 14, padding: '0.9rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--pink)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>❌ Fehlende Skills</div>
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                              {matchResult.missingSkills.map((s: string) => <span key={s} style={{ padding: '3px 9px', background: 'var(--pink-soft)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, color: 'var(--pink)' }}>{s}</span>)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {nearbyJobs.length > 0 && (
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: '0.75rem' }}>📍 Ähnliche Jobs {city ? `in ${city}` : ''}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                        {nearbyJobs.map((job: any, i: number) => (
                          <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '0.9rem', display: 'flex', gap: '0.75rem', alignItems: 'center', cursor: 'pointer', transition: 'all 0.18s' }}>
                              <div className={`jlogo ${lc[i % 4]}`} style={{ width: 38, height: 38, borderRadius: 10, fontSize: '0.78rem', flexShrink: 0 }}>{job.company.slice(0, 2).toUpperCase()}</div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: '0.84rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{job.location}</div>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--green)', marginTop: 2 }}>{job.salary_min > 0 ? `${job.salary_min.toLocaleString('de-DE')} €` : 'n. V.'}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {matchResult?.error && <div style={{ padding: '11px 14px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 600, background: 'var(--pink-soft)', color: 'var(--pink)', border: '1px solid rgba(240,96,144,0.2)' }}>{matchResult.error}</div>}
            </div>
          )}



          {/* HISTORY */}
          {tab === 'history' && (
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>Verlauf</div>
              {history.length === 0 ? (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '3rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>Noch keine Aktivitäten</div>
                  <div style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>Nutze die KI-Tools und dein Verlauf erscheint hier.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {history.map((item: any) => (
                    <div key={item.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '1rem 1.1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 11, background: item.type === 'match' ? 'rgba(124,104,250,0.15)' : 'rgba(212,168,67,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                        {item.type === 'match' ? '🎯' : '✍️'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fff', marginBottom: 4 }}>{item.type === 'match' ? 'Job-Matching' : 'Anschreiben'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.job_description?.substring(0, 80)}...</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 4 }}>{new Date(item.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                      {item.match_score && (
                        <div className={`mring ${item.match_score >= 70 ? 'mr-hi' : item.match_score >= 40 ? 'mr-md' : 'mr-lo'}`} style={{ width: 44, height: 44, fontSize: '0.82rem', flexShrink: 0 }}>{item.match_score}%</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media(max-width:860px){
          .sidebar{transform:translateX(-100%) !important}
          .sidebar.open-sidebar{transform:translateX(0) !important}
          .main{margin-left:0 !important}
          .mob-bar{display:flex !important}
        }
      `}</style>
    </div>
  )
}
