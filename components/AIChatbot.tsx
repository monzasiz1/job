'use client'
import { useState, useRef, useEffect } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

const QUICK_ACTIONS = [
  { label: 'Jobsuche starten', prompt: 'Wie finde ich am schnellsten passende Jobs auf Talento?' },
  { label: 'Lebenslauf-Tipps', prompt: 'Kannst du mir Tipps geben, wie ich meinen Lebenslauf verbessern kann?' },
  { label: 'Marktplatz erklärt', prompt: 'Wie funktioniert der lokale Marktplatz auf Talento?' },
  { label: 'Karriereberatung', prompt: 'Kannst du mir Tipps für mein nächstes Vorstellungsgespräch geben?' },
]

export default function AIChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    setHasInteracted(true)
    const userMsg: Msg = { role: 'user', content: text.trim() }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Entschuldigung, etwas ist schiefgelaufen. Bitte versuche es erneut.' }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Verbindungsfehler. Bitte prüfe deine Internetverbindung.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const clearChat = () => {
    setMessages([])
    setHasInteracted(false)
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="ai-chat-fab"
        aria-label="KI-Assistent öffnen"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg>
        )}
        {!open && messages.length === 0 && (
          <span className="ai-chat-fab-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-left">
              <div className="ai-chat-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <div>
                <div className="ai-chat-header-title">Talento KI</div>
                <div className="ai-chat-header-status">
                  <span className="ai-chat-online" />Online
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {messages.length > 0 && (
                <button onClick={clearChat} className="ai-chat-header-btn" title="Chat leeren">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              )}
              <button onClick={() => setOpen(false)} className="ai-chat-header-btn" title="Schließen">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                </button>
            </div>
          </div>

          {/* Messages */}
          <div className="ai-chat-body" ref={scrollRef}>
            {!hasInteracted ? (
              <div className="ai-chat-welcome">
                <div className="ai-chat-welcome-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </div>
                <h3 className="ai-chat-welcome-title">Hallo! Ich bin Talento KI.</h3>
                <p className="ai-chat-welcome-desc">
                  Ich helfe dir bei Jobsuche, Bewerbungen, KI-Tools und allem rund um die Plattform.
                </p>
                <div className="ai-chat-quick-actions">
                  {QUICK_ACTIONS.map(a => (
                    <button
                      key={a.label}
                      onClick={() => sendMessage(a.prompt)}
                      className="ai-chat-quick-btn"
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <div key={i} className={`ai-chat-msg ${m.role === 'user' ? 'ai-chat-msg-user' : 'ai-chat-msg-bot'}`}>
                    {m.role === 'assistant' && (
                      <div className="ai-chat-msg-avatar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                      </div>
                    )}
                    <div className={`ai-chat-bubble ${m.role === 'user' ? 'ai-chat-bubble-user' : 'ai-chat-bubble-bot'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="ai-chat-msg ai-chat-msg-bot">
                    <div className="ai-chat-msg-avatar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    </div>
                    <div className="ai-chat-bubble ai-chat-bubble-bot">
                      <div className="ai-chat-typing">
                        <span /><span /><span />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Input */}
          <div className="ai-chat-input-wrap">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Frage stellen..."
              className="ai-chat-input"
              rows={1}
              maxLength={500}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="ai-chat-send"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>

          {/* Footer */}
          <div className="ai-chat-footer">
            Powered by Talento KI · Mistral AI
          </div>
        </div>
      )}
    </>
  )
}
