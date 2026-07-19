-- Invite-only family identities for Florine's Place.

create schema if not exists private;
revoke all on schema private from public;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 120),
  role text not null default 'guest' check (role in ('guest', 'family', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Invite-only family account profile and authorization role. Users can read only their own row.';

alter table public.profiles enable row level security;

grant select on table public.profiles to authenticated;
revoke all on table public.profiles from anon;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', ''), 120)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function private.handle_new_auth_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_auth_user();

-- Backfill accounts that existed before this migration as guests. Family and
-- admin access must be granted explicitly. Authorization never reads
-- user_metadata; it comes exclusively from profiles.role.
insert into public.profiles (id, display_name)
select
  users.id,
  left(coalesce(users.raw_user_meta_data ->> 'display_name', users.raw_user_meta_data ->> 'full_name', ''), 120)
from auth.users as users
on conflict (id) do nothing;
