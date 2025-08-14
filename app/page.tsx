// app/page.tsx
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import AnalyzeForm from '@/components/AnalyzeForm';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let credits = 0;
  let hasActiveSubscription = false;

  if (session?.user?.id) {
    const userId = session.user.id;

    // Hämta krediter
    const { data: c } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .maybeSingle();
    credits = c?.credits ?? 0;

    // Hämta sub-status
    const { data: sub } = await supabase
      .from('user_subscriptions')
      .select('status,current_period_end')
      .eq('user_id', userId)
      .maybeSingle();

    if (sub) {
      const allowed = ['active', 'trialing', 'past_due'];
      const notExpired =
        !sub.current_period_end ||
        new Date(sub.current_period_end).getTime() > Date.now();
      hasActiveSubscription = allowed.includes(sub.status ?? '') && notExpired;
    }
  }

  return (
    <>
      {/* Tagline med grön blinkande "online"-prick, placerad vid kortets vänsterkant */}
      <section className="mx-auto w-full max-w-3xl mb-4">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex h-2.5 w-2.5">
            {/* pulserande ring */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            {/* solid kärna */}
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_2px_rgba(16,185,129,0.25)]" />
          </span>
          <p className="text-sm text-slate-600">AI-powered technical analysis</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Create Technical Analysis</h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter the asset, current price, and upload 1D/1W/1M charts. We&apos;ll generate a complete PDF report.
        </p>

        {/* Skicka ner initiala props – AnalyzeForm hanterar bannern/gating client-side */}
        <AnalyzeForm
          initialCredits={credits}
          hasActiveSubscription={hasActiveSubscription}
        />
      </section>
    </>
  );
}
