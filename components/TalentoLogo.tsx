/**
 * Talento Brand Logo — "Faceted Diamond T"
 *
 * Konzept: Geometrischer Diamant-Schnitt mit eingebettetem "T" —
 * repräsentiert das Schleifen/Entdecken von Talenten.
 * Premium glassmorphism-Stil, purple-gold Farbwelt.
 *
 * TalentoMark     – Icon-only Badge
 * TalentoWordmark – Badge + "Talento" Text  (size="sm"|"md"|"lg")
 */

export const TalentoMark = ({
  size = 32,
  radius,
}: {
  size?: number
  radius?: number
}) => {
  const r = radius ?? Math.round(size * 0.25)
  const inner = Math.round(size * 0.7)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: 'linear-gradient(135deg, #1a1040 0%, #2d1865 50%, #1a1040 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 0 0 1px rgba(124,104,250,0.3), 0 4px 20px rgba(124,104,250,0.25), 0 0 40px rgba(212,168,67,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glass-Shine */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)',
        borderRadius: `${r}px ${r}px 0 0`, pointerEvents: 'none',
      }}/>

      <svg viewBox="0 0 32 32" fill="none" style={{ width: inner, height: inner, display: 'block', position: 'relative' }}>
        <defs>
          <linearGradient id="tg1" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#a78bfa"/>
            <stop offset="50%" stopColor="#c084fc"/>
            <stop offset="100%" stopColor="#e0b340"/>
          </linearGradient>
          <linearGradient id="tg2" x1="16" y1="4" x2="16" y2="28">
            <stop offset="0%" stopColor="#fff" stopOpacity="1"/>
            <stop offset="100%" stopColor="#e8d5ff" stopOpacity="0.85"/>
          </linearGradient>
          <filter id="tglow">
            <feGaussianBlur stdDeviation="1.2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Diamant-Rahmen (äußerer Facetten-Cut) */}
        <path d="M16 2 L28 10 L28 22 L16 30 L4 22 L4 10 Z"
          stroke="url(#tg1)" strokeWidth="1.4" fill="none" opacity="0.7"/>

        {/* Innere Facetten-Linien — Diamant-Cut-Effekt */}
        <line x1="16" y1="2" x2="16" y2="30" stroke="url(#tg1)" strokeWidth="0.4" opacity="0.2"/>
        <line x1="4" y1="10" x2="28" y2="10" stroke="url(#tg1)" strokeWidth="0.4" opacity="0.15"/>
        <line x1="4" y1="22" x2="28" y2="22" stroke="url(#tg1)" strokeWidth="0.4" opacity="0.15"/>
        <line x1="4" y1="10" x2="28" y2="22" stroke="url(#tg1)" strokeWidth="0.3" opacity="0.08"/>
        <line x1="28" y1="10" x2="4" y2="22" stroke="url(#tg1)" strokeWidth="0.3" opacity="0.08"/>

        {/* Großes T — Hauptform */}
        <g filter="url(#tglow)">
          {/* Querbalken */}
          <rect x="7" y="9" width="18" height="3.6" rx="1.8" fill="url(#tg2)"/>
          {/* Vertikaler Balken */}
          <rect x="13.2" y="9" width="5.6" height="16" rx="2.8" fill="url(#tg2)"/>
        </g>

        {/* Gold-Spark oben-links am T */}
        <circle cx="8.5" cy="8" r="1.1" fill="#e0b340" opacity="0.9"/>
        <circle cx="8.5" cy="8" r="2" fill="#e0b340" opacity="0.15"/>
        {/* Mikro-Spark oben-rechts */}
        <circle cx="23.5" cy="8" r="0.7" fill="#c084fc" opacity="0.6"/>
      </svg>
    </div>
  )
}

// ─── Wordmark ─────────────────────────────────────────────────────────────────

const SIZES = {
  sm: { iconSize: 28, iconRadius: 7,  fontSize: '1rem',    gap: 8 },
  md: { iconSize: 32, iconRadius: 8,  fontSize: '1.08rem', gap: 9 },
  lg: { iconSize: 38, iconRadius: 10, fontSize: '1.25rem', gap: 10 },
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
