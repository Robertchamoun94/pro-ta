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
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY missing' }, { status: 500 });
    }

    // Skicka alltid via Resends "onboarding"-avsändare tills domänen är verifierad
    const TO = process.env.CONTACT_INBOX || 'Arcsignals@hotmail.com';
    const FROM = 'ArcSignals <onboarding@resend.dev>';

    const subject = `New contact from ${n}`;
    const text = `Name: ${n}\nEmail: ${e}\n\n${m}`;

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        subject,
        text,
        reply_to: e, // så du kan svara direkt på kundens mejl
      }),
    });

    if (!r.ok) {
      let info = '';
      try { info = await r.text(); } catch {}
      console.error('Resend error:', r.status, info);
      return NextResponse.json({ error: info || 'Failed to send email' }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('contact POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
