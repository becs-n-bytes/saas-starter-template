'use client';

import { useWizard } from '@/lib/context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, ExternalLink, Info, AlertTriangle, Server } from 'lucide-react';

export function SupabaseSetup() {
  const { config, updateConfig } = useWizard();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
          <Database className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Supabase Setup</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Supabase provides your database (PostgreSQL) and authentication. You can
          run it locally with Docker or use a hosted project.
        </p>
      </div>

      {/* Walkthrough */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Server className="h-4 w-4 text-muted-foreground" />
            Setup Guide
          </h2>

          <div className="mt-4 space-y-4">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </div>
              <div>
                <p className="font-medium">Install the Supabase CLI</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Follow the{' '}
                  <a
                    href="https://supabase.com/docs/guides/cli"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary underline underline-offset-2"
                  >
                    official guide
                    <ExternalLink className="h-3 w-3" />
                  </a>{' '}
                  to install the CLI for your platform.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </div>
              <div>
                <p className="font-medium">Start local Supabase</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Run the following command in your project root. This starts local
                  PostgreSQL, Auth, and Studio containers via Docker.
                </p>
                <div className="mt-2 rounded-lg border bg-muted/50 p-3 font-mono text-sm">
                  pnpm supabase start
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                3
              </div>
              <div>
                <p className="font-medium">Copy your keys</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  After starting, run{' '}
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    pnpm supabase status
                  </code>{' '}
                  to see your local API URL and keys. Copy them into the fields below.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                4
              </div>
              <div>
                <p className="font-medium">Apply database migrations</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Run the following to create the initial schema (profiles,
                  subscriptions, purchases tables with RLS):
                </p>
                <div className="mt-2 rounded-lg border bg-muted/50 p-3 font-mono text-sm">
                  pnpm supabase db reset
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Production alternative */}
      <div className="flex gap-3 rounded-lg border-l-4 border-blue-500 bg-blue-500/5 p-4">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Using a hosted Supabase project?</p>
          <p className="mt-1">
            Create a project at{' '}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              supabase.com
            </a>
            , then go to <strong>Settings → API</strong> to find your Project URL
            and keys. After linking with{' '}
            <code className="rounded bg-muted px-1 font-mono text-xs">
              pnpm supabase link --project-ref YOUR_ID
            </code>
            , push migrations with{' '}
            <code className="rounded bg-muted px-1 font-mono text-xs">
              pnpm supabase db push
            </code>
            .
          </p>
        </div>
      </div>

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
            <Label htmlFor="supabaseUrl">Project URL</Label>
            <Input
              id="supabaseUrl"
              value={config.supabaseUrl}
              onChange={(e) => updateConfig({ supabaseUrl: e.target.value })}
              placeholder="http://127.0.0.1:54321"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Local default:{' '}
              <code className="rounded bg-muted px-1 font-mono">http://127.0.0.1:54321</code>.
              For hosted projects, this is your Project URL from the Supabase dashboard.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supabaseAnonKey">Anon Key</Label>
            <Input
              id="supabaseAnonKey"
              value={config.supabaseAnonKey}
              onChange={(e) => updateConfig({ supabaseAnonKey: e.target.value })}
              placeholder="eyJhbGciOiJIUzI1NiIs..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              The public anonymous key. Safe to use in browser code. Used by both
              the browser and server Supabase clients.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supabaseServiceRoleKey">
              Service Role Key{' '}
              <span className="font-normal text-muted-foreground">(secret)</span>
            </Label>
            <Input
              id="supabaseServiceRoleKey"
              type="password"
              value={config.supabaseServiceRoleKey}
              onChange={(e) =>
                updateConfig({ supabaseServiceRoleKey: e.target.value })
              }
              placeholder="eyJhbGciOiJIUzI1NiIs..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Server-only secret that bypasses Row Level Security. Used only in the
              webhook handler to write billing data.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Schema info */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="font-semibold">Database Schema</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The included migration creates the following tables automatically:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              {
                name: 'profiles',
                desc: 'User profile data (extends Supabase Auth)',
              },
              {
                name: 'customers',
                desc: 'Maps users to Stripe customer IDs',
              },
              {
                name: 'subscriptions',
                desc: 'Active subscriptions synced from Stripe',
              },
              {
                name: 'purchases',
                desc: 'One-time purchases synced from Stripe',
              },
            ].map((table) => (
              <div
                key={table.name}
                className="rounded-lg border bg-muted/30 p-3"
              >
                <p className="font-mono text-sm font-medium">{table.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {table.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            All tables have Row Level Security enabled. Users can only read their
            own data. Writes happen through the admin client in webhook handlers.
          </p>
        </CardContent>
      </Card>

      {/* Security warning */}
      <div className="flex gap-3 rounded-lg border-l-4 border-amber-500 bg-amber-500/5 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Keep your Service Role Key secret</p>
          <p className="mt-1">
            The service role key bypasses all Row Level Security policies. Never
            expose it in client-side code. The starter template enforces this with{' '}
            <code className="rounded bg-muted px-1 font-mono text-xs">
              import &apos;server-only&apos;
            </code>{' '}
            on the admin client module.
          </p>
        </div>
      </div>
    </div>
  );
}
