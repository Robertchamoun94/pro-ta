// components/HeaderAuth.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export default async function HeaderAuth() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let credits = 0;
  if (session?.user?.id) {
    const { data: c } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", session.user.id)
      .maybeSingle();
    credits = c?.credits ?? 0;
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-3">
        <nav className="flex flex-wrap items-center justify-between gap-3">
          {/* Brand */}
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-slate-900"
          >
            ArcSignals
          </Link>

          {/* Right group: credits + buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {session && (
              <span
                className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium
                           text-emerald-700 ring-1 ring-emerald-200"
                aria-label={`Credits: ${credits}`}
                title={`Credits: ${credits}`}
              >
                Credits: <span className="font-semibold">{credits}</span>
              </span>
            )}

            {/* Pricing as a real button, always visible */}
            <Link
              href="/pricing"
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5
                         text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Pricing
            </Link>

            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5
                             text-sm font-medium text-slate-800 hover:bg-slate-50"
                >
                  Dashboard
                </Link>

                {/* Anpassa action/route om du har en annan signout-lösning */}
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm
                               font-medium text-white hover:opacity-90"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/auth/sign-in"
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm
                           font-medium text-white hover:opacity-90"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
