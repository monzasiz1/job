'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'
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
    setHistory([...(matches||[]).map((m:any)=>({...m,type:'match'})),...(apps||[]).map((a:any)=>({...a,type:'application'}))].sort((a,b)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime()))
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
      const res = await fetch('/api/analyze-resume', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ resumeText }) })
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
      const res = await fetch('/api/job-match', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ resumeText, jobDescription: jobDesc }) })
      const data = await res.json()
      setMatchResult(data)
      if (user) { await supabase.from('job_matches').insert({ user_id: user.id, job_description: jobDesc, match_score: data.score, analysis: JSON.stringify(data) }); loadHistory(user.id) }
      await findNearbyJobs(data.score)
    } catch { setMatchResult({ error: 'Fehler beim Matching' }) }
    setLoading(false)
  }

  const generateCoverLetter = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) return
    setLoading(true); setCoverLetter('')
    try {
      const res = await fetch('/api/generate-application', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ resumeText, jobDescription: jobDesc }) })
      const data = await res.json()
      setCoverLetter(data.coverLetter||'')
      if (user) { await supabase.from('applications').insert({ user_id: user.id, job_description: jobDesc, cover_letter: data.coverLetter }); loadHistory(user.id) }
    } catch { setCoverLetter('Fehler.') }
    setLoading(false)
  }

  const scoreClass = (s: number) => s>=70?'score-high':s>=40?'score-mid':'score-low'
  const scoreLabel = (s: number) => s>=70?'🟢 Sehr gut':s>=50?'🟡 Gut geeignet':s>=30?'🟠 Teilweise':'🔴 Wenig geeignet'
  const tabs = [{ id:'analyse',label:'Lebenslauf',icon:'🧠'},{ id:'matching',label:'Job-Matching',icon:'🎯'},{ id:'anschreiben',label:'Anschreiben',icon:'✍️'},{ id:'history',label:'Verlauf',icon:'📋'}]
  const logoClasses = ['logo-a','logo-b','logo-c','logo-d']

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <div>
            <span className="ai-badge" style={{ marginRight: 10 }}>✦ KI-Tools</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.1rem' }}>Karriere-Assistent</span>
          </div>
          <Link href="/jobs" className="btn btn-light btn-sm">← Zu den Jobs</Link>
        </div>

        {/* TAB BAR */}
        <div style={{ padding: '1.5rem 2rem 0' }}>
          <div className="tab-bar" style={{ maxWidth: 500 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id as Tab)} className={`tab-btn${tab===t.id?' active':''}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="page" style={{ paddingTop: '1rem' }}>

          {/* LEBENSLAUF INPUT */}
          {tab !== 'history' && (
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <label className="form-label" style={{ margin: 0 }}>Dein Lebenslauf</label>
                <span style={{ fontSize: '0.78rem', color: 'var(--ink3)' }}>Text einfügen oder tippen</span>
              </div>
              <textarea className="form-input" value={resumeText} onChange={e => setResumeText(e.target.value)}
                placeholder="Füge hier deinen Lebenslauf-Text ein..." rows={4} style={{ resize: 'vertical' }} />
            </div>
          )}

          {/* ANALYSE */}
          {tab === 'analyse' && (
            <div>
              <button onClick={analyzeResume} disabled={loading||!resumeText.trim()} className="form-submit" style={{ maxWidth: 260, borderRadius: 12 }}>
                {loading ? '🧠 Analysiere...' : '🧠 Lebenslauf analysieren'}
              </button>
              {analysis && !analysis.error && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: '1.25rem' }}>
                  <div className="card" style={{ borderTop: '3px solid var(--green)' }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'var(--green)', marginBottom: '1rem' }}>✅ Stärken</div>
                    <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
                      {(analysis.strengths||[]).map((s:string,i:number)=><li key={i} style={{ fontSize:'0.88rem', display:'flex', gap:8 }}><span style={{ color:'var(--green)', flexShrink:0 }}>✓</span>{s}</li>)}
                    </ul>
                  </div>
                  <div className="card" style={{ borderTop: '3px solid var(--pink)' }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'var(--pink)', marginBottom: '1rem' }}>⚠️ Schwächen</div>
                    <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
                      {(analysis.weaknesses||[]).map((w:string,i:number)=><li key={i} style={{ fontSize:'0.88rem', display:'flex', gap:8 }}><span style={{ color:'var(--pink)', flexShrink:0 }}>✗</span>{w}</li>)}
                    </ul>
                  </div>
                  <div className="card" style={{ gridColumn:'1/-1', borderTop: '3px solid var(--gold)' }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: 'var(--gold)', marginBottom: '1rem' }}>💡 Verbesserungen</div>
                    <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:8 }}>
                      {(analysis.improvements||[]).map((imp:string,i:number)=><li key={i} style={{ fontSize:'0.88rem', display:'flex', gap:8 }}><span style={{ color:'var(--gold)', flexShrink:0 }}>→</span>{imp}</li>)}
                    </ul>
                  </div>
                </div>
              )}
              {analysis?.error && <div className="alert alert-error" style={{ marginTop:'1rem' }}>{analysis.error}</div>}
            </div>
          )}

          {/* MATCHING */}
          {tab === 'matching' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: '1rem' }}>
                <div className="card">
                  <label className="form-label">Stellenanzeige</label>
                  <textarea className="form-input" value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Stellenanzeige einfügen..." rows={5} style={{ resize:'vertical' }} />
                </div>
                <div className="card">
                  <label className="form-label">Deine Stadt</label>
                  <input className="form-input" value={city} onChange={e => setCity(e.target.value)} placeholder="z.B. Krefeld, Düsseldorf..." />
                  <div style={{ fontSize:'0.78rem', color:'var(--ink3)', marginTop:8 }}>Für Job-Vorschläge in deiner Nähe</div>
                </div>
              </div>
              <button onClick={matchJob} disabled={loading||!resumeText.trim()||!jobDesc.trim()} className="form-submit" style={{ maxWidth: 240, borderRadius: 12 }}>
                {loading ? '🎯 Analysiere...' : '🎯 Eignung prüfen'}
              </button>

              {matchResult && !matchResult.error && (
                <div style={{ marginTop: '1.25rem', display:'flex', flexDirection:'column', gap:14 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:14 }}>
                    <div className="card" style={{ textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10 }}>
                      <div style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--ink3)' }}>Match</div>
                      <div className={`match-score ${scoreClass(matchResult.score)}`}>{matchResult.score}%</div>
                      <div style={{ fontSize:'0.78rem', color:'var(--ink2)', fontWeight:600 }}>{scoreLabel(matchResult.score)}</div>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                      <div className="card"><div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, marginBottom:'0.5rem', fontSize:'0.9rem' }}>Erklärung</div><p style={{ fontSize:'0.88rem', color:'var(--ink2)', lineHeight:1.7 }}>{matchResult.explanation}</p></div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                        {matchResult.matchingSkills?.length>0 && <div className="card" style={{ borderLeft:'3px solid var(--green)' }}><div style={{ fontWeight:700, color:'var(--green)', fontSize:'0.82rem', marginBottom:'0.5rem' }}>✅ Passende Skills</div><div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>{matchResult.matchingSkills.map((s:string)=><span key={s} className="badge badge-remote">{s}</span>)}</div></div>}
                        {matchResult.missingSkills?.length>0 && <div className="card" style={{ borderLeft:'3px solid var(--pink)' }}><div style={{ fontWeight:700, color:'var(--pink)', fontSize:'0.82rem', marginBottom:'0.5rem' }}>❌ Fehlende Skills</div><div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>{matchResult.missingSkills.map((s:string)=><span key={s} className="badge badge-new">{s}</span>)}</div></div>}
                      </div>
                    </div>
                  </div>

                  {matchResult.score >= 50 && (
                    <div className="card" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem', borderLeft:'4px solid var(--accent)' }}>
                      <div><div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, marginBottom:4 }}>✍️ Anschreiben generieren?</div><div style={{ fontSize:'0.85rem', color:'var(--ink2)' }}>Dein Match ist gut — jetzt Anschreiben erstellen.</div></div>
                      <button onClick={() => setTab('anschreiben')} className="btn btn-dark btn-sm" style={{ borderRadius:10 }}>Jetzt generieren →</button>
                    </div>
                  )}

                  {nearbyJobs.length > 0 && (
                    <div>
                      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, marginBottom:'0.75rem' }}>📍 Ähnliche Jobs {city?`in ${city}`:''}</div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:10 }}>
                        {nearbyJobs.map((job:any,i:number)=>(
                          <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration:'none' }}>
                            <div className="job-card-row" style={{ flexDirection:'column', alignItems:'flex-start', gap:'0.5rem' }}>
                              <div style={{ display:'flex', gap:10, alignItems:'center', width:'100%' }}>
                                <div className={`job-logo ${logoClasses[i%4]}`} style={{ width:38, height:38, fontSize:'0.78rem' }}>{job.company.substring(0,2).toUpperCase()}</div>
                                <div style={{ flex:1, minWidth:0 }}><div className="job-card-title">{job.title}</div><div className="job-card-company">{job.company}</div></div>
                                <div className="job-card-arrow" style={{ width:28, height:28, borderRadius:8, fontSize:'0.8rem' }}>→</div>
                              </div>
                              <div style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--green)' }}>{job.salary_min>0?`${job.salary_min.toLocaleString('de-DE')} €`:'n. V.'}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {matchResult?.error && <div className="alert alert-error" style={{ marginTop:'1rem' }}>{matchResult.error}</div>}
            </div>
          )}

          {/* ANSCHREIBEN */}
          {tab === 'anschreiben' && (
            <div>
              <div className="card" style={{ marginBottom:'1rem' }}>
                <label className="form-label">Stellenanzeige</label>
                <textarea className="form-input" value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Stellenanzeige einfügen..." rows={4} style={{ resize:'vertical' }} />
              </div>
              <button onClick={generateCoverLetter} disabled={loading||!resumeText.trim()||!jobDesc.trim()} className="form-submit" style={{ maxWidth:280, borderRadius:12 }}>
                {loading ? '✍️ Generiere...' : '✍️ Anschreiben generieren'}
              </button>
              {coverLetter && (
                <div className="card" style={{ marginTop:'1.25rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700 }}>📄 Ihr Anschreiben</div>
                    <button onClick={()=>{navigator.clipboard.writeText(coverLetter);setCopied(true);setTimeout(()=>setCopied(false),2000)}} className="btn btn-dark btn-sm" style={{ borderRadius:10 }}>
                      {copied?'✓ Kopiert':'📋 Kopieren'}
                    </button>
                  </div>
                  <textarea className="form-input" value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} rows={16} style={{ resize:'vertical', lineHeight:1.8, fontSize:'0.9rem' }} />
                </div>
              )}
            </div>
          )}

          {/* HISTORY */}
          {tab === 'history' && (
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1.1rem', marginBottom:'1rem' }}>Verlauf</div>
              {history.length === 0 ? (
                <div className="card" style={{ textAlign:'center', padding:'3rem' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>📋</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700 }}>Noch keine Aktivitäten</div>
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {history.map((item:any)=>(
                    <div key={item.id} className="card" style={{ display:'flex', gap:'1rem', alignItems:'flex-start', padding:'1rem 1.25rem' }}>
                      <div style={{ width:40, height:40, borderRadius:12, background:item.type==='match'?'#e8f0fc':'rgba(124,106,247,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>
                        {item.type==='match'?'🎯':'✍️'}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:'0.88rem', marginBottom:4 }}>{item.type==='match'?'Job-Matching':'Anschreiben'}</div>
                        <div style={{ fontSize:'0.8rem', color:'var(--ink3)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.job_description?.substring(0,80)}...</div>
                        <div style={{ fontSize:'0.72rem', color:'var(--ink3)', marginTop:4 }}>{new Date(item.created_at).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}</div>
                      </div>
                      {item.match_score && <div className={`match-score ${item.match_score>=70?'score-high':item.match_score>=40?'score-mid':'score-low'}`} style={{ width:44, height:44, fontSize:'0.82rem' }}>{item.match_score}%</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
