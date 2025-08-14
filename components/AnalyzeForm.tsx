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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        const msg = await res.text().catch(() => '');
        alert(msg || 'Checkout error');
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

      // ↓ Uppdatera kredit-banderollen direkt och headern via refresh
      setCreditsLeft((c) => Math.max(0, c - 1));
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Valfri banner om 0 krediter och ingen aktiv prenumeration */}
      {!hasActiveSubscription && creditsLeft <= 0 && (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm">
          You have <strong>0 credits</strong>. You can’t run a new analysis yet,
          but you can still download the result of a running one. When you’re
          ready, buy more credits.
        </div>
      )}

      {/* Behåll din befintliga JSX – byt bara onSubmit */}
      <form onSubmit={onSubmit}>
        {/* ... dina inputs/knappar/filuppladdningar ... */}
        {/* Exempel: en submit-knapp som använder state */}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {submitting ? 'Generating…' : 'Generate Analysis (PDF)'}
        </button>
      </form>
    </>
  );
}
