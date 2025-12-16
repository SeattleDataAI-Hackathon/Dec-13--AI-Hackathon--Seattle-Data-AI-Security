'use client';

import { Header } from '@/components/homepage/header';
import { Footer } from '@/components/homepage/footer';
import { useState } from 'react';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Header onDemoClick={() => setIsDemoOpen(true)} />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
