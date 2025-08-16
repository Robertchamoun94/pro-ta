export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { stripe } from '@/lib/stripe'; // Endast för SSR-fallback
import CancelSubscriptionButton from './CancelSubscriptionButton';

type PlanType = 'free' | 'single' | 'monthly' | 'yearly' | null;
type PlanStatus = 'active' | 'canceled' | 'incomplete' | 'trialing' | null;
type Profile = {
  plan_type: PlanType;
  plan_status: PlanStatus;
  current_period_end: string | null;
  stripe_customer_id?: string | null;
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
  const parts: string[] = [status ? status[0].toUpperCase() + status.slice(1) : 'No active subscription'];
  if (periodEnd) parts.push(`until ${new Date(periodEnd).toLocaleDateString()}`);
  return parts.join(' • ');
}

function getPlanDisplay(profile: Profile | null): { label: string; subline: string } {
  const plan = profile?.plan_type ?? 'free';
  const status = profile?.plan_status ?? null;
  const periodEnd = profile?.current_period_end ?? null;

  // Tydlig kopia vid uppsägning
  if (status === 'canceled') {
    const d = periodEnd ? new Date(periodEnd) : null;
    return {
      label: 'Canceled',
      subline: d ? `cancels on ${d.toLocaleDateString()}` : 'cancellation scheduled',
    };
  }

  if (status === 'active' || status === 'trialing') {
    // Bastext enligt plan_type
    let planText = '';
    if (plan === 'monthly') planText = '1 Month plan';
    else if (plan === 'yearly') planText = '1 Year plan';
    else if (plan === 'single') planText = 'Single Analysis';
    else planText = formatPlan(plan);

    // Visuell överstyrning utifrån nästa förnyelse
    if (periodEnd) {
      const now = new Date();
      const end = new Date(periodEnd);
      const diffDays = (end.getTime() - now.getTime()) / 86400000;
      if (diffDays > 330) {
        planText = '1 Year plan';
      } else if (diffDays > 27 && diffDays <= 330) {
        planText = '1 Month plan';
      }
    }

    const parts: string[] = [planText];
    if (periodEnd) {
      const d = new Date(periodEnd);
      parts.push(`renews on ${d.toLocaleDateString()}`);
    }
    return { label: 'Subscribed', subline: parts.join(' • ') };
  }

  return { label: formatPlan(plan), subline: formatSubline(status, periodEnd) };
}

// Normalisera Stripe-intervallet till endast 'month' | 'year'
function normalizeInterval(iv: unknown): 'month' | 'year' | undefined {
  if (iv === 'month') return 'month';
  if (iv === 'year') return 'year';
  return undefined;
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect(`/auth/sign-in?redirect=${encodeURIComponent('/dashboard')}`);
  }

  // Läs profil
  let profile: Profile | null = null;
  try {
    const { data } = await supabase
      .from('profiles')
      .select('plan_type, plan_status, current_period_end, stripe_customer_id')
      .eq('id', session!.user.id)
      .maybeSingle();
    profile = (data as Profile) ?? null;
  } catch {
    profile = null;
  }

  // 🔒 Synka mot Stripe vid aktiv/trialing premium eller om end saknas
  const needsStripeSync =
    !!profile?.stripe_customer_id &&
    (profile?.plan_type === 'monthly' || profile?.plan_type === 'yearly') &&
    (
      !profile?.current_period_end ||                // saknas end → backfill
      profile?.plan_status === 'active' ||           // aktiv/trialing → kolla ev. pending cancel
      profile?.plan_status === 'trialing'
    );

  if (needsStripeSync) {
    try {
      const list = await stripe.subscriptions.list({
        customer: profile!.stripe_customer_id!,
        status: 'all',
        limit: 10,
      });

      const candidates = list.data;
      const pick =
        candidates.find(s => s.status === 'active' || s.status === 'trialing') ??
        candidates
          .slice()
          .sort((a: any, b: any) => {
            const aStart = (a as any).current_period_start ?? a.created ?? 0;
            const bStart = (b as any).current_period_start ?? b.created ?? 0;
            return bStart - aStart;
          })[0];

      if (pick) {
        const anySub: any = pick as any;

        // Avläs tider & intervall
        let endUnix: number | null =
          typeof anySub.current_period_end === 'number' ? anySub.current_period_end : null;

        const cancelAtUnix: number | null =
          typeof anySub.cancel_at === 'number' ? anySub.cancel_at : null;

        const startUnix: number | undefined =
          (typeof anySub.current_period_start === 'number' ? anySub.current_period_start : undefined) ??
          (typeof anySub.created === 'number' ? anySub.created : undefined);

        let interval: 'month' | 'year' | undefined = normalizeInterval(
          pick.items?.data?.[0]?.price?.recurring?.interval
        );

        if (!endUnix && startUnix && interval) {
          const d = new Date(startUnix * 1000);
          if (interval === 'year') d.setUTCFullYear(d.getUTCFullYear() + 1);
          else d.setUTCMonth(d.getUTCMonth() + 1);
          endUnix = Math.floor(d.getTime() / 1000);
        }

        if (!interval && startUnix && typeof endUnix === 'number') {
          const diffDays = (endUnix - startUnix) / 86400;
          interval = diffDays > 330 ? 'year' : 'month';
        }

        // ✅ NYTT: om Stripe visar Pending Cancel, visa "Canceled" direkt och skriv tillbaka
        const willCancel = anySub.cancel_at_period_end === true || cancelAtUnix !== null;

        const nextEndUnix = willCancel ? (cancelAtUnix ?? endUnix) : endUnix;

        if (nextEndUnix) {
          const nextEndISO = new Date(nextEndUnix * 1000).toISOString();

          // Typ-säkert planType-val
          const currentPlan: PlanType = profile ? profile.plan_type : null;
          const planType: PlanType =
            interval === 'year'
              ? 'yearly'
              : interval === 'month'
              ? 'monthly'
              : currentPlan;

          // Om pending cancel enligt Stripe → sätt canceled, annars behåll status
          const nextStatus: PlanStatus = willCancel
            ? 'canceled'
            : (profile?.plan_status ?? (pick.status as PlanStatus) ?? null);

          await supabase
            .from('profiles')
            .update({
              current_period_end: nextEndISO,
              plan_type: planType,
              plan_status: nextStatus,
            })
            .eq('id', session!.user.id);

          profile = {
            ...(profile as Profile),
            current_period_end: nextEndISO,
            plan_type: planType,
            plan_status: nextStatus,
          };
        }
      }
    } catch {
      // Best-effort – webhooks/web app kompletterar annars
    }
  }

  const { label: planLabel, subline } = getPlanDisplay(profile);

  // 🔔 UI-only: guld för aktiva premium-planer (med solid fallback)
  const isPremium =
    (profile?.plan_type === 'monthly' || profile?.plan_type === 'yearly') &&
    (profile?.plan_status === 'active' || profile?.plan_status === 'trialing');

  return (
    <main className="min-h-[60vh] px-6 py-10">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-sm text-slate-600 mb-8">
        Signed in as <span className="font-medium text-slate-800">{session!.user.email}</span>
      </p>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-sm text-slate-500">Current plan</div>
            <div className="mt-1 flex flex-wrap md:flex-nowrap items-center gap-3">
              <span
                className={
                  isPremium
                    ? 'inline-flex items-center rounded-full px-3 py-1 text-sm text-slate-900 bg-amber-400 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 ring-1 ring-amber-500/40 shadow-sm'
                    : 'inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-sm text-slate-800'
                }
              >
                {planLabel}
              </span>
              <span className="text-xs text-slate-500">{subline}</span>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
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

            {(
              (profile?.plan_type === 'monthly' || profile?.plan_type === 'yearly') &&
              (profile?.plan_status === 'active' || profile?.plan_status === 'trialing')
            ) && <CancelSubscriptionButton />}
          </div>
        </div>
      </div>
    </main>
  );
}
