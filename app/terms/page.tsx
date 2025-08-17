export const dynamic = 'force-dynamic';

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10 prose">
      <h1>Terms of Service</h1>
      <p><em>Last updated: 2025-08-17</em></p>

      <h2>1. About the Service</h2>
      <p>
        ArcSignals (“we”, “us”, “our”) provides a tool that generates technical
        analysis reports based on user-provided inputs and uploaded images (the “Service”).
        By accessing or using the Service, you agree to these Terms of Service (the “Terms”).
      </p>

      <h2>2. Accounts & Eligibility</h2>
      <ul>
        <li>You are responsible for the accuracy of your account details and for safeguarding your login credentials.</li>
        <li>You represent that you are at least 18 years old and have the legal capacity to enter into these Terms.</li>
      </ul>

      <h2>3. Payments, Subscriptions & Credits</h2>
      <ul>
        <li>Payments are processed by Stripe. By completing a purchase, you also agree to Stripe’s terms and policies.</li>
        <li>Subscriptions (monthly or yearly) renew automatically until cancelled. Cancellation takes effect at the end of the current billing period (“cancel at period end”).</li>
        <li>Credits can be purchased as one-off purchases and are consumed when you run an analysis. Credits are non-refundable once used.</li>
        <li>Prices may change in the future. Price changes do not affect an already paid billing period.</li>
        <li>Applicable taxes may be added as required by law.</li>
      </ul>

      <h2>4. Withdrawal/Refunds for Digital Services</h2>
      <p>
        For digital services, the statutory right of withdrawal may not apply once
        delivery has begun with your express consent. By starting an analysis or
        activating a subscription, you consent to immediate delivery. Any mandatory
        consumer rights under applicable law remain unaffected.
      </p>

      <h2>5. Cancellation & Termination</h2>
      <ul>
        <li>You can cancel your subscription from the dashboard. Your subscription remains active until the end of the current period.</li>
        <li>We may suspend or terminate accounts that violate these Terms or applicable law.</li>
      </ul>

      <h2>6. Uploaded Material & Rights</h2>
      <ul>
        <li>You retain ownership of the materials you upload.</li>
        <li>
          You grant us a non-exclusive, worldwide license to process the materials
          solely to provide, maintain, secure, and improve the Service (e.g., generate
          reports, troubleshoot issues). This license terminates when your materials
          are deleted from our systems, subject to legal obligations and backups.
        </li>
        <li>You are responsible for ensuring you have the necessary rights to all content you upload.</li>
      </ul>

      <h2>7. Generated Content & Use</h2>
      <ul>
        <li>You receive a non-exclusive license to use generated reports for your own internal purposes.</li>
        <li>Generated reports may not be resold or commercially redistributed without our prior written consent.</li>
      </ul>

      <h2>8. Acceptable Use</h2>
      <ul>
        <li>Do not upload illegal, harmful, infringing, or offensive content.</li>
        <li>Do not attempt to bypass security, disrupt the Service, or interfere with other users.</li>
      </ul>

      <h2>9. No Financial Advice</h2>
      <p>
        The Service does not provide financial or investment advice. Reports and
        analyses are for informational purposes only and are not recommendations to
        buy or sell securities. You act at your own risk.
      </p>

      <h2>10. Warranty Disclaimer & Limitation of Liability</h2>
      <ul>
        <li>The Service is provided “as is” and “as available”, without warranties of any kind, express or implied.</li>
        <li>
          To the maximum extent permitted by law, our total liability for claims
          arising out of or relating to the Service is limited to the amount you
          paid to us in the twelve (12) months prior to the event giving rise to the claim.
        </li>
      </ul>

      <h2>11. Personal Data</h2>
      <p>
        Please see our <a href="/privacy">Privacy Policy</a> for details on how we
        collect, use, and protect personal data.
      </p>

      <h2>12. Changes to the Service and to these Terms</h2>
      <p>
        We may update the Service and these Terms from time to time. For material changes,
        we will provide notice on the website or by email. Continued use of the Service
        after changes become effective constitutes acceptance of the updated Terms.
      </p>

      <h2>13. Governing Law & Disputes</h2>
      <p>
        These Terms are governed by the laws of Sweden, without regard to its conflict of law
        principles. Disputes shall be resolved by the courts of Sweden, with Stockholm District Court
        as the court of first instance, unless mandatory consumer protection laws provide otherwise.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these Terms? Contact us at{' '}
        <a href="mailto:support@yourdomain.com">support@yourdomain.com</a>.
      </p>
    </main>
  );
}
