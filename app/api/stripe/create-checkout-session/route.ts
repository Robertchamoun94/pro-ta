// app/api/stripe/create-checkout-session/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { stripe } from "@/lib/stripe";
import { PRICES, SITE_URL } from "@/lib/stripe";

type Plan = "ONE_TIME" | "MONTHLY" | "YEARLY";

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email ?? undefined;

    const body = (await req.json().catch(() => ({}))) as { plan?: Plan };
    const plan = body?.plan as Plan;

    if (!plan) {
      return NextResponse.json({ error: "Missing plan" }, { status: 400 });
    }

    // vart Stripe ska skicka användaren efter checkout
    const successUrl = `${SITE_URL}/?paid=1&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${SITE_URL}/pricing?canceled=1`;

    // gemensamma fält (oförändrat, plus metadata.user_id för webhook-mappning)
    const base: any = {
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId, // hjälper vid spårning
      customer_email: userEmail,   // autofill
      metadata: { user_id: userId } // <-- VIKTIGT: gör att webhooken kan uppdatera profiles
    };

    let sessionStripe;

    switch (plan) {
      case "ONE_TIME": {
        sessionStripe = await stripe.checkout.sessions.create({
          ...base,
          mode: "payment",
          line_items: [{ price: PRICES.ONE_TIME, quantity: 1 }],
        });
        break;
      }

      case "MONTHLY": {
        sessionStripe = await stripe.checkout.sessions.create({
          ...base,
          mode: "subscription",
          line_items: [{ price: PRICES.MONTHLY, quantity: 1 }],
        });
        break;
      }

      case "YEARLY": {
        sessionStripe = await stripe.checkout.sessions.create({
          ...base,
          mode: "subscription",
          line_items: [{ price: PRICES.YEARLY, quantity: 1 }],
        });
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    return NextResponse.json({ url: sessionStripe.url });
  } catch (err: any) {
    console.error("create-checkout-session error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Checkout error" },
      { status: 500 },
    );
  }
}
