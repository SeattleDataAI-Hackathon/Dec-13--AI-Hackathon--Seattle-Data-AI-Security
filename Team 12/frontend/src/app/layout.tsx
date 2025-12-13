import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TechClub AI | Collaborative Learning Orchestrator',
  description: 'AI-powered platform that automates peer learning group management with intelligent team formation and project generation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="noise-overlay" />
        <div className="grid-bg fixed inset-0 -z-10" />
        
        {/* Background orbs */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="orb orb-primary w-[600px] h-[600px] -top-[200px] -left-[200px]" />
          <div className="orb orb-accent w-[400px] h-[400px] top-1/2 right-[10%]" style={{ animationDelay: '-5s' }} />
          <div className="orb orb-primary w-[300px] h-[300px] bottom-[10%] left-[20%]" style={{ animationDelay: '-10s' }} />
        </div>
        
        {children}
      </body>
    </html>
  )
}

