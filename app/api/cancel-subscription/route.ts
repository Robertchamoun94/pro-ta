// app/api/cancel-subscription/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('stripe_customer_id, plan_status, plan_type, current_period_end')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) throw error;
    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ message: 'No Stripe customer connected.' }, { status: 400 });
    }

    // Hämta kundens sub och hitta aktiv/trialing
    const subs = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'all',
      limit: 20,
    });

    const active = subs.data.find(
      (s) => s.status === 'active' || s.status === 'trialing'
    );

    if (!active) {
      return NextResponse.json({ message: 'No active subscription found.' }, { status: 404 });
    }

    // Idempotent: om redan markerad att avslutas → använd den
    const updated = active.cancel_at_period_end
      ? active
      : await stripe.subscriptions.update(active.id, {
          cancel_at_period_end: true,
        });

    const endUnix = updated.cancel_at ?? updated.current_period_end ?? null;
    const endIso = endUnix ? new Date(endUnix * 1000).toISOString() : null;

    // Uppdatera profil: status=canceled, behåll plan_type, uppdatera end-datum
    await supabase
      .from('profiles')
      .update({
        plan_status: 'canceled',
        current_period_end: endIso,
      })
      .eq('id', session.user.id);

    return NextResponse.json({
      status: 'canceled',
      current_period_end: endIso,
      message: 'Subscription will end at the current period end.',
    });
  } catch (err) {
    console.error('cancel-subscription error', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
