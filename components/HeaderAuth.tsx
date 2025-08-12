import Link from 'next/link';
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import LogoMark from './LogoMark';
import NavBar from './NavBar';

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
          <div className="font-semibold tracking-tight text-slate-900">ArcSignals</div>
        </Link>

        {/* Desktop: inline nav  •  Mobile: compakt meny */}
        <NavBar authed={!!session} email={email} />
      </div>
    </header>
  );
}
