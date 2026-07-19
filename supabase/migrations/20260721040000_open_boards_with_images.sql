-- Rework Porch Notes + new live Guestbook: open, anonymous posting.
-- No account needed to post. A poster gives a name (first name + last
-- initial) and a phone or email so the family can respond privately if
-- needed — that contact is never exposed on the public read path, only to
-- admins. Everything else posted (including an optional image) is public.
--
-- porch_notes (rewritten): the account-gated version created earlier today
-- has zero real rows, so it's dropped and replaced rather than migrated.
-- It's now specifically for practical reports: supplies needed, or
-- something noticed that needs fixing/attention.
--
-- guestbook_entries (new): a live, ongoing version of the paper cabin
-- guestbook — open, freeform, personal.

drop table if exists public.porch_notes;

create table public.porch_notes (
  id uuid primary key default gen_random_uuid(),
  poster_name text not null check (char_length(poster_name) between 2 and 80),
  contact text not null check (char_length(contact) between 3 and 160),
  message text not null check (char_length(message) between 1 and 1000),
  category text not null check (category in ('supplies', 'maintenance')),
  image_path text,
  posted_at timestamptz not null default now()
);

create table public.guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  poster_name text not null check (char_length(poster_name) between 2 and 80),
  contact text not null check (char_length(contact) between 3 and 160),
  message text not null check (char_length(message) between 1 and 1000),
  image_path text,
  posted_at timestamptz not null default now()
);

comment on table public.porch_notes is
  'Open public board for supplies needed / things that need fixing. Anyone can post, no account required. contact is private (admin-only read) for a private follow-up if needed.';
comment on table public.guestbook_entries is
  'Open public live guestbook. Anyone can post, no account required. contact is private (admin-only read).';

alter table public.porch_notes enable row level security;
alter table public.guestbook_entries enable row level security;

-- Same model as the rest of the app: no direct client access at all.
-- The API routes (service-role key) validate, rate-limit, and handle image
-- uploads server-side, and decide what's public vs admin-only.
revoke all on table public.porch_notes from anon, authenticated;
revoke all on table public.guestbook_entries from anon, authenticated;
grant all on table public.porch_notes to service_role;
grant all on table public.guestbook_entries to service_role;

create index porch_notes_posted_at_idx on public.porch_notes (posted_at desc);
create index guestbook_entries_posted_at_idx on public.guestbook_entries (posted_at desc);

-- Public image bucket for board posts. Reads are public (anyone can view an
-- image via its public URL); writes only ever happen server-side via the
-- service-role key, so no anon/authenticated storage policies are needed.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'board-uploads', 'board-uploads', true,
  8388608, -- 8 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;
