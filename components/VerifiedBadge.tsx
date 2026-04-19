'use client'

/**
 * Verified by Talento — Goldener Haken
 * Zeigt das Verifizierungssiegel neben dem Namen an.
 * 
 * Usage: <VerifiedBadge verified={profile.verified} size="md" />
 */
export default function VerifiedBadge({
  verified,
  size = 'md',
  showLabel = false,
}: {
  verified?: boolean | null
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}) {
  if (!verified) return null

  const s = size === 'sm' ? 16 : size === 'lg' ? 28 : 20
  const fs = size === 'sm' ? '0.68rem' : size === 'lg' ? '0.85rem' : '0.75rem'

  return (
    <span className="verified-badge" title="Verified by Talento" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 1L14.4 3.3L17.6 2.6L18.5 5.7L21.5 6.8L20.8 10L23 12L20.8 14L21.5 17.2L18.5 18.3L17.6 21.4L14.4 20.7L12 23L9.6 20.7L6.4 21.4L5.5 18.3L2.5 17.2L3.2 14L1 12L3.2 10L2.5 6.8L5.5 5.7L6.4 2.6L9.6 3.3L12 1Z" fill="url(#gold-grad)" stroke="#c5960a" strokeWidth="0.5"/>
        <path d="M8.5 12L11 14.5L16 9.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="gold-grad" x1="1" y1="1" x2="23" y2="23" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f5d442"/>
            <stop offset="50%" stopColor="#d4a843"/>
            <stop offset="100%" stopColor="#c5960a"/>
          </linearGradient>
        </defs>
      </svg>
      {showLabel && (
        <span style={{ fontSize: fs, fontWeight: 700, color: '#d4a843', whiteSpace: 'nowrap' }}>
          Verified
        </span>
      )}
    </span>
  )
}
