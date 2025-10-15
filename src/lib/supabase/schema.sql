-- Favorites table schema for Crypto Explorer
-- Run this SQL in your Supabase project

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  asset_id text not null,
  created_at timestamp with time zone not null default now(),
  unique (client_id, asset_id)
);

alter table public.favorites enable row level security;

-- RLS policies: allow public read and write by client-provided client_id
-- NOTE: For a production app you should scope by authenticated user.
create policy if not exists "Favorites are readable by anyone" on public.favorites
  for select using (true);

create policy if not exists "Insert favorites by anyone" on public.favorites
  for insert with check (true);

create policy if not exists "Delete favorites by anyone" on public.favorites
  for delete using (true);


