import Header from '@/components/Header';
import AnalyzeForm from '@/components/AnalyzeForm';

export default function Page() {
  return (
    <>
      <Header />

      <div className="card p-6 mb-8">
        <h2 className="text-lg font-semibold mb-2">Create Technical Analysis</h2>
        <p className="opacity-70 text-sm mb-4">
          Enter the asset, current price, and upload 1D/1W/1M charts. We’ll generate a complete PDF report.
        </p>
        <AnalyzeForm />
      </div>
    </>
  );
}
