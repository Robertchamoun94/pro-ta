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
    <header
      className="sticky top-0 z-40 border-b border-white/10
                 bg-[#0B1220]/75 backdrop-blur
                 [background-image:radial-gradient(60%_60%_at_50%_-10%,rgba(56,189,248,.10),transparent)]"
    >
      <div className="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark className="h-6 w-6" />
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">ArcSignals</div>
            <div className="text-[11px] text-gray-400">
              AI-powered technical analysis • dark theme
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {/* Pricing always visible */}
          <Link
            href="/pricing"
            className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition"
          >
            Pricing
          </Link>

          {!session ? (
            <>
              <Link
                href="/auth/sign-in"
                className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition"
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition"
              >
                Create account
              </Link>
            </>
          ) : (
            <>
              <span className="hidden sm:inline text-gray-400">
                Signed in as <span className="text-gray-200">{email}</span>
              </span>
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition"
              >
                Dashboard
              </Link>
              <form action="/auth/signout" method="post">
                <button className="px-3 py-1.5 rounded-xl border border-white/10 hover:bg-white/5 transition">
                  Sign out
                </button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
