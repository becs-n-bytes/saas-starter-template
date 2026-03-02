import 'server-only';

import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Handles all Stripe webhook events and syncs billing state to Supabase.
 * Uses the admin client (service role) to bypass RLS.
 */
export async function handleWebhookEvent(event: Stripe.Event) {
  const supabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;

      if (!userId) {
        console.error('checkout.session.completed: missing user_id in metadata');
        return;
      }

      // Ensure customer mapping exists
      if (session.customer) {
        await supabase.from('customers').upsert(
          {
            id: userId,
            stripe_customer_id: session.customer as string,
          },
          { onConflict: 'id' }
        );
      }

      if (session.mode === 'subscription' && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await supabase.from('subscriptions').upsert(
          {
            id: subscription.id,
            user_id: userId,
            stripe_price_id: subscription.items.data[0].price.id,
            status: subscription.status,
            current_period_start: new Date(
              subscription.items.data[0].current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.items.data[0].current_period_end * 1000
            ).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          },
          { onConflict: 'id' }
        );
      }

      if (session.mode === 'payment') {
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id
        );
        const lineItem = lineItems.data[0];

        if (lineItem) {
          await supabase.from('purchases').insert({
            id: session.id,
            user_id: userId,
            stripe_price_id: lineItem.price?.id ?? '',
            product_id: (lineItem.price?.product as string) ?? '',
            amount: session.amount_total ?? 0,
            currency: session.currency ?? 'usd',
            status: 'completed',
          });
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from('subscriptions')
        .update({
          stripe_price_id: subscription.items.data[0].price.id,
          status: subscription.status,
          current_period_start: new Date(
            subscription.items.data[0].current_period_start * 1000
          ).toISOString(),
          current_period_end: new Date(
            subscription.items.data[0].current_period_end * 1000
          ).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          canceled_at: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000).toISOString()
            : null,
        })
        .eq('id', subscription.id);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
        })
        .eq('id', subscription.id);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        invoice.parent?.subscription_details?.subscription as string | null;

      if (subscriptionId) {
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('id', subscriptionId);
      }
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId =
        invoice.parent?.subscription_details?.subscription as string | null;

      if (subscriptionId) {
        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId);

        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            current_period_start: new Date(
              subscription.items.data[0].current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscription.items.data[0].current_period_end * 1000
            ).toISOString(),
          })
          .eq('id', subscriptionId);
      }
      break;
    }

    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }
}
