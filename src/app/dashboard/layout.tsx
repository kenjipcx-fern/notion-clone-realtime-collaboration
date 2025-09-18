'use client'

import { Sidebar } from '@/components/sidebar/sidebar'
import QueryProvider from '@/lib/react-query'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <QueryProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </QueryProvider>
  )
}
