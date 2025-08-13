'use client';
import { useState } from 'react';

type PlanId = 'single' | 'monthly' | 'yearly';
type StripePlan = 'ONE_TIME' | 'MONTHLY' | 'YEARLY';

function toStripePlan(planId: PlanId): StripePlan {
  switch (planId) {
    case 'single':
      return 'ONE_TIME';
    case 'monthly':
      return 'MONTHLY';
    case 'yearly':
      return 'YEARLY';
  }
}

export default function CheckoutButton({
  planId,
  cta,
  highlight,
}: {
  planId: PlanId;
  cta: string;
  highlight?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    try {
      setLoading(true);
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: toStripePlan(planId) }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        alert(j.error ?? 'Checkout error');
        return;
      }
      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={startCheckout}
      disabled={loading}
      className={`w-full rounded-lg px-4 py-2 font-medium transition border
        ${highlight ? 'bg-slate-900 text-white border-slate-900 hover:opacity-90'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'}
        ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Opening Checkout…' : cta}
    </button>
  );
}
