export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

type PlanType = 'free' | 'single' | 'monthly' | 'yearly' | null;
type PlanStatus = 'active' | 'canceled' | 'incomplete' | 'trialing' | null;
type Profile = { plan_type: PlanType; plan_status: PlanStatus; current_period_end: string | null };

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
  const parts: string[] = [status ? status[0].toUpperCase() + status.slice(1) : 'No active subscription'];
  if (periodEnd) parts.push(`until ${new Date(periodEnd).toLocaleDateString()}`);
  return parts.join(' • ');
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/auth/sign-in?redirect=${encodeURIComponent('/dashboard')}`);
  }

  // Läs profil (om tabell/kolumn saknas => fallback till Free)
  let profile: Profile | null = null;
  try {
    const { data } = await supabase
      .from('profiles')
      .select('plan_type, plan_status, current_period_end')
      .eq('id', session!.user.id)
      .maybeSingle();
    profile = (data as Profile) ?? null;
  } catch {
    profile = null;
  }

  const planLabel = formatPlan(profile?.plan_type ?? 'free');
  const subline = formatSubline(profile?.plan_status ?? null, profile?.current_period_end ?? null);

  return (
    <main className="min-h-[60vh] px-6 py-10">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-sm text-slate-600 mb-8">
        Signed in as <span className="font-medium text-slate-800">{session!.user.email}</span>
      </p>

      {/* Enda kvarvarande kortet: Plan + knappar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500">Current plan</div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm text-slate-800">
                {planLabel}
              </span>
              <span className="text-xs text-slate-500">{subline}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm hover:bg-slate-50 transition"
            >
              Go to Analysis
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-slate-900 bg-slate-900 text-white px-3.5 py-2 text-sm hover:opacity-90 transition"
            >
              Change plan
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
