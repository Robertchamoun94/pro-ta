'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onClick() {
    const ok = window.confirm(
      'Are you sure you want to cancel? Your subscription will remain active until the end of the current billing period.'
    );
    if (!ok) return;

    setLoading(true);
    try {
      const res = await fetch('/api/cancel-subscription', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.message || 'Could not cancel subscription.');
        return;
      }
      alert('Subscription set to cancel at the period end.');
      router.refresh(); // uppdatera dashboard-visningen
    } catch {
      alert('Network error. Please try again.');
    } finally {
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
