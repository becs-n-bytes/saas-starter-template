import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <section className="container max-w-3xl py-24">
      <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-4 text-muted-foreground">
        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <div className="prose prose-neutral dark:prose-invert mt-8">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of{' '}
          {siteConfig.name} (&quot;Service&quot;). By using our Service, you
          agree to these Terms.
        </p>
        <h2>Use of Service</h2>
        <p>
          You must be at least 13 years old to use this Service. You are
          responsible for maintaining the security of your account and password.
        </p>
        <h2>Payments & Refunds</h2>
        <p>
          Paid plans are billed in advance on a recurring basis. You can cancel
          your subscription at any time through your account settings.
        </p>
        <h2>Limitation of Liability</h2>
        <p>
          Our service is provided &quot;as is&quot; without warranty of any kind.
          We shall not be liable for any indirect, incidental, or consequential
          damages.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at
          support@yourdomain.com.
        </p>
      </div>
    </section>
  );
}
