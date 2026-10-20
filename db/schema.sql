-- ProofOfWork schema for Supabase
-- Run once in Supabase Dashboard > SQL Editor.
-- A profile is created automatically after every new auth.users signup.
-- Public visibility is opt-in; evidence links are not treated as verification.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Student' check (char_length(display_name) between 1 and 90),
  bio text not null default '' check (char_length(bio) <= 600),
  skills text[] not null default '{}',
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 50),
  is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.portfolio_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '' check (char_length(description) <= 2000),
  evidence_url text null check (evidence_url is null or (char_length(evidence_url) <= 2048 and evidence_url ~* '^https?://')),
  entry_type text not null default 'project' check (entry_type in ('project', 'certificate', 'hackathon', 'achievement', 'other')),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists portfolio_entries_user_sort_idx
  on public.portfolio_entries (user_id, sort_order, created_at desc);

 drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists portfolio_entries_set_updated_at on public.portfolio_entries;
create trigger portfolio_entries_set_updated_at before update on public.portfolio_entries
for each row execute function public.set_updated_at();

-- Create a unique, URL-safe slug for every new account. A collision adds -1, -2, ...
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  raw_name text;
  base_slug text;
  candidate_slug text;
  suffix integer := 1;
begin
  raw_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    split_part(coalesce(new.email, 'student'), '@', 1),
    'student'
  );

  base_slug := trim(both '-' from regexp_replace(lower(raw_name), '[^a-z0-9]+', '-', 'g'));
  if char_length(base_slug) < 3 then base_slug := 'student-' || substr(replace(new.id::text, '-', ''), 1, 6); end if;
  base_slug := substr(base_slug, 1, 42);
  base_slug := trim(both '-' from base_slug);
  candidate_slug := base_slug;

  while exists (select 1 from public.profiles where slug = candidate_slug) loop
    candidate_slug := base_slug || '-' || suffix::text;
    suffix := suffix + 1;
  end loop;

  insert into public.profiles (id, display_name, slug)
  values (new.id, raw_name, candidate_slug)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.portfolio_entries enable row level security;

-- Profiles: owners may read/update their row; anyone can read published profiles only.
drop policy if exists "Owners can read own profile" on public.profiles;
create policy "Owners can read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "Anyone can read published profiles" on public.profiles;
create policy "Anyone can read published profiles" on public.profiles
  for select to anon, authenticated using (is_public = true);

drop policy if exists "Owners can update own profile" on public.profiles;
create policy "Owners can update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Entries: owners can manage all of their own entries; visitors can only read entries
-- belonging to a profile that is published. No policy claims links or entries are verified.
drop policy if exists "Owners can read own entries" on public.portfolio_entries;
create policy "Owners can read own entries" on public.portfolio_entries
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Anyone can read entries on published portfolios" on public.portfolio_entries;
create policy "Anyone can read entries on published portfolios" on public.portfolio_entries
  for select to anon, authenticated using (
    exists (
      select 1 from public.profiles p
      where p.id = portfolio_entries.user_id and p.is_public = true
    )
  );

drop policy if exists "Owners can insert own entries" on public.portfolio_entries;
create policy "Owners can insert own entries" on public.portfolio_entries
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Owners can update own entries" on public.portfolio_entries;
create policy "Owners can update own entries" on public.portfolio_entries
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Owners can delete own entries" on public.portfolio_entries;
create policy "Owners can delete own entries" on public.portfolio_entries
  for delete to authenticated using (auth.uid() = user_id);

-- Supabase projects typically grant table access to anon/authenticated by default; state it explicitly.
grant select on public.profiles to anon, authenticated;
grant update on public.profiles to authenticated;
grant select on public.portfolio_entries to anon, authenticated;
grant insert, update, delete on public.portfolio_entries to authenticated;
