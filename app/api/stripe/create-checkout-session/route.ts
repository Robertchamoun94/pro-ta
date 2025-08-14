// app/api/stripe/create-checkout-session/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { PRICES, SITE_URL } from '@/lib/stripe';

type Plan = 'ONE_TIME' | 'MONTHLY' | 'YEARLY';

export async function POST(req: Request) {
  // 1) Måste vara inloggad
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const user = session.user;

  // 2) Läs vald plan
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });
  }
  const plan: Plan = body?.plan;
  if (!plan) {
    return NextResponse.json({ error: 'Missing plan' }, { status: 400 });
  }

  // 3) Gemensamma parametrar för alla sessioner
  const base = {
    // ←← VIKTIGT: dessa två fält kopplar köpet till din användare
    client_reference_id: user.id,                 // <- här!
    customer_email: user.email ?? undefined,      // <- här!

    success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/pricing?canceled=1`,
  };

  let params: Stripe.Checkout.SessionCreateParams;

  switch (plan) {
    case 'ONE_TIME': {
      params = {
        ...base,
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{ price: PRICES.ONE_TIME, quantity: 1 }],
      };
      break;
    }
    case 'MONTHLY': {
      params = {
        ...base,
        mode: 'subscription',
        line_items: [{ price: PRICES.MONTHLY, quantity: 1 }],
        allow_promotion_codes: true,
      };
      break;
    }
    case 'YEARLY': {
      params = {
        ...base,
        mode: 'subscription',
        line_items: [{ price: PRICES.YEARLY, quantity: 1 }],
        allow_promotion_codes: true,
      };
      break;
    }
    default:
      return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });
  }

  // 4) Skapa session och returnera URL
  const sessionCheckout = await stripe.checkout.sessions.create(params);
  return NextResponse.json({ url: sessionCheckout.url });
}
