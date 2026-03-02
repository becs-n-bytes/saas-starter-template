import type { Metadata } from 'next';
import { PricingCards } from '@/components/marketing/pricing-cards';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Choose the plan that works for you.',
};

export default function PricingPage() {
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Pricing
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that works for you. Upgrade or downgrade at any time.
        </p>
      </div>
      <div className="mt-10">
        <PricingCards />
      </div>
    </section>
  );
}
