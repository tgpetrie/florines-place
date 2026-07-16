# Codex handoff — fix + refine the home hero forest scene

You're picking up work on the **home hero scene** of a Next.js 15 / React 19 /
Tailwind v4 app (Florine's Place, a family cabin site). The prior agent (Claude)
built a lot of this but got two things wrong that need fixing, plus there's
unfinished work. **Trust the screenshots and the running app over any prior
"this is fixed" claims — at least one such claim was false.**

Branch: `hero-native-motifs`. Run: `npm run dev` → http://localhost:3000.
Typecheck: `npx tsc --noEmit`. See also `HANDOFF.md` (prior handoff).

## The scene, in code

- `src/components/cabin-scene.tsx` — the illustrated strip: SVG `viewBox="0 0 1200 240"`,
  rendered `preserveAspectRatio="xMidYMax slice"`, pinned to the bottom of the
  hero at `h-44 sm:h-52` (176/208px tall). Contains the water, bluff/beach land
  path, the **trees** (a `Fir` component + a seeded `GROVE` generator), a `Totem`,
  the cabin, and a dashed **staircase** path.
- `src/components/landscape-bg.tsx` — sky gradient, sun, moon, distant mountains.
  Renders `FormlineSun`.
- `src/components/formline-sun.tsx`, `formline-crest.tsx` — NW-Coast-style motifs.
- `src/app/page.tsx` — hero section; headline bracketed by `FormlineCrest`.

## BUG 1 — trees are NOT grounded (still floating)

Despite a commit that claims to "plant trunks on the ground line" (it added a
`groundY(x)` helper in the `GROVE` IIFE in `cabin-scene.tsx`), trees still float
above the sand in the running app. **Do not assume `groundY` is correct.**

What to check:
- The land/beach surface is drawn by the `#d8c7ad` land path and the `#8a5a36`
  crest stroke in `cabin-scene.tsx`. The trees must sit on THAT visible surface.
- `groundY(x)` approximates that curve as piecewise quadratics
  (`250,160 → 560,110 → 870,160 → …`). Verify it actually matches the drawn land
  at several x by eye; the two may diverge (especially the side shores and the
  x=250 dip).
- Each `Fir` draws foliage from `apex=baseY-h` down to `baseY`, plus a 6px trunk
  `line` below `baseY`. "Grounded" means `baseY` lands on the sand surface at that x.
- The `GROVE` generator has back/mid/front rows — check EACH row's base, not just
  the front. Confirm visually per row (temporarily tint rows to debug).

Best approach: drive the running page, screenshot, and iterate until every trunk
base meets the sand across the full width (center crest AND the tapered side
shores). Consider a faint ground-shadow ellipse under trunks to seat them.

## BUG 2 — tree tops are being cut off

`cabin-scene.tsx` uses `viewBox="0 0 1200 240"` with
`preserveAspectRatio="xMidYMax slice"` inside a short container (`h-44 sm:h-52`).
Because the container is wider-aspect than the viewBox, `slice` scales to cover
and **crops the TOP** — roughly the top ~45px of viewBox y-space is cut on
desktop. Tall trees near the crest (base y≈110, heights up to ~88 → apex y≈22)
get their tips clipped.

Fix options (pick what preserves the look):
- Cap tree height as a function of base so `apex = baseY - h` stays ≥ ~50
  (tallest trees allowed only where the base is lower — i.e., toward the sides).
- Or grow the scene: increase the container height (`h-44 sm:h-52`) and/or the
  viewBox height, and reflow content so nothing clips.
- Verify at multiple widths (mobile 375, tablet 768, desktop 1280) — the crop
  amount depends on container aspect ratio.

## TASK 3 — the aesthetic the owner actually wants

Owner feedback (paraphrased, with reference screenshots they provided):
> "The way I had it looked much better — **not as cluttered, but with more trees
> and different shades** which gave it depth. You're cutting off the tops."

So the goal is **depth through SHADE variation, not brute density**:
- Introduce a small palette of green tones and assign by depth row: back row =
  lighter / cooler / desaturated (hazier, reads distant), mid = medium, front =
  darker / more saturated (reads near). Right now depth is mostly "filled vs
  hollow" — add graduated greens instead.
- More trees, but reduce visual clutter: fewer hard overlaps, cleaner silhouettes,
  let the shade layering carry depth. The current `GROVE` is too busy/uniform.
- Keep the cabin readable (a light clearing around x 530–602) and the totem visible.
- Current palette in use: fill `#37613f`, stroke `#5f3a24`, hollow greens
  `#4f6d55` / `#5e7d63`. Expand this into a back→front ramp.

## TASK 4 — port the owner's hand-edited staircase from Figma

The owner significantly changed the staircase by hand in Figma. The code still
has the ORIGINAL path in `cabin-scene.tsx` (dashed `#8a5a36`):
`M566 116 L572 130 L596 130 L602 144 L626 144 L676 186`.
If you have Figma access, read the file (fileKey below), find the dashed vector in
node `3:2`, and export its path:
```js
const scene = await figma.getNodeByIdAsync("3:2");
const stair = scene.findOne(n => n.type === "VECTOR" && Array.isArray(n.dashPattern) && n.dashPattern.length);
const svg = String.fromCharCode.apply(null, Array.from(await stair.exportAsync({ format: "SVG" })));
return svg; // extract `d`, translate to scene coords, replace the path above
```
NOTE: Figma MCP was **rate-limited (Starter plan)** for the prior agent — the
same limit likely applies. If blocked, match it by eye from the owner's screenshot.

## TASK 5 — night formline moon

Add a `FormlineMoon` (new file, mirror `formline-sun.tsx`) — a cool-palette
sibling to the sun (`#e9edf3` face, navy `#131a38` carving, muted teal accents).
Wire it into the `Moon` component in `landscape-bg.tsx` for
`state === "night" || state === "dusk"`. The hero is currently pinned to a warm
day↔sunset sky (`sky="warm"`), so test with `<LandscapeBackground sky="night" />`.

## Figma source

File **Florine's Place — Home / Hero**: https://www.figma.com/design/DvrsFwfr53nq1EeroSks2m
(fileKey `DvrsFwfr53nq1EeroSks2m`, owner tgpetrie@gmail.com). One-way snapshot —
edits there don't sync to code; port by hand.

## Must-preserve constraints

- **SSR-safe determinism:** `cabin-scene.tsx` renders on the server and hydrates
  on the client. NEVER use `Math.random()` in render — the `GROVE` layout is
  generated once at module load from a fixed seed so both passes match. Keep it.
- **Cultural framing:** Hood Canal is Coast Salish (Twana / Skokomish) land. The
  totem, sun, crests (and the future moon) are **original stylized homages, NOT
  reproductions** of any nation's real crest/pole/mask. Preserve the note in each
  component's header comment.
- Scene coords: `viewBox 0 0 1200 240`; cabin x≈544–588; waterline ≈ y168.

## Definition of done

Trees planted on the sand (no floating) at all widths; no clipped tree tops; a
fuller-but-cleaner forest with shade-graded depth; staircase matches Figma; night
moon in place. Verify by driving the running app and screenshotting — not by
assertion.
