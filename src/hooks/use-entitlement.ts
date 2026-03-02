'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/use-user';

export type Entitlement =
  | { status: 'free' }
  | {
      status: 'subscribed';
      planId: string;
      subscriptionStatus: string;
      currentPeriodEnd: Date;
      cancelAtPeriodEnd: boolean;
    }
  | { status: 'purchased'; productId: string };

/**
 * Returns the user's billing entitlement by checking their subscriptions
 * and purchases in Supabase (synced from Stripe via webhooks).
 */
export function useEntitlement() {
  const { user } = useUser();

  return useQuery<Entitlement>({
    queryKey: ['entitlement', user?.id],
    queryFn: async (): Promise<Entitlement> => {
      if (!user) return { status: 'free' };

      const supabase = createClient();

      // Check for active subscription first
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (subscriptions && subscriptions.length > 0) {
        const sub = subscriptions[0];
        return {
          status: 'subscribed',
          planId: sub.stripe_price_id,
          subscriptionStatus: sub.status,
          currentPeriodEnd: new Date(sub.current_period_end),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        };
      }

      // Check for one-time purchases
      const { data: purchases } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (purchases && purchases.length > 0) {
        return {
          status: 'purchased',
          productId: purchases[0].product_id,
        };
      }

      return { status: 'free' };
    },
    enabled: !!user,
    staleTime: 60 * 1000,
  });
}
