/**
 * Talento Brand Logo — "Network T"
 *
 * Konzept: Die T-Form wird als Talent-Netzwerk-Graph gezeichnet —
 * drei weiße Knoten (Jobs / Menschen) verbunden durch
 * einen goldenen Hub in der Mitte + Sparkle-Stern oben.
 *
 * TalentoMark     – Icon-only Badge
 * TalentoWordmark – Badge + "Talento" Text  (size="sm"|"md"|"lg")
 */

// ─── Mark ─────────────────────────────────────────────────────────────────────

export const TalentoMark = ({
  size = 32,
  radius,
}: {
  size?: number
  radius?: number
}) => {
  const r = radius ?? Math.round(size * 0.27)
  const inner = Math.round(size * 0.64)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: 'linear-gradient(145deg, #4a3de0 0%, #8a38cc 48%, #c07a20 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 14px rgba(124,104,250,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top shine */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '48%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 100%)',
        borderRadius: `${r}px ${r}px 0 0`,
        pointerEvents: 'none',
      }} />

      <svg viewBox="0 0 24 24" fill="none" style={{ width: inner, height: inner, display: 'block' }}>

        {/* ── T-Linien (zuerst, damit Knoten darüber liegen) ── */}
        <line x1="3.5" y1="10" x2="20.5" y2="10"
          stroke="white" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="12" y1="10" x2="12" y2="21"
          stroke="white" strokeWidth="3.5" strokeLinecap="round" />

        {/* ── Drei End-Knoten (Jobs / Menschen) ── */}
        <circle cx="3.5"  cy="10" r="1.55" fill="white" opacity="0.88" />
        <circle cx="20.5" cy="10" r="1.55" fill="white" opacity="0.88" />
        <circle cx="12"   cy="21" r="1.55" fill="white" opacity="0.88" />

        {/* ── Goldener Hub in der Mitte (Triple-Ring für Tiefe) ── */}
        <circle cx="12" cy="10" r="2.7"  fill="rgba(212,168,67,0.28)" />
        <circle cx="12" cy="10" r="1.85" fill="#d4a843" />
        <circle cx="12" cy="10" r="0.95" fill="#ffe070" />

        {/* ── 4-Punkt-Stern (Talent-Spark) ── */}
        <path
          d="M12 2.2 L12.52 3.85 L14.3 4.32 L12.52 4.79 L12 6.44 L11.48 4.79 L9.7 4.32 L11.48 3.85 Z"
          fill="#ffd060"
        />
        {/* Diagonale Mikro-Strahlen des Sterns */}
        <line x1="10.5" y1="2.9" x2="9.2"  y2="1.9"  stroke="#ffd060" strokeWidth="0.55" strokeLinecap="round" opacity="0.6" />
        <line x1="13.5" y1="2.9" x2="14.8" y2="1.9"  stroke="#ffd060" strokeWidth="0.55" strokeLinecap="round" opacity="0.6" />
        <line x1="10.5" y1="5.7" x2="9.2"  y2="6.7"  stroke="#ffd060" strokeWidth="0.55" strokeLinecap="round" opacity="0.4" />
        <line x1="13.5" y1="5.7" x2="14.8" y2="6.7"  stroke="#ffd060" strokeWidth="0.55" strokeLinecap="round" opacity="0.4" />

        {/* ── Zwei Akzent-Punkte neben dem Stern ── */}
        <circle cx="7.8"  cy="3.9" r="0.52" fill="rgba(255,210,80,0.6)" />
        <circle cx="16.2" cy="3.9" r="0.52" fill="rgba(255,210,80,0.6)" />

      </svg>
    </div>
  )
}

// ─── Wordmark ─────────────────────────────────────────────────────────────────

const SIZES = {
  sm: { iconSize: 28, iconRadius: 8,  fontSize: '1rem',    gap: 8  },
  md: { iconSize: 32, iconRadius: 9,  fontSize: '1.08rem', gap: 9  },
  lg: { iconSize: 38, iconRadius: 11, fontSize: '1.25rem', gap: 10 },
}

export const TalentoWordmark = ({
  size = 'md',
  color = '#fff',
}: {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}) => {
  const s = SIZES[size]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        textDecoration: 'none',
      }}
    >
      <TalentoMark size={s.iconSize} radius={s.iconRadius} />
      <span
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: s.fontSize,
          color,
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}
      >
        Talento
      </span>
    </span>
  )
}

export default TalentoMark
