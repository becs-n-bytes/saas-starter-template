import {
  Shield,
  CreditCard,
  Mail,
  Palette,
  Database,
  Zap,
} from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Authentication',
    description:
      'Email/password, OAuth, and magic links powered by Supabase Auth with cookie-based sessions.',
    icon: Shield,
  },
  {
    title: 'Stripe Billing',
    description:
      'Subscriptions and one-time purchases with webhook sync. No runtime Stripe calls for billing checks.',
    icon: CreditCard,
  },
  {
    title: 'Transactional Email',
    description:
      'Beautiful React Email templates sent via Resend. Welcome emails and payment receipts included.',
    icon: Mail,
  },
  {
    title: 'Dark Mode',
    description:
      'Light and dark themes with system preference detection. Powered by next-themes and Tailwind CSS.',
    icon: Palette,
  },
  {
    title: 'Database & RLS',
    description:
      'Supabase Postgres with row-level security. Users can only access their own data by default.',
    icon: Database,
  },
  {
    title: 'Type-Safe',
    description:
      'End-to-end TypeScript with strict mode. Zod validation for forms and API inputs.',
    icon: Zap,
  },
];

export function Features() {
  return (
    <section className="container py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to launch
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A complete foundation for your SaaS — so you can focus on what makes
          your product unique.
        </p>
      </div>
      <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="h-10 w-10 text-primary" />
              <CardTitle className="mt-4">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
