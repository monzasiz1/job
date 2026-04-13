'use client'
import { useState } from 'react'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 150, backdropFilter: 'blur(4px)' }} />
      )}

      {/* Sidebar */}
      <div style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 240, zIndex: 200, transform: sidebarOpen ? 'translateX(0)' : undefined }}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main */}
      <div className="main-content">
        {/* Mobile topbar */}
        <div className="mob-topbar">
          <button className="mob-menu-btn" onClick={() => setSidebarOpen(true)}>☰</button>
          <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: '1rem', color: 'white' }}>WorkMatch</span>
          <div style={{ width: 40 }} />
        </div>
        {children}
      </div>
    </div>
  )
}
