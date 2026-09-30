create table if not exists public.forge_user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  recovery_email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint forge_user_profiles_username_format
    check (username = lower(username) and username ~ '^[a-z0-9][a-z0-9_-]{1,22}[a-z0-9]$'),
  constraint forge_user_profiles_recovery_email_format
    check (position('@' in recovery_email) > 1)
);

create unique index if not exists forge_user_profiles_username_unique
  on public.forge_user_profiles (username);

alter table public.forge_user_profiles enable row level security;

drop policy if exists "Users can read their Forge identity" on public.forge_user_profiles;
create policy "Users can read their Forge identity"
  on public.forge_user_profiles for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their Forge identity" on public.forge_user_profiles;
create policy "Users can create their Forge identity"
  on public.forge_user_profiles for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their Forge identity" on public.forge_user_profiles;
create policy "Users can update their Forge identity"
  on public.forge_user_profiles for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.forge_user_profiles to authenticated;
