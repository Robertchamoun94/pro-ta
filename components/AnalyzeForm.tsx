// components/AnalyzeForm.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

type Props = {
  initialCredits: number;
  hasActiveSubscription: boolean;
};

export default function AnalyzeForm({
  initialCredits,
  hasActiveSubscription,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credits, setCredits] = useState(initialCredits);

  const noCreditsAndNoSub = !hasActiveSubscription && credits === 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (noCreditsAndNoSub) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => 'Analysis error');
        alert(msg || 'Analysis error');
        return;
      }

      // Ladda ned PDF
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analysis.pdf';
      a.click();
      URL.revokeObjectURL(url);

      // Servern har dragit 1 kredit → uppdatera lokalt, men ingen redirect
      setCredits((c) => Math.max(0, c - 1));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-4">
      {/* Banner istället för redirect */}
      {noCreditsAndNoSub && !isSubmitting && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          You have <strong>0 credits</strong>. You can’t run a new analysis yet,
          but you can still download the result of a running one. When you’re
          ready,{' '}
          <Link href="/pricing" className="underline underline-offset-2">
            buy more credits
          </Link>
          .
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Asset Name
            </label>
            <input
              name="asset"
              placeholder="e.g., BTC/USD or Volvo B"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Current Price
            </label>
            <input
              name="price"
              placeholder="e.g., 712.50"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        {/* Filuppladdningar – matchar din /api/analyze */}
        <div className="rounded-xl border border-slate-200 p-3 sm:p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                1D chart (image)
              </label>
              <input
                type="file"
                accept="image/*"
                name="chart1d"
                className="mt-1 block w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                1W chart (image)
              </label>
              <input
                type="file"
                accept="image/*"
                name="chart1w"
                className="mt-1 block w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                1M chart (image)
              </label>
              <input
                type="file"
                accept="image/*"
                name="chart1m"
                className="mt-1 block w-full text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={noCreditsAndNoSub && !isSubmitting}
          className={`rounded-lg px-4 py-2 font-semibold text-white
            ${isSubmitting ? 'bg-slate-400' : 'bg-slate-900 hover:opacity-90'}
            disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {isSubmitting ? 'Generating…' : 'Generate Analysis (PDF)'}
        </button>
      </form>
    </div>
  );
}
