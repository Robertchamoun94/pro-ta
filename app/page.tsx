export default function Page() {
  return (
    <>
      {/* Title */}
      <section className="mb-4">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">ArcSignals</h1>
        <p className="mt-1 text-sm text-gray-400">AI-powered technical analysis • dark theme</p>
      </section>

      {/* Compact card */}
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0E1627]/70 p-5 sm:p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)]">
        <h2 className="text-lg font-semibold">Create Technical Analysis</h2>
        <p className="mt-1 text-sm text-gray-400">
          Enter the asset, current price, and upload 1D/1W/1M charts. We&apos;ll generate a complete PDF report.
        </p>

        <form
          action="/api/analyze"
          method="POST"
          encType="multipart/form-data"
          className="mt-5 space-y-5"
        >
          {/* Inputs (compact) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1 text-gray-300">Asset Name</label>
              <input
                name="asset"
                placeholder="e.g., BTC/USD or Volvo B"
                className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40"
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-gray-300">Current Price</label>
              <input
                name="price"
                placeholder="e.g., 712.50"
                inputMode="decimal"
                className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40"
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
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-300">1W chart (image)</label>
                <input
                  type="file"
                  name="chart1w"
                  accept="image/*"
                  className="block w-full text-xs file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-black/40 file:px-3 file:py-1.5 file:text-gray-200 hover:file:bg-black/60"
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-300">1M chart (image)</label>
                <input
                  type="file"
                  name="chart1m"
                  accept="image/*"
                  className="block w-full text-xs file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-black/40 file:px-3 file:py-1.5 file:text-gray-200 hover:file:bg-black/60"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3.5 py-1.5 text-sm font-medium hover:bg-cyan-500/15 hover:border-cyan-400/60 transition"
            >
              Generate Analysis (PDF)
            </button>
            <span className="text-[11px] rounded-full border border-white/10 px-2 py-0.5 text-gray-400">
              Beta
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Images are processed on upload. The report includes scenarios, notes, and a disclaimer.
          </p>
        </form>
      </section>
    </>
  );
}
