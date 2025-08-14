'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  initialCredits?: number;
  hasActiveSubscription?: boolean;
};

export default function AnalyzeForm({
  initialCredits = 0,
  hasActiveSubscription = false,
}: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [creditsLeft, setCreditsLeft] = useState<number>(initialCredits);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fd = new FormData(e.currentTarget);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        alert(msg || 'Error generating analysis');
        return;
      }

      // Ladda ner PDF
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const asset = (fd.get('asset') ?? 'analysis').toString();
      a.download = `${asset.replace(/[^a-z0-9_-]/gi, '_')}_analysis.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // Optimistisk kreditminskning + uppdatera header-badge
      setCreditsLeft((c) => Math.max(0, c - 1));
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {!hasActiveSubscription && creditsLeft <= 0 && (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm">
          You have <strong>0 credits</strong>. You can’t run a new analysis yet,
          but you can still download the result of a running one. When you’re
          ready, <a className="underline" href="/pricing">buy more credits</a>.
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-4 space-y-5">
        {/* Asset + Price */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="asset" className="block text-sm font-medium">
              Asset Name
            </label>
            <input
              id="asset"
              name="asset"
              placeholder="e.g., BTC/USD or Volvo B"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
              required
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium">
              Current Price
            </label>
            <input
              id="price"
              name="price"
              placeholder="e.g., 712.50"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
              required
            />
          </div>
        </div>

        {/* Tre bildfält */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-sm font-medium">1D chart (image)</div>
            <input type="file" name="chart1d" accept="image/*" className="mt-2 block w-full text-sm" required />
          </div>

          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-sm font-medium">1W chart (image)</div>
            <input type="file" name="chart1w" accept="image/*" className="mt-2 block w-full text-sm" required />
          </div>

          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-sm font-medium">1M chart (image)</div>
            <input type="file" name="chart1m" accept="image/*" className="mt-2 block w-full text-sm" required />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || (!hasActiveSubscription && creditsLeft <= 0)}
          className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {submitting ? 'Generating…' : 'Generate Analysis (PDF)'}
        </button>
      </form>
    </>
  );
}
