import AnalyzeForm from '@/components/AnalyzeForm';

export default function Page() {
  return (
    <>
      <section className="mb-4">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">ArcSignals</h1>
        <p className="mt-1 text-sm text-gray-400">AI-powered technical analysis • dark theme</p>
      </section>

      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-white/10 bg-[#0E1627]/70 p-5 sm:p-6 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)]">
        <h2 className="text-lg font-semibold">Create Technical Analysis</h2>
        <p className="mt-1 text-sm text-gray-400">
          Enter the asset, current price, and upload 1D/1W/1M charts. We&apos;ll generate a complete PDF report.
        </p>

        <AnalyzeForm />
      </section>
    </>
  );
}
