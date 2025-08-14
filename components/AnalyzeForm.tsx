'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyzeForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const form = e.currentTarget;
      const fd = new FormData(form);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        // 402 -> inga credits, etc. Här gör du vad du redan gör idag (visa banner/redirect).
        const msg = await res.text().catch(() => 'Error');
        alert(msg || 'Checkout error');
        return;
      }

      // Ladda ned PDF
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fd.get('asset')
        ? String(fd.get('asset')).replace(/[^a-z0-9_-]/gi, '_') + '_analysis.pdf'
        : 'analysis.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      // ✨ Uppdatera headern (credits) utan sidladdning
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {/* ...dina befintliga fält & knappar... */}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Generating…' : 'Generate Analysis (PDF)'}
      </button>
    </form>
  );
}
