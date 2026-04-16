import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import MapClient from './MapClient'

export default async function MarktplatzPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?redirect=/marktplatz')

  return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 62px)' }}>
        {/* Topbar */}
        <div style={{
          padding: '14px 24px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(15,15,23,0.88)', backdropFilter: 'blur(20px)',
        }}>
          <span style={{ fontSize: '1.2rem' }}>🗺️</span>
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
              Marktplatz
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 1 }}>
              Finde Fähigkeiten & Dienstleistungen in deiner Umgebung
            </p>
          </div>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <MapClient />
        </div>
      </div>
    </AppShell>
  )
}
