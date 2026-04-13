'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

export default function FavoriteButton({ jobId, size = 'md' }: { jobId: string, size?: 'sm' | 'md' }) {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUser(data.user)
      const { data: fav } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', data.user.id)
        .eq('job_id', jobId)
        .single()
      setSaved(!!fav)
    })
  }, [jobId])

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { router.push('/login'); return }
    setLoading(true)
    if (saved) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('job_id', jobId)
      setSaved(false)
    } else {
      await supabase.from('favorites').insert({ user_id: user.id, job_id: jobId })
      setSaved(true)
    }
    setLoading(false)
  }

  const s = size === 'sm' ? 30 : 36
  const fs = size === 'sm' ? '0.85rem' : '1rem'

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
      style={{
        width: s, height: s,
        borderRadius: 10,
        border: `1px solid ${saved ? 'rgba(212,168,67,0.4)' : 'var(--border2)'}`,
        background: saved ? 'rgba(212,168,67,0.12)' : 'var(--surface2)',
        color: saved ? '#d4a843' : 'var(--text3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: loading ? 'wait' : 'pointer',
        fontSize: fs,
        transition: 'all 0.2s',
        flexShrink: 0,
      }}
    >
      {saved ? '★' : '☆'}
    </button>
  )
}
