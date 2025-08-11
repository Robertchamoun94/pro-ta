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
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill="#0EA5E9" opacity="0.25" />
          <path d="M5 15c2.5-4 5-6 7-6s4 1.5 7 6" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round"/>
        </svg>
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
