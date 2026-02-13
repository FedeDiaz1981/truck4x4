-- Enable extensions
create extension if not exists "pgcrypto";

-- Profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- Helper roles to avoid RLS recursion on profiles
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('admin', 'editor')
  );
$$;

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on profiles for select
  using (public.is_admin());

create policy "Admins can manage profiles"
  on profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- Site settings
create table if not exists site_settings (
  id boolean primary key default true,
  whatsapp_number text,
  contact_email text,
  instagram_url text,
  facebook_url text,
  tiktok_url text,
  youtube_url text,
  x_url text,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;

alter table site_settings add column if not exists instagram_url text;
alter table site_settings add column if not exists facebook_url text;
alter table site_settings add column if not exists tiktok_url text;
alter table site_settings add column if not exists youtube_url text;
alter table site_settings add column if not exists x_url text;
alter table site_settings add column if not exists contact_email text;

create policy "Public read site settings"
  on site_settings for select
  using (true);

create policy "Admins manage site settings"
  on site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

insert into site_settings (id, whatsapp_number)
values (true, '')
on conflict (id) do nothing;

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  brand text not null,
  compatible_brands text not null,
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'ARS',
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table products enable row level security;

create policy "Public read products"
  on products for select
  using (true);

create policy "Editors manage products"
  on products for insert
  with check (public.is_editor());

create policy "Editors update products"
  on products for update
  using (public.is_editor())
  with check (public.is_editor());

create policy "Admins delete products"
  on products for delete
  using (public.is_admin());

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  status text not null default 'pending',
  total numeric(12, 2) not null,
  currency text not null default 'ARS',
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity integer not null,
  unit_price numeric(12, 2) not null
);

alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Admins read orders"
  on orders for select
  using (public.is_admin());

create policy "Admins read order items"
  on order_items for select
  using (public.is_admin());

-- Insert profile when user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'editor')
  on conflict do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
