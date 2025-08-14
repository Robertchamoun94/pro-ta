// lib/billing.ts
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// Tillåter tjänst om sub är aktiv (eller trial/past_due) och inte utgången.
async function hasActiveSubscription(userId: string): Promise<boolean> {
  const { data: sub, error } = await supabaseAdmin
    .from("user_subscriptions")
    .select("status,current_period_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !sub) return false;

  const allowed = ["active", "trialing", "past_due"];
  const statusOk = allowed.includes(sub.status ?? "");
  const notExpired =
    !sub.current_period_end ||
    new Date(sub.current_period_end).getTime() > Date.now();

  return statusOk && notExpired;
}

/**
 * Gate:
 * 1) Släpp igenom om aktiv prenumeration.
 * 2) Annars försök konsumera 1 kredit (atomiskt via RPC).
 * 3) Om inga krediter → 402 Payment Required.
 */
export async function requireBillingAccess(userId: string): Promise<
  | { ok: true; usedCredit: boolean }
  | { ok: false; code: number; message: string }
> {
  if (await hasActiveSubscription(userId)) {
    return { ok: true, usedCredit: false };
  }

  const { data: consumed, error } = await supabaseAdmin.rpc(
    "consume_one_credit",
    { p_user_id: userId }
  );

  if (error) {
    console.error("consume_one_credit error", error);
    return { ok: false, code: 500, message: "Internal billing error" };
  }

  if (!consumed) {
    return {
      ok: false,
      code: 402, // Payment Required
      message: "No active subscription or credits",
    };
  }

  return { ok: true, usedCredit: true };
}
