import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignUpClient />
    </Suspense>
  );
}

'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabase-browser';
import { useSearchParams } from 'next/navigation';

function SignUpClient() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [age, setAge] = useState<number | ''>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const search = useSearchParams();
  const next = search.get('next') || '/';
  const supabase = supabaseBrowser();

  function validate(): string | null {
    if (!name.trim()) return 'Please enter your name.';
    if (!gender) return 'Please select your gender.';
    if (age === '' || isNaN(Number(age))) return 'Please enter your age.';
    const a = Number(age);
    if (a < 18 || a > 99) return 'Age must be between 18 and 99.';
    if (!email) return 'Please enter your email.';
    if (!password || password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (v) { setErr(v); return; }

    setLoading(true); setErr(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, gender, age: Number(age) } }
    });
    setLoading(false);
    if (error) return setErr(error.message);
    window.location.replace(next); // hård redirect
  }

  return (
    <div className="card p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} required />
        <div className="grid grid-cols-2 gap-3">
          <select className="input" value={gender} onChange={e=>setGender(e.target.value as any)} required>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input className="input" type="number" min={18} max={99} placeholder="Age (18-99)"
                 value={age} onChange={e=>setAge(e.target.value === '' ? '' : Number(e.target.value))} required />
        </div>
        <input className="input" type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password (min 6 chars)" value={password} onChange={e=>setPassword(e.target.value)} required />
        <input className="input" type="password" placeholder="Confirm password" value={confirm} onChange={e=>setConfirm(e.target.value)} required />
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Creating…' : 'Sign up'}
        </button>
        {err && <p className="text-red-400 text-sm">{err}</p>}
      </form>
      <p className="text-sm opacity-70 mt-4">
        Already have an account? <a className="underline" href={`/auth/sign-in?next=${encodeURIComponent(next)}`}>Sign in</a>
      </p>
    </div>
  );
}
