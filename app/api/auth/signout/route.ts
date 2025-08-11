import { NextResponse } from 'next/server';
import { supabaseRoute } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const supabase = supabaseRoute();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL('/', req.url));
}

export async function GET(req: Request) {
  return NextResponse.redirect(new URL('/', req.url));
}
