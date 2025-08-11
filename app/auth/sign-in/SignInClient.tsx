'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FormEvent } from 'react';
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

export default function SignInClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const redirectTo = React.useMemo(
    () => searchParams.get('redirect') ?? '/dashboard',
    [searchParams]
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const sb = supabase();
      const { data, error } = await sb.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        return;
      }
      if (data.session) {
        if (typeof window !== 'undefined') {
          window.location.assign(redirectTo);
        } else {
          router.replace(redirectTo);
        }
      } else {
        router.replace(redirectTo);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Unexpected error during sign in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-1">Sign in</h1>
        <p className="text-sm text-gray-500 mb-6">
          Access your <span className="font-medium">ArcSignals</span> account.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-gray-400"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-gray-400"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              autoComplete="current-password"
              minLength={8}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-2xl px-4 py-2 font-medium shadow-sm border border-gray-900/10 dark:border-white/10 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-xs text-gray-500">
            No account?{' '}
            <a
              href={`/auth/sign-up?redirect=${encodeURIComponent(redirectTo)}`}
              className="underline underline-offset-2 hover:no-underline"
            >
              Create one
            </a>.
          </p>
        </form>
      </div>
    </div>
  );
}
