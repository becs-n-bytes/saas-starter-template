import 'server-only';

import { resend } from '@/lib/email/client';
import WelcomeEmail from '@/emails/welcome';
import ReceiptEmail from '@/emails/receipt';

const emailFrom = process.env.EMAIL_FROM || 'My SaaS <noreply@yourdomain.com>';

/**
 * Send a welcome email to a new user.
 */
export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  const { data, error } = await resend.emails.send({
    from: emailFrom,
    to,
    subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'My SaaS'}!`,
    react: WelcomeEmail({ name }),
  });

  if (error) {
    console.error('Failed to send welcome email:', error);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Send a payment receipt email.
 */
export async function sendReceiptEmail({
  to,
  customerName,
  productName,
  amount,
  currency,
  date,
}: {
  to: string;
  customerName: string;
  productName: string;
  amount: number;
  currency?: string;
  date?: Date;
}) {
  const { data, error } = await resend.emails.send({
    from: emailFrom,
    to,
    subject: `Your receipt from ${process.env.NEXT_PUBLIC_APP_NAME || 'My SaaS'}`,
    react: ReceiptEmail({
      customerName,
      productName,
      amount,
      currency: currency || 'USD',
      date: date || new Date(),
    }),
  });

  if (error) {
    console.error('Failed to send receipt email:', error);
    throw new Error(error.message);
  }

  return data;
}
