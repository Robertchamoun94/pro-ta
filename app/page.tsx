import AnalyzeForm from '@/components/AnalyzeForm';

export default function Page() {
  return (
    <>
      <section className="mb-4">
        {/* Endast den mindre taglinen */}
        <p className="text-sm text-slate-600">AI-powered technical analysis</p>
      </section>

      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Create Technical Analysis</h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter the asset, current price, and upload 1D/1W/1M charts. We&apos;ll generate a complete PDF report.
        </p>

        <AnalyzeForm />
      </section>
    </>
  );
}
