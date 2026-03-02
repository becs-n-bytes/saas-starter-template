import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export function Hero() {
  return (
    <section className="container flex flex-col items-center gap-6 pb-8 pt-24 text-center md:pt-32">
      <div className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
        <span>🎉</span>
        <span>Now in public beta</span>
      </div>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        Build your next SaaS{' '}
        <span className="text-primary">faster than ever</span>
      </h1>
      <p className="max-w-[42rem] text-lg text-muted-foreground sm:text-xl">
        {siteConfig.description} Ship your product in days, not weeks.
        Authentication, billing, and email — all wired up and ready to go.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/signup">
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href={siteConfig.links.github} target="_blank" rel="noopener">
            View on GitHub
          </Link>
        </Button>
      </div>
    </section>
  );
}
