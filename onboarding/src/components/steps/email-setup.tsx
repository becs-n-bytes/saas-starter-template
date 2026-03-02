'use client';

import { useWizard } from '@/lib/context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, ExternalLink, Info, FileText } from 'lucide-react';

export function EmailSetup() {
  const { config, updateConfig } = useWizard();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10">
          <Mail className="h-5 w-5 text-rose-600 dark:text-rose-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Email Setup</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          The starter uses Resend for transactional emails. You&apos;ll need an API
          key and a verified sender domain.
        </p>
      </div>

      {/* Walkthrough */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <FileText className="h-4 w-4 text-muted-foreground" />
            Setup Guide
          </h2>
          <div className="mt-4 space-y-4">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </div>
              <div>
                <p className="font-medium">Create a Resend account</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sign up at{' '}
                  <a
                    href="https://resend.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary underline underline-offset-2"
                  >
                    resend.com
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </div>
              <div>
                <p className="font-medium">Verify your domain</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Go to{' '}
                  <a
                    href="https://resend.com/domains"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary underline underline-offset-2"
                  >
                    Domains
                    <ExternalLink className="h-3 w-3" />
                  </a>{' '}
                  and add your domain. You&apos;ll need to add DNS records to verify
                  ownership.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                3
              </div>
              <div>
                <p className="font-medium">Create an API key</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Go to{' '}
                  <a
                    href="https://resend.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary underline underline-offset-2"
                  >
                    API Keys
                    <ExternalLink className="h-3 w-3" />
                  </a>{' '}
                  and create a new key. Copy it — you won&apos;t be able to see it
                  again.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credentials */}
      <Card className="shadow-sm">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Credentials</h2>
            <Badge variant="secondary" className="text-xs">
              Required
            </Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resendApiKey">
              API Key{' '}
              <span className="font-normal text-muted-foreground">(secret)</span>
            </Label>
            <Input
              id="resendApiKey"
              type="password"
              value={config.resendApiKey}
              onChange={(e) => updateConfig({ resendApiKey: e.target.value })}
              placeholder="re_..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Starts with{' '}
              <code className="rounded bg-muted px-1 font-mono">re_</code>. Used
              server-side only.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailFrom">Sender Address</Label>
            <Input
              id="emailFrom"
              value={config.emailFrom}
              onChange={(e) => updateConfig({ emailFrom: e.target.value })}
              placeholder='My SaaS <noreply@yourdomain.com>'
            />
            <p className="text-xs text-muted-foreground">
              Format:{' '}
              <code className="rounded bg-muted px-1 font-mono text-xs">
                Your App &lt;noreply@yourdomain.com&gt;
              </code>
              . The domain must be verified in Resend.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Included templates */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-semibold">Included Email Templates</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The starter includes two React Email templates, ready to use:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium">Welcome Email</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sent after a user signs up. Greets them by name and introduces the
                product.
              </p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                src/emails/welcome.tsx
              </p>
            </div>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="font-medium">Receipt Email</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sent after a successful payment. Includes product name, amount, and
                currency.
              </p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                src/emails/receipt.tsx
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optional SMTP config */}
      <div className="flex gap-3 rounded-lg border-l-4 border-primary bg-primary/5 p-4">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">
            Optional: Use Resend for Supabase auth emails
          </p>
          <p className="mt-1">
            By default, Supabase sends auth emails (confirmation, password reset)
            through its own mail service. To use your Resend domain instead, go to{' '}
            <strong>Supabase Dashboard → Authentication → SMTP Settings</strong>{' '}
            and configure:
          </p>
          <div className="mt-2 space-y-1 font-mono text-xs">
            <p>Host: smtp.resend.com</p>
            <p>Port: 465</p>
            <p>Username: resend</p>
            <p>Password: (your Resend API key)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
