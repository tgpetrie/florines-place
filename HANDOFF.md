# Handoff — Hero scene: dense grove, formline sun, totem, headline crests

This branch (`hero-native-motifs`) ports a Figma design pass into the home hero
and adds Pacific-Northwest-Coast-inspired motifs. It's a **work in progress** —
three items are still open (see **TODO** below). Continue from here.

## What this branch does (done)

- **Dense grove** around the cabin — `src/components/cabin-scene.tsx`. A seeded,
  module-load generator (`GROVE`) builds a packed, layered stand (back / mid /
  front rows), mixing hollow line-firs with solid green + carved-brown filled
  firs. Deterministic on purpose (fixed seed, **no `Math.random` in render**) so
  server and client hydration match.
- **Filled firs** — a few foreground firs use `fill="#37613f"` + `stroke="#5f3a24"`.
- **Totem post** — `Totem` in `cabin-scene.tsx`: an original, stylized carved
  post (thunderbird / bear / orca) beside the cabin.
- **Formline sun** — `src/components/formline-sun.tsx`, wired into the hero via
  `src/components/landscape-bg.tsx` (replaces the old CSS sun disc). Smiling
  sun-mask with ovoid eyes, U-forms, 8 pointed rays.
- **Headline crests** — `src/components/formline-crest.tsx`, bracketing the
  "Florine's Place" wordmark in `src/app/page.tsx` (`hidden sm:block` — desktop
  only, keeps the mobile title clean).

Verified: `npx tsc --noEmit` clean, no console errors, renders on desktop +
mobile (crests correctly hidden on mobile).

## Cultural note (please preserve)

Hood Canal is Coast Salish (Twana / Skokomish) land. All of these are **original,
stylized homages in the Northwest-Coast idiom — NOT reproductions** of any
nation's real crest, pole, or mask (which carry family / spiritual meaning). The
intent is documented in each component's header comment; keep that framing.

## TODO (open items, in priority order)

### 1. Trees look like they're floating (not attached to the ground)
Cause: in the `GROVE` generator (`cabin-scene.tsx`), the **back row** sits at
`base - 7 - rnd()*12` and the **mid row** at `base - 2 + rnd()*4` — the negative
offsets lift trunks above the sand, so in this side-view scene they read as
floating rather than "further back."
Suggested fix:
- Anchor every row's `baseY` to the dune line (`dune(x)`), with only small
  positive jitter (0–3px), so trunk bases meet the ground.
- The `dune(x)` helper is an approximation: `min(159, 118 + 0.00022*(x-560)^2)`.
  The **actual** land crest is the path in `cabin-scene.tsx` (`fill="#d8c7ad"` /
  the `#8a5a36` crest stroke): control points `250,160 → 560,110 → 870,160`, then
  tapering to the low side shores. Trees at the far edges (x < 250, x > 870)
  should sit near the shoreline (~y 155–160), not the crest curve.
- Optional polish: add a faint ground shadow (a low-opacity ellipse) under each
  trunk to seat them visually.

### 2. Port the hand-edited staircase from Figma
The staircase was significantly changed by hand in the Figma file; this branch
still has the **original** code path:
`M566 116 L572 130 L596 130 L602 144 L626 144 L676 186` (in `cabin-scene.tsx`,
the dashed `#8a5a36` path).
To pull the exact edited geometry, read the Figma file (fileKey below), find the
dashed vector in the cabin-scene node `3:2`, and export its path:
```js
// use_figma against fileKey DvrsFwfr53nq1EeroSks2m
const scene = await figma.getNodeByIdAsync("3:2");
const stair = scene.findOne(n => n.type === "VECTOR" && Array.isArray(n.dashPattern) && n.dashPattern.length);
const svg = String.fromCharCode.apply(null, Array.from(await stair.exportAsync({ format: "SVG" })));
return svg; // extract the `d` attribute, translate into scene coords, replace the path above
```
NOTE: this was blocked by the **Figma Starter-plan MCP rate limit** during the
session — retry once it resets, or read positions by eye from a screenshot.

### 3. Night moon — a formline moon to match the sun
For the night / dusk sky state, add a formline-styled moon analogous to
`FormlineSun`. The moon lives in `landscape-bg.tsx` (`Moon` component, currently
a CSS disc with a phase mask). Build a `FormlineMoon` (new file, same original-
homage framing) — a pale sun-mask sibling (cool palette: `#e9edf3` face, navy
`#131a38` carving, muted teal accents), and render it in `Moon` for
`state === "night" || state === "dusk"`. Keep or simplify the existing lunar-
phase logic (`getLunarPhase`).
NOTE: the hero is currently locked to a warm day↔sunset sky (`sky="warm"`), so
the moon only shows if the sky state logic is changed to `"auto"` or pinned to
`"night"` — test with `<LandscapeBackground sky="night" />` locally.

## Figma source

- File: **Florine's Place — Home / Hero** — https://www.figma.com/design/DvrsFwfr53nq1EeroSks2m
- fileKey: `DvrsFwfr53nq1EeroSks2m` (owned by tgpetrie@gmail.com / "Treal" team)
- One-way snapshot: Figma edits do **not** sync back to code — port by hand.

## Run / verify

```bash
npm run dev          # http://localhost:3000
npx tsc --noEmit     # typecheck (should be clean)
```

## Key palette values

- Grove: fill `#37613f`, stroke `#5f3a24`, trunk `#6b4a2f`; hollow greens `#4f6d55` / `#5e7d63`
- Sun/formline: gold `#ffd23f`, orange `#ef8a2a`, carved black `#1a1a1a`, cream `#fff9ee`
- Crest: cream `#f4efe5`, rust `#b0522c`, brown `#3a2417`, teal `#2f6d6a`
- Scene coordinate system: `viewBox="0 0 1200 240"`; cabin at x≈544–588; waterline ≈ y168
