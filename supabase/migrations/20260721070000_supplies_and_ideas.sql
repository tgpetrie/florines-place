-- Supplies (family/admin managed inventory) and Ideas (family-managed
-- backlog that anyone can also add to — a lightweight public "suggest an
-- idea" submission lands in the same table at status 'Idea').
--
-- Same access model as the rest of the app: RLS enabled, all direct client
-- access revoked, only the server's service-role key (via API routes)
-- reads or writes. The routes decide what's family-only vs public.

create table public.supply_items (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  category text not null check (category in (
    'Groceries', 'Paper goods', 'Cleaning supplies', 'Toiletries',
    'Firewood / propane / utilities', 'Tools / hardware', 'Linens / towels',
    'Emergency supplies', 'Wanted items'
  )),
  status text not null default 'Need to Buy' check (status in (
    'In Stock', 'Running Low', 'Out', 'Need to Buy', 'Wanted', 'Purchased', 'Not Sure'
  )),
  quantity text not null default '',
  notes text not null default '',
  updated_by text not null check (char_length(updated_by) between 1 and 80),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  updated_at timestamptz not null default now()
);

create table public.cabin_ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  description text not null default '' check (char_length(description) <= 1000),
  category text not null default 'Improvements' check (category in (
    'Repairs needed', 'Improvements', 'Decoration ideas', 'Outdoor projects',
    'Comfort upgrades', 'Accessibility ideas', 'Family traditions', 'Future dreams'
  )),
  added_by text not null check (char_length(added_by) between 1 and 80),
  -- private: only set for public submissions, so the family can follow up.
  -- never returned to non-admin viewers.
  contact text,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high')),
  estimated_cost text not null default '',
  status text not null default 'Idea' check (status in (
    'Idea', 'Worth Discussing', 'Approved', 'In Progress', 'Done', 'Not Now'
  )),
  created_at timestamptz not null default now()
);

comment on table public.supply_items is
  'Family/admin-managed pantry & supply inventory. Not publicly readable or writable.';
comment on table public.cabin_ideas is
  'Family idea backlog with status tracking. Family/admin can manage everything; the public can only insert a new idea (status forced to Idea) via the API.';

alter table public.supply_items enable row level security;
alter table public.cabin_ideas enable row level security;

revoke all on table public.supply_items from anon, authenticated;
revoke all on table public.cabin_ideas from anon, authenticated;
grant all on table public.supply_items to service_role;
grant all on table public.cabin_ideas to service_role;

create index supply_items_category_idx on public.supply_items (category, updated_at desc);
create index cabin_ideas_status_idx on public.cabin_ideas (status, created_at desc);
