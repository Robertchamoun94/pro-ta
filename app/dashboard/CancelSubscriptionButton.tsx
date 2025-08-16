'use client';

import { useState } from 'react';

export default function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false); // optimistisk låsning efter första lyckade klicket

  if (done) return null; // göm knappen direkt efter lyckad POST

  async function onClick() {
    const ok = window.confirm(
      'Are you sure you want to cancel? Your subscription will remain active until the end of the current billing period.'
    );
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.message || 'Could not cancel subscription.');
        return;
      }

      // 1) optimistiskt: lås/göm knappen
      setDone(true);

      // 2) informera användaren
      alert('Subscription set to cancel at the period end.');

      // 3) ge repliken tid att hinna ikapp och ladda om med cache-bust
      await new Promise((r) => setTimeout(r, 1200));
      window.location.assign('/dashboard?ts=' + Date.now());
    } catch {
      alert('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="rounded-lg border border-red-600 text-red-600 px-3.5 py-2 text-sm hover:bg-red-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
      aria-label="Cancel subscription"
    >
      {loading ? 'Cancelling…' : 'Cancel subscription'}
    </button>
  );
}
