# Florine's Place

A private web app for our family cabin on Hood Canal, Washington — built in the
early 1980s by Florine, our great aunt and grandmother's sister.

This is **not a rental app**. It's a shared family place. The app exists to help
the family coordinate stays respectfully, keep the cabin cared for, and hold on
to the small histories of every visit.

> The tide is out. The calendar is open.

## Two isolated builds

The project has one UI and two reservation backends:

- **Demo** is a writable browser-local calendar. It starts with one approved
  seven-day stay in each of the next 12 months. Open dates can be requested and
  immediately become unavailable in that browser; filled dates reject overlap.
- **Live** starts with no seeded reservation data and reads/writes the shared
  Supabase database through server-only route handlers.

The demo build also carries clearly scoped sample content for the other family
boards. The live build shows honest empty/unconnected states for operational
records until those tables and authentication are built out. Reference content
such as the Cabin Guide remains available in both. Demo reservations never
enter the live database.

## Running locally

```bash
npm install
npm run dev:demo
```

Then open http://localhost:3000.

Other scripts:

```bash
npm run dev:demo    # writable local demo calendar
npm run dev:live    # live UI; requires Supabase environment variables
npm run build:demo  # writes .next-demo
npm run build:live  # writes .next-live; this is also `npm run build`
npm run start:demo
npm run start:live  # this is also `npm start`
npm run typecheck
```

The separate `.next-demo` and `.next-live` directories let both artifacts exist
at the same time without one build overwriting the other.

### Live reservation database

The live build expects these server-only deployment secrets:

```bash
NEXT_PUBLIC_APP_MODE=live
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SECRET_KEY=YOUR_SERVER_ONLY_SECRET_KEY
```

For family sign-in, also set the Supabase publishable key used by Auth:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Best practice is to set both public auth variables even when the server can
fall back to `SUPABASE_URL`; that keeps future browser-side Supabase usage
working without another config pass.

Never prefix the secret key with `NEXT_PUBLIC_`. Link the Supabase CLI to the
intended project, review the SQL, and apply the included migration:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase migration up --linked
```

The migration in `supabase/migrations/` creates an empty live calendar and stay
request table. A database exclusion constraint makes overlapping date ranges
impossible even when two requests arrive at nearly the same time. Browser roles
have no direct table access; the Next.js route validates requests and returns
only public calendar fields.

### Live weather, tides, and moon phase

The live build now uses a free conditions stack instead of sample data:

- **Weather** — Open-Meteo
- **Tides** — NOAA CO-OPS predictions
- **Moon phase** — local app calculation

Optional live conditions env vars:

```bash
CABIN_LATITUDE=47.93
CABIN_LONGITUDE=-122.59
NOAA_TIDE_STATION_ID=9444090
```

If those are omitted, the app falls back to the current Hansville / Hood Canal
defaults in code. Set them explicitly once you have the exact cabin coordinates
and preferred NOAA station.

### Private directions configuration

Copy `.env.example` to `.env.local` and fill in the private cabin address,
directions passcode, and family approver emails. `.env.local` is ignored by
Git. In deployment, set the same values in the host's encrypted environment
settings rather than committing them.

The directions gate can optionally send approval requests through Resend when
`RESEND_API_KEY` and `DIRECTIONS_REQUEST_FROM` are configured. Without those
values, it opens a pre-addressed email draft for the requester to send.

## The pages

| Route | What it is |
| --- | --- |
| `/` | Home — Florine's story, the shared-place philosophy, the cleaning fee |
| `/calendar` | Twelve-month live or writable demo availability calendar |
| `/request` | Request a Stay form with occupied-date conflict protection |
| `/dashboard` | Family Dashboard — pending requests, fees, care notes (role-gated) |
| `/supplies` | The living pantry board + "Before You Go" checklist |
| `/ideas` | Ideas & improvements board, grouped by status |
| `/guide` | Cabin guide — structured field manual from the 2020 welcome letter |
| `/local` | Tides, Weather & Nearby — the cabin's local field guide |
| `/guestbook` | Digital cabin guestbook (never reviews, never stars) |

In the header, Cabin Guide, Tides Weather & Nearby, and Guestbook are grouped
under a **Guide** dropdown to keep the navigation calm.

### Tides, Weather & Nearby

Demo mode uses labeled sample conditions data. Live mode now pulls real weather
and tide data while keeping the same page structure and moon-phase display.
The local field guide also includes a family-curated directory:

- **Current conditions & tide calendar** — mock data, clearly labeled; wired
  later to a weather API, NOAA tides, and a sun/moon source
  (see `src/data/conditions.ts`)
- **Nearby essentials / Local stops & experiences / Yard work & equipment** —
  one `LocalPlace` model (`src/data/local-places.ts`) with per-entry
  `lastVerified` dates, statuses (Recommended / Used Before / Need to Verify /
  Seasonal / Not Recommended), family notes, and plain age/seasonal notes
  where relevant
- **Fishing, crabbing & shellfish** — deliberately stores no rules as truth;
  every card carries a status to check, official WA links (WDFW, DOH shellfish
  safety, NOAA), and a last-verified date
- **Admin layer** — placeholder edit/verify/note buttons, role-gated, that
  become Supabase mutations later

## Authentication and roles

Demo builds keep the **"Viewing as"** switcher in the header. Live builds use
invite-only Supabase Auth accounts and read authorization from the account's
`profiles` row:

- **Guest** — welcome info, request a stay, see their own request status
- **Family Owner** — the Family Dashboard, supplies, ideas, guestbook
- **Admin** — everything, plus fee waiving, user/calendar/guide management buttons

In live mode, `/dashboard`, `/supplies`, `/ideas`, and `/guestbook` require a
signed-in `family` or `admin` profile. Public cabin information, availability,
and the stay-request form remain available without an account. Create or invite
family accounts through Supabase Auth. New accounts start as `guest`; grant
`family` or `admin` explicitly by updating `public.profiles.role` through a
trusted server or the Supabase dashboard.

## Project structure

```
src/
  app/                 # Next.js App Router pages (one folder per route)
    globals.css        # design tokens (@theme) + shared component classes
    layout.tsx         # fonts, header/footer, RoleProvider
  components/          # reusable UI (header, badges, calendar, form, SVG art)
  data/                # mock data — one file per future Supabase table
  lib/
    types.ts           # shared types; mirror of the future database schema
    role-context.tsx   # mock role switching (future: Supabase Auth)
    selectors.ts       # derived data (e.g. the "Before You Go" rule)
```

## Design system

The whole visual language lives in `src/app/globals.css` as Tailwind v4 theme
tokens. Motif: **Hood Canal at very low tide, under moonlight.**

- Palette: moonlit navy, oyster shell white, wet sand, cedar, crab-shell rust,
  seaweed, pearl, driftwood — each is a `--color-*` token and a Tailwind class
  (`bg-oyster`, `text-rust`, …).
- Type: Fraunces (display serif) + Karla (body), loaded via `next/font`.
- Fine-line SVG illustrations (moon, tide lines, sand dollar, crab, lantern)
  live in `src/components/shore-art.tsx`.

Language rules the app follows everywhere: **"Request a Stay"** (never "Book
Now"), **"Approved Stay"** (never "Reservation"), **"Cleaning Fee"** (never
rent), guestbook (never reviews or ratings).

## Backend rollout

The project is organized so Supabase can be wired in without restructuring:

1. **Auth** — Supabase cookie sessions and protected family routes are wired in
   for live mode; `role` comes from the RLS-protected `profiles` table. Demo mode
   keeps the role switcher for previews.
2. **Database** — `stay_requests` and `calendar_events` now have a real Supabase
   migration and server API. The remaining `src/data/` modules map to future
   tables (`family_plans`, `supply_items`, `ideas`, `guestbook_entries`, and
   `guide_sections`).
3. **Real-time** — the Supplies board subscribes to `supply_items` changes so
   the pantry updates live during inventory.
   The local guide adds `local_places`, `harvest_resources`, `special_dates`,
   and a `guide_notes` table for the family-notes layer; live weather/tide
   data comes from external APIs (see `src/data/conditions.ts`), fetched
   server-side — never hard-coded.
4. **Cleaning fees** — stays manual at first (admin marks paid/waived on the
   dashboard). Stripe only if the family ever wants payment links; the
   `CleaningFeeStatus` type already models due / paid / waived.
5. **Mutations** — requesting an open stay is functional in both builds. Admin
   approval, supplies, ideas, and guestbook mutations remain the next server
   actions. Each remaining seam is marked with a `BACKEND NOTE:` comment.

Search the codebase for `BACKEND NOTE` to find every integration seam.

### The Cabin Guide & the 2020 letter

The guide's content is derived from the family's May 2020 "Hood Canal Beach
House Welcome Letter" (`src/data/guide.ts`), restructured into typed
`GuideTopic` records: quick summaries, numbered steps, checklists, notes, and
photo placeholders — never one text blob. Each topic carries:

- `visibility` — `public` / `approved_guest` / `family` / `admin`, enforced in
  the UI now and by row-level security later. The cabin's street address,
  directions passcode, and approval email addresses are server-only local
  environment values; family phone numbers remain **masked placeholders** until
  real auth protects them.
- `lastVerified` + `needsVerification` — anything that may have drifted since
  2020 (internet, dump hours/prices, parking details) is flagged rather than
  presented as current truth. Admin "Edit"/"Mark verified" buttons are
  placeholders for the future editing flow.

The letter's "email Greg a restock list" workflow is replaced by the Supplies
page, and the Hansville dump appears both in the guide and under Nearby
Essentials on `/local`.

## Next steps (suggested order)

1. Show it to the family; collect reactions to tone, palette, and copy.
2. Replace placeholder names/details (users in `src/data/users.ts`, emergency
   contacts and specifics in `src/data/guide.ts`).
3. Tune the "Before You Go" rule in `src/lib/selectors.ts` — how naggy should
   the list be? (It's a small, well-marked function.)
4. Add real cabin photos and a photo of Florine to the Home page.
5. Set up Supabase (auth first, then `stay_requests` — the request form is the
   highest-value real feature).
6. Deploy somewhere private (e.g. Vercel with password protection) so family
   can click through it.
