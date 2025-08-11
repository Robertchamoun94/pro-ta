import { supabaseServer } from './supabase-server';

export async function getUser() {
  const supabase = supabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}

export function requireAccess(user: any) {
  // MVP: endast inloggning krävs
  return !!user;
}

export function isSubscriber(user: any) {
  // Vi sätter detta via Stripe-webhook senare
  return !!user?.user_metadata?.is_subscriber;
}
