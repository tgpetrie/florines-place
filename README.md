# Florine's Place

A private web app for our family cabin on Hood Canal, Washington — built in the
early 1980s by Florine, our great aunt and grandmother's sister.

This is **not a rental app**. It's a shared family place. The app exists to help
the family coordinate stays respectfully, keep the cabin cared for, and hold on
to the small histories of every visit.

> The tide is out. The calendar is open.

## Current state: first lantern in the window

This is the MVP foundation — every page works and is clickable, but all data is
mock data and all mutations (approve, add item, leave an entry) are
placeholders. It's polished enough to show family members as a first concept.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Other scripts:

```bash
npm run build      # production build (includes type checking)
npm run typecheck  # TypeScript check only
```

## The pages

| Route | What it is |
| --- | --- |
| `/` | Home — Florine's story, the shared-place philosophy, the cleaning fee |
| `/calendar` | Mock availability calendar (July–Aug 2026) + soft family plans |
| `/request` | Request a Stay form (mock submit → confirmation) |
| `/dashboard` | Family Dashboard — pending requests, fees, care notes (role-gated) |
| `/supplies` | The living pantry board + "Before You Go" checklist |
| `/ideas` | Ideas & improvements board, grouped by status |
| `/guide` | Cabin guide — structured field manual from the 2020 welcome letter |
| `/local` | Tides, Weather & Nearby — the cabin's local field guide |
| `/guestbook` | Digital cabin guestbook (never reviews, never stars) |

In the header, Cabin Guide, Tides Weather & Nearby, and Guestbook are grouped
under a **Guide** dropdown to keep the navigation calm.

### Tides, Weather & Nearby

The local field guide combines placeholder conditions data with a
family-curated directory:

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

## Roles (mock for now)

Use the **"Viewing as"** switcher in the header to preview the app as:

- **Guest** — welcome info, request a stay, see their own request status
- **Family Owner** — the Family Dashboard, supplies, ideas, guestbook
- **Admin** — everything, plus fee waiving, user/calendar/guide management buttons

The switcher is a stand-in for real logins. See `src/lib/role-context.tsx` —
that file is the seam where Supabase Auth plugs in.

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

## Where the backend goes (later)

The project is organized so Supabase can be wired in without restructuring:

1. **Auth** — replace the internals of `src/lib/role-context.tsx` with the
   Supabase session; `role` comes from a `profiles` table. Every `useRole()`
   call site keeps working. Delete the header switcher.
2. **Database** — each file in `src/data/` maps to one table
   (`stay_requests`, `calendar_events`, `family_plans`, `supply_items`,
   `ideas`, `guestbook_entries`, `guide_sections`). The interfaces in
   `src/lib/types.ts` are the schema draft.
3. **Real-time** — the Supplies board subscribes to `supply_items` changes so
   the pantry updates live during inventory.
   The local guide adds `local_places`, `harvest_resources`, `special_dates`,
   and a `guide_notes` table for the family-notes layer; live weather/tide
   data comes from external APIs (see `src/data/conditions.ts`), fetched
   server-side — never hard-coded.
4. **Cleaning fees** — stays manual at first (admin marks paid/waived on the
   dashboard). Stripe only if the family ever wants payment links; the
   `CleaningFeeStatus` type already models due / paid / waived.
5. **Mutations** — every placeholder button (Approve, Decline, Add item,
   Leave an entry) becomes a server action. Each is marked with a
   `BACKEND NOTE:` comment at the spot where the code changes.

Search the codebase for `BACKEND NOTE` to find every integration seam.

### The Cabin Guide & the 2020 letter

The guide's content is derived from the family's May 2020 "Hood Canal Beach
House Welcome Letter" (`src/data/guide.ts`), restructured into typed
`GuideTopic` records: quick summaries, numbered steps, checklists, notes, and
photo placeholders — never one text blob. Each topic carries:

- `visibility` — `public` / `approved_guest` / `family` / `admin`, enforced in
  the UI now and by row-level security later. The cabin's street address lives
  only on the private Emergency Info card; family phone numbers and emails are
  **masked placeholders** and should stay out of the repo until real auth
  protects them.
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
