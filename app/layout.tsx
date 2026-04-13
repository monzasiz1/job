import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WorkMatch — Karriere neu gedacht',
  description: 'Die intelligenteste Jobbörse Deutschlands mit KI-Analyse, Job-Matching und Bewerbungsassistent.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
