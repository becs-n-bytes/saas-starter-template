import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const name =
    user.user_metadata?.full_name || user.email?.split('@')[0] || 'there';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {name}. Here&apos;s an overview of your account.
        </p>
      </div>

      {/* Placeholder stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardDescription>
                <Skeleton className="h-4 w-24" />
              </CardDescription>
              <CardTitle>
                <Skeleton className="h-8 w-16" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder content */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            This is your dashboard. Replace this placeholder content with your
            app&apos;s features.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            ✅ Authentication is working — you&apos;re signed in as{' '}
            <span className="font-medium text-foreground">{user.email}</span>
          </p>
          <p>
            📊 Add your app&apos;s main content and metrics here
          </p>
          <p>
            ⚙️ Visit{' '}
            <a href="/settings" className="font-medium text-foreground underline">
              Settings
            </a>{' '}
            to manage your profile
          </p>
          <p>
            💳 Visit{' '}
            <a
              href="/settings/billing"
              className="font-medium text-foreground underline"
            >
              Billing
            </a>{' '}
            to manage your subscription
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
