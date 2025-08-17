// components/SiteFooter.tsx
export default function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-4xl px-6 py-10 text-sm text-slate-500">
      <div className="flex flex-wrap items-center gap-4 justify-between border-t border-slate-200 pt-6">
        <p>© {new Date().getFullYear()} ArcSignals. All rights reserved.</p>
        <nav className="flex items-center gap-4">
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="mailto:support@yourdomain.com" className="hover:underline">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
