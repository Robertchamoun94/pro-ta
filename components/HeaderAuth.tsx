import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function HeaderAuth() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const email = session?.user?.email ?? null;

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-semibold">ArcSignals</span>
          <span className="text-xs text-gray-500 hidden sm:inline">
            AI-powered technical analysis · dark theme
          </span>
        </Link>

        {!session ? (
          <nav className="flex items-center gap-3">
            <Link href="/pricing" className="px-3 py-1.5 rounded-xl border border-white/10">Pricing</Link>
            <Link href="/auth/sign-in" className="px-3 py-1.5 rounded-xl border border-white/10">Sign in</Link>
            <Link href="/auth/sign-up" className="px-3 py-1.5 rounded-xl border border-white/10">Create account</Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:inline">
              Signed in as <span className="text-gray-200">{email}</span>
            </span>
            <Link href="/dashboard" className="px-3 py-1.5 rounded-xl border border-white/10">Dashboard</Link>
            <form action="/auth/signout" method="post">
              <button className="px-3 py-1.5 rounded-xl border border-white/10">Sign out</button>
            </form>
          </nav>
        )}
      </div>
    </header>
  );
}
