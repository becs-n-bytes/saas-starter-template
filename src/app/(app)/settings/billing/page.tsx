'use client';

import { useTransition } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useEntitlement } from '@/hooks/use-entitlement';
import { createPortalSession, createCheckoutSession } from '@/lib/stripe/actions';
import { billingConfig, formatPrice, getPlanByPriceId } from '@/config/billing';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function BillingPage() {
  const { loading: userLoading } = useUser();
  const { data: entitlement, isLoading: entitlementLoading } = useEntitlement();
  const [isPending, startTransition] = useTransition();

  if (userLoading || entitlementLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <Skeleton className="h-48 w-full max-w-2xl" />
      </div>
    );
  }

  const currentPlan =
    entitlement?.status === 'subscribed'
      ? getPlanByPriceId(entitlement.planId)
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Current plan */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              Your current subscription and billing status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {entitlement?.status === 'free' && (
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">Free Plan</span>
                <Badge variant="secondary">Free</Badge>
              </div>
            )}

            {entitlement?.status === 'subscribed' && (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">
                    {currentPlan?.name || 'Pro'} Plan
                  </span>
                  <Badge
                    variant={
                      entitlement.subscriptionStatus === 'active'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {entitlement.subscriptionStatus}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Current period ends on{' '}
                  {entitlement.currentPeriodEnd.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                {entitlement.cancelAtPeriodEnd && (
                  <p className="text-sm text-destructive">
                    Your subscription will be canceled at the end of the current
                    billing period.
                  </p>
                )}
              </div>
            )}

            {entitlement?.status === 'purchased' && (
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">Lifetime Access</span>
                <Badge>Active</Badge>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-3 border-t px-6 py-4">
            {entitlement?.status === 'subscribed' && (
              <form action={() => startTransition(() => createPortalSession())}>
                <Button type="submit" variant="outline" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Manage Subscription
                  {!isPending && <ExternalLink className="ml-2 h-4 w-4" />}
                </Button>
              </form>
            )}
            {entitlement?.status === 'free' && (
              <Button
                disabled={isPending}
                onClick={() => {
                  const proPlan = billingConfig.plans.find(
                    (p) => p.id === 'pro'
                  );
                  if (proPlan?.stripePriceId.monthly) {
                    startTransition(() =>
                      createCheckoutSession(proPlan.stripePriceId.monthly)
                    );
                  }
                }}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upgrade to Pro
              </Button>
            )}
          </CardFooter>
        </Card>

        <Separator />

        {/* Available plans */}
        {entitlement?.status === 'free' && (
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>
                Upgrade your plan to unlock more features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {billingConfig.plans
                .filter((plan) => plan.id !== 'free')
                .map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        {formatPrice(plan.price.monthly)}/mo
                      </p>
                    </div>
                    <Button
                      size="sm"
                      disabled={isPending}
                      onClick={() => {
                        if (plan.stripePriceId.monthly) {
                          startTransition(() =>
                            createCheckoutSession(plan.stripePriceId.monthly)
                          );
                        }
                      }}
                    >
                      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Subscribe
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
