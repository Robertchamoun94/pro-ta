export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

type PlanType = 'free' | 'single' | 'monthly' | 'yearly' | null;
type PlanStatus = 'active' | 'canceled' | 'incomplete' | 'trialing' | null;

type Profile = {
  plan_type: PlanType;
  plan_status: PlanStatus;
  current_period_end: string | null;
};

function formatPlan(plan: PlanType): string {
  switch (plan) {
    case 'single':
      return 'Single Analysis';
    case 'monthly':
      return 'Monthly';
    case 'yearly':
      return 'Yearly';
    default:
      return 'Free';
  }
}

function formatSubline(status: PlanStatus, periodEnd: string | null): string {
  let parts: string[] = [];
  if (status) parts.push(status[0].toUpperCase() + status.slice(1));
  else parts.push('No active subscription');
  if (periodEnd) {
    const d = new Date(periodEnd);
    parts.push(`until ${d.toLocaleDateString()}`);
  }
  return parts.join(' • ');
}

export default async function DashboardPage() {
  // Server-side session
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/auth/sign-in?redirect=${encodeURIComponent('/dashboard')}`);
  }

  // Try reading plan from profiles (optional; will gracefully fallback to Free)
  let profile: Profile | null = null;
  try {
    const { data } = await supabase
      .from('profiles')
      .select('plan_type, plan_status, current_period_end')
      .eq('id', session!.user.id)
      // maybeSingle() returns null if row missing (no error)
      .maybeSingle();
    profile = (data as Profile) ?? null;
  } catch {
    profile = null;
  }

  const planLabel = formatPlan(profile?.plan_type ?? 'free');
  const subline = formatSubline(
    profile?.plan_status ?? null,
    profile?.current_period_end ?? null
  );

  return (
    <main className="min-h-[70vh] px-6 py-10">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">
        Signed in as <span className="font-medium">{session!.user.email}</span>
      </p>

      <div className="rounded-2xl border border-white/10 bg-[#0E1627]/70 p-6 mb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-400">Current plan</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 text-sm">
                {planLabel}
              </span>
              <span className="text-xs text-gray-400">{subline}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-white/10 px-3.5 py-2 text-sm hover:bg-white/5 transition"
            >
              Go to Analysis
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3.5 py-2 text-sm font-medium hover:bg-cyan-500/15 hover:border-cyan-400/60 transition"
            >
              Change plan
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
        <p className="text-sm text-gray-400">
          Replace this placeholder with your ArcSignals dashboard content.
        </p>
      </div>
    </main>
  );
}
