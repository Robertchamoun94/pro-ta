// app/contact/page.tsx
import ContactForm from '@/components/ContactForm';

export const metadata = {
  title: 'Contact — ArcSignals',
  description: 'Get in touch with ArcSignals support.',
};

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-lg font-semibold">Contact support</h1>
      <p className="mt-1 text-sm text-slate-600">
        Fill in the form below and we’ll get back to you within 24 hours.
      </p>

      <ContactForm />
    </section>
  );
}
