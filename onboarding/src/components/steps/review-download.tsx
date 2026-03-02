'use client';

import { useState } from 'react';
import { useWizard } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Download,
  CheckCircle2,
  Settings,
  Database,
  CreditCard,
  Mail,
  Receipt,
  Loader2,
  PartyPopper,
  Terminal,
  Copy,
  Check,
} from 'lucide-react';

export function ReviewDownload() {
  const { config, goToStep } = useWizard();
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const projectSlug = config.appName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'my-saas';

  async function handleDownload() {
    setDownloading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Generation failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectSlug}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloaded(true);
      toast.success('Project downloaded successfully!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to generate project');
    } finally {
      setDownloading(false);
    }
  }

  function copyCommand(cmd: string) {
    navigator.clipboard.writeText(cmd);
    setCopiedCommand(cmd);
    setTimeout(() => setCopiedCommand(null), 2000);
  }

  const sections = [
    {
      icon: Settings,
      title: 'Project',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      step: 1,
      items: [
        { label: 'Name', value: config.appName },
        { label: 'Description', value: config.appDescription },
        { label: 'URL', value: config.siteUrl },
      ],
    },
    {
      icon: Database,
      title: 'Supabase',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      step: 2,
      items: [
        { label: 'URL', value: config.supabaseUrl || '(not set)' },
        { label: 'Anon Key', value: config.supabaseAnonKey ? 'Configured' : '(not set)', secret: true },
        { label: 'Service Role Key', value: config.supabaseServiceRoleKey ? 'Configured' : '(not set)', secret: true },
      ],
    },
    {
      icon: CreditCard,
      title: 'Stripe',
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-500/10',
      step: 3,
      items: [
        { label: 'Publishable Key', value: config.stripePublishableKey ? 'Configured' : '(not set)', secret: true },
        { label: 'Secret Key', value: config.stripeSecretKey ? 'Configured' : '(not set)', secret: true },
        { label: 'Webhook Secret', value: config.stripeWebhookSecret ? 'Configured' : '(not set)', secret: true },
      ],
    },
    {
      icon: Receipt,
      title: 'Billing',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10',
      step: 4,
      items: [
        { label: 'Plans', value: `${config.plans.length} plan${config.plans.length !== 1 ? 's' : ''}` },
        { label: 'Products', value: `${config.products.length} product${config.products.length !== 1 ? 's' : ''}` },
      ],
    },
    {
      icon: Mail,
      title: 'Email',
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-500/10',
      step: 5,
      items: [
        { label: 'API Key', value: config.resendApiKey ? 'Configured' : '(not set)', secret: true },
        { label: 'From', value: config.emailFrom || '(not set)' },
      ],
    },
  ];

  if (downloaded) {
    return (
      <div className="space-y-8">
        {/* Success state */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
            <PartyPopper className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">You&apos;re All Set!</h1>
          <p className="mx-auto mt-3 max-w-lg text-lg text-muted-foreground">
            Your configured SaaS starter has been downloaded. Here&apos;s how to get
            started:
          </p>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 font-semibold">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              Next Steps
            </h2>
            <div className="mt-4 space-y-4">
              {[
                { step: 'Unzip and enter the project', cmd: `cd ${projectSlug}` },
                { step: 'Install dependencies', cmd: 'pnpm install' },
                { step: 'Start local Supabase (if using local dev)', cmd: 'pnpm supabase start' },
                { step: 'Apply database migrations', cmd: 'pnpm supabase db reset' },
                { step: 'Start the dev server', cmd: 'pnpm dev' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.step}</p>
                    <div className="group mt-1.5 flex items-center gap-2">
                      <div className="flex-1 rounded-lg border bg-muted/50 px-3 py-2 font-mono text-sm">
                        {item.cmd}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyCommand(item.cmd)}
                        className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        {copiedCommand === item.cmd ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={() => {
            setDownloaded(false);
          }}
          variant="outline"
          className="w-full"
        >
          Download Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Download className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Review & Download</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Review your configuration below. Click any section to go back and make
          changes, or download your configured starter.
        </p>
      </div>

      {/* Config summary */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.title} className="shadow-sm">
            <CardContent className="p-5">
              <button
                onClick={() => goToStep(section.step)}
                className="flex w-full items-center gap-3 text-left group"
              >
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${section.bgColor}`}>
                  <section.icon className={`h-4 w-4 ${section.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                </div>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  Edit
                </Badge>
              </button>

              <Separator className="my-3" />

              <div className="space-y-2">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={`font-medium truncate ml-4 max-w-[60%] text-right ${
                      item.value === '(not set)' ? 'text-muted-foreground/50 italic' : ''
                    }`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Download section */}
      <Card className="border-primary/30 shadow-md">
        <CardContent className="p-6 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-primary" />
          <h2 className="text-lg font-semibold">Ready to Download</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Your configuration will be applied to the template. You&apos;ll get a zip
            file with your customized{' '}
            <code className="rounded bg-muted px-1 font-mono text-xs">.env.local</code>,
            site config, and billing config ready to go.
          </p>
          <Button
            size="lg"
            onClick={handleDownload}
            disabled={downloading}
            className="mt-5 gap-2"
          >
            {downloading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download {projectSlug}.zip
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
