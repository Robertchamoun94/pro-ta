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

    const fd = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: fd });

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

  const inputCls =
    'w-full rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-sm text-slate-900 outline-none ' +
    'focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300';

  const fileCls =
    'block w-full text-xs file:mr-3 file:rounded-md file:border file:border-slate-300 file:bg-white ' +
    'file:px-3 file:py-1.5 file:text-slate-700 hover:file:bg-slate-50';

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data" className="mt-5 space-y-5">
      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs mb-1 text-slate-700">Asset Name</label>
          <input name="asset" placeholder="e.g., BTC/USD or Volvo B" className={inputCls} disabled={loading} required />
        </div>
        <div>
          <label className="block text-xs mb-1 text-slate-700">Current Price</label>
          <input name="price" placeholder="e.g., 712.50" inputMode="decimal" className={inputCls} disabled={loading} required />
        </div>
      </div>

      {/* Files */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs mb-1 text-slate-700">1D chart (image)</label>
            <input type="file" name="chart1d" accept="image/*" className={fileCls} disabled={loading} />
          </div>
          <div>
            <label className="block text-xs mb-1 text-slate-700">1W chart (image)</label>
            <input type="file" name="chart1w" accept="image/*" className={fileCls} disabled={loading} />
          </div>
          <div>
            <label className="block text-xs mb-1 text-slate-700">1M chart (image)</label>
            <input type="file" name="chart1m" accept="image/*" className={fileCls} disabled={loading} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {!downloadUrl ? (
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg border border-slate-300 bg-slate-900 text-white px-3.5 py-1.5 text-sm font-medium
                       hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? 'Analysing…' : 'Generate Analysis (PDF)'}
          </button>
        ) : (
          <>
            <a
              href={downloadUrl}
              download="analysis.pdf"
              className="rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 text-sm font-medium
                         hover:bg-emerald-100 transition"
            >
              Download PDF
            </a>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-sm hover:bg-slate-50 transition"
            >
              Generate new
            </button>
          </>
        )}
        <span className="text-[11px] rounded-full border border-slate-200 px-2 py-0.5 text-slate-500">Beta</span>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <p className="text-xs text-slate-500">
        Images are processed on upload. The report includes scenarios, notes, and a disclaimer.
      </p>
    </form>
  );
}
