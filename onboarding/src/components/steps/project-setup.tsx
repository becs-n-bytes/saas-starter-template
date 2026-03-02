'use client';

import { useWizard } from '@/lib/context';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Settings, Info } from 'lucide-react';

export function ProjectSetup() {
  const { config, updateConfig } = useWizard();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Project Setup</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Define your app&apos;s identity. These values appear in the browser tab, metadata,
          emails, and throughout the UI.
        </p>
      </div>

      {/* App Identity */}
      <Card className="shadow-sm">
        <CardContent className="space-y-5 p-6">
          <h2 className="font-semibold">App Identity</h2>

          <div className="space-y-2">
            <Label htmlFor="appName">App Name</Label>
            <Input
              id="appName"
              value={config.appName}
              onChange={(e) => updateConfig({ appName: e.target.value })}
              placeholder="My SaaS"
            />
            <p className="text-xs text-muted-foreground">
              Used in the browser tab title, navbar, emails, and metadata. Maps to{' '}
              <code className="rounded bg-muted px-1 font-mono">siteConfig.name</code> and{' '}
              <code className="rounded bg-muted px-1 font-mono">NEXT_PUBLIC_APP_NAME</code>.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appDescription">App Description</Label>
            <Textarea
              id="appDescription"
              value={config.appDescription}
              onChange={(e) => updateConfig({ appDescription: e.target.value })}
              placeholder="A brief description of what this product does."
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              Appears in SEO meta tags and OpenGraph previews. Keep it under 160
              characters for best results.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* URLs */}
      <Card className="shadow-sm">
        <CardContent className="space-y-5 p-6">
          <h2 className="font-semibold">URLs</h2>

          <div className="space-y-2">
            <Label htmlFor="siteUrl">Site URL</Label>
            <Input
              id="siteUrl"
              value={config.siteUrl}
              onChange={(e) => updateConfig({ siteUrl: e.target.value })}
              placeholder="http://localhost:3000"
            />
            <p className="text-xs text-muted-foreground">
              Base URL used for absolute links, metadata, and email links. Use{' '}
              <code className="rounded bg-muted px-1 font-mono">http://localhost:3000</code>{' '}
              for local development. Change to your domain when deploying.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="shadow-sm">
        <CardContent className="space-y-5 p-6">
          <h2 className="font-semibold">Social Links</h2>
          <p className="text-sm text-muted-foreground -mt-2">
            Optional. Displayed in the footer and metadata.
          </p>

          <div className="space-y-2">
            <Label htmlFor="twitterUrl">Twitter / X URL</Label>
            <Input
              id="twitterUrl"
              value={config.twitterUrl}
              onChange={(e) => updateConfig({ twitterUrl: e.target.value })}
              placeholder="https://twitter.com/yourusername"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="githubUrl">GitHub URL</Label>
            <Input
              id="githubUrl"
              value={config.githubUrl}
              onChange={(e) => updateConfig({ githubUrl: e.target.value })}
              placeholder="https://github.com/yourusername/your-repo"
            />
          </div>
        </CardContent>
      </Card>

      {/* Info callout */}
      <div className="flex gap-3 rounded-lg border-l-4 border-primary bg-primary/5 p-4">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Where do these values go?</p>
          <p className="mt-1">
            The app name and description are written to{' '}
            <code className="rounded bg-muted px-1 font-mono text-xs">src/config/site.ts</code>.
            The site URL and app name also become environment variables in your{' '}
            <code className="rounded bg-muted px-1 font-mono text-xs">.env.local</code> file.
          </p>
        </div>
      </div>
    </div>
  );
}
