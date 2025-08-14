import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // TODO: Hantera customer.subscription.updated/created/deleted och payment_intent.succeeded
    // Uppdatera användarens plan i din databas

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
  }
}
