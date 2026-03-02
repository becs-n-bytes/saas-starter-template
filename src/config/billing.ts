export const billingConfig = {
  enableSubscriptions: true,
  enableOneTimePurchases: true,

  plans: [
    {
      id: 'free',
      name: 'Free',
      description: 'Get started for free',
      price: { monthly: 0, yearly: 0 },
      stripePriceId: { monthly: null, yearly: null },
      features: ['Up to 3 projects', 'Basic features', 'Community support'],
      highlighted: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For power users',
      price: { monthly: 999, yearly: 7999 },
      stripePriceId: {
        monthly: 'price_REPLACE_WITH_STRIPE_PRICE_ID',
        yearly: 'price_REPLACE_WITH_STRIPE_PRICE_ID',
      },
      features: ['Unlimited projects', 'All features', 'Priority support'],
      highlighted: true,
    },
  ],

  products: [
    {
      id: 'lifetime',
      name: 'Lifetime Access',
      description: 'Pay once, use forever',
      price: 4999,
      stripePriceId: 'price_REPLACE_WITH_STRIPE_PRICE_ID',
    },
  ],
} as const;

export type PlanId = (typeof billingConfig.plans)[number]['id'];
export type ProductId = (typeof billingConfig.products)[number]['id'];

export type Plan = (typeof billingConfig.plans)[number];
export type Product = (typeof billingConfig.products)[number];

/** Get a plan by its ID */
export function getPlan(planId: PlanId): Plan | undefined {
  return billingConfig.plans.find((p) => p.id === planId);
}

/** Get a product by its ID */
export function getProduct(productId: ProductId): Product | undefined {
  return billingConfig.products.find((p) => p.id === productId);
}

/** Get a plan by its Stripe price ID */
export function getPlanByPriceId(stripePriceId: string): Plan | undefined {
  return billingConfig.plans.find(
    (p) =>
      p.stripePriceId.monthly === stripePriceId ||
      p.stripePriceId.yearly === stripePriceId
  );
}

/** Get a product by its Stripe price ID */
export function getProductByPriceId(stripePriceId: string): Product | undefined {
  return billingConfig.products.find((p) => p.stripePriceId === stripePriceId);
}

/** Format a price in cents to a display string */
export function formatPrice(priceInCents: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(priceInCents / 100);
}
