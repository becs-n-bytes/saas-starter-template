-- ============================================
-- Core SaaS Template Schema
-- Extends Supabase Auth with billing support
-- ============================================

-- User profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Stripe customer mapping
create table public.customers (
  id uuid references auth.users(id) on delete cascade primary key,
  stripe_customer_id text unique not null,
  created_at timestamptz default now() not null
);

-- Subscriptions (synced from Stripe via webhooks)
create table public.subscriptions (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_price_id text not null,
  status text not null,
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  cancel_at_period_end boolean default false,
  canceled_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- One-time purchases (synced from Stripe via webhooks)
create table public.purchases (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  stripe_price_id text not null,
  product_id text not null,
  amount integer not null,
  currency text default 'usd' not null,
  status text not null,
  created_at timestamptz default now() not null
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.purchases enable row level security;

-- RLS policies: users can only access their own data
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Users can view own customer record"
  on public.customers for select using (auth.uid() = id);
create policy "Users can view own subscriptions"
  on public.subscriptions for select using (auth.uid() = user_id);
create policy "Users can view own purchases"
  on public.purchases for select using (auth.uid() = user_id);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at timestamps
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.update_updated_at();
