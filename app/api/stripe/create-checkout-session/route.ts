// app/api/stripe/create-checkout-session/route.ts
export const runtime = "nodejs"; // Stripe SDK kräver Node-runtime

import { NextResponse } from "next/server";
import { stripe, PRICES, SITE_URL } from "@/lib/stripe";
import { createSupabaseRouteClient } from "@/lib/supabaseRoute";

type Plan = "ONE_TIME" | "MONTHLY" | "YEARLY";

function getMode(plan: Plan) {
  return plan === "ONE_TIME" ? "payment" : "subscription";
}

export async function POST(req: Request) {
  const supabase = createSupabaseRouteClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await req.json()) as { plan?: Plan };
  const plan = body?.plan;
  if (!plan || !(plan in PRICES)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const priceId =
    plan === "ONE_TIME"
      ? PRICES.ONE_TIME
      : plan === "MONTHLY"
      ? PRICES.MONTHLY
      : PRICES.YEARLY;

  const mode = getMode(plan);

  const session = await stripe.checkout.sessions.create({
    mode: mode as "payment" | "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${SITE_URL}/dashboard?checkout=success`,
    cancel_url: `${SITE_URL}/pricing?checkout=cancel`,
    client_reference_id: user.id,           // vi använder i webhook senare
    customer_email: user.email ?? undefined,
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
  });

  return NextResponse.json({ url: session.url });
}
