import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) redirect('/auth/sign-in');

  const name = user.user_metadata?.name || '';
  const email = user.email || '';
  const isSub = !!user.user_metadata?.is_subscriber;

  return (
    <div className="space-y-6">
      {/* Top bar with back button */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Link href="/" className="btn">
          ← Back to analysis
        </Link>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-2">Welcome{ name ? `, ${name}` : '' }</h2>
        <p className="opacity-80 text-sm">
          Signed in as <span className="font-mono">{email}</span>
        </p>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-2">Subscription</h2>
        <p className="text-sm">
          Status:{' '}
          <span className={`font-medium ${isSub ? 'text-green-400' : 'text-red-400'}`}>
            {isSub ? 'Active' : 'Inactive'}
          </span>
        </p>
        <p className="text-xs opacity-60 mt-2">
          After Stripe integration your status will update automatically.
        </p>
      </div>
    </div>
  );
}
