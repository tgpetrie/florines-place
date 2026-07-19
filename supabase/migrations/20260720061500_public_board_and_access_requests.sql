-- Porch Notes (public message board) and Access Requests (invite queue).
-- Same access model as reservation_core: RLS enabled, all client access
-- revoked, only the server's service-role key (via the API routes) may
-- read or write. The API routes decide what's public vs admin-only.

create table public.porch_notes (
  id uuid primary key default gen_random_uuid(),
  -- References profiles (not auth.users directly) so PostgREST can embed the
  -- author's display_name in one query.
  author_id uuid not null references public.profiles (id) on delete cascade,
  message text not null check (char_length(message) between 1 and 1000),
  posted_at timestamptz not null default now()
);

comment on table public.porch_notes is
  'Public family cabin message board. Anyone can read; posting requires a signed-in account (any role).';

create table public.access_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 160),
  message text not null default '' check (char_length(message) <= 1000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id)
);

comment on table public.access_requests is
  'Public "request access" queue. Anyone can submit; only admins can review. Approving here does not create an account — an admin still invites the person through Supabase.';

alter table public.porch_notes enable row level security;
alter table public.access_requests enable row level security;

revoke all on table public.porch_notes from anon, authenticated;
revoke all on table public.access_requests from anon, authenticated;
grant all on table public.porch_notes to service_role;
grant all on table public.access_requests to service_role;

create index porch_notes_posted_at_idx on public.porch_notes (posted_at desc);
create index access_requests_status_idx on public.access_requests (status, submitted_at desc);
