/**
 * The Home hero scene: an abstract read of Florine's Place — the cabin on a
 * forested bluff above Hood Canal, tide below. Fine-line, warm, not
 * cartoonish. Motion lives here (tide shimmer, cabin-window glow, one eagle
 * gliding past) so it never sits behind reading text.
 *
 * Composition note: the cabin, trees, and bluff are centered (x ≈ 250–870) so
 * that on narrow/mobile widths — where preserveAspectRatio slice crops the
 * sides — the cabin-above-the-water identity survives instead of being cut off.
 *
 * Island fix: the central bluff no longer ends abruptly in open water. A low
 * shoreline tapers from the base of the bluff out to both screen edges, staying
 * near sea level. Land is clipped to the waterline (no brown below it); the
 * submerged shore is a blue-green tinted band drawn over the water, so the scene
 * reads as a raised bluff connected to a continuous coastline — not an island.
 *
 * Decorative only — colors are drawn from the warm palette directly since this
 * is a one-off illustration, not themed UI.
 */

/** A single Pacific-Northwest fir / cedar silhouette. */
function Fir({
  x,
  baseY,
  h,
  w,
  stroke,
  fill = "none",
  opacity = 1,
  strokeWidth = 1.4,
  trunk,
  lean = 0,
}: {
  x: number;
  baseY: number;
  h: number;
  w: number;
  stroke: string;
  fill?: string;
  opacity?: number;
  strokeWidth?: number;
  /** trunk colour — defaults to the foliage stroke; pass a brown for saplings */
  trunk?: string;
  /** degrees of lean about the trunk base, for natural variation */
  lean?: number;
}) {
  const apex = baseY - h;
  // three-tier fir outline so it reads as a conifer, not a plain triangle
  const d = [
    `M${x} ${apex}`,
    `L${x - w * 0.28} ${apex + h * 0.42}`,
    `L${x - w * 0.16} ${apex + h * 0.42}`,
    `L${x - w * 0.42} ${apex + h * 0.72}`,
    `L${x - w * 0.28} ${apex + h * 0.72}`,
    `L${x - w * 0.5} ${baseY}`,
    `L${x + w * 0.5} ${baseY}`,
    `L${x + w * 0.28} ${apex + h * 0.72}`,
    `L${x + w * 0.42} ${apex + h * 0.72}`,
    `L${x + w * 0.16} ${apex + h * 0.42}`,
    `L${x + w * 0.28} ${apex + h * 0.42}`,
    "Z",
  ].join(" ");
  return (
    <g opacity={opacity} transform={lean ? `rotate(${lean} ${x} ${baseY})` : undefined}>
      <line
        x1={x}
        y1={baseY}
        x2={x}
        y2={baseY + 6}
        stroke={trunk ?? stroke}
        strokeWidth={Math.max(strokeWidth, 1.6)}
        strokeLinecap="round"
      />
      <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
    </g>
  );
}

/** Exact quadratic evaluation for the visible bluff-crest path below. Keeping
 * this in one shared helper prevents hand-placed and generated trees from
 * drifting away from the sand surface. */
function quadraticY(
  x0: number,
  y0: number,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  x: number,
) {
  const t = Math.max(0, Math.min(1, (x - x0) / (x1 - x0)));
  const mt = 1 - t;
  return mt * mt * y0 + 2 * mt * t * cy + t * t * y1;
}

function landGroundY(x: number) {
  if (x <= 250) return quadraticY(0, 158, 130, 155, 250, 160, x);
  if (x <= 560) return quadraticY(250, 160, 400, 120, 560, 110, x);
  if (x <= 870) return quadraticY(560, 110, 720, 120, 870, 160, x);
  return quadraticY(870, 160, 1006, 156, 1200, 156, x);
}

type GroveDepth = "back" | "mid" | "front";

type GroveTone = { fill: string; stroke: string; hollow: string; trunk: string; strokeWidth: number };

const GROVE_PALETTE: Record<GroveDepth, GroveTone[]> = {
  back: [
    { fill: "#b8c4b4", stroke: "#92a18f", hollow: "#98a89a", trunk: "#8d7c67", strokeWidth: 0.95 },
    { fill: "#a7b8a8", stroke: "#859786", hollow: "#8ba08e", trunk: "#857460", strokeWidth: 1.0 },
    { fill: "#9db29f", stroke: "#7d9282", hollow: "#839889", trunk: "#806f5b", strokeWidth: 1.02 },
  ],
  mid: [
    { fill: "#779275", stroke: "#60775f", hollow: "#698167", trunk: "#7b5b40", strokeWidth: 1.15 },
    { fill: "#688667", stroke: "#557059", hollow: "#5f7a63", trunk: "#74533a", strokeWidth: 1.22 },
    { fill: "#829a77", stroke: "#667b5f", hollow: "#6d8567", trunk: "#7f5d43", strokeWidth: 1.18 },
  ],
  front: [
    { fill: "#55784f", stroke: "#6a4a31", hollow: "#5d8058", trunk: "#6a4a31", strokeWidth: 1.28 },
    { fill: "#456c47", stroke: "#5f3a24", hollow: "#4f7850", trunk: "#5f3a24", strokeWidth: 1.36 },
    { fill: "#62814f", stroke: "#755035", hollow: "#6a8756", trunk: "#755035", strokeWidth: 1.31 },
  ],
};

function groveToneFor(depth: GroveDepth, x: number, index: number) {
  const variants = GROVE_PALETTE[depth];
  return variants[(index + Math.round(x / 23)) % variants.length];
}

const WATER_BASE = "#748d96";
const WATER_LINE = "#efe1c9";
const WATER_DRIFT = "#34535f";
const SHORE_SUBMERGED = "#a8b7ac";
const SHORE_SUBMERGED_LINE = "#c6d1c7";
const SHORE_BASE = "#f1e3cf";
const SHORE_TOP_LINE = "#b58051";
const SHORE_WET = "#d0ba94";
const SHORE_PATCH = "#cdb697";
const SHORE_PEBBLE = "#d6c7b0";
const SHORE_ROCK = "#ab9271";
const SHORE_DRIFTWOOD = "#8c6948";
const SHORE_SEAWEED = "#5d795e";
const TREE_SHADOW = "#8d7658";

/** A full but legible grove matching the Figma composition: more individual
 * trees than the original scene, with depth carried primarily by graduated
 * green shades instead of heavy overlap. Generated once from a fixed seed, so
 * server render and hydration remain byte-identical. Tuple:
 * [x, baseY, height, width, opacity, depth, filled, lean]. */
type FirTuple = [number, number, number, number, number, GroveDepth, boolean, number];
const GROVE: FirTuple[] = (() => {
  let s = 20260716; // fixed seed → deterministic
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const trees: FirTuple[] = [];

  const addRow = ({
    depth,
    start,
    end,
    spacing,
    spacingJitter,
    heightMin,
    heightMax,
    opacityMin,
    opacityMax,
    fillChance,
    apexFloor,
  }: {
    depth: GroveDepth;
    start: number;
    end: number;
    spacing: number;
    spacingJitter: number;
    heightMin: number;
    heightMax: number;
    opacityMin: number;
    opacityMax: number;
    fillChance: number;
    apexFloor: number;
  }) => {
    let cursor = start + rnd() * spacing;
    while (cursor <= end) {
      const x = Math.round(cursor + rnd() * 8 - 4);
      const nearCabin =
        x > (depth === "back" ? 550 : depth === "mid" ? 545 : 535) &&
        x < (depth === "back" ? 590 : depth === "mid" ? 600 : 610);
      const nearTotem = depth === "front" && x > 486 && x < 510;
      const nearStairs = depth === "front" && x > 620 && x < 660;

      // Preserve a clean silhouette around the cabin, carved post, and edited
      // staircase. The distant row may ghost behind these landmarks.
      const edgeTaper =
        x > 900 ? ((x - 900) / 250) * (depth === "front" ? 0.48 : 0.32) : x < 165 ? 0.22 : 0;
      const skip =
        nearTotem ||
        (nearStairs && rnd() < 0.62) ||
        (nearCabin && (depth === "front" || rnd() < (depth === "mid" ? 0.82 : 0.45))) ||
        rnd() < edgeTaper;

      if (!skip) {
        const baseY = landGroundY(x);
        // Bias toward taller silhouettes while widening the silhouette range so
        // the grove does not read as a repeated stamp line.
        const naturalHeight = heightMin + Math.sqrt(rnd()) * (heightMax - heightMin);
        const h = Math.round(Math.min(naturalHeight, Math.max(28, baseY - apexFloor)));
        trees.push([
          x,
          +baseY.toFixed(1),
          h,
          Math.round(h * (0.34 + rnd() * 0.22)),
          +(opacityMin + rnd() * (opacityMax - opacityMin)).toFixed(2),
          depth,
          rnd() < fillChance,
          Math.round(rnd() * 10 - 5),
        ]);
      }

      cursor += spacing + rnd() * spacingJitter;
    }
  };

  addRow({
    depth: "back",
    start: 125,
    end: 1080,
    spacing: 11,
    spacingJitter: 9,
    heightMin: 26,
    heightMax: 72,
    opacityMin: 0.38,
    opacityMax: 0.62,
    fillChance: 0.72,
    apexFloor: 30,
  });
  addRow({
    depth: "mid",
    start: 135,
    end: 1070,
    spacing: 14,
    spacingJitter: 10,
    heightMin: 36,
    heightMax: 90,
    opacityMin: 0.56,
    opacityMax: 0.82,
    fillChance: 0.82,
    apexFloor: 28,
  });
  addRow({
    depth: "front",
    start: 140,
    end: 1060,
    spacing: 19,
    spacingJitter: 14,
    heightMin: 46,
    heightMax: 106,
    opacityMin: 0.82,
    opacityMax: 0.97,
    fillChance: 0.92,
    apexFloor: 24,
  });

  return trees;
})();

/**
 * Totem — an original, stylized carved post in the Pacific Northwest Coast
 * idiom (stacked thunderbird / bear / orca, formline eyes and U-forms), stood
 * on the bluff beside the cabin. Decorative homage in the cabin palette, NOT a
 * reproduction of any nation's real pole. Hood Canal is Coast Salish (Twana /
 * Skokomish) land. Authored in a 64×200 box, scaled down into the scene.
 */
function Totem() {
  return (
    <g transform="translate(487 71) scale(0.406)" opacity={0.95}>
      {/* cedar post */}
      <rect x="18" y="24" width="28" height="176" rx="9" fill="#6d4a33" stroke="#43301f" strokeWidth="2" />
      {/* thunderbird wings */}
      <path d="M18 40 Q -4 30 2 54 Q 9 47 18 52 Z" fill="#b0522c" stroke="#43301f" strokeWidth="1.5" />
      <path d="M46 40 Q 68 30 62 54 Q 55 47 46 52 Z" fill="#b0522c" stroke="#43301f" strokeWidth="1.5" />
      {/* thunderbird head */}
      <ellipse cx="32" cy="42" rx="13" ry="11" fill="#1a1a1a" />
      <ellipse cx="27" cy="41" rx="3.4" ry="4" fill="#f4efe5" />
      <circle cx="27" cy="42" r="1.6" fill="#1a1a1a" />
      <ellipse cx="37" cy="41" rx="3.4" ry="4" fill="#f4efe5" />
      <circle cx="37" cy="42" r="1.6" fill="#1a1a1a" />
      <path d="M28 49 L36 49 L32 58 Z" fill="#b0522c" stroke="#43301f" strokeWidth="0.8" />
      {/* bear ears + face */}
      <path d="M20 90 Q 14 84 20 82 Z" fill="#b0522c" />
      <path d="M44 90 Q 50 84 44 82 Z" fill="#b0522c" />
      <rect x="20" y="88" width="24" height="30" rx="6" fill="#1a1a1a" />
      <ellipse cx="27" cy="98" rx="3.6" ry="4" fill="#f4efe5" />
      <circle cx="27" cy="99" r="1.7" fill="#1a1a1a" />
      <ellipse cx="37" cy="98" rx="3.6" ry="4" fill="#f4efe5" />
      <circle cx="37" cy="99" r="1.7" fill="#1a1a1a" />
      <rect x="27" y="104" width="10" height="9" rx="3" fill="#2f6d6a" />
      <circle cx="30" cy="108" r="1.2" fill="#1a1a1a" />
      <circle cx="34" cy="108" r="1.2" fill="#1a1a1a" />
      {/* orca base figure */}
      <rect x="20" y="140" width="24" height="54" rx="7" fill="#1a1a1a" />
      <ellipse cx="27" cy="152" rx="3.6" ry="4" fill="#f4efe5" />
      <circle cx="27" cy="153" r="1.7" fill="#1a1a1a" />
      <ellipse cx="37" cy="152" rx="3.6" ry="4" fill="#f4efe5" />
      <circle cx="37" cy="153" r="1.7" fill="#1a1a1a" />
      <path d="M24 162 Q 32 171 40 162" stroke="#b0522c" strokeWidth="3" fill="none" />
      <rect x="28" y="173" width="8" height="15" rx="3" fill="#b0522c" />
    </g>
  );
}

export function CabinScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 -14 1200 254"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff9ee" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff9ee" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff9ee" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Hood Canal water */}
      <path
        d="M0 168 Q 150 159 300 166 T 600 164 T 900 166 T 1200 163 L1200 240 L0 240 Z"
        fill={WATER_BASE}
        opacity="0.92"
      />
      <path
        d="M0 168 Q 150 159 300 166 T 600 164 T 900 166 T 1200 163"
        stroke={WATER_LINE}
        strokeWidth="2"
        opacity="0.62"
      />
      <rect className="tide-shimmer" x="330" y="168" width="460" height="72" fill="url(#shimmer)" />
      <g className="tide-drift" stroke={WATER_DRIFT} strokeWidth="1.3" opacity="0.22">
        <path d="M-60 192 Q 200 186 460 192 T 980 190 T 1400 192" />
        <path d="M-60 212 Q 240 206 500 212 T 1000 210 T 1400 212" />
      </g>

      {/* submerged shoreline — the beach continuing under the tide: blue-green,
          low-contrast, hazy. Drawn over the open water so it reads as beneath
          the surface, not as dry land. */}
      <path
        d="M0 171 Q 300 173 600 171 Q 900 173 1200 171 L1200 190 Q 900 192 600 190 Q 300 192 0 190 Z"
        fill={SHORE_SUBMERGED}
        opacity="0.22"
      />
      <g stroke={SHORE_SUBMERGED_LINE} strokeWidth="1.1" fill="none" opacity="0.24">
        <path d="M-40 178 Q 300 175 640 179 T 1240 178" />
        <path d="M-40 186 Q 320 183 660 187 T 1240 186" />
      </g>

      {/* Extended land: raised central bluff tapering to a low shoreline that
          continues to both edges. Bottom edge sits at the waterline, so no brown
          drops into the water (which is what made it read as an island). The
          bluff crest control points are unchanged, so the cabin sits identically. */}
      <path
        d="M0 157
           Q 62 160 128 155 Q 190 151 250 160
           Q 400 120 560 110 Q 720 120 870 160
           Q 936 151 1006 157 Q 1088 162 1166 153 Q 1186 151 1200 156
           L1200 171
           Q 1040 174 880 170 Q 720 172 560 170 Q 400 172 240 171 Q 120 172 0 170 Z"
        fill={SHORE_BASE}
        opacity="0.98"
      />
      {/* shore + bluff-crest highlight, now continuous across the whole coast */}
      <path
        d="M0 158 Q 130 155 250 160 Q 400 120 560 110 Q 720 120 870 160 Q 1006 156 1200 156"
        stroke={SHORE_TOP_LINE}
        strokeWidth="1.6"
        opacity="0.34"
      />
      {/* wet shoreline — a damp band along the waterline, darker than dry sand */}
      <path
        d="M0 166 Q 300 169 600 167 Q 900 169 1200 167 L1200 171 Q 900 173 600 171 Q 300 173 0 171 Z"
        fill={SHORE_WET}
        opacity="0.72"
      />

      {/* Beach material along the low side shores — pebbles, wet gravel, small
          rocks, driftwood, seaweed, damp patches. Kept sparse and irregular so
          it reads as Hood Canal shingle, not a broad sandy beach. */}
      <g>
        {/* damp patches */}
        <g fill={SHORE_PATCH} opacity="0.22">
          <ellipse cx="110" cy="168" rx="15" ry="3" />
          <ellipse cx="1030" cy="168" rx="17" ry="3" />
        </g>
        {/* pebbles / wet gravel */}
        <g fill={SHORE_PEBBLE} opacity="0.42">
          {(
            [
              [42, 164], [70, 166], [108, 163], [144, 165], [186, 162], [222, 164],
              [930, 163], [968, 166], [1010, 162], [1052, 165], [1096, 161], [1150, 164],
            ] as [number, number][]
          ).map(([cx, cy], i) => (
            <ellipse key={`peb-${i}`} cx={cx} cy={cy} rx={i % 3 === 0 ? 2.8 : 2} ry={i % 3 === 0 ? 1.8 : 1.3} />
          ))}
        </g>
        {/* small rocks */}
        <g fill={SHORE_ROCK} opacity="0.46">
          <ellipse cx="66" cy="166" rx="6" ry="3.5" />
          <ellipse cx="150" cy="164" rx="5" ry="3" />
          <ellipse cx="205" cy="167" rx="4.5" ry="2.8" />
          <ellipse cx="960" cy="165" rx="6" ry="3.5" />
          <ellipse cx="1050" cy="163" rx="5" ry="3" />
          <ellipse cx="1130" cy="166" rx="4.5" ry="2.8" />
        </g>
        {/* driftwood */}
        <g stroke={SHORE_DRIFTWOOD} fill="none" strokeLinecap="round" opacity="0.46">
          <path d="M40 160 Q 58 157 74 161" strokeWidth="2.4" />
          <path d="M175 159 Q 189 157 201 160" strokeWidth="1.8" />
          <path d="M980 159 Q 996 156 1010 160" strokeWidth="2.2" />
          <path d="M1095 158 Q 1108 156 1119 159" strokeWidth="1.7" />
        </g>
        {/* seaweed */}
        <g stroke={SHORE_SEAWEED} fill="none" strokeLinecap="round" opacity="0.42">
          <path d="M90 168 Q 93 164 91 161" strokeWidth="1.1" />
          <path d="M200 167 Q 203 163 201 160" strokeWidth="1" />
          <path d="M1000 167 Q 1003 163 1001 160" strokeWidth="1.1" />
          <path d="M1120 166 Q 1123 162 1121 159" strokeWidth="1" />
        </g>
      </g>

      {/* Small contact shadows seat the nearest trunks on the sand. Their y
          values come from the same land curve as every tree base. */}
      <g fill={TREE_SHADOW}>
        {GROVE.filter(([, , , , , depth]) => depth !== "back").map(([x, b, , w, , depth], i) => (
          <ellipse
            key={`tree-shadow-${i}`}
            cx={x}
            cy={b + 2.2}
            rx={Math.max(3, w * 0.36)}
            ry={depth === "front" ? 1.6 : 1.1}
            opacity={depth === "front" ? 0.11 : 0.07}
          />
        ))}
      </g>

      {/* Shade-graded grove: hazy sage in back, medium cedar green through the
          middle, and darker saturated firs in front. */}
      {GROVE.map(([x, b, h, w, op, depth, filled, lean], i) => {
        const palette = groveToneFor(depth, x, i);
        return (
          <Fir
            key={`grove-${i}`}
            x={x}
            baseY={b}
            h={h}
            w={w}
            opacity={op}
            lean={lean}
            trunk={palette.trunk}
            fill={filled ? palette.fill : "none"}
            stroke={filled ? palette.stroke : palette.hollow}
            strokeWidth={palette.strokeWidth}
          />
        );
      })}

      {/* stylized carved post beside the cabin (see Totem note above) */}
      <Totem />

      {/* the cabin, with a window that warms to life on load */}
      <circle className="cabin-glow" cx="566" cy="102" r="12" fill="#e7a54a" />
      <g stroke="#5f3a24" strokeWidth="2">
        <path d="M544 114 L544 92 L566 76 L588 92 L588 114 Z" fill="#f4efe5" />
        <rect x="560" y="97" width="12" height="13" fill="#e7a54a" />
        <path d="M560 97 L572 97 M566 97 L566 110" strokeWidth="1.3" />
      </g>

      {/* Hand-edited Figma staircase: a short, dark switchback tucked into the
          trees, ending at the shoreline instead of running deep into the water. */}
      <path
        d="M610 108 C606 117 611 125 619 130 C614 138 620 146 629 150 C625 157 637 163 645 169"
        stroke="#46545c"
        strokeWidth="2.4"
        strokeDasharray="4.5 3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.86"
      />

      {/* a single eagle gliding across, once */}
      <g className="eagle-glide">
        <path d="M0 44 Q 9 37 18 44 Q 27 37 36 44" stroke="#28444f" strokeWidth="2.2" opacity="0.5" />
      </g>

      {/* a faint sand dollar on the near beach (desktop only; crops on mobile) */}
      <g transform="translate(150 196)" opacity="0.2">
        <circle r="15" stroke="#8a5a36" strokeWidth="1.4" />
        <path
          d="M0 -9 L0 -1 M0 -1 L -6 6 M0 -1 L 6 6 M-7 -4 L -2 -1 M7 -4 L 2 -1"
          stroke="#8a5a36"
          strokeWidth="1.1"
        />
      </g>
    </svg>
  );
}
