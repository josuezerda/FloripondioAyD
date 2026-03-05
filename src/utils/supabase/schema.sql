-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Create profiles table (If you already ran this, it might say it exists, you can ignore that error)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create membership_plans table (CATALOGO DE MEMBRESÍAS)
create table if not exists public.membership_plans (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price numeric not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INSERTAR LOS PLANES QUE ME PEDISTE:
insert into public.membership_plans (name, price, description) values
('Bronce', 50000, 'Decoración base'),
('Oro', 100000, 'Decoración avanzada'),
('Diamante', 150000, 'Decoración premium')
on conflict do nothing;

-- 3. Create subscriptions table
-- Borramos la anterior si ya la creaste para enlazarla con los planes
drop table if exists public.subscriptions;

create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  plan_id uuid references public.membership_plans(id) on delete cascade not null,
  mp_preapproval_id text,
  status text default 'pending' not null, -- 'pending', 'authorized', 'paused', 'cancelled'
  price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;
alter table public.membership_plans enable row level security;
alter table public.profiles enable row level security;

-- Policies for public reading of plans
create policy "Plans are viewable by everyone." on membership_plans for select using (true);
create policy "Users can view their own subscriptions." on subscriptions for select using (auth.uid() = profile_id);

-- Triggers (If they already exist from the previous run, we use OR REPLACE)
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists handle_profiles_updated_at on public.profiles;
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_subscriptions_updated_at on public.subscriptions;
create trigger handle_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

-- Function for Auto-Profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
