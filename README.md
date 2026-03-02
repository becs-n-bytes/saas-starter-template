# My SaaS — Starter Template

A minimal, cloneable Next.js SaaS starter template with authentication, billing, and email infrastructure already wired up. Designed for individual user accounts and rapid extension by AI coding agents and developers alike.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, TypeScript) |
| **Database & Auth** | [Supabase](https://supabase.com) (`@supabase/ssr` for cookie-based auth) |
| **Payments** | [Stripe](https://stripe.com) (Checkout, Customer Portal, Webhooks) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| **Email** | [Resend](https://resend.com) + [React Email](https://react.email) |
| **Validation** | [Zod](https://zod.dev) |
| **Client Data** | [TanStack Query](https://tanstack.com/query) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Package Manager** | [pnpm](https://pnpm.io) |

## Prerequisites

- **Node.js** 18.17 or later
- **pnpm** 8+ (`npm install -g pnpm`)
- **Docker** (for local Supabase development)
- **Stripe CLI** (for local webhook testing)

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/yourusername/your-repo.git my-saas
cd my-saas
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in the values — see the sections below for each service.

### 3. Start Supabase (local)

```bash
pnpm supabase start
```

This starts local Supabase containers. Copy the `anon key` and `service_role key` from the output into your `.env.local`.

### 4. Run database migrations

```bash
pnpm supabase db reset
```

This applies all migrations in `supabase/migrations/` and runs `supabase/seed.sql`.

### 5. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

### Local Development

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli)
2. Run `pnpm supabase start` to spin up local containers
3. Access Supabase Studio at [http://localhost:54323](http://localhost:54323)
4. Copy the API keys from `pnpm supabase status` into `.env.local`

### Production

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key -> `SUPABASE_SERVICE_ROLE_KEY`
3. Link your local project: `pnpm supabase link --project-ref YOUR_PROJECT_ID`
4. Push migrations: `pnpm supabase db push`

### Generate Database Types

```bash
# From remote project
pnpm supabase gen types --lang=typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts

# From local instance
pnpm supabase gen types --lang=typescript --local > src/lib/supabase/types.ts
```

## Stripe Setup

### 1. Create products and prices

In the [Stripe Dashboard](https://dashboard.stripe.com):

1. Go to **Product Catalog** and create your products/prices
2. Copy the Price IDs (e.g., `price_xxx`) into `src/config/billing.ts`
3. Configure the [Customer Portal](https://dashboard.stripe.com/settings/billing/portal)

### 2. Set up webhooks

**Local development:**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret (`whsec_xxx`) into `.env.local`.

**Production:**

1. Go to **Developers > Webhooks > Add endpoint**
2. URL: `https://yourdomain.com/api/webhooks/stripe`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

### 3. Update billing config

Edit `src/config/billing.ts` with your Stripe Price IDs:

```typescript
stripePriceId: {
  monthly: 'price_YOUR_MONTHLY_PRICE_ID',
  yearly: 'price_YOUR_YEARLY_PRICE_ID',
},
```

### Architecture Note

The app **never queries Stripe at runtime** for billing status. All billing state is synced to Supabase via webhooks and read from the database. This keeps pages fast and avoids Stripe rate limits.

## Email Setup

### Resend

1. Create an account at [resend.com](https://resend.com)
2. Add and verify your domain at **Domains**
3. Create an API key at **API Keys** -> `RESEND_API_KEY`
4. Set `EMAIL_FROM` to match your verified domain

### Supabase SMTP (for auth emails)

To use Resend for Supabase auth emails (confirmation, password reset):

1. In Supabase Dashboard, go to **Authentication > SMTP Settings**
2. Enable Custom SMTP
3. Use Resend SMTP credentials:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: your Resend API key

## Project Structure

```
src/
  app/
    (marketing)/     # Public pages (landing, pricing, privacy, terms)
    (auth)/          # Auth pages (login, signup, forgot/reset password)
    (app)/           # Authenticated pages (dashboard, settings, billing)
    api/webhooks/    # Stripe webhook handler
  components/
    ui/              # shadcn/ui primitives
    marketing/       # Landing page sections
    app/             # App-specific components (sidebar, user nav)
    shared/          # Shared across marketing + app (logo, navbar, theme)
  lib/
    supabase/        # Browser, server, and admin clients
    stripe/          # Stripe client, actions, webhook handler
    email/           # Resend client and send functions
  emails/            # React Email templates
  hooks/             # Client hooks (useUser, useEntitlement)
  config/            # App config (site, billing, navigation)
  providers/         # React context providers
supabase/
  migrations/        # Database migrations
  seed.sql           # Test data
  config.toml        # Local Supabase config
```

## How to Add New Features

### Adding a new page

1. Create a new directory in the appropriate route group:
   - Public pages: `src/app/(marketing)/your-page/page.tsx`
   - Authenticated pages: `src/app/(app)/your-page/page.tsx`
2. Authenticated pages are automatically protected by middleware

### Adding a new database table

1. Create a new migration: `pnpm supabase migration new your_table_name`
2. Write the SQL in the generated file
3. Enable RLS and add policies
4. Apply locally: `pnpm supabase db reset`
5. Regenerate types: `pnpm supabase gen types --lang=typescript --local > src/lib/supabase/types.ts`

### Gating features by billing status

Use the `useEntitlement` hook:

```tsx
'use client';
import { useEntitlement } from '@/hooks/use-entitlement';
import { UpgradePrompt } from '@/components/app/upgrade-prompt';

export function PremiumFeature() {
  const { data: entitlement } = useEntitlement();

  if (entitlement?.status === 'free') {
    return <UpgradePrompt />;
  }

  return <div>Premium content here</div>;
}
```

### Adding a new billing plan

1. Add the plan to `src/config/billing.ts`
2. Create the corresponding Product and Price in Stripe
3. Update the `stripePriceId` with the Stripe Price ID

## Deployment

### Vercel (recommended)

1. Push your repo to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local.example`
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain
5. Deploy

### Production Checklist

- [ ] Set up production Supabase project and push migrations
- [ ] Set up Stripe live mode products and prices
- [ ] Configure Stripe production webhook endpoint
- [ ] Set up Resend with verified domain
- [ ] Update `src/config/site.ts` with your app name, description, and URLs
- [ ] Update `src/config/billing.ts` with real Stripe Price IDs
- [ ] Replace placeholder content (landing page copy, legal pages)
- [ ] Add a real favicon and OG image in `public/`
- [ ] Set all production environment variables

## New Project Checklist

When cloning this template for a new product:

1. **Update identity**: `src/config/site.ts` — app name, description, URL, social links
2. **Update billing**: `src/config/billing.ts` — plans, prices, features
3. **Update branding**: Replace logo in `src/components/shared/logo.tsx`
4. **Update legal**: Privacy policy and terms of service
5. **Update emails**: Email templates in `src/emails/`, sender address in `.env.local`
6. **Set up services**: Supabase project, Stripe products, Resend domain
7. **Update env**: All values in `.env.local` for your new project
8. **Build your app**: Add your features in `src/app/(app)/` — the infrastructure is ready

## License

MIT
