import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  // Hämta stripe_customer_id från profiles
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error || !profile?.stripe_customer_id) {
    return new NextResponse('Missing stripe_customer_id', { status: 400 });
  }

  const portal = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: process.env.NEXT_PUBLIC_SITE_URL
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`
      : 'http://localhost:3000/dashboard',
  });

  return NextResponse.redirect(portal.url, { status: 303 });
}
