import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WorkMatch — Jobs neu gedacht',
  description: 'Die smarte Jobbörse für Arbeitnehmer und Arbeitgeber. Günstiger, schneller, besser.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
