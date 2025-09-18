import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Realtime Collab Platform',
  description: 'A high-performance real-time collaboration platform like Notion',
  keywords: ['collaboration', 'real-time', 'documents', 'workspace', 'productivity'],
  authors: [{ name: 'Fern AI' }],
  openGraph: {
    title: 'Realtime Collab Platform',
    description: 'A high-performance real-time collaboration platform like Notion',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
        <div id="portal-root" />
      </body>
    </html>
  )
}
