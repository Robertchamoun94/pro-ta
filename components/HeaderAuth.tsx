// components/HeaderAuth.tsx
import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import CreditsBadge from './CreditsBadge';

export const dynamic = 'force-dynamic';

export default async function HeaderAuth() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold">
            ArcSignals
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Pricing
          </Link>
        </div>

        {session ? (
          <div className="flex items-center gap-3 text-sm">
            {/* SALDO-BADGE */}
            <CreditsBadge />

            <span className="hidden sm:inline text-slate-600">
              Signed in as <strong>{session.user.email}</strong>
            </span>
            <Link
              href="/dashboard"
              className="rounded-md border border-slate-300 px-2 py-1 hover:bg-slate-50"
            >
              Dashboard
            </Link>
            <Link
              href="/auth/sign-out"
              className="rounded-md bg-slate-900 px-2 py-1 text-white hover:opacity-90"
            >
              Sign out
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/auth/sign-in"
              className="rounded-md bg-slate-900 px-2 py-1 text-white hover:opacity-90"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
