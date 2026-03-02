import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="border-t">
      <div className="container flex flex-col items-center gap-6 py-24 text-center">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to get started?
        </h2>
        <p className="max-w-[42rem] text-lg text-muted-foreground">
          Create your account and start building today. No credit card required.
        </p>
        <Button size="lg" asChild>
          <Link href="/signup">
            Start Building
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
