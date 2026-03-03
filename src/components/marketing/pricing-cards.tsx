'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { billingConfig, formatPrice } from '@/config/billing';
import { cn } from '@/lib/utils';

type BillingInterval = 'monthly' | 'yearly';

export function PricingCards() {
  const [interval, setInterval] = useState<BillingInterval>('monthly');

  return (
    <div>
      {/* Billing interval toggle */}
      {billingConfig.enableSubscriptions && (
        <div className="mb-10 flex items-center justify-center gap-3">
          <button
            onClick={() => setInterval('monthly')}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              interval === 'monthly'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval('yearly')}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              interval === 'yearly'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Yearly
            <Badge variant="secondary" className="ml-2">
              Save 33%
            </Badge>
          </button>
        </div>
      )}

      {/* Plan cards */}
      <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
        {billingConfig.plans.map((plan) => {
          const price = plan.price[interval];
          const isFree = price === 0;

          return (
            <Card
              key={plan.id}
              className={cn(
                'relative',
                plan.highlighted && 'border-primary shadow-md'
              )}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    {isFree ? 'Free' : formatPrice(price)}
                  </span>
                  {!isFree && (
                    <span className="text-muted-foreground">
                      /{interval === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  asChild
                >
                  <Link
                    href={
                      isFree
                        ? '/signup'
                        : `/signup?plan=${plan.id}&interval=${interval}`
                    }
                  >
                    {isFree ? 'Get Started' : 'Subscribe'}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* One-time products */}
      {billingConfig.enableOneTimePurchases &&
        billingConfig.products.length > 0 && (
          <div className="mx-auto mt-12 max-w-md">
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Or, get access with a one-time purchase:
            </p>
            {billingConfig.products.map((product) => (
              <Card key={product.id}>
                <CardHeader className="text-center">
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-muted-foreground"> one-time</span>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href={`/signup?product=${product.id}`}>Buy Now</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}
