'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import AppShell from '@/components/AppShell'
import StripeOnboarding from '@/components/StripeOnboarding'
import Link from 'next/link'

export default function Einstellungen() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [notifyBookings, setNotifyBookings] = useState(true)
  const [notifyMessages, setNotifyMessages] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.push('/login'); return }
      const { data: p } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      if (p) setProfile(p)
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'rgba(255,255,255,0.3)' }}>Laden...</div>
    </AppShell>
  )

  return (
    <AppShell>
      {/* HEADER */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(15,15,23,0.95)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '0 clamp(1rem, 4vw, 1.5rem)', height: 56, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Link href="/dashboard" style={{
          padding: '6px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none',
        }}>← Zurück</Link>
        <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>Einstellungen</span>
      </div>

      <div style={{ padding: 'clamp(1rem, 4vw, 1.5rem)', maxWidth: 640, margin: '0 auto' }}>

        {/* PROFIL */}
        <SettingsSection title="Profil" emoji="👤">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg, #7c68fa, #a080ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1rem', color: '#fff', overflow: 'hidden', flexShrink: 0,
            }}>
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : (profile?.full_name || '?').slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{profile?.full_name}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                {profile?.role === 'employer' ? '🏢 Arbeitgeber' : '🔍 Jobsuchend'}
                {profile?.location && ` · 📍 ${profile.location}`}
              </div>
            </div>
          </div>
          <Link href="/dashboard/profil" style={{
            display: 'block', textAlign: 'center',
            padding: '12px', background: 'rgba(124,104,250,0.12)', border: '1px solid rgba(124,104,250,0.2)',
            borderRadius: 12, color: '#a080ff', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
          }}>✏️ Profil bearbeiten</Link>
        </SettingsSection>

        {/* ZAHLUNGSKONTO */}
        <SettingsSection title="Zahlungskonto" emoji="💳">
          <StripeOnboarding />
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6, marginTop: 8 }}>
            Dein Zahlungskonto wird über Stripe verwaltet. 10% Plattformgebühr pro Transaktion.
          </div>
        </SettingsSection>

        {/* BENACHRICHTIGUNGEN */}
        <SettingsSection title="Benachrichtigungen" emoji="🔔">
          <ToggleRow
            label="Auftrags-Benachrichtigungen"
            desc="Bei neuen Buchungen und Statusänderungen"
            active={notifyBookings}
            onToggle={() => setNotifyBookings(!notifyBookings)}
          />
          <ToggleRow
            label="Chat-Nachrichten"
            desc="Bei neuen Nachrichten im Chat"
            active={notifyMessages}
            onToggle={() => setNotifyMessages(!notifyMessages)}
          />
        </SettingsSection>

        {/* KONTO */}
        <SettingsSection title="Konto" emoji="⚙️">
          <button onClick={handleLogout} style={{
            width: '100%', padding: '14px', border: 'none', borderRadius: 12,
            background: 'rgba(240,96,144,0.1)', color: '#f06090',
            fontFamily: 'inherit', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
            marginBottom: 10,
          }}>Abmelden</button>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginTop: 8 }}>
            Talento v1.0 · Fragen? support@talento.de
          </div>
        </SettingsSection>

      </div>
    </AppShell>
  )
}

function SettingsSection({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 18, padding: 'clamp(1rem, 3vw, 1.25rem)', marginBottom: 14,
    }}>
      <div style={{
        fontWeight: 800, fontSize: '0.82rem', color: '#fff',
        marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8,
        textTransform: 'uppercase', letterSpacing: '0.03em',
      }}>
        <span>{emoji}</span> {title}
      </div>
      {children}
    </div>
  )
}

function ToggleRow({ label, desc, active, onToggle }: { label: string; desc: string; active: boolean; onToggle: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#fff' }}>{label}</div>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>{desc}</div>
      </div>
      <button onClick={onToggle} style={{
        width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
        background: active ? '#3dba7e' : 'rgba(255,255,255,0.12)',
        position: 'relative', transition: 'background 0.2s', flexShrink: 0,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%', background: '#fff',
          position: 'absolute', top: 3,
          left: active ? 23 : 3,
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  )
}
