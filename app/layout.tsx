import SiteFooter from '@/components/SiteFooter';
import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HeaderAuth from '../components/HeaderAuth';

export const metadata: Metadata = {
  title: 'ArcSignals',
  description: 'AI-powered technical analysis',
};

// säkerställ korrekt header (ingen statisk cache)
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <HeaderAuth />
        <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        <SiteFooter /> {/* ✅ footern renderas precis före </body> */}
      </body>
    </html>
  );
}
