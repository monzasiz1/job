'use client'
import { Suspense } from 'react'
import ChatContent from './chat-content'
import Navbar from '@/components/Navbar'

export default function ChatPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.3 }}>💬</div>
            <div style={{ color: 'rgba(255,255,255,0.4)' }}>Chat wird geladen...</div>
          </div>
        </div>
      }>
        <ChatContent />
      </Suspense>
    </>
  )
}
