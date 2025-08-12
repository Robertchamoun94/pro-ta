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
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-6xl h-14 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark className="h-6 w-6" />
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-slate-900">ArcSignals</div>
            <div className="text-[11px] text-slate-500">AI-powered technical analysis • dark theme</div>
          </div>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {/* Pricing visas alltid */}
          <Link
            href="/pricing"
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
          >
            Pricing
          </Link>

          {!session ? (
            <>
              <Link
                href="/auth/sign-in"
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
              >
                Sign in
              </Link>
              <Link
                href="/auth/sign-up"
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-900 text-white hover:opacity-90 transition"
              >
                Create account
              </Link>
            </>
          ) : (
            <>
              <span className="hidden sm:inline text-slate-500">
                Signed in as <span className="text-slate-800">{email}</span>
              </span>
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
              >
                Dashboard
              </Link>
              <form action="/auth/signout" method="post">
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition">
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
