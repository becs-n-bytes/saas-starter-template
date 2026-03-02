import 'server-only';

import { createClient } from '@supabase/supabase-js';

/**
 * Admin Supabase client — uses the service role key to bypass RLS.
 * ONLY use in webhook handlers and admin operations. Never expose to the client.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
