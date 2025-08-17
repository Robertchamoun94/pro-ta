// app/api/contact/route.ts
import { NextResponse } from 'next/server';

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    if (!isEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // TODO: Koppla e-post/skicka till dig, eller spara i DB om du vill.
    // Här loggar vi bara — påverkar inte din befintliga logik.
    console.log('[Contact] Incoming message:', { name, email, message });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
