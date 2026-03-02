'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Rocket,
  Database,
  CreditCard,
  Mail,
  Shield,
  Palette,
  Code,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Authentication',
    description:
      'Email/password auth with Supabase, including forgot & reset password flows.',
  },
  {
    icon: CreditCard,
    title: 'Billing & Payments',
    description:
      'Stripe subscriptions and one-time purchases, synced to your database via webhooks.',
  },
  {
    icon: Mail,
    title: 'Transactional Email',
    description:
      'Welcome and receipt emails powered by React Email templates and Resend.',
  },
  {
    icon: Database,
    title: 'Database',
    description:
      'PostgreSQL via Supabase with Row Level Security policies and auto-generated types.',
  },
  {
    icon: Palette,
    title: 'Beautiful UI',
    description:
      'Tailwind CSS v4 + shadcn/ui component library with built-in dark mode support.',
  },
  {
    icon: Code,
    title: 'TypeScript Strict',
    description:
      'End-to-end type safety with strict TypeScript and Zod v4 runtime validation.',
  },
];

const techStack = [
  'Next.js 16',
  'TypeScript',
  'Supabase',
  'Stripe',
  'Tailwind CSS v4',
  'shadcn/ui',
  'Resend',
  'React Email',
  'Zod v4',
  'TanStack Query',
  'Lucide Icons',
  'pnpm',
];

export function Welcome() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Rocket className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome to Your SaaS Starter
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
          This wizard will walk you through configuring your new SaaS application
          step by step. In about 5–10 minutes, you&apos;ll have a fully configured
          project ready to build on.
        </p>
      </div>

      {/* What's included */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">What&apos;s Included</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="shadow-sm">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="px-3 py-1 text-sm">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* What we'll configure */}
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Zap className="h-4 w-4 text-primary" />
            What We&apos;ll Configure
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {[
              "Your app's name, description, and branding",
              'Supabase database and authentication keys',
              'Stripe payments and webhook integration',
              'Billing plans, pricing tiers, and feature lists',
              'Resend email service and sender identity',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm font-medium text-foreground">
            At the end, you&apos;ll download a fully configured project as a zip
            file — ready for <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">pnpm install && pnpm dev</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
