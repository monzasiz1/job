'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase-browser'

type Tab = 'analyse' | 'matching' | 'anschreiben' | 'history'

export default function KIToolsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [tab, setTab] = useState<Tab>('analyse')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [resumeText, setResumeText] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [analysis, setAnalysis] = useState<any>(null)
  const [matchResult, setMatchResult] = useState<any>(null)
  const [nearbyJobs, setNearbyJobs] = useState<any[]>([])
  const [coverLetter, setCoverLetter] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const [city, setCity] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUser(data.user)
      loadHistory(data.user.id)
    })
  }, [])

  const loadHistory = async (uid: string) => {
    const [{ data: matches }, { data: apps }] = await Promise.all([
      supabase.from('job_matches').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(5),
      supabase.from('applications').select('*').eq('user_id', uid).order('created_at', { ascending: false }).limit(5),
    ])
    setHistory([
      ...(matches || []).map((m: any) => ({ ...m, type: 'match' })),
      ...(apps || []).map((a: any) => ({ ...a, type: 'application' }))
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
  }

  const findNearbyJobs = async (score: number, jobDescription: string) => {
    if (score < 50) return
    try {
      let query = supabase.from('jobs').select('*').eq('is_active', true).limit(4)
      if (city.trim()) query = query.ilike('location', `%${city.trim()}%`)
      const { data } = await query
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
      if (user) {
        await supabase.from('job_matches').insert({ user_id: user.id, job_description: jobDesc, match_score: data.score, analysis: JSON.stringify(data) })
        loadHistory(user.id)
      }
      await findNearbyJobs(data.score, jobDesc)
    } catch { setMatchResult({ error: 'Fehler beim Matching' }) }
    setLoading(false)
  }

  const generateCoverLetter = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) return
    setLoading(true); setCoverLetter('')
    try {
      const res = await fetch('/api/generate-application', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeText, jobDescription: jobDesc }) })
      const data = await res.json()
      setCoverLetter(data.coverLetter || '')
      if (user) {
        await supabase.from('applications').insert({ user_id: user.id, job_description: jobDesc, cover_letter: data.coverLetter })
        loadHistory(user.id)
      }
    } catch { setCoverLetter('Fehler bei der Generierung.') }
    setLoading(false)
  }

  const scoreClass = (s: number) => s >= 70 ? 'score-high' : s >= 40 ? 'score-mid' : 'score-low'
  const scoreLabel = (s: number) => s >= 70 ? '🟢 Sehr gut geeignet' : s >= 50 ? '🟡 Gut geeignet' : s >= 30 ? '🟠 Teilweise geeignet' : '🔴 Wenig geeignet'
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'analyse', label: 'Lebenslauf-Analyse', icon: '🧠' },
    { id: 'matching', label: 'Job-Matching', icon: '🎯' },
    { id: 'anschreiben', label: 'Anschreiben', icon: '✍️' },
    { id: 'history', label: 'Verlauf', icon: '📋' },
  ]
  const logoClasses = ['logo-a', 'logo-b', 'logo-c', 'logo-d']

  return (
    <>
      <Navbar />
      <div style={{ background: 'var(--navy)', padding: '3rem 2rem 0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: 'var(--gold2)', borderRadius: 100, padding: '5px 14px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>✦ KI-Tools</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>Dein KI-Karriereassistent</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>Analysiere deinen Lebenslauf, prüfe deine Eignung und generiere Anschreiben — alles mit KI.</p>
          <div style={{ display: 'flex', gap: 4 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '12px 20px', background: tab === t.id ? 'white' : 'transparent', color: tab === t.id ? 'var(--navy)' : 'rgba(255,255,255,0.5)', border: 'none', borderRadius: '10px 10px 0 0', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2.5rem 2rem' }}>
        {tab !== 'history' && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Lebenslauf-Text</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--ink2)' }}>Kopiere deinen Lebenslauf hier rein</span>
            </div>
            <textarea className="form-input" value={resumeText} onChange={e => setResumeText(e.target.value)}
              placeholder="Füge hier deinen Lebenslauf-Text ein..." rows={5} style={{ resize: 'vertical' }} />
          </div>
        )}

        {tab === 'analyse' && (
          <div>
            <button onClick={analyzeResume} disabled={loading || !resumeText.trim()} className="form-submit" style={{ marginBottom: '1.5rem', maxWidth: 280 }}>
              {loading ? '🧠 Analyse läuft...' : '🧠 Lebenslauf analysieren'}
            </button>
            {analysis && !analysis.error && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="card" style={{ borderTop: '3px solid #2d6a3f' }}>
                  <div style={{ fontWeight: 700, color: '#2d6a3f', marginBottom: '1rem' }}>✅ Stärken</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(analysis.strengths || []).map((s: string, i: number) => <li key={i} style={{ fontSize: '0.9rem', display: 'flex', gap: 8 }}><span style={{ color: '#2d6a3f', flexShrink: 0 }}>✓</span>{s}</li>)}
                  </ul>
                </div>
                <div className="card" style={{ borderTop: '3px solid #c0392b' }}>
                  <div style={{ fontWeight: 700, color: '#c0392b', marginBottom: '1rem' }}>⚠️ Schwächen</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(analysis.weaknesses || []).map((w: string, i: number) => <li key={i} style={{ fontSize: '0.9rem', display: 'flex', gap: 8 }}><span style={{ color: '#c0392b', flexShrink: 0 }}>✗</span>{w}</li>)}
                  </ul>
                </div>
                <div className="card card-gold" style={{ gridColumn: '1/-1', borderTop: '3px solid var(--gold)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--gold)', marginBottom: '1rem' }}>💡 Verbesserungsvorschläge</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(analysis.improvements || []).map((imp: string, i: number) => <li key={i} style={{ fontSize: '0.9rem', display: 'flex', gap: 8 }}><span style={{ color: 'var(--gold)', flexShrink: 0 }}>→</span>{imp}</li>)}
                  </ul>
                </div>
              </div>
            )}
            {analysis?.error && <div className="alert alert-error">{analysis.error}</div>}
          </div>
        )}

        {tab === 'matching' && (
          <div>
            <div className="card" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Stellenanzeige einfügen</label>
              <textarea className="form-input" value={jobDesc} onChange={e => setJobDesc(e.target.value)}
                placeholder="Füge hier die komplette Stellenanzeige ein..." rows={5} style={{ resize: 'vertical', marginBottom: '1rem' }} />
              <div style={{ flex: 1 }}>
                <label className="form-label">Deine Stadt <span style={{ color: 'var(--ink3)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(für Job-Vorschläge in deiner Nähe)</span></label>
                <input className="form-input" value={city} onChange={e => setCity(e.target.value)} placeholder="z.B. Krefeld, Willich, Düsseldorf..." />
              </div>
            </div>
            <button onClick={matchJob} disabled={loading || !resumeText.trim() || !jobDesc.trim()} className="form-submit" style={{ marginBottom: '1.5rem', maxWidth: 280 }}>
              {loading ? '🎯 Analyse läuft...' : '🎯 Eignung prüfen'}
            </button>

            {matchResult && !matchResult.error && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16 }}>
                  <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink2)' }}>Match-Score</div>
                    <div className={`match-score ${scoreClass(matchResult.score)}`}>{matchResult.score}%</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--ink2)' }}>{scoreLabel(matchResult.score)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="card">
                      <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>📝 Erklärung</div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--ink2)', lineHeight: 1.7 }}>{matchResult.explanation}</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {matchResult.matchingSkills?.length > 0 && (
                        <div className="card" style={{ borderLeft: '3px solid #2d6a3f' }}>
                          <div style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#2d6a3f', fontSize: '0.88rem' }}>✅ Passende Skills</div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {matchResult.matchingSkills.map((s: string) => <span key={s} className="badge badge-green">{s}</span>)}
                          </div>
                        </div>
                      )}
                      {matchResult.missingSkills?.length > 0 && (
                        <div className="card" style={{ borderLeft: '3px solid #c0392b' }}>
                          <div style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#c0392b', fontSize: '0.88rem' }}>❌ Fehlende Skills</div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {matchResult.missingSkills.map((s: string) => <span key={s} className="badge" style={{ background: '#fef2f2', color: '#c0392b' }}>{s}</span>)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {matchResult.score >= 50 && (
                  <div className="card card-gold" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>✍️ Gleich bewerben?</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--ink2)' }}>Dein Match ist gut — lass die KI ein Anschreiben generieren.</div>
                    </div>
                    <button onClick={() => setTab('anschreiben')} className="btn btn-gold">Anschreiben generieren →</button>
                  </div>
                )}

                {nearbyJobs.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.2rem' }}>
                          📍 Ähnliche Jobs {city ? `in ${city}` : 'in deiner Nähe'}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--ink2)', marginTop: 4 }}>
                          Basierend auf deinem Profil — diese Stellen könnten auch passen
                        </div>
                      </div>
                      <Link href={`/jobs${city ? `?city=${encodeURIComponent(city)}` : ''}`} className="btn btn-outline" style={{ fontSize: '0.82rem' }}>
                        Alle Jobs →
                      </Link>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                      {nearbyJobs.map((job: any, i: number) => (
                        <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div className="job-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                              <div className={`company-logo ${logoClasses[i % logoClasses.length]}`} style={{ width: 40, height: 40, fontSize: '0.85rem' }}>
                                {job.company.substring(0, 2).toUpperCase()}
                              </div>
                              <span className={`badge ${job.type === 'Remote' ? 'badge-green' : job.type === 'Hybrid' ? 'badge-blue' : 'badge-amber'}`}>{job.type}</span>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{job.title}</div>
                            <div style={{ fontSize: '0.82rem', color: 'var(--ink2)', marginBottom: '0.75rem' }}>{job.company}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                              <span style={{ fontWeight: 700, color: '#2d6a3f', fontSize: '0.88rem' }}>
                                {job.salary_min > 0 ? `${job.salary_min.toLocaleString('de-DE')} €` : 'n. V.'}
                              </span>
                              <span style={{ fontSize: '0.78rem', color: 'var(--ink2)' }}>📍 {job.location}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {matchResult.score < 50 && nearbyJobs.length === 0 && (
                  <div className="card" style={{ textAlign: 'center', padding: '2rem', borderTop: '3px solid var(--gold)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💡</div>
                    <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Tipp: Schau dir ähnliche Jobs an</div>
                    <div style={{ color: 'var(--ink2)', fontSize: '0.9rem', marginBottom: '1rem' }}>Der Match ist noch nicht optimal — vielleicht findest du eine besser passende Stelle.</div>
                    <Link href="/jobs" className="btn btn-navy">Alle Jobs durchsuchen →</Link>
                  </div>
                )}
              </div>
            )}
            {matchResult?.error && <div className="alert alert-error">{matchResult.error}</div>}
          </div>
        )}

        {tab === 'anschreiben' && (
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Stellenanzeige</label>
              <textarea className="form-input" value={jobDesc} onChange={e => setJobDesc(e.target.value)}
                placeholder="Füge hier die Stellenanzeige ein..." rows={5} style={{ resize: 'vertical' }} />
            </div>
            <button onClick={generateCoverLetter} disabled={loading || !resumeText.trim() || !jobDesc.trim()} className="form-submit" style={{ marginBottom: '1.5rem', maxWidth: 320 }}>
              {loading ? '✍️ Wird generiert...' : '✍️ Anschreiben generieren'}
            </button>
            {coverLetter && (
              <div className="card card-gold">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700 }}>📄 Ihr Anschreiben</div>
                  <button onClick={() => { navigator.clipboard.writeText(coverLetter); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                    className="btn btn-navy" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
                    {copied ? '✓ Kopiert!' : '📋 Kopieren'}
                  </button>
                </div>
                <textarea className="form-input" value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                  rows={16} style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.8, fontSize: '0.92rem' }} />
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Mein Verlauf</h2>
            {history.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Noch keine Aktivitäten</div>
                <div style={{ color: 'var(--ink2)', fontSize: '0.9rem' }}>Nutze die KI-Tools und dein Verlauf erscheint hier.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {history.map((item: any) => (
                  <div key={item.id} className="card" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: item.type === 'match' ? '#e8f0fc' : 'rgba(201,168,76,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                      {item.type === 'match' ? '🎯' : '✍️'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.type === 'match' ? 'Job-Matching' : 'Anschreiben generiert'}</div>
                        {item.match_score && (
                          <div className={`match-score ${item.match_score >= 70 ? 'score-high' : item.match_score >= 40 ? 'score-mid' : 'score-low'}`} style={{ width: 44, height: 44, fontSize: '0.82rem' }}>
                            {item.match_score}%
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--ink2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.job_description?.substring(0, 80)}...
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink3)', marginTop: 4 }}>
                        {new Date(item.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
