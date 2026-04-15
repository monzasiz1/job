/**
 * Talento Brand Logo Components
 *
 * TalentoMark  – Icon-only (badge mark), use size prop to scale
 * TalentoWordmark – Icon + "Talento" text, use size="sm"|"md"|"lg"
 */

// ─── Icon Mark ────────────────────────────────────────────────────────────────
// Design: rounded square, purple→gold gradient
// Icon: bold "T" whose stem rises above the crossbar (= "talent rising") +
//       a small diamond facet at the top tip

export const TalentoMark = ({
  size = 32,
  radius,
}: {
  size?: number
  radius?: number
}) => {
  const r = radius ?? Math.round(size * 0.28)
  const inner = Math.round(size * 0.55)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: 'linear-gradient(135deg, #7c68fa 0%, #a855c8 50%, #d4a843 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 12px rgba(124,104,250,0.35)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* subtle shine overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '50%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)',
          borderRadius: `${r}px ${r}px 0 0`,
          pointerEvents: 'none',
        }}
      />
      <svg
        viewBox="0 0 20 20"
        fill="none"
        style={{ width: inner, height: inner, display: 'block' }}
      >
        {/* Vertical bar – rises above crossbar to create the "rising talent" arrow */}
        <rect x="8.4" y="2.5" width="3.2" height="15" rx="1.6" fill="white" />
        {/* Crossbar */}
        <rect x="2.5" y="7.2" width="15" height="3.2" rx="1.6" fill="white" />
        {/* Diamond cap – top of the rising stem */}
        <rect
          x="9.1"
          y="1"
          width="1.8"
          height="1.8"
          rx="0.4"
          fill="white"
          opacity="0.85"
          transform="rotate(45 10 1.9)"
        />
      </svg>
    </div>
  )
}

// ─── Wordmark (Icon + Text) ───────────────────────────────────────────────────
const SIZES = {
  sm: { iconSize: 28, iconRadius: 8,  fontSize: '1rem',   gap: 8 },
  md: { iconSize: 32, iconRadius: 9,  fontSize: '1.08rem', gap: 9 },
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
