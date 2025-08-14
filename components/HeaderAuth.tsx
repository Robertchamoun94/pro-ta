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
      <div className="mx-auto max-w-6xl px-4 py-2">
        {/* Flex-wrap + gap-y gör att det blir snyggt när det bryter till två rader på mobil */}
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          {/* Vänster sida: logga + Pricing */}
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/"
              className="whitespace-nowrap text-lg font-semibold"
            >
              ArcSignals
            </Link>
            <Link
              href="/pricing"
              className="whitespace-nowrap text-sm text-slate-600 hover:text-slate-900"
            >
              Pricing
            </Link>
          </div>

          {/* Höger sida: auth-del */}
          {session ? (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Kompakt kredit-badge på mobil */}
              <CreditsBadge />

              {/* Döljer lång text på mycket små skärmar genom fontstorlek + nowrap */}
              {/* E-post är redan dold på <sm> i din tidigare variant; vill du ha den, lägg till den här: */}
              {/* <span className="hidden sm:inline text-slate-600 truncate max-w-[12rem]">
                {session.user.email}
              </span> */}

              <Link
                href="/dashboard"
                className="whitespace-nowrap rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50 sm:text-sm"
              >
                Dashboard
              </Link>

              <Link
                href="/auth/sign-out"
                className="whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white hover:opacity-90 sm:text-sm"
              >
                Sign out
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/sign-in"
                className="whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white hover:opacity-90 sm:text-sm"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
