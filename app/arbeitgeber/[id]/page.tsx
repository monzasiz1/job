'use client'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'

interface Profile {
  id: string
  company_name: string
  avatar_url?: string
  location?: string
  website?: string
  bio?: string
  email: string
  created_at: string
}

interface Job {
  id: string
  title: string
  company: string
  location: string
  contract: string
  salary_min: number
  salary_max: number
  type: string
  cover_image_url?: string
}

export default function ArbeitgeberProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activeJobs, setActiveJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient()

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .eq('role', 'employer')
        .single()

      if (!profileData) {
        setNotFound(true)
        return
      }

      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', params.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      setProfile(profileData)
      setActiveJobs(jobsData || [])
      setLoading(false)
    }

    loadData()
  }, [params.id])

  if (notFound) {
    return (
      <>
        <Navbar />
        <div className="page" style={{ textAlign: 'center', padding: '4rem' }}>
          <h2 style={{ color: 'var(--ink)' }}>Profil nicht gefunden</h2>
        </div>
      </>
    )
  }

  if (loading || !profile) {
    return (
      <>
        <Navbar />
        <div className="page" style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ color: 'var(--ink2)' }}>Wird geladen...</div>
        </div>
      </>
    )
  }

  const logoClasses = ['logo-a', 'logo-b', 'logo-c', 'logo-d']

  return (
    <>
      <Navbar />

      {/* PROFILE HERO */}
      <div className="profile-hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Link href="/jobs" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: '2rem' }}>← Jobs</Link>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="profile-avatar">
              {profile.avatar_url ? <img src={profile.avatar_url} alt={profile.company_name} /> : profile.company_name?.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(200,169,81,0.12)', border: '1px solid rgba(200,169,81,0.25)', color: 'var(--gold2)', borderRadius: 100, padding: '4px 14px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>🏢 Arbeitgeber</div>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: 'white', marginBottom: '0.4rem' }}>{profile.company_name}</h1>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {profile.location && <span>📍 {profile.location}</span>}
                {profile.website && <a href={profile.website} target="_blank" rel="noopener" style={{ color: 'var(--gold2)', textDecoration: 'none' }}>🌐 Website</a>}
                <span>💼 {activeJobs.length} offene Stellen</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2.5rem', alignItems: 'start', marginTop: '-2rem' }}>

        {/* MAIN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {profile.bio && (
            <div className="card">
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.3rem', marginBottom: '1rem' }}>Über uns</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--ink2)', lineHeight: 1.85 }}>{profile.bio}</p>
            </div>
          )}

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1.3rem' }}>Offene Stellen ({activeJobs.length})</h2>
            </div>
            {activeJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--ink2)' }}>Aktuell keine offenen Stellen</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activeJobs.map((job, i) => (
                  <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem 1.25rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', transition: 'all 0.2s', background: 'white', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-gold)'; e.currentTarget.style.background = 'rgba(200,169,81,0.02)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'white' }}>
                      {job.cover_image_url ? (
                        <img src={job.cover_image_url} alt={job.title} style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div className={`company-logo ${logoClasses[i % 4]}`} style={{ width: 60, height: 60, flexShrink: 0 }}>{job.company.substring(0, 2).toUpperCase()}</div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{job.title}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--ink2)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <span>📍 {job.location}</span>
                          <span>⏰ {job.contract}</span>
                          {job.salary_min > 0 && <span style={{ color: 'var(--green)', fontWeight: 600 }}>{job.salary_min.toLocaleString('de-DE')} €</span>}
                        </div>
                      </div>
                      <span className={`badge ${job.type === 'Remote' ? 'badge-green' : job.type === 'Hybrid' ? 'badge-blue' : 'badge-amber'}`}>{job.type}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ position: 'sticky', top: 80, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card card-gold">
            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Kontakt</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
              {profile.location && <div style={{ display: 'flex', gap: 8 }}><span>📍</span><span>{profile.location}</span></div>}
              {profile.website && <div style={{ display: 'flex', gap: 8 }}><span>🌐</span><a href={profile.website} target="_blank" rel="noopener" style={{ color: 'var(--gold)', textDecoration: 'none' }}>{profile.website}</a></div>}
              <div style={{ display: 'flex', gap: 8 }}><span>✉️</span><a href={`mailto:${profile.email}`} style={{ color: 'var(--gold)', textDecoration: 'none' }}>{profile.email}</a></div>
            </div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💼</div>
            <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{activeJobs.length} offene Stellen</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink2)', marginBottom: '1rem' }}>Mitglied seit {new Date(profile.created_at).getFullYear()}</div>
          </div>
        </div>
      </div>
    </>
  )
}
