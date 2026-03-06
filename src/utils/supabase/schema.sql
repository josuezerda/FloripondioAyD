-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Create profiles table (If you already ran this, it might say it exists, you can ignore that error)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  phone text,
  role text default 'user' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Si la tabla ya existía, intentamos agregar únicamente la columna role
alter table public.profiles add column if not exists role text default 'user' not null;

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

-- 4. Create promos table (CMS para Promociones Especiales)
create table if not exists public.promos (
  id text primary key, -- 'combo_1', 'combo_2', etc.
  title text not null,
  description text,
  price numeric not null,
  real_price numeric not null,
  is_active boolean default true not null,
  image_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Si la tabla promos ya existía, intentamos agregar únicamente la columna image_url
alter table public.promos add column if not exists image_url text;

-- Insertar promociones actuales por defecto
insert into public.promos (id, title, description, price, real_price, is_active) values
('combo_1', 'Combo "Mesa Soñada"', 'Mesa dulce temática completa con decoración y montaje.', 500000, 850000, true),
('combo_2', 'Combo "Mundo Mágico"', 'Mini escenografía temática con ambientación completa.', 600000, 950000, true)
on conflict (id) do update set
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  real_price = EXCLUDED.real_price;

alter table public.promos enable row level security;

-- Policies for public reading of plans and promos
drop policy if exists "Plans are viewable by everyone." on membership_plans;
create policy "Plans are viewable by everyone." on membership_plans for select using (true);
drop policy if exists "Promos are viewable by everyone." on promos;
create policy "Promos are viewable by everyone." on promos for select using (true);
drop policy if exists "Users can view their own subscriptions." on subscriptions;
create policy "Users can view their own subscriptions." on subscriptions for select using (auth.uid() = profile_id);

-- Helper function to avoid infinite recursion in policies
create or replace function public.is_admin()
returns boolean as $$
declare
  status boolean;
begin
  select (role = 'admin') into status from public.profiles where id = auth.uid();
  return coalesce(status, false);
end;
$$ language plpgsql security definer;

-- Admin Policies for full access
drop policy if exists "Admins can do everything on membership_plans" on membership_plans;
create policy "Admins can do everything on membership_plans" on membership_plans for all using (public.is_admin());
drop policy if exists "Admins can do everything on promos" on promos;
create policy "Admins can do everything on promos" on promos for all using (public.is_admin());
drop policy if exists "Admins can do everything on subscriptions" on subscriptions;
create policy "Admins can do everything on subscriptions" on subscriptions for all using (public.is_admin());
drop policy if exists "Admins can view all profiles" on profiles;
create policy "Admins can view all profiles" on profiles for select using (public.is_admin());
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

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

drop trigger if exists handle_promos_updated_at on public.promos;
create trigger handle_promos_updated_at
  before update on public.promos
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

-- 5. Create hero_banners table (CMS Slider)
create table if not exists public.hero_banners (
  id uuid default uuid_generate_v4() primary key,
  image_url text not null,
  title text,
  subtitle text,
  button_text text,
  button_link text,
  is_active boolean default true not null,
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.hero_banners enable row level security;

drop policy if exists "Banners are viewable by everyone." on hero_banners;
create policy "Banners are viewable by everyone." on hero_banners for select using (true);

drop policy if exists "Admins can do everything on hero_banners" on hero_banners;
create policy "Admins can do everything on hero_banners" on hero_banners for all using (public.is_admin());

drop trigger if exists handle_hero_banners_updated_at on public.hero_banners;
create trigger handle_hero_banners_updated_at
  before update on public.hero_banners
  for each row execute procedure public.handle_updated_at();

-- 6. Storage Bucket for CMS Images
insert into storage.buckets (id, name, public) 
values ('public_assets', 'public_assets', true) 
on conflict do nothing;

-- Storage Policies for 'public_assets' bucket
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using ( bucket_id = 'public_assets' );

drop policy if exists "Admin Insert" on storage.objects;
create policy "Admin Insert" on storage.objects for insert using ( 
    bucket_id = 'public_assets' and public.is_admin()
);

drop policy if exists "Admin Update" on storage.objects;
create policy "Admin Update" on storage.objects for update using ( 
    bucket_id = 'public_assets' and public.is_admin()
);

drop policy if exists "Admin Delete" on storage.objects;
create policy "Admin Delete" on storage.objects for delete using ( 
    bucket_id = 'public_assets' and public.is_admin()
);
