import { Hero } from '@/components/marketing/hero';
import { Features } from '@/components/marketing/features';
import { PricingCards } from '@/components/marketing/pricing-cards';
import { CTA } from '@/components/marketing/cta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <section className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that works for you. Upgrade or downgrade at any
            time.
          </p>
        </div>
        <div className="mt-10">
          <PricingCards />
        </div>
      </section>
      <CTA />
    </>
  );
}
