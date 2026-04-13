'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const [coverLetter, setCoverLetter] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

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
    setHistory([...(matches || []).map((m: any) => ({ ...m, type: 'match' })), ...(apps || []).map((a: any) => ({ ...a, type: 'application' }))].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()))
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
    setLoading(true); setMatchResult(null)
    try {
      const res = await fetch('/api/job-match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeText, jobDescription: jobDesc }) })
      const data = await res.json()
      setMatchResult(data)
      if (user) {
        await supabase.from('job_matches').insert({ user_id: user.id, job_description: jobDesc, match_score: data.score, analysis: JSON.stringify(data) })
        loadHistory(user.id)
      }
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

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'analyse', label: 'Lebenslauf-Analyse', icon: '🧠' },
    { id: 'matching', label: 'Job-Matching', icon: '🎯' },
    { id: 'anschreiben', label: 'Anschreiben', icon: '✍️' },
    { id: 'history', label: 'Verlauf', icon: '📋' },
  ]

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

        {/* RESUME INPUT — shared across tabs */}
        {tab !== 'history' && (
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Lebenslauf-Text</label>
              <span style={{ fontSize: '0.8rem', color: 'var(--ink2)' }}>Kopiere deinen Lebenslauf hier rein</span>
            </div>
            <textarea className="form-input" value={resumeText} onChange={e => setResumeText(e.target.value)}
              placeholder="Füge hier deinen Lebenslauf-Text ein (aus Word, PDF-Kopie etc.)&#10;&#10;Beispiel:&#10;Max Mustermann&#10;Software Engineer mit 5 Jahren Erfahrung in React, Node.js, TypeScript...&#10;Ausbildung: B.Sc. Informatik, TU Berlin 2018&#10;..." rows={6} style={{ resize: 'vertical' }} />
          </div>
        )}

        {/* ANALYSE TAB */}
        {tab === 'analyse' && (
          <div>
            <button onClick={analyzeResume} disabled={loading || !resumeText.trim()} className="form-submit" style={{ marginBottom: '1.5rem', maxWidth: 280 }}>
              {loading ? '🧠 Analyse läuft...' : '🧠 Lebenslauf analysieren'}
            </button>
            {analysis && !analysis.error && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="card" style={{ borderTop: '3px solid #2d6a3f' }}>
                  <div style={{ fontWeight: 700, color: '#2d6a3f', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>✅ Stärken</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(analysis.strengths || []).map((s: string, i: number) => <li key={i} style={{ fontSize: '0.9rem', display: 'flex', gap: 8 }}><span style={{ color: '#2d6a3f' }}>✓</span>{s}</li>)}
                  </ul>
                </div>
                <div className="card" style={{ borderTop: '3px solid #c0392b' }}>
                  <div style={{ fontWeight: 700, color: '#c0392b', marginBottom: '1rem' }}>⚠️ Schwächen</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(analysis.weaknesses || []).map((w: string, i: number) => <li key={i} style={{ fontSize: '0.9rem', display: 'flex', gap: 8 }}><span style={{ color: '#c0392b' }}>✗</span>{w}</li>)}
                  </ul>
                </div>
                <div className="card card-gold" style={{ gridColumn: '1/-1', borderTop: '3px solid var(--gold)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--gold)', marginBottom: '1rem' }}>💡 Verbesserungsvorschläge</div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {(analysis.improvements || []).map((imp: string, i: number) => <li key={i} style={{ fontSize: '0.9rem', display: 'flex', gap: 8 }}><span style={{ color: 'var(--gold)' }}>→</span>{imp}</li>)}
                  </ul>
                </div>
              </div>
            )}
            {analysis?.error && <div className="alert alert-error">{analysis.error}</div>}
          </div>
        )}

        {/* MATCHING TAB */}
        {tab === 'matching' && (
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label">Stellenanzeige einfügen</label>
              <textarea className="form-input" value={jobDesc} onChange={e => setJobDesc(e.target.value)}
                placeholder="Füge hier die komplette Stellenanzeige ein..." rows={6} style={{ resize: 'vertical' }} />
            </div>
            <button onClick={matchJob} disabled={loading || !resumeText.trim() || !jobDesc.trim()} className="form-submit" style={{ marginBottom: '1.5rem', maxWidth: 280 }}>
              {loading ? '🎯 Analyse läuft...' : '🎯 Eignung prüfen'}
            </button>
            {matchResult && !matchResult.error && (
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16 }}>
                <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink2)', marginBottom: '1rem' }}>Match-Score</div>
                  <div className={`match-score ${scoreClass(matchResult.score)}`}>{matchResult.score}%</div>
                  <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--ink2)' }}>{matchResult.score >= 70 ? '🟢 Sehr gut geeignet' : matchResult.score >= 40 ? '🟡 Teilweise geeignet' : '🔴 Wenig geeignet'}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="card">
                    <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>📝 Erklärung</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--ink2)', lineHeight: 1.7 }}>{matchResult.explanation}</p>
                  </div>
                  {matchResult.missingSkills?.length > 0 && (
                    <div className="card" style={{ borderLeft: '3px solid #c0392b' }}>
                      <div style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#c0392b' }}>❌ Fehlende Skills</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {matchResult.missingSkills.map((s: string) => <span key={s} className="badge" style={{ background: '#fef2f2', color: '#c0392b' }}>{s}</span>)}
                      </div>
                    </div>
                  )}
                  {matchResult.matchingSkills?.length > 0 && (
                    <div className="card" style={{ borderLeft: '3px solid #2d6a3f' }}>
                      <div style={{ fontWeight: 700, marginBottom: '0.75rem', color: '#2d6a3f' }}>✅ Passende Skills</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {matchResult.matchingSkills.map((s: string) => <span key={s} className="badge badge-green">{s}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANSCHREIBEN TAB */}
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
                <textarea className="form-input" value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={16} style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.8, fontSize: '0.92rem' }} />
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
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
                        {item.match_score && <span className={`match-score ${scoreClass(item.match_score)}`} style={{ width: 44, height: 44, fontSize: '0.85rem' }}>{item.match_score}%</span>}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--ink2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{item.job_description?.substring(0, 100)}...</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink3)', marginTop: 4 }}>{new Date(item.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
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
