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

const TABS_EMP: { id: Tab; label: string; emoji: string }[] = [
  { id: 'overview', label: 'Übersicht', emoji: '🏠' },
  { id: 'marktplatz', label: 'Marktplatz', emoji: '🛒' },
  { id: 'jobs', label: 'Stellen', emoji: '💼' },
  { id: 'chats', label: 'Chats', emoji: '💬' },
]

const TABS_JS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'overview', label: 'Übersicht', emoji: '🏠' },
  { id: 'marktplatz', label: 'Marktplatz', emoji: '🛒' },
  { id: 'jobs', label: 'Jobs', emoji: '💼' },
  { id: 'chats', label: 'Chats', emoji: '💬' },
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
        background: 'rgba(15,15,23,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Top row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: isMobile ? '10px 14px' : '10px clamp(1rem, 4vw, 1.5rem)',
          minHeight: isMobile ? 48 : 52,
        }}>
          <div style={{
            width: isMobile ? 32 : 36, height: isMobile ? 32 : 36,
            borderRadius: 10, background: 'linear-gradient(135deg, #7c68fa, #a080ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#fff',
            overflow: 'hidden', flexShrink: 0,
          }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontWeight: 800, fontSize: isMobile ? '0.85rem' : '0.95rem', color: '#fff',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {profile.full_name}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            {isEmp && (
              <Link href="/post-job" style={{
                padding: isMobile ? '7px 12px' : '8px 16px',
                background: '#d4a843', color: '#000', borderRadius: 999,
                fontWeight: 700, fontSize: isMobile ? '0.7rem' : '0.78rem',
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}>＋ Stelle</Link>
            )}
            <Link href="/dashboard/einstellungen" style={{
              padding: isMobile ? '7px 10px' : '8px 14px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 999, color: 'rgba(255,255,255,0.5)',
              fontSize: isMobile ? '0.75rem' : '0.78rem', fontWeight: 700,
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}>⚙️{!isMobile ? ' Einstellungen' : ''}</Link>
          </div>
        </div>

        {/* TAB BAR */}
        <div style={{
          display: 'flex', gap: isMobile ? 0 : 4,
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
                  padding: isMobile ? '10px 8px' : '10px 18px',
                  background: 'transparent',
                  border: 'none', borderBottom: active ? '2px solid #7c68fa' : '2px solid transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.4)',
                  fontFamily: 'inherit', fontWeight: 700,
                  fontSize: isMobile ? '0.72rem' : '0.8rem',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}
              >
                <span style={{ fontSize: isMobile ? '1rem' : '0.9rem' }}>{t.emoji}</span>
                {(!isMobile || active) && <span>{t.label}</span>}
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
                { n: jobs.length, l: 'Stellen', c: '#7aa2f7', e: '💼' },
                { n: conversations.length, l: 'Chats', c: '#a080ff', e: '💬' },
                { n: myOfferings.length, l: 'Angebote', c: '#3dba7e', e: '🛒' },
                { n: interests.length, l: 'Bewerber', c: '#f06090', e: '💌' },
              ] : [
                { n: conversations.length, l: 'Chats', c: '#a080ff', e: '💬' },
                { n: myInterests.length, l: 'Favoriten', c: '#f06090', e: '❤️' },
                { n: myOfferings.length, l: 'Angebote', c: '#3dba7e', e: '🛒' },
                { n: myRequests.length, l: 'Gesuche', c: '#d4a843', e: '📋' },
              ]).map(s => (
                <div key={s.l} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: isMobile ? 14 : 16, padding: isMobile ? '12px' : '14px 16px',
                  cursor: 'pointer',
                }} onClick={() => {
                  if (s.l === 'Chats') setTab('chats')
                  else if (['Stellen', 'Jobs', 'Favoriten'].includes(s.l)) setTab('jobs')
                  else if (['Angebote', 'Gesuche'].includes(s.l)) setTab('marktplatz')
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: isMobile ? '1.2rem' : '1.1rem' }}>{s.e}</span>
                    <span style={{
                      fontWeight: 800, fontSize: isMobile ? '1.3rem' : '1.5rem', color: s.c,
                      fontFamily: 'sans-serif',
                    }}>{s.n}</span>
                  </div>
                  <div style={{
                    fontSize: isMobile ? '0.68rem' : '0.72rem',
                    color: 'rgba(255,255,255,0.35)', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Aufträge (immer sichtbar) */}
            <BookingsSection />

            {/* Schnellzugriff */}
            <div style={{ marginTop: 20 }}>
              <SectionTitle>Schnellzugriff</SectionTitle>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                gap: isMobile ? 8 : 10,
              }}>
                {[
                  { icon: '🗺️', label: 'Marktplatz', href: '/marktplatz', color: '#3dba7e' },
                  { icon: '💼', label: isEmp ? 'Stellen' : 'Jobs finden', href: isEmp ? '/post-job' : '/jobs', color: '#7aa2f7' },
                  { icon: '✦', label: 'KI-Tools', href: '/ki-tools', color: '#d4a843' },
                  ...(isEmp ? [] : [{ icon: '⭐', label: 'Favoriten', href: '/favoriten', color: '#f06090' }]),
                  { icon: '⚙️', label: 'Einstellungen', href: '/dashboard/einstellungen', color: '#888' },
                  { icon: '📊', label: 'Profil', href: isEmp ? `/arbeitgeber/${userId}` : `/bewerber/${userId}`, color: '#a080ff' },
                ].map(q => (
                  <Link key={q.label} href={q.href} style={{ textDecoration: 'none' }}>
                    <div style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: isMobile ? 14 : 16, padding: isMobile ? '14px 12px' : '16px',
                      cursor: 'pointer', transition: 'all 0.15s',
                      display: 'flex', flexDirection: 'column', gap: 6,
                      minHeight: isMobile ? 72 : 80,
                    }}>
                      <span style={{ fontSize: isMobile ? '1.3rem' : '1.4rem' }}>{q.icon}</span>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: isMobile ? '0.78rem' : '0.85rem' }}>{q.label}</span>
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
                background: 'linear-gradient(135deg, #3dba7e, #2ea36d)',
                color: '#fff', borderRadius: 12, fontWeight: 700,
                fontSize: isMobile ? '0.78rem' : '0.85rem', textDecoration: 'none',
              }}>🗺️ Marktplatz öffnen</Link>
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
                    background: 'linear-gradient(135deg, #7c68fa, #6a5acd)',
                    color: '#fff', borderRadius: 12, fontWeight: 700,
                    fontSize: isMobile ? '0.78rem' : '0.85rem', textDecoration: 'none',
                  }}>🔍 Jobs durchsuchen</Link>
                </div>
                <InterestsSection myInterests={myInterests} />
              </>
            )}

            {/* Interessierte Bewerber (Arbeitgeber) */}
            {isEmp && interests.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <SectionTitle>💌 Interessierte Bewerber <CountBadge n={interests.length} color="#f06090" /></SectionTitle>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: isMobile ? 8 : 10,
                }}>
                  {interests.slice(0, 6).map((interest: any) => (
                    <div key={interest.id} style={{
                      background: 'rgba(240,96,144,0.04)', border: '1px solid rgba(240,96,144,0.12)',
                      borderRadius: 14, padding: isMobile ? '12px' : '14px',
                      display: 'flex', gap: 10, alignItems: 'center',
                    }}>
                      {interest.applicant?.avatar_url
                        ? <img src={interest.applicant.avatar_url} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                        : <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(240,96,144,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#f06090', fontSize: '0.8rem', flexShrink: 0 }}>
                            {(interest.applicant?.full_name || '?').slice(0, 2).toUpperCase()}
                          </div>}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{interest.applicant?.full_name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{interest.job?.title}</div>
                      </div>
                      <Link href={`/chat?employer=${userId}&applicant=${interest.applicant_id}&job=${interest.job_id}`} style={{
                        padding: '7px 12px', background: '#f06090', color: '#fff', borderRadius: 10,
                        fontWeight: 700, fontSize: '0.72rem', textDecoration: 'none', flexShrink: 0,
                      }}>💬</Link>
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
      fontWeight: 800, fontSize: '0.88rem', color: '#fff',
      marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {children}
    </div>
  )
}

function CountBadge({ n, color }: { n: number; color: string }) {
  return (
    <span style={{
      padding: '2px 8px', background: color + '18', border: `1px solid ${color}33`,
      borderRadius: 999, fontSize: '0.68rem', fontWeight: 700, color,
    }}>{n}</span>
  )
}
