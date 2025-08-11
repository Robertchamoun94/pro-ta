'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _sb: SupabaseClient | null = null;
function supabase(): SupabaseClient {
  if (_sb) return _sb;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error('Missing Supabase env vars');
  _sb = createClient(url, anon);
  return _sb!;
}

export default function CallbackClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const run = async () => {
      const code = sp.get('code');
      const redirect = sp.get('redirect') ?? '/dashboard';
      if (!code) {
        setError('Missing auth code in URL.');
        return;
      }
      const { error } = await supabase().auth.exchangeCodeForSession(code);
      if (error) {
        setError(error.message);
        return;
      }
      if (typeof window !== 'undefined') {
        window.location.replace(redirect);
      } else {
        router.replace(redirect);
      }
    };
    run();
  }, [sp, router]);

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-xl font-medium mb-2">Signing you in…</h1>
        {!error ? (
          <p className="text-sm text-gray-500">
            Please wait while we complete the login.
          </p>
        ) : (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
