export default function Page() {
  return (
    <>
      <section className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">ArcSignals</h1>
        <p className="mt-1 text-sm text-gray-400">AI-drivna tekniska analyser • mörkt tema</p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#0E1627]/70 p-5 sm:p-7 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)]">
        <h2 className="text-xl font-semibold">Skapa teknisk analys</h2>
        <p className="mt-1 text-sm text-gray-400">
          Fyll i tillgång, nupris och ladda upp 1D/1W/1M-grafer. Vi genererar en komplett PDF-rapport.
        </p>

        <form action="/api/analyze" method="POST" encType="multipart/form-data" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Asset Name</label>
              <input
                name="asset"
                placeholder="t.ex., BTC/USD eller Volvo B"
                className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/30"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-300">Nuvarande pris</label>
              <input
                name="price"
                placeholder="t.ex., 712.50"
                inputMode="decimal"
                className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/30"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-300">1D graf (bild)</label>
                <input type="file" name="chart1d" accept="image/*"
                  className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-black/40 file:px-3 file:py-2 file:text-gray-200 hover:file:bg-black/60" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">1W graf (bild)</label>
                <input type="file" name="chart1w" accept="image/*"
                  className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-black/40 file:px-3 file:py-2 file:text-gray-200 hover:file:bg-black/60" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-300">1M graf (bild)</label>
                <input type="file" name="chart1m" accept="image/*"
                  className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-black/40 file:px-3 file:py-2 file:text-gray-200 hover:file:bg-black/60" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit"
              className="rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 font-medium hover:bg-cyan-500/15 hover:border-cyan-400/60 transition">
              Generera analys (PDF)
            </button>
            <span className="text-xs rounded-full border border-white/10 px-2 py-0.5 text-gray-400">Beta</span>
          </div>

          <p className="text-xs text-gray-500">
            Bilder bearbetas vid uppladdning. Rapporten genereras med scenarier, noter och ansvarsfriskrivning.
          </p>
        </form>
      </section>
    </>
  );
}
