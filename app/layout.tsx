import SiteFooter from '@/components/SiteFooter';
import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HeaderAuth from '../components/HeaderAuth';

export const metadata: Metadata = {
  title: 'ArcSignals',
  description: 'AI-powered technical analysis',
  icons: {
    icon: [
      { url: '/favicon.ico' }, // klassisk favicon (bredast stöd)
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }, // png fallback
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }, // iOS homescreen
    ],
  },
  manifest: '/manifest.json', // PWA/ikon-manifest
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
