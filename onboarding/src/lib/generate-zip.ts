import JSZip from 'jszip';
import type { OnboardingConfig } from '@/lib/types';

interface BundleEntry {
  binary: boolean;
  data: string;
}

type TemplateBundle = Record<string, BundleEntry>;

function generateEnvLocal(c: OnboardingConfig): string {
  return `# ============================================
# App Configuration
# ============================================
NEXT_PUBLIC_SITE_URL=${c.siteUrl || 'http://localhost:3000'}
NEXT_PUBLIC_APP_NAME="${c.appName || 'My SaaS'}"

# ============================================
# Supabase
# ============================================
NEXT_PUBLIC_SUPABASE_URL=${c.supabaseUrl || 'http://127.0.0.1:54321'}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${c.supabaseAnonKey || 'your-anon-key-here'}
SUPABASE_SERVICE_ROLE_KEY=${c.supabaseServiceRoleKey || 'your-service-role-key-here'}

# ============================================
# Stripe
# ============================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${c.stripePublishableKey || 'pk_test_xxxxx'}
STRIPE_SECRET_KEY=${c.stripeSecretKey || 'sk_test_xxxxx'}
STRIPE_WEBHOOK_SECRET=${c.stripeWebhookSecret || 'whsec_xxxxx'}

# ============================================
# Resend (Email)
# ============================================
RESEND_API_KEY=${c.resendApiKey || 're_xxxxx'}
EMAIL_FROM="${c.emailFrom || `${c.appName || 'My SaaS'} <noreply@yourdomain.com>`}"
`;
}

function generateSiteConfig(c: OnboardingConfig): string {
  const esc = (s: string) => s.replace(/'/g, "\\'");
  const name = esc(c.appName || 'My SaaS');
  const desc = esc(c.appDescription || 'A brief description of what this product does.');
  const twitter = esc(c.twitterUrl || 'https://twitter.com/yourusername');
  const github = esc(c.githubUrl || 'https://github.com/yourusername/your-repo');

  return `export const siteConfig = {
  name: '${name}',
  description: '${desc}',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og.png',
  links: {
    twitter: '${twitter}',
    github: '${github}',
  },
} as const;
`;
}

function generateBillingConfig(c: OnboardingConfig): string {
  const esc = (s: string) => s.replace(/'/g, "\\'");

  const plans = c.plans.map((p) => {
    const features = p.features
      .filter((f) => f.trim())
      .map((f) => `'${esc(f)}'`)
      .join(', ');

    const monthlyPriceId = p.stripePriceIdMonthly
      ? `'${p.stripePriceIdMonthly}'`
      : p.monthlyPrice === 0 ? 'null' : "'price_REPLACE_WITH_STRIPE_PRICE_ID'";
    const yearlyPriceId = p.stripePriceIdYearly
      ? `'${p.stripePriceIdYearly}'`
      : p.yearlyPrice === 0 ? 'null' : "'price_REPLACE_WITH_STRIPE_PRICE_ID'";

    return `    {
      id: '${esc(p.id)}',
      name: '${esc(p.name)}',
      description: '${esc(p.description)}',
      price: { monthly: ${p.monthlyPrice}, yearly: ${p.yearlyPrice} },
      stripePriceId: { monthly: ${monthlyPriceId}, yearly: ${yearlyPriceId} },
      features: [${features}],
      highlighted: ${p.highlighted},
    }`;
  });

  const products = c.products.map((p) => {
    const priceId = p.stripePriceId
      ? `'${p.stripePriceId}'`
      : "'price_REPLACE_WITH_STRIPE_PRICE_ID'";

    return `    {
      id: '${esc(p.id)}',
      name: '${esc(p.name)}',
      description: '${esc(p.description)}',
      price: ${p.price},
      stripePriceId: ${priceId},
    }`;
  });

  return `export const billingConfig = {
  enableSubscriptions: true,
  enableOneTimePurchases: ${c.products.length > 0},

  plans: [
${plans.join(',\n')}
  ],

  products: [
${products.join(',\n')}
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
`;
}

function applyTransforms(filePath: string, content: string, config: OnboardingConfig): string {
  if (filePath === 'src/config/site.ts') return generateSiteConfig(config);
  if (filePath === 'src/config/billing.ts') return generateBillingConfig(config);
  if (filePath === 'package.json') {
    try {
      const pkg = JSON.parse(content);
      const slug = (config.appName || 'my-saas')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      pkg.name = slug;
      return JSON.stringify(pkg, null, 2) + '\n';
    } catch {
      return content;
    }
  }
  return content;
}

let bundleCache: TemplateBundle | null = null;

async function loadBundle(): Promise<TemplateBundle> {
  if (bundleCache) return bundleCache;

  const paths = [
    './template-bundle.json',
    '/template-bundle.json',
  ];

  for (const p of paths) {
    try {
      const res = await fetch(p);
      if (res.ok) {
        bundleCache = await res.json() as TemplateBundle;
        return bundleCache;
      }
    } catch {
      continue;
    }
  }

  throw new Error('Failed to load template bundle');
}

export async function generateProjectZip(config: OnboardingConfig): Promise<Blob> {
  const bundle = await loadBundle();
  const projectName = (config.appName || 'my-saas')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const zip = new JSZip();

  for (const [filePath, entry] of Object.entries(bundle)) {
    const zipFilePath = `${projectName}/${filePath}`;
    if (entry.binary) {
      zip.file(zipFilePath, entry.data, { base64: true });
    } else {
      const transformed = applyTransforms(filePath, entry.data, config);
      zip.file(zipFilePath, transformed);
    }
  }

  zip.file(`${projectName}/.env.local`, generateEnvLocal(config));

  return zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
