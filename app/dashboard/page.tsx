export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { stripe } from '@/lib/stripe'; // ← används endast vid sista-fallback

type PlanType = 'free' | 'single' | 'monthly' | 'yearly' | null;
type PlanStatus = 'active' | 'canceled' | 'incomplete' | 'trialing' | null;
type Profile = {
  plan_type: PlanType;
  plan_status: PlanStatus;
  current_period_end: string | null;
  stripe_customer_id?: string | null; // ← för SSR-fallback
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

/**
 * Endast visningslogik: om prenumerationen är aktiv, visa "Subscribed" och rätt plantext.
 * Layout och övrig logik lämnas orörd.
 */
function getPlanDisplay(profile: Profile | null): { label: string; subline: string } {
  const plan = profile?.plan_type ?? 'free';
  const status = profile?.plan_status ?? null;
  const periodEnd = profile?.current_period_end ?? null;

  if (status === 'active') {
    let planText = '';
    if (plan === 'monthly') planText = '1 Month plan';
    else if (plan === 'yearly') planText = '1 Year plan';
    else if (plan === 'single') planText = 'Single Analysis';
    else planText = formatPlan(plan);

    // Visa tydligt när nästa period förnyas/löper ut om datum finns.
    const parts: string[] = [planText];
    if (periodEnd) {
      const d = new Date(periodEnd);
      parts.push(`renews on ${d.toLocaleDateString()}`);
    }

    return {
      label: 'Subscribed',
      subline: parts.join(' • '),
    };
  }

  // Fallback exakt som tidigare
  return {
    label: formatPlan(plan),
    subline: formatSubline(status, periodEnd),
  };
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
      .select('plan_type, plan_status, current_period_end, stripe_customer_id') // ← lägg till customer-id
      .eq('id', session!.user.id)
      .maybeSingle();
    profile = (data as Profile) ?? null;
  } catch {
    profile = null;
  }

  /**
   * 🔒 Sista-säkerhets-fallback:
   * Om användaren är ACTIVE men current_period_end saknas,
   * hämta sub från Stripe med stripe_customer_id och fyll datumet (samt skriv tillbaka).
   * Detta hanterar ev. race/leveransordning i webhooks och gör att UI:n alltid visar datum direkt.
   */
  if (
    profile?.plan_status === 'active' &&
    !profile.current_period_end &&
    profile.stripe_customer_id
  ) {
    try {
      // Hämta aktiv sub för kunden
      const subs = await stripe.subscriptions.list({
        customer: profile.stripe_customer_id,
        status: 'active',
        limit: 1,
      });
      const sub = subs.data[0];

      let nextEndISO: string | null = null;
      let planType: PlanType = profile.plan_type;

      if (sub) {
        if (typeof (sub as any).current_period_end === 'number') {
          nextEndISO = new Date((sub as any).current_period_end * 1000).toISOString();
        } else {
          // Beräkna från start + interval om Stripe inte skickat current_period_end än
          const start = (sub as any).current_period_start as number | undefined;
          const interval = sub.items?.data?.[0]?.price?.recurring?.interval;
          if (start && interval) {
            const d = new Date(start * 1000);
            if (interval === 'year') d.setUTCFullYear(d.getUTCFullYear() + 1);
            else d.setUTCMonth(d.getUTCMonth() + 1);
            nextEndISO = d.toISOString();
          }
        }

        // Sätt planType utifrån sub:en om det saknas/fel
        const interval = sub.items?.data?.[0]?.price?.recurring?.interval;
        if (!planType || planType === 'free') {
          planType = interval === 'year' ? 'yearly' : 'monthly';
        }
      }

      if (nextEndISO) {
        // Skriv tillbaka till profiles för att hålla DB synkad
        await supabase
          .from('profiles')
          .update({
            current_period_end: nextEndISO,
            plan_type: planType ?? profile.plan_type,
            plan_status: 'active',
          })
          .eq('id', session!.user.id);

        // Uppdatera lokalt så UI visar datum direkt
        profile = {
          ...profile,
          current_period_end: nextEndISO,
          plan_type: planType ?? profile.plan_type,
          plan_status: 'active',
        };
      }
    } catch {
      // Tyst – fallback är best-effort för att säkra UI; webhooks fyller vanligtvis snart ändå.
    }
  }

  const { label: planLabel, subline } = getPlanDisplay(profile);

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
