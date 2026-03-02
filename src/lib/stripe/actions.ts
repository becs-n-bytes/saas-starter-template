'use server';

import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { billingConfig, getPlanByPriceId, getProductByPriceId } from '@/config/billing';
import { siteConfig } from '@/config/site';

/**
 * Get or create a Stripe customer for the current user.
 */
async function getOrCreateStripeCustomer(
  userId: string,
  email: string
): Promise<string> {
  const supabaseAdmin = createAdminClient();

  // Check if customer already exists
  const { data: existing } = await supabaseAdmin
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: { user_id: userId },
  });

  // Store mapping
  await supabaseAdmin.from('customers').insert({
    id: userId,
    stripe_customer_id: customer.id,
  });

  return customer.id;
}

/**
 * Creates a Stripe Checkout Session for subscriptions or one-time purchases.
 * Redirects the user to the Stripe checkout page.
 */
export async function createCheckoutSession(priceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const customerId = await getOrCreateStripeCustomer(user.id, user.email!);

  // Determine mode based on whether this is a subscription plan or a product
  const plan = getPlanByPriceId(priceId);
  const product = getProductByPriceId(priceId);
  const mode = plan ? 'subscription' : product ? 'payment' : null;

  if (!mode) {
    throw new Error(`Unknown price ID: ${priceId}`);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { user_id: user.id },
    ...(mode === 'subscription' && {
      subscription_data: {
        metadata: { user_id: user.id },
      },
    }),
    success_url: `${siteConfig.url}/dashboard?checkout=success`,
    cancel_url: `${siteConfig.url}/pricing`,
    allow_promotion_codes: billingConfig.enableSubscriptions,
  });

  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }

  redirect(session.url);
}

/**
 * Creates a Stripe Billing Portal session for managing existing subscriptions.
 * Redirects the user to the Stripe portal.
 */
export async function createPortalSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const supabaseAdmin = createAdminClient();
  const { data: customer } = await supabaseAdmin
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!customer?.stripe_customer_id) {
    throw new Error('No billing account found');
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customer.stripe_customer_id,
    return_url: `${siteConfig.url}/settings/billing`,
  });

  redirect(portalSession.url);
}
