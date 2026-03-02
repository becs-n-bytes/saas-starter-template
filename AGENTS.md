# AGENTS.md

## Project overview

This is a Next.js SaaS starter template. It provides authentication (Supabase), billing (Stripe), and transactional email (Resend) — all pre-wired. It targets individual user accounts (no teams/orgs) and supports both subscriptions and one-time purchases.

**Tech stack**: Next.js 16 (App Router), TypeScript (strict), Supabase (`@supabase/ssr`), Stripe, Tailwind CSS v4, shadcn/ui, Resend + React Email, Zod v4, TanStack Query, Lucide icons, pnpm.

## Setup commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build (also runs type checking)
pnpm lint             # Run ESLint
```

There is no test suite — this is a starter template. Use `pnpm build` as the primary verification command. A clean build with exit code 0 means no type errors.

## Architecture

### Route groups

The app uses three Next.js route groups. Route groups affect layout nesting but not URL paths.

| Route group | URL prefix | Layout | Auth required |
|---|---|---|---|
| `(marketing)` | `/`, `/pricing`, `/privacy`, `/terms` | Navbar + footer | No |
| `(auth)` | `/login`, `/signup`, `/forgot-password`, `/reset-password` | Centered card | No (redirects to `/dashboard` if already signed in) |
| `(app)` | `/dashboard`, `/settings`, `/settings/billing` | Sidebar + header | Yes (redirects to `/login` if not signed in) |

Route protection is handled in `src/lib/supabase/middleware.ts`, called from `src/middleware.ts`.

### Directory structure

```
src/
  app/                    # Next.js App Router pages and layouts
    (marketing)/          # Public pages — uses marketing layout
    (auth)/               # Auth pages — uses centered card layout
      auth/callback/      # OAuth/magic link callback (route handler, not a page)
    (app)/                # Authenticated pages — uses sidebar layout
    api/webhooks/stripe/  # Stripe webhook endpoint (route handler)
  components/
    ui/                   # shadcn/ui primitives — do NOT edit manually, managed by shadcn CLI
    marketing/            # Landing page sections (hero, features, pricing, cta, footer)
    app/                  # App-specific components (sidebar, user nav, upgrade prompt)
    shared/               # Used by both marketing and app (logo, navbar, theme toggle)
  lib/
    supabase/             # Three Supabase clients + middleware helper + DB types
    stripe/               # Stripe client, server actions, webhook handler
    email/                # Resend client and send wrapper functions
    utils.ts              # General helpers (cn, formatCurrency, absoluteUrl)
  emails/                 # React Email templates (welcome, receipt)
  hooks/                  # Client-side React hooks
  config/                 # App-wide configuration (single source of truth)
  providers/              # React context providers (QueryClient, Theme, Tooltip)
```

### Key architectural decisions

1. **Billing state is NEVER queried from Stripe at runtime.** All billing data is synced to Supabase via webhooks and read from the database. This is the central design constraint for billing.

2. **Billing is config-driven.** All plans, products, prices, and feature lists live in `src/config/billing.ts`. The pricing UI renders entirely from this config. Never hardcode pricing in components.

3. **Three Supabase clients exist for different contexts:**
   - `lib/supabase/client.ts` — Browser client. Use in `'use client'` components.
   - `lib/supabase/server.ts` — Server client. Use in server components, server actions, route handlers.
   - `lib/supabase/admin.ts` — Admin client (service role, bypasses RLS). Use ONLY in webhooks and admin operations.

## Conventions

### Client vs server components

- **Server components** are the default. No directive needed.
- **Client components** must have `'use client'` as the first line.
- **Server-only modules** (Stripe client, admin Supabase, email client) use `import 'server-only'` at the top. This prevents accidental import from client code.

Client components in this codebase:
- All auth page forms (`login`, `signup`, `forgot-password`, `reset-password`)
- `settings/page.tsx`, `settings/billing/page.tsx`
- `components/shared/theme-toggle.tsx`
- `components/marketing/pricing-cards.tsx`
- `components/app/app-sidebar.tsx`, `user-nav.tsx`, `upgrade-prompt.tsx`
- `providers/index.tsx`
- `lib/supabase/client.ts`
- `hooks/use-user.ts`, `hooks/use-entitlement.ts`

Server components in this codebase:
- `app/(app)/dashboard/page.tsx`
- All layout files
- All marketing page components (except pricing-cards)

### Imports

Use the `@/` path alias for all imports. Never use relative paths like `../../`.

```typescript
// Correct
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';

// Wrong
import { Button } from '../../components/ui/button';
```

Import order convention (not enforced by linter, but follow existing style):
1. `'use client'` or `import 'server-only'` directives
2. React/Next.js imports
3. Third-party library imports
4. `@/` aliased project imports
5. Relative imports (avoid these)

### Naming

- **Files**: kebab-case (`pricing-cards.tsx`, `use-entitlement.ts`)
- **Components**: PascalCase (`PricingCards`, `UserNav`)
- **Hooks**: camelCase with `use` prefix (`useUser`, `useEntitlement`)
- **Server actions**: camelCase (`createCheckoutSession`, `createPortalSession`)
- **Config exports**: camelCase objects (`siteConfig`, `billingConfig`)

### Styling

Tailwind CSS v4 with the `cn()` utility for conditional classes:

```typescript
import { cn } from '@/lib/utils';

<div className={cn('base-classes', condition && 'conditional-classes')} />
```

- Use Tailwind utility classes directly. No CSS modules, no styled-components.
- Mobile-first responsive design (`sm:`, `md:`, `lg:` breakpoints).
- Dark mode via `dark:` variant. Theme is managed by `next-themes`.
- shadcn/ui semantic color tokens: `text-foreground`, `bg-background`, `text-muted-foreground`, `border`, `text-primary`, `text-destructive`, etc.

### Form handling

All forms use Zod v4 for validation with this pattern:

```typescript
import { z } from 'zod';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
});

// In submit handler:
const parsed = schema.safeParse({ email: formData.get('email') });
if (!parsed.success) {
  toast.error(parsed.error.issues[0].message);  // .issues, NOT .errors (Zod v4)
  return;
}
// Use parsed.data
```

**Important**: Zod v4 uses `.issues` not `.errors` on ZodError objects.

### Server actions

Server actions are defined in dedicated files with `'use server'` at the top:
- `src/lib/stripe/actions.ts` — Stripe checkout and portal session creation

**You CANNOT define inline `'use server'` in client components.** This is a Next.js restriction. If you need a server action in a client component, import it from a separate `'use server'` file.

### Error handling

- Form errors: Show via `toast.error()` from sonner
- Auth errors: Caught and shown via toast, with redirect on success
- Webhook errors: Logged to console, return appropriate HTTP status. Return 200 for non-critical errors to prevent Stripe retries.
- Supabase `setAll` in server components: Wrapped in try/catch (intentionally — server components are read-only)

## Common tasks

### Add a new public page

1. Create `src/app/(marketing)/your-page/page.tsx`
2. It automatically gets the marketing layout (navbar + footer)
3. Add navigation link in `src/config/nav.ts` if needed

### Add a new authenticated page

1. Create `src/app/(app)/your-page/page.tsx`
2. It automatically gets the sidebar layout and is protected by middleware
3. Add sidebar navigation in `src/config/nav.ts` (`sidebarNav` array)

### Add a new database table

1. Create migration: `pnpm supabase migration new your_table_name`
2. Write SQL: CREATE TABLE, enable RLS, add policies
3. Apply: `pnpm supabase db reset`
4. Regenerate types: `pnpm supabase gen types --lang=typescript --local > src/lib/supabase/types.ts`

### Gate a feature by billing status

```tsx
'use client';
import { useEntitlement } from '@/hooks/use-entitlement';
import { UpgradePrompt } from '@/components/app/upgrade-prompt';

export function MyFeature() {
  const { data: entitlement } = useEntitlement();
  if (entitlement?.status === 'free') return <UpgradePrompt />;
  return <div>Premium content</div>;
}
```

The `useEntitlement` hook returns one of:
- `{ status: 'free' }`
- `{ status: 'subscribed', planId, subscriptionStatus, currentPeriodEnd, cancelAtPeriodEnd }`
- `{ status: 'purchased', productId }`

### Add a new billing plan

1. Add the plan object to `billingConfig.plans` in `src/config/billing.ts`
2. Create the Product and Price in Stripe Dashboard
3. Replace the `stripePriceId` placeholder with the real Stripe Price ID

### Add a new shadcn/ui component

```bash
pnpm dlx shadcn@latest add [component-name]
```

Do NOT manually create files in `src/components/ui/`. They are managed by the shadcn CLI.

### Send a transactional email

```typescript
import { sendWelcomeEmail, sendReceiptEmail } from '@/lib/email/send';

await sendWelcomeEmail({ to: 'user@example.com', name: 'Jane' });
await sendReceiptEmail({ to: 'user@example.com', customerName: 'Jane', productName: 'Pro Plan', amount: 999, currency: 'USD' });
```

Email templates are in `src/emails/`. They use React Email components with inline styles (not Tailwind — email clients need inline styles).

## Critical rules

### Do NOT

- **Use `@supabase/auth-helpers-nextjs`** — it is deprecated. Use `@supabase/ssr` (already set up).
- **Query Stripe at runtime for billing status** — read from Supabase instead (synced via webhooks).
- **Use `any` types** — TypeScript strict mode is enabled.
- **Use `@ts-ignore` or `@ts-expect-error`** — fix the type error properly.
- **Edit files in `src/components/ui/`** — these are managed by shadcn CLI. Use `pnpm dlx shadcn@latest add` to install or update components.
- **Use `getSession()` for server-side auth checks** — use `getUser()` instead (it validates the JWT).
- **Import browser Supabase client in server code** (or vice versa) — use the right client for the context.
- **Define inline `'use server'` in client components** — import server actions from separate files.
- **Hardcode billing info in components** — read from `src/config/billing.ts`.
- **Use `.errors` on Zod errors** — Zod v4 uses `.issues`.
- **Use relative imports** — always use the `@/` path alias.

### Do

- **Run `pnpm build`** after making changes to verify no type errors.
- **Use `import 'server-only'`** in any new module that should never run on the client (e.g., anything using `STRIPE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY`).
- **Use `cn()` from `@/lib/utils`** for conditional Tailwind classes.
- **Use `toast` from `sonner`** for user-facing notifications.
- **Return HTTP 200 from webhook handlers** even for non-critical errors — this prevents Stripe from retrying.
- **Use the admin Supabase client** (`lib/supabase/admin.ts`) for webhook handlers that need to write data (they bypass RLS).
- **Await `cookies()`** from `next/headers` — it is async in Next.js 15+.

## Environment variables

| Variable | Public | Used by |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Site config, metadata, email links |
| `NEXT_PUBLIC_APP_NAME` | Yes | Email templates |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | All Supabase clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Browser + server Supabase clients |
| `SUPABASE_SERVICE_ROLE_KEY` | **No** | Admin Supabase client only (webhooks) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Client-side Stripe (not currently used) |
| `STRIPE_SECRET_KEY` | **No** | Stripe server client |
| `STRIPE_WEBHOOK_SECRET` | **No** | Webhook signature verification |
| `RESEND_API_KEY` | **No** | Resend email client |
| `EMAIL_FROM` | **No** | Email sender address |

Server-only variables (no `NEXT_PUBLIC_` prefix) must NEVER be exposed to client code. The `import 'server-only'` directive on modules using these variables enforces this at build time.

## Key files reference

| File | Purpose |
|---|---|
| `src/config/billing.ts` | Single source of truth for plans, products, and prices |
| `src/config/site.ts` | App name, description, URL, social links |
| `src/config/nav.ts` | Marketing navbar and sidebar navigation items |
| `src/lib/supabase/middleware.ts` | Session refresh + route protection logic |
| `src/lib/stripe/actions.ts` | Server actions for creating checkout/portal sessions |
| `src/lib/stripe/webhooks.ts` | Webhook event handler (syncs Stripe -> Supabase) |
| `src/hooks/use-entitlement.ts` | Client hook for checking user's billing status |
| `src/hooks/use-user.ts` | Client hook for current authenticated user |
| `src/providers/index.tsx` | Root providers (QueryClient, Theme, Tooltip) |
| `supabase/migrations/00001_initial_schema.sql` | Database schema |
| `.env.local.example` | All required environment variables with comments |

## Stripe webhook events handled

The webhook handler at `src/lib/stripe/webhooks.ts` processes:

- `checkout.session.completed` — Creates subscription or purchase record. Branches on `session.mode` (`subscription` vs `payment`).
- `customer.subscription.updated` — Updates subscription status, price, period dates, cancellation state.
- `customer.subscription.deleted` — Marks subscription as canceled.
- `invoice.paid` — Refreshes subscription to active with new period dates.
- `invoice.payment_failed` — Marks subscription as past_due.

All webhook writes use the admin Supabase client (bypasses RLS). The webhook route at `src/app/api/webhooks/stripe/route.ts` verifies the Stripe signature before processing.
