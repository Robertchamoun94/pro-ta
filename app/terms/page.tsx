export const dynamic = 'force-dynamic';

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Terms of Service</h1>
      <p className="mb-8 text-slate-600">
        Please read these Terms carefully. By accessing or using ArcSignals (the “Service”),
        you agree to the Terms below.
      </p>

      <div className="space-y-3">
        {/* 1 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>1. About the Service</span>
            <svg
              className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180"
              viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
            >
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </summary>
          <div className="mt-3 text-slate-700 leading-relaxed">
            ArcSignals (“we”, “us”, “our”) provides a tool that generates technical
            analysis reports based on user inputs and uploaded images (the “Service”).
            By using the Service, you agree to these Terms.
          </div>
        </details>

        {/* 2 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>2. Accounts & Eligibility</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
            <li>You are responsible for accurate account details and safeguarding your credentials.</li>
            <li>You confirm you are at least 18 years old and legally able to enter these Terms.</li>
          </ul>
        </details>

        {/* 3 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>3. Payments, Subscriptions & Credits</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
            <li>Payments are processed by Stripe; you also agree to Stripe’s terms and policies.</li>
            <li>Subscriptions (monthly/yearly) renew automatically until cancelled at the end of the current period (“cancel at period end”).</li>
            <li>Credits are one-off purchases consumed per analysis; used credits are non-refundable.</li>
            <li>Prices may change; changes do not affect an already paid period. Taxes may apply.</li>
          </ul>
        </details>

        {/* 4 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>4. Withdrawal/Refunds for Digital Services</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <p className="mt-3 text-slate-700">
            For digital services, the statutory right of withdrawal may not apply once delivery has begun
            with your express consent. By starting an analysis or activating a subscription, you consent
            to immediate delivery. Mandatory consumer rights remain unaffected.
          </p>
        </details>

        {/* 5 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>5. Cancellation & Termination</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
            <li>You can cancel from the dashboard; access remains until the period ends.</li>
            <li>We may suspend or terminate accounts for violations of these Terms or law.</li>
          </ul>
        </details>

        {/* 6 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>6. Uploaded Material & Rights</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
            <li>You retain ownership of your uploads.</li>
            <li>We receive a non-exclusive, worldwide license to process the material solely to provide, maintain, secure, and improve the Service (e.g., generate reports, troubleshoot). The license ends when your material is deleted (subject to legal obligations/backups).</li>
            <li>You warrant you have necessary rights to upload the content.</li>
          </ul>
        </details>

        {/* 7 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>7. Generated Content & Use</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
            <li>You may use generated reports for your internal purposes.</li>
            <li>Do not resell or commercially redistribute reports without our written consent.</li>
          </ul>
        </details>

        {/* 8 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>8. Acceptable Use</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
            <li>No illegal, harmful, infringing, or offensive content.</li>
            <li>No attempts to bypass security or disrupt the Service.</li>
          </ul>
        </details>

        {/* 9 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>9. No Financial Advice</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <p className="mt-3 text-slate-700">
            We do not provide financial or investment advice. Reports are informational and
            not recommendations to buy or sell securities. You act at your own risk.
          </p>
        </details>

        {/* 10 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>10. Warranty Disclaimer & Limitation of Liability</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-700">
            <li>The Service is provided “as is” and “as available”, without warranties of any kind.</li>
            <li>To the maximum extent permitted by law, our total liability is limited to amounts paid in the prior 12 months.</li>
          </ul>
        </details>

        {/* 11 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>11. Personal Data</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <p className="mt-3 text-slate-700">
            See our <a className="underline" href="/privacy">Privacy Policy</a> for details on how we collect, use, and protect personal data.
          </p>
        </details>

        {/* 12 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>12. Changes to the Service and to these Terms</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <p className="mt-3 text-slate-700">
            We may update the Service and these Terms. For material changes, we will provide notice
            on the website or by email. Continued use after changes take effect constitutes acceptance.
          </p>
        </details>

        {/* 13 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>13. Governing Law & Disputes</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <p className="mt-3 text-slate-700">
            These Terms are governed by the laws of Sweden. Disputes are resolved by Swedish courts,
            with Stockholm District Court as the first instance, unless mandatory consumer laws apply.
          </p>
        </details>

        {/* 14 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>14. Contact</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <p className="mt-3 text-slate-700">
            Questions about these Terms? Email us at{' '}
            <a className="underline" href="mailto:support@yourdomain.com">support@yourdomain.com</a>.
          </p>
        </details>
      </div>
    </main>
  );
}
