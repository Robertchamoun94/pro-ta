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

  // filenames to show under upload buttons
  const [name1d, setName1d] = useState('');
  const [name1w, setName1w] = useState('');
  const [name1m, setName1m] = useState('');

  function handleFileName(
    e: React.ChangeEvent<HTMLInputElement>,
    setName: (v: string) => void
  ) {
    const f = e.target.files?.[0];
    setName(f ? f.name : '');
  }

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

      // Download PDF
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const asset = (fd.get('asset') ?? 'analysis').toString();
      a.href = url;
      a.download = `${asset.replace(/[^a-z0-9_-]/gi, '_')}_analysis.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // Optimistic credit decrement + refresh header badge
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

        {/* 1D / 1W / 1M upload sections with EN buttons */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* 1D */}
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-sm font-medium">1D chart (image)</div>
            <input
              id="chart1d"
              name="chart1d"
              type="file"
              accept="image/*"
              className="sr-only"
              required
              onChange={(e) => handleFileName(e, setName1d)}
            />
            <label
              htmlFor="chart1d"
              className="mt-2 inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Upload image
            </label>
            <div className="mt-1 truncate text-xs text-slate-500">
              {name1d || 'No file selected'}
            </div>
          </div>

          {/* 1W */}
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-sm font-medium">1W chart (image)</div>
            <input
              id="chart1w"
              name="chart1w"
              type="file"
              accept="image/*"
              className="sr-only"
              required
              onChange={(e) => handleFileName(e, setName1w)}
            />
            <label
              htmlFor="chart1w"
              className="mt-2 inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Upload image
            </label>
            <div className="mt-1 truncate text-xs text-slate-500">
              {name1w || 'No file selected'}
            </div>
          </div>

          {/* 1M */}
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="text-sm font-medium">1M chart (image)</div>
            <input
              id="chart1m"
              name="chart1m"
              type="file"
              accept="image/*"
              className="sr-only"
              required
              onChange={(e) => handleFileName(e, setName1m)}
            />
            <label
              htmlFor="chart1m"
              className="mt-2 inline-flex cursor-pointer items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Upload image
            </label>
            <div className="mt-1 truncate text-xs text-slate-500">
              {name1m || 'No file selected'}
            </div>
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
