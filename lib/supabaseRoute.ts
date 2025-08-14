// lib/supabaseRoute.ts
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export function createSupabaseRouteClient() {
  return createRouteHandlerClient(
    { cookies },
    {
      // Använd de envs du redan har i Vercel Production
      supabaseUrl: process.env.SUPABASE_URL!,
      supabaseKey: process.env.SUPABASE_ANON_KEY!,
    }
  );
}
