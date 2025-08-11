import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const plan = String(form.get('plan'));

    const price = plan === 'subscription' ? process.env.STRIPE_PRICE_SUB_199 : process.env.STRIPE_PRICE_ONEOFF_49;
    if (!price) return new NextResponse('Pris-ID saknas i .env', { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: plan === 'subscription' ? 'subscription' : 'payment',
      line_items: [{ price, quantity: 1 }],
      success_url: `${process.env.APP_URL}/?success=1`,
      cancel_url: `${process.env.APP_URL}/?canceled=1`
    });

    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (e: any) {
    return new NextResponse(e.message || 'Checkout error', { status: 500 });
  }
}
