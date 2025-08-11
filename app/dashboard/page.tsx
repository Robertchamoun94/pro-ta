export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function DashboardPage() {
  // Läs session på serversidan (via cookies)
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Ingen session → skicka till sign-in och tillbaka hit efteråt
  if (!session) {
    redirect(`/auth/sign-in?redirect=${encodeURIComponent('/dashboard')}`);
  }

  // === Din dashboard-UI kan ligga här nedanför ===
  // Lägg gärna tillbaka din riktiga dashboard sedan.
  return (
    <main className="min-h-[70vh] px-6 py-10">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">
        Signed in as <span className="font-medium">{session.user.email}</span>
      </p>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <p className="text-sm text-gray-400">
          Replace this placeholder with your ArcSignals dashboard content.
        </p>
      </div>
    </main>
  );
}
