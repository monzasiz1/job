'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ShareButton({ jobId, jobTitle, jobCompany }: { jobId: string; jobTitle: string; jobCompany: string }) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const jobUrl = typeof window !== 'undefined' ? `${window.location.origin}/jobs/${jobId}` : ''

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      setShowMenu(false)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleEmail = () => {
    const subject = `Stellenangebot: ${jobTitle} bei ${jobCompany}`
    const body = `Schau dir diese Stelle an:\n\n${jobTitle} bei ${jobCompany}\n\n${jobUrl}`
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setShowMenu(false)
  }

  const handleSMS = () => {
    const body = `${jobTitle} bei ${jobCompany}: ${jobUrl}`
    window.location.href = `sms:?body=${encodeURIComponent(body)}`
    setShowMenu(false)
  }

  const handleWhatsApp = () => {
    const text = `Schau dir diese Stelle an: ${jobTitle} bei ${jobCompany} - ${jobUrl}`
    window.location.href = `https://wa.me/?text=${encodeURIComponent(text)}`
    setShowMenu(false)
  }

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: 'clamp(8px, 2vw, 12px) clamp(12px, 2vw, 16px)',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12,
          color: 'rgba(255,255,255,0.7)',
          fontWeight: 700,
          fontSize: 'clamp(0.8rem, 1.5vw, 0.9rem)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
          e.currentTarget.style.color = '#fff'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
        }}
      >
        <span>↗ Teilen</span>
      </button>

      {showMenu && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            background: 'var(--surface, #17172a)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            zIndex: 1000,
            minWidth: 200,
            overflow: 'hidden',
            backdropFilter: 'blur(20px)',
          }}
        >
          <button
            onClick={handleCopyLink}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(124,104,250,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>🔗</span>
            <div style={{ flex: 1 }}>
              <div>Link kopieren</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                {copied ? '✓ Kopiert!' : 'Link in Zwischenablage'}
              </div>
            </div>
          </button>

          <button
            onClick={handleEmail}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(124,104,250,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>📧</span>
            <div style={{ flex: 1 }}>
              <div>E-Mail</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                E-Mail-Programm öffnen
              </div>
            </div>
          </button>

          <button
            onClick={handleSMS}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(124,104,250,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>💬</span>
            <div style={{ flex: 1 }}>
              <div>SMS</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                Über SMS Nachricht teilen
              </div>
            </div>
          </button>

          <button
            onClick={handleWhatsApp}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(124,104,250,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>💬</span>
            <div style={{ flex: 1 }}>
              <div>WhatsApp</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                Via WhatsApp teilen
              </div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
