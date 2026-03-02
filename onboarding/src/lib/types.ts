export interface BillingPlan {
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

export interface BillingProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stripePriceId: string;
}

export interface OnboardingConfig {
  // Project Identity
  appName: string;
  appDescription: string;
  siteUrl: string;
  twitterUrl: string;
  githubUrl: string;

  // Supabase
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;

  // Stripe
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;

  // Email
  resendApiKey: string;
  emailFrom: string;

  // Billing
  plans: BillingPlan[];
  products: BillingProduct[];
}

export const defaultConfig: OnboardingConfig = {
  appName: 'My SaaS',
  appDescription: 'A brief description of what this product does.',
  siteUrl: 'http://localhost:3000',
  twitterUrl: 'https://twitter.com/yourusername',
  githubUrl: 'https://github.com/yourusername/your-repo',

  supabaseUrl: '',
  supabaseAnonKey: '',
  supabaseServiceRoleKey: '',

  stripePublishableKey: '',
  stripeSecretKey: '',
  stripeWebhookSecret: '',

  resendApiKey: '',
  emailFrom: '',

  plans: [
    {
      id: 'free',
      name: 'Free',
      description: 'Get started for free',
      monthlyPrice: 0,
      yearlyPrice: 0,
      stripePriceIdMonthly: '',
      stripePriceIdYearly: '',
      features: ['Up to 3 projects', 'Basic features', 'Community support'],
      highlighted: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For power users',
      monthlyPrice: 999,
      yearlyPrice: 7999,
      stripePriceIdMonthly: '',
      stripePriceIdYearly: '',
      features: ['Unlimited projects', 'All features', 'Priority support'],
      highlighted: true,
    },
  ],
  products: [
    {
      id: 'lifetime',
      name: 'Lifetime Access',
      description: 'Pay once, use forever',
      price: 4999,
      stripePriceId: '',
    },
  ],
};

export interface StepDefinition {
  id: string;
  title: string;
  description: string;
}

export const STEPS: StepDefinition[] = [
  { id: 'welcome', title: 'Welcome', description: 'Overview of your new SaaS' },
  { id: 'project', title: 'Project Setup', description: 'Name & identity' },
  { id: 'supabase', title: 'Supabase', description: 'Database & auth' },
  { id: 'stripe', title: 'Stripe', description: 'Payments setup' },
  { id: 'billing', title: 'Billing Plans', description: 'Plans & pricing' },
  { id: 'email', title: 'Email', description: 'Transactional emails' },
  { id: 'review', title: 'Review & Download', description: 'Get your starter' },
];
