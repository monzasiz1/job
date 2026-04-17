'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ChatsSection from './ChatsSection'
import InterestsSection from './InterestsSection'
import JobsManagement from './JobsManagement'
import OfferingsManagement from './OfferingsManagement'
import RequestsManagement from './RequestsManagement'
import BookingsSection from './BookingsSection'

type Tab = 'overview' | 'marktplatz' | 'jobs' | 'chats'

const TABS_EMP: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Übersicht' },
  { id: 'marktplatz', label: 'Marktplatz' },
  { id: 'jobs', label: 'Stellen' },
  { id: 'chats', label: 'Chats' },
]

const TABS_JS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Übersicht' },
  { id: 'marktplatz', label: 'Marktplatz' },
  { id: 'jobs', label: 'Jobs' },
  { id: 'chats', label: 'Chats' },
]

interface Props {
  profile: any
  userId: string
  isEmp: boolean
  jobs: any[]
  conversations: any[]
  interests: any[]
  myInterests: any[]
  myOfferings: any[]
  myRequests: any[]
  lc: string[]
}

export default function DashboardClient({
  profile, userId, isEmp, jobs, conversations,
  interests, myInterests, myOfferings, myRequests, lc,
}: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const tabs = isEmp ? TABS_EMP : TABS_JS
  const initials = profile.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <>
      {/* STICKY HEADER */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(15,15,23,0.97)', backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Top row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: isMobile ? '12px 16px' : '14px clamp(1rem, 4vw, 1.5rem)',
          minHeight: isMobile ? 50 : 56,
        }}>
          <div style={{
            width: isMobile ? 32 : 34, height: isMobile ? 32 : 34,
            borderRadius: 8, background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: isMobile ? '0.68rem' : '0.75rem', color: 'rgba(255,255,255,0.7)',
            overflow: 'hidden', flexShrink: 0, letterSpacing: '0.02em',
          }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 700, fontSize: isMobile ? '0.88rem' : '0.95rem', color: '#fff',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              letterSpacing: '-0.01em',
            }}>
              {profile.full_name}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {isEmp && (
              <Link href="/post-job" style={{
                padding: isMobile ? '7px 14px' : '8px 18px',
                background: '#fff', color: '#000', borderRadius: 8,
                fontWeight: 700, fontSize: isMobile ? '0.72rem' : '0.78rem',
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}>Neue Stelle</Link>
            )}
            <Link href="/dashboard/einstellungen" style={{
              padding: isMobile ? '7px 12px' : '8px 16px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, color: 'rgba(255,255,255,0.5)',
              fontSize: isMobile ? '0.72rem' : '0.78rem', fontWeight: 600,
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>{!isMobile ? 'Einstellungen' : '⚙'}</Link>
          </div>
        </div>

        {/* TAB BAR */}
        <div style={{
          display: 'flex', gap: 0,
          padding: isMobile ? '0' : '0 clamp(1rem, 4vw, 1.5rem)',
          overflowX: 'auto', WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}>
          {tabs.map(t => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: isMobile ? 1 : 'none',
                  padding: isMobile ? '10px 12px' : '11px 20px',
                  background: 'transparent',
                  border: 'none', borderBottom: active ? '2px solid #fff' : '2px solid transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.35)',
                  fontFamily: 'inherit', fontWeight: 600,
                  fontSize: isMobile ? '0.76rem' : '0.82rem',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'color 0.15s, border-color 0.15s',
                  letterSpacing: '-0.01em',
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{
        padding: isMobile ? '1rem 0.85rem' : 'clamp(1rem, 4vw, 1.5rem)',
        maxWidth: 920, margin: '0 auto',
      }}>

        {/* ──── ÜBERSICHT ──── */}
        {tab === 'overview' && (
          <>
            {/* Kompakte Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: isMobile ? 8 : 10, marginBottom: isMobile ? 16 : 20,
            }}>
              {(isEmp ? [
                { n: jobs.length, l: 'Stellen' },
                { n: conversations.length, l: 'Chats' },
                { n: myOfferings.length, l: 'Angebote' },
                { n: interests.length, l: 'Bewerber' },
              ] : [
                { n: conversations.length, l: 'Chats' },
                { n: myInterests.length, l: 'Favoriten' },
                { n: myOfferings.length, l: 'Angebote' },
                { n: myRequests.length, l: 'Gesuche' },
              ]).map(s => (
                <div key={s.l} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 10, padding: isMobile ? '14px 12px' : '16px',
                  cursor: 'pointer', transition: 'border-color 0.15s',
                }} onClick={() => {
                  if (s.l === 'Chats') setTab('chats')
                  else if (['Stellen', 'Jobs', 'Favoriten'].includes(s.l)) setTab('jobs')
                  else if (['Angebote', 'Gesuche'].includes(s.l)) setTab('marktplatz')
                }}>
                  <div style={{
                    fontWeight: 700, fontSize: isMobile ? '1.5rem' : '1.75rem', color: '#fff',
                    letterSpacing: '-0.02em', marginBottom: 4,
                  }}>{s.n}</div>
                  <div style={{
                    fontSize: isMobile ? '0.68rem' : '0.72rem',
                    color: 'rgba(255,255,255,0.35)', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Aufträge (immer sichtbar) */}
            <BookingsSection />

            {/* Schnellzugriff */}
            <div style={{ marginTop: 24 }}>
              <SectionTitle>Schnellzugriff</SectionTitle>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                gap: isMobile ? 8 : 10,
              }}>
                {[
                  { label: 'Marktplatz', href: '/marktplatz', desc: 'Angebote & Gesuche' },
                  { label: isEmp ? 'Stelle inserieren' : 'Jobs finden', href: isEmp ? '/post-job' : '/jobs', desc: isEmp ? 'Neue Anzeige erstellen' : 'Stellenangebote durchsuchen' },
                  { label: 'KI-Tools', href: '/ki-tools', desc: 'Analyse & Matching' },
                  ...(isEmp ? [] : [{ label: 'Favoriten', href: '/favoriten', desc: 'Gespeicherte Jobs' }]),
                  { label: 'Einstellungen', href: '/dashboard/einstellungen', desc: 'Konto & Profil' },
                  { label: 'Profil ansehen', href: isEmp ? `/arbeitgeber/${userId}` : `/bewerber/${userId}`, desc: 'Öffentliches Profil' },
                ].map(q => (
                  <Link key={q.label} href={q.href} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 10, padding: isMobile ? '14px 12px' : '16px',
                      cursor: 'pointer', transition: 'border-color 0.15s',
                      display: 'flex', flexDirection: 'column', gap: 4,
                      minHeight: isMobile ? 64 : 72,
                    }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: isMobile ? '0.82rem' : '0.88rem' }}>{q.label}</span>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{q.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ──── MARKTPLATZ TAB ──── */}
        {tab === 'marktplatz' && (
          <>
            <div style={{
              display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap',
            }}>
              <Link href="/marktplatz" style={{
                padding: isMobile ? '10px 16px' : '10px 20px',
                background: '#fff', color: '#000', borderRadius: 8, fontWeight: 700,
                fontSize: isMobile ? '0.78rem' : '0.85rem', textDecoration: 'none',
              }}>Marktplatz öffnen</Link>
            </div>
            <OfferingsManagement offerings={myOfferings} />
            <div style={{ height: 12 }} />
            <RequestsManagement requests={myRequests} />
          </>
        )}

        {/* ──── JOBS TAB ──── */}
        {tab === 'jobs' && (
          <>
            {isEmp ? (
              <JobsManagement jobs={jobs} lc={lc} />
            ) : (
              <>
                <div style={{
                  display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap',
                }}>
                  <Link href="/jobs" style={{
                    padding: isMobile ? '10px 16px' : '10px 20px',
                    background: '#fff', color: '#000', borderRadius: 8, fontWeight: 700,
                    fontSize: isMobile ? '0.78rem' : '0.85rem', textDecoration: 'none',
                  }}>Jobs durchsuchen</Link>
                </div>
                <InterestsSection myInterests={myInterests} />
              </>
            )}

            {/* Interessierte Bewerber (Arbeitgeber) */}
            {isEmp && interests.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <SectionTitle>Interessierte Bewerber <CountBadge n={interests.length} color="rgba(255,255,255,0.5)" /></SectionTitle>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: isMobile ? 8 : 10,
                }}>
                  {interests.slice(0, 6).map((interest: any) => (
                    <div key={interest.id} style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 10, padding: isMobile ? '12px' : '14px',
                      display: 'flex', gap: 10, alignItems: 'center',
                    }}>
                      {interest.applicant?.avatar_url
                        ? <img src={interest.applicant.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                        : <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', flexShrink: 0 }}>
                            {(interest.applicant?.full_name || '?').slice(0, 2).toUpperCase()}
                          </div>}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{interest.applicant?.full_name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{interest.job?.title}</div>
                      </div>
                      <Link href={`/chat?employer=${userId}&applicant=${interest.applicant_id}&job=${interest.job_id}`} style={{
                        padding: '7px 14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff', borderRadius: 8,
                        fontWeight: 600, fontSize: '0.72rem', textDecoration: 'none', flexShrink: 0,
                      }}>Chat</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ──── CHATS TAB ──── */}
        {tab === 'chats' && (
          <ChatsSection conversations={conversations} isEmp={isEmp} />
        )}
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 0; height: 0; }
        .jlogo { display:flex;align-items:center;justify-content:center; }
        .ja{background:rgba(30,64,175,0.2);color:#7aa2f7}
        .jb{background:rgba(212,168,67,0.18);color:#d4a843}
        .jc{background:rgba(240,96,144,0.18);color:#f06090}
        .jd{background:rgba(61,186,126,0.18);color:#3dba7e}
      `}</style>
    </>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontWeight: 600, fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)',
      marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
      textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      {children}
    </div>
  )
}

function CountBadge({ n, color }: { n: number; color: string }) {
  return (
    <span style={{
      padding: '2px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 6, fontSize: '0.68rem', fontWeight: 700, color,
    }}>{n}</span>
  )
}
