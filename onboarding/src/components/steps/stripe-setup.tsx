'use client';

import { useWizard } from '@/lib/context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, ExternalLink, Info, Terminal, Webhook } from 'lucide-react';

export function StripeSetup() {
  const { config, updateConfig } = useWizard();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
          <CreditCard className="h-5 w-5 text-violet-600 dark:text-violet-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Stripe Setup</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Stripe handles all payment processing. The starter uses Checkout for
          purchases and webhooks to sync billing state to your database.
        </p>
      </div>

      {/* API Keys Guide */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            Getting Your API Keys
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </div>
              <div>
                <p className="font-medium">Create a Stripe account</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sign up at{' '}
                  <a
                    href="https://dashboard.stripe.com/register"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary underline underline-offset-2"
                  >
                    stripe.com
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  . You can use test mode for development.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </div>
              <div>
                <p className="font-medium">Find your API keys</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Go to{' '}
                  <a
                    href="https://dashboard.stripe.com/apikeys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary underline underline-offset-2"
                  >
                    Developers → API Keys
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  . Copy the Publishable key and Secret key.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                3
              </div>
              <div>
                <p className="font-medium">Set up local webhook forwarding</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Install the{' '}
                  <a
                    href="https://docs.stripe.com/stripe-cli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary underline underline-offset-2"
                  >
                    Stripe CLI
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  , then run:
                </p>
                <div className="mt-2 rounded-lg border bg-muted/50 p-3 font-mono text-sm">
                  stripe listen --forward-to localhost:3000/api/webhooks/stripe
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Copy the webhook signing secret (
                  <code className="rounded bg-muted px-1 font-mono text-xs">
                    whsec_...
                  </code>
                  ) it outputs.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Credentials */}
      <Card className="shadow-sm">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">API Credentials</h2>
            <Badge variant="secondary" className="text-xs">
              Required
            </Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripePublishableKey">Publishable Key</Label>
            <Input
              id="stripePublishableKey"
              value={config.stripePublishableKey}
              onChange={(e) =>
                updateConfig({ stripePublishableKey: e.target.value })
              }
              placeholder="pk_test_..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Starts with{' '}
              <code className="rounded bg-muted px-1 font-mono">pk_test_</code>{' '}
              (test mode) or{' '}
              <code className="rounded bg-muted px-1 font-mono">pk_live_</code>{' '}
              (production).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripeSecretKey">
              Secret Key{' '}
              <span className="font-normal text-muted-foreground">(server-only)</span>
            </Label>
            <Input
              id="stripeSecretKey"
              type="password"
              value={config.stripeSecretKey}
              onChange={(e) => updateConfig({ stripeSecretKey: e.target.value })}
              placeholder="sk_test_..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Server-side only. Used for creating checkout sessions and reading
              subscription data.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripeWebhookSecret">
              Webhook Secret{' '}
              <span className="font-normal text-muted-foreground">(server-only)</span>
            </Label>
            <Input
              id="stripeWebhookSecret"
              type="password"
              value={config.stripeWebhookSecret}
              onChange={(e) =>
                updateConfig({ stripeWebhookSecret: e.target.value })
              }
              placeholder="whsec_..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Used to verify that webhook events actually come from Stripe.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Webhook info */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Webhook className="h-4 w-4 text-muted-foreground" />
            Webhook Events
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The starter template handles these Stripe webhook events automatically.
            For production, configure your webhook endpoint at{' '}
            <code className="rounded bg-muted px-1 font-mono text-xs">
              https://yourdomain.com/api/webhooks/stripe
            </code>{' '}
            and select these events:
          </p>
          <div className="mt-4 space-y-2">
            {[
              {
                event: 'checkout.session.completed',
                desc: 'Creates subscription or purchase record',
              },
              {
                event: 'customer.subscription.updated',
                desc: 'Updates plan, status, and billing period',
              },
              {
                event: 'customer.subscription.deleted',
                desc: 'Marks subscription as canceled',
              },
              {
                event: 'invoice.paid',
                desc: 'Refreshes subscription to active status',
              },
              {
                event: 'invoice.payment_failed',
                desc: 'Marks subscription as past_due',
              },
            ].map((item) => (
              <div
                key={item.event}
                className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3"
              >
                <code className="flex-shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium">
                  {item.event}
                </code>
                <span className="text-sm text-muted-foreground">{item.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Architecture note */}
      <div className="flex gap-3 rounded-lg border-l-4 border-primary bg-primary/5 p-4">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">
            Billing state is never queried from Stripe at runtime
          </p>
          <p className="mt-1">
            All billing data flows through webhooks into your Supabase database.
            Your app reads billing status from the database, keeping pages fast and
            avoiding Stripe rate limits. This is the core architectural decision of
            the billing system.
          </p>
        </div>
      </div>
    </div>
  );
}
