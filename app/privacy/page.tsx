// app/privacy/page.tsx
export const dynamic = 'force-dynamic';

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Privacy Policy</h1>
      <p className="mb-8 text-slate-600">
        This Privacy Policy explains what personal data ArcSignals (“we”, “us”, “our”)
        collects, how we use it, and the choices you have. By using our Service you
        agree to this Policy.
      </p>

      <div className="space-y-3">
        {/* 1 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>1. What this policy covers</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <p className="mt-3 text-slate-700">
            This policy applies to the ArcSignals website, dashboard, and related
            services that link to it. It does not cover third-party services you
            access via links (e.g., Stripe’s checkout pages), which have their own policies.
          </p>
        </details>

        {/* 2 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>2. Data we collect</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
            <li>
              <strong>Account & Profile</strong>: name (if provided), email, user ID, subscription/credit
              status, and preferences.
            </li>
            <li>
              <strong>Authentication</strong>: session identifiers, tokens, timestamps, and related
              metadata to keep you signed in.
            </li>
            <li>
              <strong>Billing</strong>: handled by <strong>Stripe</strong>. We receive limited data
              (e.g., customer ID, plan, payment status) but do not store full card details.
            </li>
            <li>
              <strong>Uploads & Inputs</strong>: images/charts you upload and text fields you provide
              to generate reports.
            </li>
            <li>
              <strong>Generated Output</strong>: analysis PDFs and related metadata.
            </li>
            <li>
              <strong>Usage & Device Info</strong>: IP address, device/browser type, pages
              visited, and basic logs for security and troubleshooting.
            </li>
            <li>
              <strong>Cookies & Local Storage</strong>: essential cookies for authentication,
              session continuity, and Stripe checkout functionality.
            </li>
          </ul>
        </details>

        {/* 3 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>3. How we use your data (purposes & legal bases)</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
            <li>Provide the Service and generate reports you request (contract performance).</li>
            <li>Process payments and manage subscriptions/credits (contract performance).</li>
            <li>Secure accounts, prevent abuse, and troubleshoot (legitimate interests/security).</li>
            <li>Communicate important updates about the Service (legitimate interests/contract).</li>
            <li>Comply with legal obligations (tax, bookkeeping, fraud prevention, sanctions).</li>
          </ul>
        </details>

        {/* 4 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>4. Retention</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <p className="mt-3 text-slate-700">
            We keep personal data only as long as necessary for the purposes described above:
            account data while you maintain an account; billing records per statutory retention;
            uploads/outputs until deleted by you or per our operational retention schedules and
            backups. Backup copies are cycled out on a schedule.
          </p>
        </details>

        {/* 5 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>5. Sharing & processors</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
            <li><strong>Stripe</strong> – payments, invoicing, subscription management.</li>
            <li><strong>Supabase</strong> – database, authentication, storage of uploads/outputs.</li>
            <li><strong>Hosting/CDN</strong> providers – serve the app securely and reliably.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            We do not sell your personal data. Service providers act under agreements that
            limit processing to our instructions and apply appropriate safeguards.
          </p>
        </details>

        {/* 6 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>6. International transfers</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <p className="mt-3 text-slate-700">
            Where data is transferred outside your jurisdiction, we rely on appropriate
            safeguards (e.g., EU Standard Contractual Clauses) with our processors, as applicable.
          </p>
        </details>

        {/* 7 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>7. Security</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <p className="mt-3 text-slate-700">
            We apply technical and organizational measures appropriate to the risks of the Service,
            including access controls, encryption in transit, and least-privilege practices with our providers.
            No method is 100% secure; report concerns to us immediately.
          </p>
        </details>

        {/* 8 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>8. Your rights</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
            <li>Access, rectification, deletion, and portability of your personal data.</li>
            <li>Restriction or objection to certain processing (e.g., legitimate interests).</li>
            <li>Complaint to a supervisory authority where applicable.</li>
          </ul>
        </details>

        {/* 9 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>9. Your choices & controls</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
            <li>Update account info and manage subscriptions in your dashboard.</li>
            <li>Delete uploads/outputs or request account/data deletion by contacting us.</li>
            <li>Control cookies via your browser (note: essential cookies are required for login/checkout).</li>
          </ul>
        </details>

        {/* 10 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>10. Children</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <p className="mt-3 text-slate-700">
            The Service is not directed to children under 16, and we do not knowingly collect
            personal data from them. If you believe a child provided data, contact us for deletion.
          </p>
        </details>

        {/* 11 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>11. Changes to this Policy</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <p className="mt-3 text-slate-700">
            We may update this Policy from time to time. Material changes will be
            announced on the website or by email where appropriate.
          </p>
        </details>

        {/* 12 */}
        <details className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
            <span>12. Contact & data controller</span>
            <svg className="h-5 w-5 text-slate-500 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.24 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
          </summary>
          <p className="mt-3 text-slate-700">
            Data controller: ArcSignals. Questions or requests? Email{' '}
            <a className="underline" href="mailto:support@yourdomain.com">support@yourdomain.com</a>.
          </p>
        </details>
      </div>
    </main>
  );
}
