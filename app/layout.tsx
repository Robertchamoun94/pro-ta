import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import HeaderAuth from '../components/HeaderAuth'; // server-komponent som läser session

export const metadata: Metadata = {
  title: 'ArcSignals',
  description: 'AI-powered technical analysis',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <HeaderAuth />
        {children}
      </body>
    </html>
  );
}
