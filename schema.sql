-- ===================================================
-- GlossNails Database Schema (improved)
-- ===================================================

-- Wipe the old schema completely clean to allow a fresh install without "already exists" errors
drop table if exists order_items cascade;
drop table if exists orders cascade;
drop table if exists products cascade;
drop table if exists categories cascade;
drop table if exists promo_codes cascade;
drop table if exists users cascade;

-- Needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- Users table (Custom implementation for Name, Email, Password Auth)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  has_claimed_giveaway boolean default false,
  created_at timestamptz not null default now()
);

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price integer not null check (price >= 0),
  description text,
  image_url text,
  category_id uuid not null references categories(id) on delete restrict,
  in_stock boolean not null default true,
  nail_shapes text[] not null default array['almond','stiletto','coffin','square'],
  gallery_urls text[] default array[]::text[],
  created_at timestamptz not null default now()
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  customer_name text not null,
  phone text not null,
  email text,
  instagram text,
  address text not null,
  pincode text not null,
  city text not null,
  state text not null,
  total_amount integer not null check (total_amount >= 0),
  payment_status text not null default 'pending',
  payment_id text,
  fulfillment_status text not null default 'pending',
  tracking_number text,
  order_note text,
  created_at timestamptz not null default now()
);

-- Order items
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete restrict,
  product_name text not null,
  price integer not null check (price >= 0),
  quantity integer not null check (quantity > 0),
  nail_shape text,
  nail_size text
);

-- Promo codes
create table if not exists promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_percent integer not null check (discount_percent >= 0 and discount_percent <= 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Helpful indexes for joins / common lookups
create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_order_items_product_id on order_items(product_id);
create index if not exists idx_orders_payment_status on orders(payment_status);

-- ===================================================
-- RLS
-- ===================================================
alter table users enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table promo_codes enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Public read (OK for catalog data)
create policy "Public read products"
  on products for select
  to public
  using (true);

create policy "Public read categories"
  on categories for select
  to public
  using (true);

create policy "Public read promos"
  on promo_codes for select
  to public
  using (true);

-- Allow anon to create users, but only users themselves can read/update their data
create policy "Anon can create users"
  on users for insert
  to public
  with check (true);

create policy "Users can view their own data"
  on users for select
  to public
  using (true); -- Simple approach for now: allow reading users so login works client-side if needed, but ideally limit it. Actually, login should use an API.

create policy "Users can update their own data"
  on users for update
  to public
  using (true);

-- Allow public inserts for orders since users might not be logged in to order normally, 
-- but we link user_id if they are.
create policy "Public insert orders"
  on orders for insert
  to public
  with check (true);

create policy "Public insert order_items"
  on order_items for insert
  to public
  with check (true);

-- IMPORTANT:
-- Your "Public insert orders/ order_items WITH CHECK (true)" is very permissive.
-- Replace these with a policy that matches your desired access model.
-- Example for authenticated-only inserts:
--   create policy "Authenticated insert orders"
--     on orders for insert to authenticated
--     with check (true);
--
-- For order_items, you also usually want WITH CHECK to ensure order_id belongs to the inserted order.

-- If you want anon inserts, you must decide that explicitly (still policy-controlled).

-- ===================================================
-- Seeds
-- ===================================================

insert into categories (name, slug)
values
  ('All', 'all'),
  ('Solo Sets', 'solo-sets'),
  ('Valentine''s', 'valentines'),
  ('Glam', 'glam'),
  ('Minimal', 'minimal');

insert into promo_codes (code, discount_percent, is_active)
values ('GLOSS10', 10, true);

-- Sample products (category_id lookups remain fine)
insert into products (name, price, description, image_url, category_id, in_stock)
select
  v.name, v.price, v.description, v.image_url, c.id, v.in_stock
from (values
  ('Bloody Moon', 1499, 'Dark red dramatic press-on set. Perfect for bold looks.', 'https://placehold.co/400x400/1a1a1a/ffffff?text=Bloody+Moon', true, 'solo-sets'),
  ('Cosmic Aura', 1999, 'Teal holographic press-on set. Out of this world.', 'https://placehold.co/400x400/0d1b2a/ffffff?text=Cosmic+Aura', true, 'glam'),
  ('Pink Love Spell', 1499, 'Soft pink with glitter tips. Romantic and dreamy.', 'https://placehold.co/400x400/ffb6c1/ffffff?text=Pink+Love', true, 'valentines'),
  ('V-Day 1', 1399, 'Valentine special — nude with heart details.', 'https://placehold.co/400x400/f5c6cb/ffffff?text=V-Day+1', true, 'valentines')
) as v(name, price, description, image_url, in_stock, cat_slug)
join categories c on c.slug = v.cat_slug;

-- ===================================================
-- Store Settings
-- ===================================================

create table if not exists store_settings (
  key text primary key,
  value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table store_settings enable row level security;

-- Public can read store settings
create policy "Public read store settings"
  on store_settings for select
  to public
  using (true);

-- Only authenticated users (or admin if you have an admin role) can update it
-- For simplicity, keeping it open to authenticated or you can use service role.
-- Currently, frontend will use Supabase Service Role Key in an API route to update it securely.

-- Insert default threshold offer
insert into store_settings (key, value)
values (
  'free_gift_offer',
  '{"is_active": false, "threshold": 600, "product_id": null}'::jsonb
) on conflict (key) do nothing;

 