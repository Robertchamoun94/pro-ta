'use client';

import * as React from 'react';
import Link from 'next/link';

type Props = {
  authed: boolean;
  email?: string | null;
};

export default function NavBar({ authed, email }: Props) {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // stäng menyn när man klickar utanför
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current) return;
      if (!panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // DESKTOP (md+): inline-knappar, kompakta
  return (
    <>
      <nav className="hidden md:flex items-center gap-2 text-sm">
        <Link
          href="/pricing"
          className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
        >
          Pricing
        </Link>

        {!authed ? (
          <>
            <Link
              href="/auth/sign-in"
              className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
            >
              Sign in
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-2.5 py-1 rounded-md border border-slate-300 bg-slate-900 text-white hover:opacity-90 transition"
            >
              Create account
            </Link>
          </>
        ) : (
          <>
            {/* E-post visas bara på större skärmar */}
            <span className="hidden lg:inline text-slate-500">
              Signed in as <span className="text-slate-800">{email}</span>
            </span>
            <Link
              href="/dashboard"
              className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
            >
              Dashboard
            </Link>
            <form action="/auth/signout" method="post">
              <button
                className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
              >
                Sign out
              </button>
            </form>
          </>
        )}
      </nav>

      {/* MOBIL: menyknapp + dropdown-panel */}
      <div className="relative md:hidden" ref={panelRef}>
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm"
        >
          Menu
          <svg width="16" height="16" viewBox="0 0 20 20" className={`transition ${open ? 'rotate-180' : ''}`}>
            <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {open && (
          <div
            className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5"
            role="menu"
          >
            <Link
              href="/pricing"
              className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              Pricing
            </Link>

            {!authed ? (
              <>
                <Link
                  href="/auth/sign-in"
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  Create account
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  onClick={() => setOpen(false)}
                  role="menuitem"
                >
                  Dashboard
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
