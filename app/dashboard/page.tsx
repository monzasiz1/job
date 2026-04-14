import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import AppShell from '@/components/AppShell'
import ChatsSection from './ChatsSection'
import InterestsSection from './InterestsSection'

export default async function Dashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile) redirect('/register')
  const isEmp = profile.role === 'employer'
  let jobs: any[] = []
  let interests: any[] = []
  let conversations: any[] = []
  let myInterests: any[] = []

  if (isEmp) {
    // ARBEITGEBER: Meine Stellen
    const { data } = await supabase.from('jobs').select('*').eq('employer_id', user.id).order('created_at', { ascending: false })
    jobs = data || []
    
    // ARBEITGEBER: Interessierte Bewerber (an meinen Stellen)
    const jobIds = jobs.map((j: any) => j.id) || []
    if (jobIds.length > 0) {
      const { data: intData } = await supabase
        .from('job_interests')
        .select('*, applicant:applicant_id(full_name, avatar_url, bio), job:job_id(id, title)')
        .eq('action', 'like')
        .in('job_id', jobIds)
        .order('created_at', { ascending: false })
      interests = intData || []
    }

    // ARBEITGEBER: Meine Chats
    const { data: convData } = await supabase
      .from('conversations')
      .select('*, applicant:applicant_id(full_name, avatar_url), job:job_id(title)')
      .eq('employer_id', user.id)
      .order('last_message_at', { ascending: false })
      .limit(5)
    conversations = convData || []
  } else {
    // BEWERBER: Meine Chat-Konversationen
    const { data: convData } = await supabase
      .from('conversations')
      .select('*, employer:employer_id(full_name, avatar_url, company_name), job:job_id(title, company)')
      .eq('applicant_id', user.id)
      .order('last_message_at', { ascending: false })
      .limit(5)
    conversations = convData || []

    // BEWERBER: Jobs an denen ich interessiert bin
    const { data: intData } = await supabase
      .from('job_interests')
      .select('*, job:job_id(id, title, company, location, salary_min, salary_max)')
      .eq('applicant_id', user.id)
      .eq('action', 'like')
      .order('created_at', { ascending: false })
      .limit(6)
    myInterests = intData || []
  }
  const lc = ['ja','jb','jc','jd']
  const initials = profile.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || '?'

  return (
    <AppShell>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,15,23,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1.5rem', height: 60 }}>
        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', flex: 1 }}>Dashboard</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {isEmp && <Link href="/post-job" style={{ padding: '8px 16px', background: '#d4a843', color: '#000', borderRadius: 999, fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>＋ Stelle inserieren</Link>}
          <Link href="/ki-tools" style={{ padding: '8px 16px', background: '#7c68fa', color: '#fff', borderRadius: 999, fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>✦ KI-Tools</Link>
        </div>
      </div>

      <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>

        {/* PROFIL CARD */}
        <div style={{ background: 'linear-gradient(135deg, rgba(124,104,250,0.1), rgba(124,104,250,0.04))', border: '1px solid rgba(124,104,250,0.2)', borderRadius: 20, padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg, #7c68fa, #a080ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.4rem', color: '#fff', flexShrink: 0, overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)' }}>
            {profile.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: 4 }}>{profile.full_name}</div>
            <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>
              {isEmp ? `🏢 ${profile.company_name || 'Arbeitgeber'}` : '🔍 Auf Jobsuche'}
              {profile.location && ` · 📍 ${profile.location}`}
              {!profile.bio && <span style={{ color: '#f06090', marginLeft: 8 }}>⚠️ Bio fehlt noch</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <Link href="/dashboard/profil" style={{ padding: '9px 18px', background: 'rgba(124,104,250,0.2)', border: '1px solid rgba(124,104,250,0.3)', borderRadius: 999, color: '#a080ff', fontSize: '0.83rem', fontWeight: 700, textDecoration: 'none' }}>✏️ Profil bearbeiten</Link>
            {!isEmp && <Link href={`/bewerber/${user.id}`} style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem', fontWeight: 700, textDecoration: 'none' }}>Profil ansehen</Link>}
            {isEmp && <Link href={`/arbeitgeber/${user.id}`} style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem', fontWeight: 700, textDecoration: 'none' }}>Firmenprofil</Link>}
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
          {(isEmp ? [
            [jobs.length, 'Aktive Stellen', '#7aa2f7'],
            [jobs.length * 12, 'Aufrufe', '#3dba7e'],
            [jobs.length * 3, 'Bewerbungen', '#d4a843'],
            ['–', 'KI-Matches', '#a080ff'],
          ] : [
            ['0', 'Bewerbungen', '#a080ff'],
            ['0', 'Favoriten', '#3dba7e'],
            ['–', 'Analysen', '#d4a843'],
            ['65%', 'Match-Score', '#f06090'],
          ]).map(([n, l, c]: any) => (
            <div key={l} style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '1.1rem' }}>
              <div style={{ fontFamily: 'sans-serif', fontSize: '1.8rem', fontWeight: 800, color: c }}>{n}</div>
              <div style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.3)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}>{l}</div>
            </div>
          ))}
        </div>

        {/* ARBEITGEBER: Stellen */}
        {isEmp && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>Meine Stellen</div>
              <Link href="/post-job" style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>＋ Neu</Link>
            </div>
            {jobs.length === 0 ? (
              <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '3rem', textAlign: 'center' as const }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
                <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Noch keine Stellen</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>Schalten Sie Ihre erste Stelle live.</div>
                <Link href="/post-job" style={{ padding: '11px 22px', background: '#d4a843', color: '#000', borderRadius: 999, fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>Erste Stelle inserieren →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                {jobs.map((j, i) => (
                  <div key={j.id} style={{ background: '#17172a', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', padding: '1rem 1.1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {j.cover_image_url
                      ? <img src={j.cover_image_url} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                      : <div className={`jlogo ${lc[i%4]}`} style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>{j.company.slice(0,2).toUpperCase()}</div>}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', marginBottom: 3 }}>{j.title}</div>
                      <div style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.3)', display: 'flex', gap: 10 }}>
                        <span>📍 {j.location}</span><span>⏰ {j.contract}</span>
                        <span>{new Date(j.created_at).toLocaleDateString('de-DE')}</span>
                      </div>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: j.is_active ? 'rgba(61,186,126,0.15)' : 'rgba(255,255,255,0.07)', color: j.is_active ? '#3dba7e' : 'rgba(255,255,255,0.3)' }}>{j.is_active ? 'Aktiv' : 'Inaktiv'}</span>
                    <Link href={`/jobs/${j.id}`} style={{ padding: '7px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', flexShrink: 0 }}>Ansehen</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BEWERBER: Meine Chat-Konversationen */}
        {!isEmp && <ChatsSection conversations={conversations} isEmp={false} />}

        {/* BEWERBER: Interessierte Jobs */}
        {!isEmp && <InterestsSection myInterests={myInterests} />}

        {/* ARBEITGEBER: Meine Chats */}
        {isEmp && <ChatsSection conversations={conversations} isEmp={true} />}

        {/* ARBEITGEBER: Interessierte Bewerber */}
        {isEmp && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>💌 Interessierte Bewerber</span>
                {interests.length > 0 && <span style={{ padding: '2px 10px', background: 'rgba(240,96,144,0.15)', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, color: '#f06090' }}>{interests.length}</span>}
              </div>
              {interests.length > 0 && <Link href={`/arbeitgeber/${user.id}`} style={{ padding: '7px 14px', background: 'rgba(240,96,144,0.15)', border: '1px solid rgba(240,96,144,0.2)', borderRadius: 999, color: '#f06090', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>Alle ansehen →</Link>}
            </div>
            {interests.length === 0 ? (
              <div style={{ background: '#17172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '2rem', textAlign: 'center' as const }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💭</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.88rem' }}>Noch keine Interessenten. Deine Stellen werden bald angezeigt, wenn sich Bewerber als interessiert melden.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                {interests.slice(0, 4).map((interest: any) => (
                  <Link key={interest.id} href={`/bewerber/${interest.applicant_id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'rgba(240,96,144,0.04)', border: '1px solid rgba(240,96,144,0.12)', borderRadius: 14, padding: '1rem', transition: 'all 0.18s', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', gap: 10, marginBottom: '0.75rem', alignItems: 'center' }}>
                        {interest.applicant?.avatar_url
                          ? <img src={interest.applicant.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
                          : <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(240,96,144,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#f06090', fontSize: '0.85rem' }}>
                              {(interest.applicant?.full_name || '?').slice(0,2).toUpperCase()}
                            </div>}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{interest.applicant?.full_name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>für {interest.job?.title}</div>
                        </div>
                      </div>
                      {interest.applicant?.bio && (
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{interest.applicant.bio}"</div>
                      )}
                      <div style={{ marginTop: '0.75rem', color: '#f06090', fontSize: '0.75rem', fontWeight: 700 }}>→ Profil öffnen</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BEWERBER: Schnellzugriff */}
        {!isEmp && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 14 }}>
            {[
              { ic: '◈', t: 'Jobs finden', d: 'Tausende aktuelle Stellen in deiner Region.', h: '/jobs', c: 'rgba(124,104,250,0.12)', b: 'rgba(124,104,250,0.2)' },
              { ic: '✦', t: 'KI-Assistent', d: 'Lebenslauf analysieren, matchen, Anschreiben generieren.', h: '/ki-tools', c: 'rgba(212,168,67,0.07)', b: 'rgba(212,168,67,0.18)' },
              { ic: '⭐', t: 'Favoriten', d: 'Deine gespeicherten Stellenanzeigen.', h: '/favoriten', c: 'rgba(61,186,126,0.07)', b: 'rgba(61,186,126,0.18)' },
            ].map(c => (
              <Link key={c.t} href={c.h} style={{ textDecoration: 'none' }}>
                <div style={{ background: c.c, border: `1px solid ${c.b}`, borderRadius: 20, padding: '1.5rem', cursor: 'pointer', transition: 'all 0.18s', height: '100%' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: '0.7rem', color: '#a080ff' }}>{c.ic}</div>
                  <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.35rem', fontSize: '0.92rem' }}>{c.t}</div>
                  <div style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>{c.d}</div>
                  <div style={{ marginTop: '1rem', color: '#a080ff', fontSize: '0.79rem', fontWeight: 700 }}>Öffnen →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .jlogo { display:flex;align-items:center;justify-content:center; }
        .ja{background:rgba(30,64,175,0.2);color:#7aa2f7}
        .jb{background:rgba(212,168,67,0.18);color:#d4a843}
        .jc{background:rgba(240,96,144,0.18);color:#f06090}
        .jd{background:rgba(61,186,126,0.18);color:#3dba7e}
      `}</style>
    </AppShell>
  )
}
