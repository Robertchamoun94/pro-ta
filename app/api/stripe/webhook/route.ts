// app/api/stripe/webhook/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

async function markProcessed(id: string) {
  await supabaseAdmin.from('stripe_events').insert({ id }).select().single();
}

function mapPlanType(sub: Stripe.Subscription): 'monthly' | 'yearly' {
  const interval = sub.items?.data?.[0]?.price?.recurring?.interval;
  return interval === 'year' ? 'yearly' : 'monthly';
}

async function updateProfileFromSubscription(
  userId: string,
  sub: Stripe.Subscription | any
) {
  const plan_type = mapPlanType(sub as Stripe.Subscription);
  const rawPeriodEnd = (sub as any)?.current_period_end;
  const current_period_end =
    typeof rawPeriodEnd === 'number'
      ? new Date(rawPeriodEnd * 1000).toISOString()
      : null;

  const stripeCustomerId =
    typeof (sub as any)?.customer === 'string' ? ((sub as any).customer as string) : null;

  await supabaseAdmin
    .from('profiles')
    .update({
      plan_type,
      plan_status: ((sub as any).status as any) ?? null,
      current_period_end,
      stripe_customer_id: stripeCustomerId,
    })
    .eq('id', userId);
}

async function findUserIdByCustomerId(customerId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  return data?.id ?? null;
}

// 🆕 Fallback: hitta användare via kundens e-post i Stripe
async function findUserIdByCustomerEmail(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer && !('deleted' in customer) && typeof customer.email === 'string') {
      const { data } = await supabaseAdmin
        .from('auth.users')
        .select('id')
        .eq('email', customer.email)
        .maybeSingle();
      return data?.id ?? null;
    }
  } catch (err) {
    console.error('Error fetching customer by email fallback:', err);
  }
  return null;
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
        const stripeCustomer = (session.customer as string) ?? null;
        const userIdFromMeta = (session.metadata?.user_id as string) || null;
        const userIdFromClientRef = (session.client_reference_id as string) || null;
        const resolvedUserId = userIdFromMeta || userIdFromClientRef || null;

        if (resolvedUserId && stripeCustomer) {
          await supabaseAdmin
            .from('profiles')
            .update({ stripe_customer_id: stripeCustomer })
            .eq('id', resolvedUserId);
        }

        if (session.mode === 'payment' && session.payment_status === 'paid') {
          let userId = resolvedUserId;
          if (!userId && stripeCustomer) {
            userId = await findUserIdByCustomerId(stripeCustomer);
          }
          if (userId) {
            await supabaseAdmin.rpc('grant_credits', { p_user_id: userId, p_n: 1 });
          }
        }

        if (session.mode === 'subscription' && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          let userId = resolvedUserId;
          if (!userId && stripeCustomer) userId = await findUserIdByCustomerId(stripeCustomer);
          if (userId) {
            await updateProfileFromSubscription(userId, sub);
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub: any = event.data.object as any;
        const stripeCustomer = sub.customer as string;

        let userId =
          (sub.metadata?.user_id as string) ||
          (await findUserIdByCustomerId(stripeCustomer));

        // 🆕 Fallback om stripe_customer_id saknas
        if (!userId && stripeCustomer) {
          userId = await findUserIdByCustomerEmail(stripeCustomer);
        }

        const priceId: string | null = sub?.items?.data?.[0]?.price?.id ?? null;
        const rawPeriodEnd = sub?.current_period_end;
        const periodEnd: string | null =
          typeof rawPeriodEnd === 'number' ? new Date(rawPeriodEnd * 1000).toISOString() : null;

        if (userId) {
          await supabaseAdmin
            .from('user_subscriptions')
            .upsert(
              {
                user_id: userId,
                status: sub.status,
                price_id: priceId ?? undefined,
                cancel_at_period_end: Boolean(sub?.cancel_at_period_end),
                current_period_end: periodEnd,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id' }
            );

          if (event.type !== 'customer.subscription.deleted') {
            await updateProfileFromSubscription(userId, sub);
          } else {
            await supabaseAdmin
              .from('profiles')
              .update({
                plan_type: 'free',
                plan_status: null,
                current_period_end: null,
              })
              .eq('id', userId);
          }
        }
        break;
      }

      default:
        break;
    }
  } finally {
    await markProcessed(event.id);
  }

  return NextResponse.json({ ok: true });
}
