import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HeaderAuth from '../components/HeaderAuth';

export const metadata: Metadata = {
  title: 'ArcSignals',
  description: 'AI-powered technical analysis',
};

// säkerställ att layouten aldrig cachas så auth-headern alltid är korrekt
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className="
          min-h-screen text-white antialiased
          bg-[#0B1220]
          [background-image:
            radial-gradient(70%_60%_at_50%_-10%,rgba(56,189,248,.08),transparent),
            radial-gradient(60%_60%_at_100%_-20%,rgba(59,130,246,.06),transparent)
          ]
        "
      >
        <HeaderAuth />
        <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
