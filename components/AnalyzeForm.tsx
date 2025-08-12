'use client';

import * as React from 'react';

export default function AnalyzeForm() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: fd,
      });

      // Om API:et redirectar till sign-in följer fetch med – skicka användaren dit.
      if (res.redirected || res.url.includes('/auth/sign-in')) {
        window.location.assign(res.url);
        return;
      }

      const ct = res.headers.get('content-type') || '';
      if (!res.ok) {
        const msg = ct.includes('application/json') ? JSON.stringify(await res.json()) : await res.text();
        throw new Error(msg || 'Failed to generate analysis.');
      }

      if (!ct.includes('application/pdf')) {
        const text = await res.text();
        throw new Error(text || 'Unexpected response (no PDF).');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err: any) {
      setError(err?.message ?? 'Unexpected error.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data" className="mt-5 space-y-5">
      {/* Inputs (compact) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs mb-1 text-gray-300">Asset Name</label>
          <input
            name="asset"
            placeholder="e.g., BTC/USD or Volvo B"
            className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-xs mb-1 text-gray-300">Current Price</label>
          <input
            name="price"
            placeholder="e.g., 712.50"
            inputMode="decimal"
            className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40"
            disabled={loading}
            required
          />
        </div>
      </div>

      {/* File inputs (compact) */}
      <div className="rounded-xl border border-white/10 bg-black/20 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs mb-1 text-gray-300">1D chart (image)</label>
            <input
              type="file"
              name="chart1d"
              accept="image/*"
              className="block w-full text-xs file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-black/40 file:px-3 file:py-1.5 file:text-gray-200 hover:file:bg-black/60"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs mb-1 text-gray-300">1W chart (image)</label>
            <input
              type="file"
              name="chart1w"
              accept="image/*"
              className="block w-full text-xs file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-black/40 file:px-3 file:py-1.5 file:text-gray-200 hover:file:bg-black/60"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs mb-1 text-gray-300">1M chart (image)</label>
            <input
              type="file"
              name="chart1m"
              accept="image/*"
              className="block w-full text-xs file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-black/40 file:px-3 file:py-1.5 file:text-gray-200 hover:file:bg-black/60"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {!downloadUrl ? (
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3.5 py-1.5 text-sm font-medium hover:bg-cyan-500/15 hover:border-cyan-400/60 transition disabled:opacity-60"
          >
            {loading ? 'Analysing…' : 'Generate Analysis (PDF)'}
          </button>
        ) : (
          <>
            <a
              href={downloadUrl}
              download="analysis.pdf"
              className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3.5 py-1.5 text-sm font-medium hover:bg-emerald-500/15 hover:border-emerald-400/60 transition"
            >
              Download PDF
            </a>
            <button
              type="submit"
              className="rounded-xl border border-white/10 px-3.5 py-1.5 text-sm hover:bg-white/5 transition"
            >
              Generate new
            </button>
          </>
        )}
        <span className="text-[11px] rounded-full border border-white/10 px-2 py-0.5 text-gray-400">
          Beta
        </span>
      </div>

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <p className="text-xs text-gray-500">
        Images are processed on upload. The report includes scenarios, notes, and a disclaimer.
      </p>
    </form>
  );
}
