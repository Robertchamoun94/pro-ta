// app/api/stripe/webhook/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

async function markProcessed(id: string) {
  // Idempotenslogg – ignorera ev. fel (t.ex. unique-violation)
  await supabaseAdmin
    .from('stripe_events')
    .insert({ id })
    .select()
    .single();
}

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();
  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
    event = Stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    return new NextResponse(`Webhook signature error: ${err.message}`, { status: 400 });
  }

  // Har vi redan processat detta event?
  const { data: seen } = await supabaseAdmin
    .from('stripe_events')
    .select('id')
    .eq('id', event.id)
    .maybeSingle();
  if (seen) return NextResponse.json({ ok: true, duplicate: true });

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const stripeCustomer = session.customer as string | null;
        const userId = (session.client_reference_id as string) ?? null;

        // Koppla stripe_customer_id på profilen första gången
        if (userId && stripeCustomer) {
          await supabaseAdmin
            .from('profiles')
            .update({ stripe_customer_id: stripeCustomer })
            .eq('id', userId);
        }

        // Engångsköp ($5) → ge +1 kredit
        if (session.mode === 'payment' && session.payment_status === 'paid') {
          let resolvedUserId = userId;
          if (!resolvedUserId && stripeCustomer) {
            const { data: prof } = await supabaseAdmin
              .from('profiles')
              .select('id')
              .eq('stripe_customer_id', stripeCustomer)
              .maybeSingle();
            resolvedUserId = prof?.id ?? null;
          }
          if (resolvedUserId) {
            await supabaseAdmin.rpc('grant_credits', { p_user_id: resolvedUserId, p_n: 1 });
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // Använd 'any' för properties som typerna inte känner till (t.ex. current_period_end)
        const sub = event.data.object as any; // Stripe.Subscription i runtime, men typerna saknar vissa fält
        const stripeCustomer = sub.customer as string;

        const { data: prof } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', stripeCustomer)
          .maybeSingle();

        if (prof?.id) {
          const priceId: string | null = sub?.items?.data?.[0]?.price?.id ?? null;

          const rawPeriodEnd = sub?.current_period_end; // kan vara number (unix seconds) eller undefined
          const periodEnd: string | null =
            typeof rawPeriodEnd === 'number'
              ? new Date(rawPeriodEnd * 1000).toISOString()
              : null;

          await supabaseAdmin
            .from('user_subscriptions')
            .upsert(
              {
                user_id: prof.id,
                status: sub.status,
                price_id: priceId ?? undefined,
                cancel_at_period_end: Boolean(sub?.cancel_at_period_end),
                current_period_end: periodEnd,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id' }
            );
        }
        break;
      }

      default:
        // Ignorera andra events
        break;
    }
  } finally {
    await markProcessed(event.id);
  }

  return NextResponse.json({ ok: true });
}
