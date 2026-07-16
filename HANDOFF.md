# Handoff — Florine's Place hero scene

This handoff is written to be usable from Codex, local Claude, or Claude Cloud.

## Start here

- Actual app repo: `/Users/cdmxx/Florines Place`
- Do not work from `/Users/cdmxx/Documents/TomsTech` for this task. That is a different project and was initially a source of confusion.
- Current branch: `hero-native-motifs`
- Upstream: `origin/hero-native-motifs`

## What changed on July 16, 2026

- Warmed the hero shoreline and bluff in [src/components/cabin-scene.tsx](/Users/cdmxx/Florines Place/src/components/cabin-scene.tsx) so the gray, muddy strip now reads as ivory / warm beige.
- Reduced the harsh pebble / driftwood clutter and softened shoreline texture so it feels calmer.
- Increased tree diversity in the same file:
  - wider size range
  - wider lean range
  - depth-based color variation instead of one repeated green
- Added more canopy headroom by changing the scene viewBox and hero sizing in [src/app/page.tsx](/Users/cdmxx/Florines Place/src/app/page.tsx), which prevents the treetops from feeling chopped off.
- Kept the existing formline sky work in place:
  - [src/components/landscape-bg.tsx](/Users/cdmxx/Florines Place/src/components/landscape-bg.tsx)
  - [src/components/formline-moon.tsx](/Users/cdmxx/Florines Place/src/components/formline-moon.tsx)

## Files currently changed on this branch

- [src/app/page.tsx](/Users/cdmxx/Florines Place/src/app/page.tsx)
- [src/components/cabin-scene.tsx](/Users/cdmxx/Florines Place/src/components/cabin-scene.tsx)
- [src/components/landscape-bg.tsx](/Users/cdmxx/Florines Place/src/components/landscape-bg.tsx)
- [src/components/formline-moon.tsx](/Users/cdmxx/Florines Place/src/components/formline-moon.tsx)

## Current visual state

- Homepage hero now renders with a lighter shore and more varied forest depth.
- The live homepage is using the warm sky path by default.
- The formline moon exists in code, but the homepage only shows it when the sky state reaches `night` or `dusk`, or when the hero is forced to a night state for testing.

## Verification already run

- Typecheck passed:

```bash
./node_modules/.bin/tsc --noEmit --pretty false
```

- Visual verification was done against the running app at `http://localhost:3000`.

## Recommended next tasks

1. Fine-tune the forest composition against owner taste.
2. Compare the current staircase shape with the Figma source and adjust if needed.
3. Test hero appearance at mobile, tablet, and desktop widths after any further scene edits.
4. If desired, add an explicit debug mode to force `day`, `sunset`, or `night` sky for faster visual review.

## Run locally

```bash
cd "/Users/cdmxx/Florines Place"
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Useful checks

```bash
cd "/Users/cdmxx/Florines Place"
git status --short
./node_modules/.bin/tsc --noEmit --pretty false
```

## Notes for any agent

- Preserve SSR-safe determinism in the generated grove. Do not introduce `Math.random()` inside render.
- Preserve the cultural framing comments around the formline / totem motifs. They are original stylized homages, not reproductions.
- If you change the hero crop again, verify with screenshots, not just by reading the SVG math.

## Suggested continuation prompt

Use this if you want another agent to pick up immediately:

```text
Continue work in /Users/cdmxx/Florines Place on branch hero-native-motifs. Read HANDOFF.md first, then inspect the homepage hero scene. Verify the current visual state at localhost:3000 before making changes. Focus on refining the Florine's Place hero art, not the unrelated TomsTech repo.
```
