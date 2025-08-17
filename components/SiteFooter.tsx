// components/SiteFooter.tsx
import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 py-6 text-sm text-slate-600">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4">
        <div>© {new Date().getFullYear()} ArcSignals. All rights reserved.</div>
        <nav className="flex items-center gap-6">
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
