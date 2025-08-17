// app/contact/page.tsx
export const metadata = {
  title: 'Contact — ArcSignals',
  description: 'Get in touch with ArcSignals support.',
};

'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get('name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      message: String(fd.get('message') || '').trim(),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = (await res.json().catch(() => null))?.error || 'Something went wrong.';
        throw new Error(msg);
      }

      setStatus('sent');
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err: any) {
      setStatus('error');
      setError(err?.message ?? 'Something went wrong.');
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-lg font-semibold">Contact support</h1>
      <p className="mt-1 text-sm text-slate-600">
        Fill in the form below and we’ll get back to you within 24 hours.
      </p>

      {status === 'sent' ? (
        <div className="mt-4 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900">
          Thanks! We’ve received your message and will reply within <strong>24 hours</strong>.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="How can we help?"
            />
          </div>

          {status === 'error' && (
            <div className="rounded-md border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </section>
  );
}
