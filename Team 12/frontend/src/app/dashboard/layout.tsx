'use client'

import Navigation from '@/components/Navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navigation />
      <main className="pt-20 pb-12 min-h-screen">
        {children}
      </main>
    </>
  )
}

