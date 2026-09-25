create table if not exists public.forge_user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  version bigint not null default 1 check (version > 0),
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.forge_user_state enable row level security;

create policy "Users can read their Forge state"
  on public.forge_user_state for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their Forge state"
  on public.forge_user_state for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their Forge state"
  on public.forge_user_state for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their Forge state"
  on public.forge_user_state for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.save_forge_state(
  expected_version bigint,
  new_data jsonb
)
returns bigint
language plpgsql
security invoker
set search_path = ''
as $$
declare
  saved_version bigint;
begin
  if auth.uid() is null then
    raise exception 'AUTH_REQUIRED' using errcode = '42501';
  end if;

  if new_data is null or jsonb_typeof(new_data) <> 'object' then
    raise exception 'INVALID_FORGE_STATE' using errcode = '22023';
  end if;

  update public.forge_user_state
     set data = new_data,
         version = version + 1,
         updated_at = now()
   where user_id = auth.uid()
     and version = expected_version
  returning version into saved_version;

  if saved_version is not null then
    return saved_version;
  end if;

  if expected_version = 0 then
    insert into public.forge_user_state (user_id, version, data)
    values (auth.uid(), 1, new_data)
    on conflict (user_id) do nothing
    returning version into saved_version;

    if saved_version is not null then
      return saved_version;
    end if;
  end if;

  raise exception 'VERSION_CONFLICT' using errcode = '40001';
end;
$$;

revoke all on function public.save_forge_state(bigint, jsonb) from public;
grant execute on function public.save_forge_state(bigint, jsonb) to authenticated;

grant select, insert, update, delete on public.forge_user_state to authenticated;
