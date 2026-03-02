/**
 * Re-exports billing config with Stripe-specific helpers.
 */
export {
  billingConfig,
  formatPrice,
  getPlan,
  getPlanByPriceId,
  getProduct,
  getProductByPriceId,
  type Plan,
  type PlanId,
  type Product,
  type ProductId,
} from '@/config/billing';
