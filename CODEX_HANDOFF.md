# Codex handoff

Canonical handoff is in HANDOFF.md.

## Session outcome

- Added Supabase profile-based role handoff details.
- Documented that all users default to `guest` and selected family emails must be promoted in `public.profiles`.
- Implemented admin-only stay request mutation path in live mode.
- Wired dashboard approve/decline actions to real API updates.
- Added live request loading for admins.
- Typecheck passed.

## Primary files changed

- src/app/api/reservations/route.ts
- src/lib/reservations-client.ts
- src/app/dashboard/page.tsx
- HANDOFF.md

## Next priority

Apply final role assignments in Supabase profiles so only selected family members are admins, then validate workflow end to end.
