import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { handleWebhookEvent } from '@/lib/stripe/webhooks';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Stripe webhook signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed` },
      { status: 400 }
    );
  }

  try {
    await handleWebhookEvent(event);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Stripe webhook handler error: ${message}`);
    // Return 200 to prevent Stripe from retrying on non-critical handler errors
  }

  return NextResponse.json({ received: true });
}
