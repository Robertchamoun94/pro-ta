import './styles.css';
import type { Metadata } from 'next';
import { BRAND } from '@/lib/config';

export const metadata: Metadata = {
  title: `${BRAND.name} — AI-powered Technical Analysis`,
  description: 'Generate professional technical analysis reports as downloadable PDFs.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
