# Handoff - Florine's Place (Supabase Live + Admin Workflow)

This handoff is for Claude (or any follow-on agent) to continue from the current production state.

## Current objective from owner

- Make selected family members admins.
- Only admins should approve or decline stay requests.
- Everyone else should remain guests.

## Repo + runtime status

- Repo: /Users/cdmxx/Florines Place
- App stack: Next.js App Router + Supabase + Cloudflare Workers (OpenNext)
- Supabase project linked and migrations applied remotely.
- Live worker has Supabase secrets configured.
- Live reservation API is connected (`configured: true`).
- Free live conditions stack is implemented (Open-Meteo + NOAA + moon phase logic).

## What was just implemented

### 0) Supabase auth roles now come from `public.profiles`

Updated migration:
- supabase/migrations/20260719072526_family_auth_profiles.sql

Behavior:
- Every Supabase auth user now gets a matching `public.profiles` row.
- New and backfilled users default to `role = 'guest'`.
- Authorization no longer depends on auth metadata for roles.
- The app reads `profiles.role` only, with valid roles:
  - `guest`
  - `family`
  - `admin`

Operational meaning:
- `admin` can view and manage stay requests.
- `family` can sign in as family but cannot approve or decline requests.
- `guest` has no admin access.

SQL pattern for promoting specific family emails to admin:

```sql
update public.profiles
set role = 'guest', updated_at = now();

update public.profiles as profiles
set role = 'admin', updated_at = now()
from auth.users as users
where users.id = profiles.id
  and lower(users.email) in (
    'family-member-one@example.com',
    'family-member-two@example.com'
  );

select users.email, profiles.role
from public.profiles as profiles
join auth.users as users on users.id = profiles.id
order by users.email;
```

Important:
- Replace the example email list with the actual approved family emails.
- Anyone not explicitly promoted stays `guest`.
- If a family member signs up before being promoted, they will still be created safely as `guest` until the role is changed.

### 1) Admin-only stay request decisions (live)

Updated API route:
- src/app/api/reservations/route.ts

Changes:
- Added viewer role lookup via Supabase session + profiles role.
- GET now returns:
  - calendar events for all callers
  - stay requests only when viewer role is admin
- Added PATCH endpoint for admin updates to stay requests:
  - supports status updates: pending, approved, declined
  - supports cleaning fee updates: due, paid, waived
  - rejects non-admins with 403

### 2) Client API wiring for request updates

Updated client helper:
- src/lib/reservations-client.ts

Changes:
- Reservation snapshot now includes requests array.
- Added updateStayRequest(...) helper using PATCH /api/reservations.

### 3) Dashboard approve/decline now live

Updated dashboard page:
- src/app/dashboard/page.tsx

Changes:
- Replaced placeholder approve/decline actions with real live API mutations.
- Added approve + waive fee action.
- Added mark fee paid action with refresh/error handling.
- Added in-flight action state and inline action error display.
- Live mode now loads stay requests from API snapshot.

## Validation run

- npm run typecheck -> pass

## Remaining gaps

- Some dashboard buttons are still placeholders (ask a question, block dates, quick actions).
- Final admin email list should be kept in a private operator note, not in git.
- Keys/tokens should be rotated if they were exposed in chat/screenshot history.

## Next steps Claude should do

1. Apply role policy in Supabase
- Set all profiles.role to guest.
- Promote only approved family emails to admin.
- Verify with a users/profile join query.

Concrete check:
- Confirm every account exists in `public.profiles`.
- Confirm only the approved family emails resolve to `admin`.
- Confirm all other accounts remain `guest` unless there is a deliberate reason to use `family`.

2. End-to-end verify admin flow
- Login as admin and confirm:
  - pending requests are visible
  - approve/decline updates persist
  - cleaning fee updates persist
- Login as non-admin and confirm PATCH returns 403.

3. Optional hardening
- Restrict GET event visibility if desired.
- Add audit logging for admin decisions.
- Add server-side validation for state transitions if policy requires (for example, prevent direct pending<-declined without explicit reopen flow).

## Quick commands

cd "/Users/cdmxx/Florines Place"
git status --short
npm run typecheck
npm run build:live

## Suggested prompt for Claude

Continue in /Users/cdmxx/Florines Place. Read HANDOFF.md first. Finalize family authorization by setting only selected emails to admin in Supabase profiles and leaving all others guest. Then verify the live dashboard approve/decline + cleaning-fee workflow end to end with role-based access control.
