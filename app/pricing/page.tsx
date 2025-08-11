export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Plans</h1>
        <a href="/" className="btn">← Back to analysis</a>
      </div>

      <div className="card p-6">
        <p className="opacity-70 text-sm mb-6">
          Choose the plan that fits you. You’ll need an account to complete checkout.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Single Analysis */}
          <div className="card p-6 relative">
            <span className="absolute right-4 top-4 text-[10px] uppercase tracking-wide bg-white/10 px-2 py-1 rounded">
              -50% today
            </span>

            <h2 className="font-semibold text-lg mb-1">Single Analysis</h2>
            <p className="opacity-70 text-sm mb-4">One-time purchase</p>

            <div className="mb-3">
              <div className="text-sm line-through opacity-50">$10</div>
              <div className="text-3xl font-semibold">$5</div>
            </div>

            <ul className="text-sm space-y-2 mb-6 opacity-90">
              <Feature>Full technical analysis as downloadable PDF</Feature>
              <Feature>LONG & SHORT scenarios (entries, stops, targets)</Feature>
              <Feature>Trend breakdown (1D / 1W / 1M)</Feature>
              <Feature>Support & Resistance levels</Feature>
              <Feature>Indicators: RSI, MACD, MA(50/200), Volume</Feature>
              <Feature>Market structure: BOS, CHoCH, FVG, Order Blocks, Fibonacci</Feature>
              <Feature>Volatility & Volume Profile sections</Feature>
              <Feature>Professional disclaimer included</Feature>
            </ul>

            <form action="/api/checkout" method="POST">
              <input type="hidden" name="plan" value="oneoff" />
              <button className="btn w-full">Buy 1 analysis — $5</button>
            </form>
          </div>

          {/* Monthly Plan (Most popular) */}
          <div className="card p-6 relative ring-1 ring-white/15">
            <span className="absolute right-4 top-4 text-[10px] uppercase tracking-wide bg-white/10 px-2 py-1 rounded">
              Most popular • -50%
            </span>

            <h2 className="font-semibold text-lg mb-1">Monthly plan</h2>
            <p className="opacity-70 text-sm mb-4">Unlimited analyses while active</p>

            <div className="mb-1">
              <div className="text-sm line-through opacity-50">$28</div>
              <div className="text-3xl font-semibold">
                $14<span className="text-base font-normal opacity-70">/mo</span>
              </div>
            </div>
            <p className="text-xs opacity-70 mb-4">Cancel anytime.</p>

            <ul className="text-sm space-y-2 mb-6 opacity-90">
              <Feature>Unlimited technical analyses</Feature>
              <Feature>Everything in Single Analysis</Feature>
              <Feature>Priority processing</Feature>
              <Feature>Access to future indicators & upgrades</Feature>
            </ul>

            <form action="/api/checkout" method="POST">
              <input type="hidden" name="plan" value="monthly" />
              <button className="btn btn-primary w-full">Subscribe — $14/mo</button>
            </form>
          </div>

          {/* Yearly Plan (Best value) */}
          <div className="card p-6 relative">
            <span className="absolute right-4 top-4 text-[10px] uppercase tracking-wide bg-white/10 px-2 py-1 rounded">
              Best value
            </span>

            <h2 className="font-semibold text-lg mb-1">Yearly plan</h2>
            <p className="opacity-70 text-sm mb-4">Unlimited analyses for 12 months</p>

            <div className="mb-1">
              <div className="text-sm line-through opacity-50">$280</div>
              <div className="text-3xl font-semibold">
                $140<span className="text-base font-normal opacity-70">/yr</span>
              </div>
            </div>
            <p className="text-xs opacity-80 mb-4">
              Save <span className="font-semibold">$28</span> — 2 months free vs $14/mo.
            </p>

            <ul className="text-sm space-y-2 mb-6 opacity-90">
              <Feature>Everything in Monthly</Feature>
              <Feature>Priority support</Feature>
              <Feature>Locked price for 12 months</Feature>
            </ul>

            <form action="/api/checkout" method="POST">
              <input type="hidden" name="plan" value="yearly" />
              <button className="btn w-full">Subscribe — $140/yr</button>
            </form>
          </div>
        </div>

        <p className="text-xs opacity-60 mt-6">
          Stripe Checkout (stub) — connect your price IDs in <code>.env</code>.
        </p>
      </div>
    </div>
  );
}

/** Small inline component for checkmarked features */
function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-[2px] text-green-400">✓</span>
      <span>{children}</span>
    </li>
  );
}
