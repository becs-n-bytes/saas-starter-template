import 'server-only';

import Stripe from 'stripe';

let _stripe: Stripe | null = null;

/**
 * Lazy-initialized Stripe client.
 * Avoids build-time errors when STRIPE_SECRET_KEY is not set.
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return _stripe;
}

/**
 * Stripe client instance.
 * Use this in server-side code (actions, webhooks, route handlers).
 */
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
