// app/api/stripe/webhook/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

async function markProcessed(id: string) {
  // idempotenslogg (om tabellen redan finns, annars no-op)
  await supabaseAdmin
    .from('stripe_events')
    .insert({ id })
    .select()
    .single()
    .catch(() => null);
}

export async function POST(req: Request) {
  // Stripe kräver rå body
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

  // Idempotens: om eventet redan processats, avsluta direkt
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

        // Koppla kund-id på profilen (om vi känner till userId)
        if (userId && stripeCustomer) {
          await supabaseAdmin
            .from('profiles')
            .update({ stripe_customer_id: stripeCustomer })
            .eq('id', userId);
        }

        // Engångsköp ($5 Single Analysis) → ge +1 kredit
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
        const sub = event.data.object as Stripe.Subscription;
        const stripeCustomer = sub.customer as string;

        const { data: prof } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', stripeCustomer)
          .maybeSingle();

        if (prof?.id) {
          const priceId = sub.items.data[0]?.price?.id ?? null;
          const periodEnd = sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null;

          await supabaseAdmin.from('user_subscriptions').upsert(
            {
              user_id: prof.id,
              status: sub.status,
              price_id: priceId ?? undefined,
              cancel_at_period_end: sub.cancel_at_period_end ?? false,
              current_period_end: periodEnd,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );
        }
        break;
      }

      default:
        // andra events ignoreras
        break;
    }
  } finally {
    await markProcessed(event.id);
  }

  return NextResponse.json({ ok: true });
}
