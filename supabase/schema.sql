-- MK Studio orders schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
-- Then set supabaseUrl + supabaseAnonKey in src/environments/environment*.ts

create table if not exists public.app_settings (
  key text primary key,
  value text not null
);

-- Keep in sync with environment.adminPassword (change both for production)
insert into public.app_settings (key, value)
values ('admin_password', 'mkstudio2026')
on conflict (key) do update set value = excluded.value;

create table if not exists public.orders (
  id text primary key,
  created_at timestamptz not null default timezone('utc', now()),
  customer jsonb not null,
  items jsonb not null,
  subtotal numeric not null check (subtotal >= 0),
  shipping numeric not null check (shipping >= 0),
  tax numeric not null check (tax >= 0),
  total numeric not null check (total >= 0),
  status text not null default 'placed'
    check (status in ('placed', 'confirmed', 'shipped', 'delivered', 'cancelled'))
);

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);

alter table public.app_settings enable row level security;
alter table public.orders enable row level security;

-- No public policies on app_settings (deny all via RLS)

drop policy if exists "Public can place orders" on public.orders;
create policy "Public can place orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

-- Admin password helper (security definer; not exposed as a table)
create or replace function public.is_admin_password(p_password text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select value from public.app_settings where key = 'admin_password'),
    ''
  ) = coalesce(p_password, '');
$$;

revoke all on function public.is_admin_password(text) from public;
grant execute on function public.is_admin_password(text) to anon, authenticated;

create or replace function public.admin_get_orders(p_password text)
returns setof public.orders
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin_password(p_password) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  return query
    select *
    from public.orders
    order by created_at desc;
end;
$$;

revoke all on function public.admin_get_orders(text) from public;
grant execute on function public.admin_get_orders(text) to anon, authenticated;

create or replace function public.admin_update_order_status(
  p_password text,
  p_order_id text,
  p_status text
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_order public.orders;
begin
  if not public.is_admin_password(p_password) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;

  if p_status not in ('placed', 'confirmed', 'shipped', 'delivered', 'cancelled') then
    raise exception 'Invalid status' using errcode = '22023';
  end if;

  update public.orders
  set status = p_status
  where id = p_order_id
  returning * into updated_order;

  if updated_order.id is null then
    raise exception 'Order not found' using errcode = 'P0002';
  end if;

  return updated_order;
end;
$$;

revoke all on function public.admin_update_order_status(text, text, text) from public;
grant execute on function public.admin_update_order_status(text, text, text) to anon, authenticated;
