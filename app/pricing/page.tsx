// app/pricing/page.tsx
import Link from 'next/link';

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M20 6 9 17l-5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Plan = {
  id: 'single' | 'monthly' | 'yearly';
  name: string;
  price: string;
  priceNote?: string;
  badge?: string;
  badgeTone?: 'default' | 'popular' | 'value';
  description: string;
  cta: string; // button label
  features: string[];
};

const plans: Plan[] = [
  {
    id: 'single',
    name: 'Single Analysis',
    price: '$5',
    priceNote: 'One-time purchase',
    description:
      'Full technical analysis as a downloadable PDF. Great for trying ArcSignals.',
    cta: 'Buy 1 analysis — $5',
    features: [
      'Full technical analysis as downloadable PDF',
      'LONG & SHORT scenarios (entries, stops, targets)',
      'Trend breakdown (1D / 1W / 1M)',
      'Support & Resistance levels',
      'Indicators: RSI, MACD, MA(50/200), Volume',
      'Market structure: BOS, CHoCH, FVG, Order Blocks, Fibonacci',
      'Volatility & Volume Profile sections',
      'Professional disclaimer included',
    ],
  },
  {
    id: 'monthly',
    name: 'Monthly plan',
    price: '$14',
    priceNote: '/mo',
    badge: 'MOST POPULAR · -50%',
    badgeTone: 'popular',
    description: 'Unlimited analyses while active. Cancel anytime.',
    cta: 'Subscribe — $14/mo',
    features: [
      'Unlimited technical analyses',
      'Everything in Single Analysis',
      'Priority processing',
      'Access to future indicators & upgrades',
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly plan',
    price: '$140',
    priceNote: '/yr',
    badge: 'BEST VALUE',
    badgeTone: 'value',
    description: 'Unlimited analyses for 12 months.',
    cta: 'Subscribe — $140/yr',
    features: [
      'Everything in Monthly',
      'Priority support',
      'Locked price for 12 months',
    ],
  },
];

function PlanCard({ plan, highlight = false }: { plan: Plan; highlight?: boolean }) {
  const ring =
    highlight
      ? 'ring-1 ring-cyan-500/40 shadow-[0_20px_60px_-30px_rgba(34,211,238,.35)]'
      : 'ring-1 ring-white/10';

  const badgeTone =
    plan.badgeTone === 'popular'
      ? 'bg-cyan-500/10 text-cyan-300 border-cyan-400/30'
      : plan.badgeTone === 'value'
      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-400/30'
      : 'bg-white/5 text-gray-300 border-white/10';

  return (
    <div className={`flex flex-col rounded-2xl ${ring} bg-[#0E1627]/70 p-5`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          {plan.description && (
            <p className="mt-1 text-sm text-gray-400">{plan.description}</p>
          )}
        </div>
        {plan.badge && (
          <span className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] ${badgeTone}`}>
            {plan.badge}
          </span>
        )}
      </div>

      <div className="mt-4 mb-2">
        <div className="flex items-baseline gap-1">
          <div className="text-4xl font-semibold">{plan.price}</div>
          {plan.priceNote && <div className="text-sm text-gray-400">{plan.priceNote}</div>}
        </div>
      </div>

      <ul className="mt-4 space-y-2 text-sm">
        {plan.features.map((f, i) => (
          <li key={i} className="flex gap-2">
            <CheckIcon className="mt-[2px] h-4 w-4 text-emerald-400" />
            <span className="text-gray-300">{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <form
        action="/api/checkout"
        method="POST"
        className="mt-6"
      >
        {/* Skicka med plan-id. Din /api/checkout kan läsa detta. */}
        <input type="hidden" name="plan" value={plan.id} />
        <button
          type="submit"
          className={`w-full rounded-xl border px-4 py-2 font-medium transition
            ${highlight
              ? 'border-cyan-400/40 bg-cyan-500/10 hover:bg-cyan-500/15 hover:border-cyan-400/60'
              : 'border-white/10 hover:bg-white/5'
            }`}
        >
          {plan.cta}
        </button>
      </form>
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <p className="mb-6 text-sm text-gray-300">
        Choose the plan that fits you. You’ll need an account to complete checkout.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Single */}
        <PlanCard plan={plans[0]} />

        {/* Monthly (highlighted) */}
        <PlanCard plan={plans[1]} highlight />

        {/* Yearly */}
        <PlanCard plan={plans[2]} />
      </div>

      {/* Hjälplänk om du vill lägga FAQ eller kontakt */}
      <div className="mt-8 text-sm text-gray-400">
        Have questions? <Link href="/contact" className="underline underline-offset-2 hover:no-underline">Contact us</Link>.
      </div>
    </main>
  );
}
