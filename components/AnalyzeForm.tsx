'use client';

import { useState } from 'react';

export default function AnalyzeForm() {
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPdfUrl(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: data,
      });

      if (res.status === 401) {
        // Not logged in → send to sign-in with return URL
        const next = encodeURIComponent(window.location.pathname || '/');
        window.location.href = `/auth/sign-in?next=${next}`;
        return;
      }

      if (!res.ok) {
        const msg = await res.text().catch(() => 'An error occurred');
        throw new Error(msg || 'An error occurred');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err: any) {
      setError(err?.message ?? 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm opacity-80">Asset Name</label>
          <input
            className="input mt-2"
            name="asset"
            placeholder="e.g., BTC/USD or Volvo B"
            required
          />
        </div>
        <div>
          <label className="text-sm opacity-80">Current Price</label>
          <input
            className="input mt-2"
            name="price"
            placeholder="e.g., 712.50"
            inputMode="decimal"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="text-sm opacity-80">1D chart (image)</label>
          <input className="input mt-2" name="img1d" type="file" accept="image/*" required />
        </div>
        <div>
          <label className="text-sm opacity-80">1W chart (image)</label>
          <input className="input mt-2" name="img1w" type="file" accept="image/*" required />
        </div>
        <div>
          <label className="text-sm opacity-80">1M chart (image)</label>
          <input className="input mt-2" name="img1m" type="file" accept="image/*" required />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Analyzing…' : 'Generate Analysis (PDF)'}
        </button>
        <span className="badge">Beta</span>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {pdfUrl && (
        <a href={pdfUrl} download className="btn">
          Download PDF
        </a>
      )}
    </form>
  );
}
