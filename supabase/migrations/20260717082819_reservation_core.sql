-- Florine's Place live reservation core.
-- No demo seed belongs in this migration: a live project starts empty.

create extension if not exists pgcrypto;

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  start_date date not null,
  end_date date not null,
  status text not null check (status in (
    'requested', 'approved', 'considering', 'blocked', 'cleaning', 'maintenance'
  )),
  who text not null check (char_length(who) between 1 and 120),
  label text,
  created_at timestamptz not null default now(),
  constraint calendar_event_dates_valid check (end_date >= start_date),
  constraint calendar_events_do_not_overlap
    exclude using gist (daterange(start_date, end_date, '[]') with &&)
);

create table public.stay_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  contact text not null check (char_length(contact) between 3 and 160),
  arrival date not null,
  departure date not null,
  guest_count smallint not null check (guest_count between 1 and 12),
  party text not null check (char_length(party) between 2 and 240),
  pets text not null default '',
  note text not null default '',
  special_circumstances text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  cleaning_fee text not null default 'due' check (cleaning_fee in ('due', 'paid', 'waived')),
  fee_acknowledged boolean not null check (fee_acknowledged),
  guide_acknowledged boolean not null check (guide_acknowledged),
  submitted_at timestamptz not null default now(),
  constraint stay_request_dates_valid check (departure > arrival)
);

comment on table public.calendar_events is
  'Canonical occupied/held date ranges. The exclusion constraint prevents overlapping reservations.';
comment on table public.stay_requests is
  'Private stay-request details. Inserts create requested calendar events atomically through a trigger.';

alter table public.calendar_events enable row level security;
alter table public.stay_requests enable row level security;

-- The Next.js server uses a Supabase secret key. Browser roles receive no
-- direct table access; the app's route handler validates and minimizes data.
revoke all on table public.calendar_events from anon, authenticated;
revoke all on table public.stay_requests from anon, authenticated;
grant all on table public.calendar_events to service_role;
grant all on table public.stay_requests to service_role;

create function public.sync_stay_request_calendar_event()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.calendar_events (id, start_date, end_date, status, who, label)
    values (new.id, new.arrival, new.departure, 'requested', new.name, 'Stay request');
    return new;
  end if;

  if new.status = 'declined' then
    delete from public.calendar_events where id = new.id;
  else
    update public.calendar_events
    set
      start_date = new.arrival,
      end_date = new.departure,
      status = case when new.status = 'approved' then 'approved' else 'requested' end,
      who = new.name,
      label = case when new.status = 'approved' then 'Approved Stay' else 'Stay request' end
    where id = new.id;
  end if;
  return new;
end;
$$;

revoke all on function public.sync_stay_request_calendar_event() from public, anon, authenticated;
grant execute on function public.sync_stay_request_calendar_event() to service_role;

create trigger stay_request_calendar_sync
after insert or update of arrival, departure, status, name on public.stay_requests
for each row execute function public.sync_stay_request_calendar_event();
