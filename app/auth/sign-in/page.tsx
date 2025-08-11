'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const search = useSearchParams();
  const next = search.get('next') || '/';
  const supabase = supabaseBrowser();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setErr(error.message);
    // HÅRD redirect (uppdaterar cookies/SSR omedelbart)
    window.location.replace(next);
  }

  return (
    <div className="card p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="input" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn btn-primary w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
        {err && <p className="text-red-400 text-sm">{err}</p>}
      </form>
      <p className="text-sm opacity-70 mt-4">
        No account? <a className="underline" href={`/auth/sign-up?next=${encodeURIComponent(next)}`}>Create one</a>
      </p>
    </div>
  );
}
