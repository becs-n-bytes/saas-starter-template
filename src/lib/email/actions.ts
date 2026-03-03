'use server';

import { sendWelcomeEmail } from '@/lib/email/send';

/**
 * Server action to send a welcome email after signup.
 * Errors are logged but not thrown — email delivery should not block signup.
 */
export async function sendWelcomeEmailAction({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  try {
    await sendWelcomeEmail({ to, name });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}
