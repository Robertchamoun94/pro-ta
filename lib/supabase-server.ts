// lib/supabase-server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * RSC-säker klient för Server Components (t.ex. Header, Dashboard).
 * Läser cookies men försöker ALDRIG skriva – undviker Next.js-felet.
 */
export function supabaseServer() {
  const store = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value;
      },
      // Viktigt: no-op i RSC
      set() {},
      remove() {},
    },
  });
}

/**
 * Route-klient för Route Handlers (/api/*).
 * Här får vi skriva cookies (sign-in refresh, sign-out, etc).
 */
export function supabaseRoute() {
  const store = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return store.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        store.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        store.set({ name, value: '', ...options, maxAge: 0 });
      },
    },
  });
}

// Hjälpfunktion för RSC att läsa användaren snabbt
export async function getUserServer() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
