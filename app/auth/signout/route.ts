import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export const runtime = 'nodejs';

async function doSignOut(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  await supabase.auth.signOut();

  const url = new URL(req.url);
  return NextResponse.redirect(new URL('/', url.origin));
}

// Stöd för både POST (form submit) och GET (om någon navigerar direkt/öppnar i ny flik)
export async function POST(req: Request) {
  return doSignOut(req);
}

export async function GET(req: Request) {
  return doSignOut(req);
}
