import { NextResponse } from 'next/server';
import JSZip from 'jszip';
import fs from 'fs/promises';
import path from 'path';

// Template root is the parent of the onboarding/ directory
const TEMPLATE_DIR = path.resolve(process.cwd(), '..');

const EXCLUDE = new Set([
  'node_modules',
  '.git',
  '.next',
  'onboarding',
  'pnpm-lock.yaml',
  '.env.local',
  '.DS_Store',
]);

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp', '.avif',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.pdf', '.zip', '.gz', '.tar',
  '.mp4', '.mp3', '.wav', '.webm',
]);

function isBinaryFile(filePath: string): boolean {
  return BINARY_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

interface BillingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  features: string[];
  highlighted: boolean;
}

interface BillingProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stripePriceId: string;
}

interface Config {
  appName: string;
  appDescription: string;
  siteUrl: string;
  twitterUrl: string;
  githubUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  resendApiKey: string;
  emailFrom: string;
  plans: BillingPlan[];
  products: BillingProduct[];
}

/* ──────────────────────────────────────────
 * File generators
 * ────────────────────────────────────────── */

function generateEnvLocal(c: Config): string {
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

function generateSiteConfig(c: Config): string {
  const name = (c.appName || 'My SaaS').replace(/'/g, "\\'");
  const desc = (c.appDescription || 'A brief description of what this product does.').replace(/'/g, "\\'");
  const twitter = (c.twitterUrl || 'https://twitter.com/yourusername').replace(/'/g, "\\'");
  const github = (c.githubUrl || 'https://github.com/yourusername/your-repo').replace(/'/g, "\\'");

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

function generateBillingConfig(c: Config): string {
  const plans = c.plans.map((p) => {
    const features = p.features
      .filter((f) => f.trim())
      .map((f) => `'${f.replace(/'/g, "\\'")}'`)
      .join(', ');

    const monthlyPriceId = p.stripePriceIdMonthly
      ? `'${p.stripePriceIdMonthly}'`
      : p.monthlyPrice === 0 ? 'null' : "'price_REPLACE_WITH_STRIPE_PRICE_ID'";
    const yearlyPriceId = p.stripePriceIdYearly
      ? `'${p.stripePriceIdYearly}'`
      : p.yearlyPrice === 0 ? 'null' : "'price_REPLACE_WITH_STRIPE_PRICE_ID'";

    return `    {
      id: '${p.id.replace(/'/g, "\\'")}',
      name: '${p.name.replace(/'/g, "\\'")}',
      description: '${p.description.replace(/'/g, "\\'")}',
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
      id: '${p.id.replace(/'/g, "\\'")}',
      name: '${p.name.replace(/'/g, "\\'")}',
      description: '${p.description.replace(/'/g, "\\'")}',
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

/* ──────────────────────────────────────────
 * Directory walking + transforms
 * ────────────────────────────────────────── */

async function addDirectory(
  dirPath: string,
  zipPath: string,
  zip: JSZip,
  config: Config,
  projectName: string,
) {
  let entries;
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return; // skip unreadable dirs
  }

  for (const entry of entries) {
    if (EXCLUDE.has(entry.name)) continue;

    const fullPath = path.join(dirPath, entry.name);
    const entryZipPath = zipPath ? `${zipPath}/${entry.name}` : entry.name;
    const zipFilePath = `${projectName}/${entryZipPath}`;

    if (entry.isDirectory()) {
      await addDirectory(fullPath, entryZipPath, zip, config, projectName);
    } else if (isBinaryFile(entry.name)) {
      // Binary files: copy as-is
      const buf = await fs.readFile(fullPath);
      zip.file(zipFilePath, buf);
    } else {
      // Text files: read and optionally transform
      const content = await fs.readFile(fullPath, 'utf-8');
      const transformed = applyTransforms(entryZipPath, content, config);
      zip.file(zipFilePath, transformed);
    }
  }
}

function applyTransforms(filePath: string, content: string, config: Config): string {
  if (filePath === 'src/config/site.ts') {
    return generateSiteConfig(config);
  }
  if (filePath === 'src/config/billing.ts') {
    return generateBillingConfig(config);
  }
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
  // .env.local.example — keep original but also generate .env.local separately
  return content;
}

/* ──────────────────────────────────────────
 * Route handler
 * ────────────────────────────────────────── */

export async function POST(request: Request) {
  try {
    const config: Config = await request.json();
    const projectName = (config.appName || 'my-saas')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const zip = new JSZip();

    // Walk the template directory and add all files
    await addDirectory(TEMPLATE_DIR, '', zip, config, projectName);

    // Add the generated .env.local (with actual values filled in)
    zip.file(`${projectName}/.env.local`, generateEnvLocal(config));

    const arrayBuffer = await zip.generateAsync({
      type: 'arraybuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${projectName}.zip"`,
        'Content-Length': String(arrayBuffer.byteLength),
      },
    });
  } catch (err) {
    console.error('ZIP generation error:', err);
    return NextResponse.json(
      { error: 'Failed to generate project zip' },
      { status: 500 },
    );
  }
}
