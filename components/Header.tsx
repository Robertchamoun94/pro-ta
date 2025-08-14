import Link from 'next/link';
import Image from 'next/image';
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
        {/* Klickbar ikonlogga */}
        <Link href="/" className="shrink-0" aria-label={`${BRAND.name} home`}>
          <img
            src="/logo-icon.svg"
            alt={`${BRAND.name} logo`}
            width={32}
            height={32}
            priority
          />
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
