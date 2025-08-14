import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase-server';
import { BRAND } from '@/lib/config';

export default async function Header() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const displayName = user?.user_metadata?.name || user?.email;

  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Klickbar ikonlogga (inline SVG), 32x32px */}
        <Link href="/" className="shrink-0" aria-label={`${BRAND.name} home`}>
          <svg
            width={32}
            height={32}
            viewBox="0 0 256 256"
            role="img"
            aria-label="ArcSignals icon"
            style={{ display: 'block' }}
          >
            <defs>
              <linearGradient id="asg" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0" stopColor="#1f7f7b" />
                <stop offset="1" stopColor="#36b58f" />
              </linearGradient>
            </defs>

            {/* Arc-botten */}
            <path
              d="M24 176c0 38.4 41.6 56 104 56s104-17.6 104-56c0-1.2 0-2.4-.1-3.6-18.6 27.5-57 43.6-103.9 43.6S42.7 199.9 24.1 172.4c-.1 1.2-.1 2.4-.1 3.6z"
              fill="url(#asg)"
            />

            {/* Staplar */}
            <rect x="56" y="120" width="28" height="64" rx="6" fill="#ffffff" />
            <rect x="106" y="104" width="28" height="80" rx="6" fill="#ffffff" />
            <rect x="156" y="88"  width="28" height="96" rx="6" fill="#ffffff" />

            {/* Prislinje + pil */}
            <path
              d="M48 160l36-28 20 12 34-34 26 20 26-38"
              fill="none"
              stroke="#36b58f"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M186 64l36 10-18 30z" fill="#36b58f" />
          </svg>
        </Link>

        <div>
          <h1 className="text-2xl font-semibold">{BRAND.name}</h1>
          <p className="text-sm opacity-70">AI-powered technical analysis • dark theme</p>
        </div>
      </div>

      <nav className="flex items-center gap-3 text-sm">
        <Link href="/pricing" className="btn">Pricing</Link>
        {user ? (
          <>
            <span className="opacity-70 hidden sm:inline">Signed in as {displayName}</span>
            <Link href="/dashboard" className="btn">Dashboard</Link>
            <form action="/api/auth/signout" method="POST">
              <button className="btn">Sign out</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/auth/sign-in" className="btn">Sign in</Link>
            <Link href="/auth/sign-up" className="btn btn-primary">Create account</Link>
          </>
        )}
      </nav>
    </header>
  );
}
