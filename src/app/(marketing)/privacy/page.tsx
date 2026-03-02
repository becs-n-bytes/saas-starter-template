import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <section className="container max-w-3xl py-24">
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-4 text-muted-foreground">
        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <div className="prose prose-neutral dark:prose-invert mt-8">
        <p>
          This Privacy Policy describes how {siteConfig.name} (&quot;we&quot;,
          &quot;us&quot;, or &quot;our&quot;) collects, uses, and shares your
          information when you use our service.
        </p>
        <h2>Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you
          create an account, make a purchase, or contact us for support. This
          information may include your name, email address, and payment
          information.
        </p>
        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our
          services, process transactions, and communicate with you.
        </p>
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at support@yourdomain.com.
        </p>
      </div>
    </section>
  );
}
