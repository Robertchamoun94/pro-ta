'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type Gender = 'male' | 'female' | 'other';

let _sb: SupabaseClient | null = null;
function supabase(): SupabaseClient {
  if (_sb) return _sb;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) throw new Error('Missing Supabase env vars');
  _sb = createClient(url, anon);
  return _sb!;
}

export default function SignUpClient() {
  const router = useRouter();

  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState<Gender>('other');
  const [age, setAge] = React.useState<string>('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [accept, setAccept] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [info, setInfo] = React.useState<string | null>(null);

  // Vi tvingar redirect till startsidan
  const redirectTo = '/';

  // Håll server-cookie i synk för token refresh / sign-out
  React.useEffect(() => {
    const { data } = supabase().auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_OUT') {
        await fetch('/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, session }),
        });
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  function validate(): string | null {
    if (!name.trim()) return 'Name is required.';
    const nAge = Number(age);
    if (!Number.isFinite(nAge) || nAge < 13 || nAge > 120)
      return 'Enter a valid age (13–120).';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    if (!accept) return 'You must accept the Terms.';
    return null;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    const v = validate();
    if (v) { setError(v); return; }
    setLoading(true);
    try {
      const sb = supabase();
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: { name, gender, age: Number(age) },
          emailRedirectTo:
            typeof window !== 'undefined'
              ? `${window.location.origin}/auth/callback`
              : undefined,
        },
      });
      if (error) { setError(error.message); return; }

      if (data.session) {
        // Email confirmations OFF → session direkt. Posta till servern:
        await fetch('/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: 'SIGNED_IN', session: data.session }),
        });

        if (typeof window !== 'undefined') window.location.assign(redirectTo);
        else router.replace(redirectTo);
        return;
      }

      // Om confirmations är ON
      setInfo('Check your inbox to confirm your email.');
    } catch (err: any) {
      setError(err?.message ?? 'Unexpected error during sign up.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-semibold mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">
          Sign up to access <span className="font-medium">ArcSignals</span>.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-4 rounded-lg border border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 px-3 py-2 text-sm text-blue-700 dark:text-blue-300">
            {info}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-gray-400"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Gender</label>
                <select
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-gray-400"
                  value={gender}
                  onChange={(e)=>setGender(e.target.value as Gender)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Age</label>
                <input
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-gray-400"
                  type="number"
                  min={13}
                  max={120}
                  value={age}
                  onChange={(e)=>setAge(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-gray-400"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
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
                minLength={8}
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Confirm password</label>
              <input
                className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-gray-400"
                type="password"
                value={confirm}
                onChange={(e)=>setConfirm(e.target.value)}
                minLength={8}
                required
              />
            </div>

            <label className="flex items-center gap-2 text-sm select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-700"
                checked={accept}
                onChange={(e)=>setAccept(e.target.checked)}
              />
              <span>
                I accept the{' '}
                <a href="/terms" className="underline underline-offset-2 hover:no-underline">Terms</a> and
                <a href="/privacy" className="underline underline-offset-2 hover:no-underline"> Privacy Policy</a>.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-2xl px-4 py-2 font-medium shadow-sm border border-gray-900/10 dark:border-white/10 hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>

            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <a href="/auth/sign-in" className="underline underline-offset-2 hover:no-underline">
                Sign in
              </a>.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
