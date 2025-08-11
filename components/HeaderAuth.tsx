import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import LogoMark from './LogoMark';

export default async function HeaderAuth() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const email = session?.user?.email ?? null;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10
      bg-[#0B1220]/75 backdrop-blur
      [background-image:radial-gradient(60%_60%_at_50%_-10%,rgba(56,189,248,.10),transparent)]">
      <div className="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark className="h-6 w-6" />
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">ArcSignals</div>
            <div className="text-[11px] text-gray-400">AI-powered technical analysis • dark theme</div>
          </div>
        </Link>

        {!session ? (
          <nav className="flex items-center gap-3 text-sm">
            <Link className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition" href="/pricing">Pricing</Link>
            <Link className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition" href="/auth/sign-in">Sign in</Link>
            <Link className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition" href="/auth/sign-up">Create account</Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-gray-400">
              Signed in as <span className="text-gray-200">{email}</span>
            </span>
            <Link className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition" href="/dashboard">Dashboard</Link>
            <form action="/auth/signout" method="post">
              <button className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition">Sign out</button>
            </form>
          </nav>
        )}
      </div>
    </header>
  );
}
