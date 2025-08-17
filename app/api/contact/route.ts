// app/api/contact/route.ts
import { NextResponse } from 'next/server';

type Payload = { name?: string; email?: string; message?: string };

export async function POST(req: Request) {
  try {
    const { name = '', email = '', message = '' } = (await req.json()) as Payload;

    const n = name.trim();
    const e = email.trim();
    const m = message.trim();

    if (!n || !e || !m) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    // enkel e-postkontroll
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // ---- Skicka via Resend ----
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY missing');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    // Mottagare: din Hotmail. Kan även sättas via env CONTACT_INBOX om du vill.
    const TO = process.env.CONTACT_INBOX || 'Arcsignals@hotmail.com';

    const subject = `New contact from ${n}`;
    const text = `Name: ${n}\nEmail: ${e}\n\n${m}`;

    // Snabbaste sättet: använd Resends “onboarding”-avsändare (funkar utan DNS)
    const from = process.env.FROM_EMAIL || 'ArcSignals <onboarding@resend.dev>';

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [TO],
        subject,
        text,
      }),
    });

    if (!r.ok) {
      const info = await r.text();
      console.error('Resend error:', r.status, info);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('contact POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
