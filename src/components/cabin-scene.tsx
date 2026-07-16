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

/** Grove treatment ported from the Figma design pass: some firs are filled a
 *  solid deep green with a carved-brown outline, mixed among the hollow line
 *  firs so the bluff reads full and layered rather than uniform. */
const GROVE_FILL = "#37613f";
const GROVE_STROKE = "#5f3a24";

/** Dense grove ringing the cabin — a full, layered, edge-to-edge stand matching
 *  the Figma design pass. Generated ONCE at module load from a fixed seed, so
 *  the layout is byte-identical on the server and on hydration (never
 *  Math.random in render, which would desync SSR and trigger a mismatch).
 *  Two depth bands: a fainter, smaller back row and a taller front row where
 *  some firs are filled. Tuple: [x, baseY, height, width, opacity, filled, lean]. */
type FirTuple = [number, number, number, number, number, boolean, number];
const GROVE: FirTuple[] = (() => {
  let s = 20260716; // fixed seed → deterministic
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  // Ground surface — the SAME piecewise-quadratic land-crest curve the scene
  // draws below (see the #d8c7ad land path / #8a5a36 crest). Evaluating it means
  // every trunk base sits ON the sand at its x, so nothing floats.
  const seg = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, x: number) => {
    const t = Math.max(0, Math.min(1, (x - x0) / (x2 - x0)));
    const mt = 1 - t;
    return mt * mt * y0 + 2 * mt * t * y1 + t * t * y2;
  };
  const groundY = (x: number) =>
    x <= 250 ? seg(0, 158, 130, 155, 250, 160, x)
    : x <= 560 ? seg(250, 160, 400, 120, 560, 110, x)
    : x <= 870 ? seg(560, 110, 720, 120, 870, 160, x)
    : seg(870, 160, 1006, 156, 1200, 156, x);
  const trees: FirTuple[] = [];
  let x = 130;
  while (x <= 1070) {
    const nearCabin = x > 530 && x < 602; // leave the cabin readable
    // back row — smaller, fainter, hollow; planted on the ground (depth via
    // size/opacity, NOT by lifting the base)
    const bx1 = Math.round(x + rnd() * 8 - 4);
    const hb = 30 + rnd() * 26;
    trees.push([
      bx1,
      Math.round(groundY(bx1) + rnd() * 2),
      Math.round(hb),
      Math.round(hb * 0.4),
      +(0.5 + rnd() * 0.22).toFixed(2),
      false,
      Math.round(rnd() * 6 - 3),
    ]);
    // mid row — fills the gaps, mostly filled
    if (rnd() < 0.85) {
      const bx2 = Math.round(x + rnd() * 10 - 5);
      const hm = 36 + rnd() * 28;
      trees.push([
        bx2,
        Math.round(groundY(bx2) + rnd() * 2),
        Math.round(hm),
        Math.round(hm * 0.4),
        +(0.66 + rnd() * 0.16).toFixed(2),
        !nearCabin && rnd() < 0.55,
        Math.round(rnd() * 6 - 3),
      ]);
    }
    // front row — tallest; mostly filled, but kept light/hollow right at the cabin
    const h2 = (nearCabin ? 34 : 48) + rnd() * (nearCabin ? 18 : 40);
    trees.push([
      x,
      Math.round(groundY(x) + rnd() * 3),
      Math.round(h2),
      Math.round(h2 * 0.4),
      +((nearCabin ? 0.62 : 0.8) + rnd() * 0.16).toFixed(2),
      !nearCabin && rnd() < 0.7,
      Math.round(rnd() * 6 - 3),
    ]);
    x += 13 + rnd() * 10;
  }
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
      viewBox="0 0 1200 240"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff9ee" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff9ee" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#fff9ee" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* faint forest silhouette on the ridge, for depth */}
      <g opacity="0.16">
        {[
          [360, 150, 44],
          [410, 146, 60],
          [470, 140, 70],
          [560, 132, 78],
          [640, 138, 66],
          [710, 146, 58],
          [770, 150, 48],
        ].map(([x, b, h], i) => (
          <Fir key={`bg-${i}`} x={x} baseY={b} h={h} w={h * 0.42} stroke="#746a5d" fill="#746a5d" />
        ))}
      </g>

      {/* Hood Canal water */}
      <path
        d="M0 168 Q 150 159 300 166 T 600 164 T 900 166 T 1200 163 L1200 240 L0 240 Z"
        fill="#607c88"
        opacity="0.9"
      />
      <path
        d="M0 168 Q 150 159 300 166 T 600 164 T 900 166 T 1200 163"
        stroke="#e6d9bf"
        strokeWidth="2"
        opacity="0.5"
      />
      <rect className="tide-shimmer" x="330" y="168" width="460" height="72" fill="url(#shimmer)" />
      <g className="tide-drift" stroke="#28444f" strokeWidth="1.3" opacity="0.28">
        <path d="M-60 192 Q 200 186 460 192 T 980 190 T 1400 192" />
        <path d="M-60 212 Q 240 206 500 212 T 1000 210 T 1400 212" />
      </g>

      {/* submerged shoreline — the beach continuing under the tide: blue-green,
          low-contrast, hazy. Drawn over the open water so it reads as beneath
          the surface, not as dry land. */}
      <path
        d="M0 171 Q 300 173 600 171 Q 900 173 1200 171 L1200 190 Q 900 192 600 190 Q 300 192 0 190 Z"
        fill="#6f8f88"
        opacity="0.24"
      />
      <g stroke="#7fa39c" strokeWidth="1.1" fill="none" opacity="0.3">
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
        fill="#d8c7ad"
        opacity="0.74"
      />
      {/* shore + bluff-crest highlight, now continuous across the whole coast */}
      <path
        d="M0 158 Q 130 155 250 160 Q 400 120 560 110 Q 720 120 870 160 Q 1006 156 1200 156"
        stroke="#8a5a36"
        strokeWidth="1.6"
        opacity="0.42"
      />
      {/* wet shoreline — a damp band along the waterline, darker than dry sand */}
      <path
        d="M0 166 Q 300 169 600 167 Q 900 169 1200 167 L1200 171 Q 900 173 600 171 Q 300 173 0 171 Z"
        fill="#b09772"
        opacity="0.55"
      />

      {/* Beach material along the low side shores — pebbles, wet gravel, small
          rocks, driftwood, seaweed, damp patches. Kept sparse and irregular so
          it reads as Hood Canal shingle, not a broad sandy beach. */}
      <g>
        {/* damp patches */}
        <g fill="#9c8663" opacity="0.3">
          <ellipse cx="110" cy="168" rx="15" ry="3" />
          <ellipse cx="1030" cy="168" rx="17" ry="3" />
        </g>
        {/* pebbles / wet gravel */}
        <g fill="#a89a7e" opacity="0.5">
          {(
            [
              [30, 164], [52, 167], [78, 163], [104, 166], [132, 162], [160, 165], [188, 161], [214, 164],
              [915, 163], [944, 166], [972, 162], [1004, 165], [1036, 161], [1070, 164], [1104, 160], [1140, 163], [1172, 165],
            ] as [number, number][]
          ).map(([cx, cy], i) => (
            <ellipse key={`peb-${i}`} cx={cx} cy={cy} rx={i % 3 === 0 ? 2.8 : 2} ry={i % 3 === 0 ? 1.8 : 1.3} />
          ))}
        </g>
        {/* small rocks */}
        <g fill="#8a7454" opacity="0.7">
          <ellipse cx="66" cy="166" rx="6" ry="3.5" />
          <ellipse cx="150" cy="164" rx="5" ry="3" />
          <ellipse cx="205" cy="167" rx="4.5" ry="2.8" />
          <ellipse cx="960" cy="165" rx="6" ry="3.5" />
          <ellipse cx="1050" cy="163" rx="5" ry="3" />
          <ellipse cx="1130" cy="166" rx="4.5" ry="2.8" />
        </g>
        {/* driftwood */}
        <g stroke="#7a5a3a" fill="none" strokeLinecap="round" opacity="0.7">
          <path d="M40 160 Q 58 157 74 161" strokeWidth="2.4" />
          <path d="M175 159 Q 189 157 201 160" strokeWidth="1.8" />
          <path d="M980 159 Q 996 156 1010 160" strokeWidth="2.2" />
          <path d="M1095 158 Q 1108 156 1119 159" strokeWidth="1.7" />
        </g>
        {/* seaweed */}
        <g stroke="#2f5236" fill="none" strokeLinecap="round" opacity="0.55">
          <path d="M90 168 Q 93 164 91 161" strokeWidth="1.1" />
          <path d="M200 167 Q 203 163 201 160" strokeWidth="1" />
          <path d="M1000 167 Q 1003 163 1001 160" strokeWidth="1.1" />
          <path d="M1120 166 Q 1123 162 1121 159" strokeWidth="1" />
        </g>
      </g>

      {/* mid + foreground trees around and behind the cabin, varied heights */}
      <Fir x={300} baseY={150} h={40} w={18} stroke="#5e7d63" opacity={0.75} />
      <Fir x={340} baseY={144} h={56} w={22} stroke="#4f6d55" opacity={0.8} />
      <Fir x={470} baseY={128} h={74} w={26} stroke={GROVE_STROKE} fill={GROVE_FILL} trunk="#6b4a2f" opacity={0.85} />
      <Fir x={508} baseY={120} h={62} w={22} stroke="#5e7d63" opacity={0.7} />
      <Fir x={628} baseY={122} h={80} w={28} stroke={GROVE_STROKE} fill={GROVE_FILL} trunk="#6b4a2f" opacity={0.86} />
      <Fir x={672} baseY={130} h={58} w={22} stroke="#5e7d63" opacity={0.72} />
      <Fir x={735} baseY={140} h={66} w={24} stroke={GROVE_STROKE} fill={GROVE_FILL} trunk="#6b4a2f" opacity={0.84} />
      <Fir x={800} baseY={150} h={46} w={18} stroke="#5e7d63" opacity={0.7} />
      <Fir x={840} baseY={156} h={36} w={15} stroke="#746a5d" opacity={0.6} />

      {/* added trees — a few more to make the bluff feel wooded. Modest count,
          brown trunks, muted green, uneven spacing and slight lean. Placed on
          the upper bluff and where the shoreline meets the bluff, kept clear of
          the cabin (x 544–588) and the staircase run (x 566–676). */}
      {/* two medium trees filling the upper bluff */}
      <Fir x={415} baseY={132} h={70} w={26} stroke="#4f6d55" trunk="#6b4a2f" opacity={0.7} lean={-3} />
      <Fir x={760} baseY={137} h={60} w={23} stroke="#4f6d55" trunk="#6b4a2f" opacity={0.68} lean={3} />
      {/* saplings where the low shoreline meets the bluff (left, then right) */}
      <Fir x={262} baseY={160} h={26} w={11} stroke="#5e7d63" trunk="#6b4a2f" opacity={0.7} lean={-5} />
      <Fir x={284} baseY={158} h={34} w={14} stroke="#4f6d55" trunk="#6b4a2f" opacity={0.7} lean={4} />
      <Fir x={858} baseY={160} h={30} w={12} stroke="#4f6d55" trunk="#6b4a2f" opacity={0.7} lean={5} />
      <Fir x={884} baseY={158} h={24} w={10} stroke="#5e7d63" trunk="#6b4a2f" opacity={0.66} lean={-4} />
      {/* small gap-fillers on the bluff, off to the sides */}
      <Fir x={392} baseY={148} h={30} w={12} stroke="#5e7d63" trunk="#6b4a2f" opacity={0.68} lean={-3} />
      <Fir x={786} baseY={150} h={28} w={11} stroke="#4f6d55" trunk="#6b4a2f" opacity={0.68} lean={3} />

      {/* denser grove ringing the cabin — ported from the Figma design pass.
          Some firs are filled (green + carved-brown outline), the rest hollow,
          for a full, layered stand. */}
      {GROVE.map(([x, b, h, w, op, filled, lean], i) => (
        <Fir
          key={`grove-${i}`}
          x={x}
          baseY={b}
          h={h}
          w={w}
          opacity={op}
          lean={lean}
          trunk="#6b4a2f"
          fill={filled ? GROVE_FILL : "none"}
          stroke={filled ? GROVE_STROKE : i % 2 ? "#4f6d55" : "#5e7d63"}
        />
      ))}

      {/* stylized carved post beside the cabin (see Totem note above) */}
      <Totem />

      {/* the cabin, with a window that warms to life on load */}
      <circle className="cabin-glow" cx="566" cy="102" r="12" fill="#e7a54a" />
      <g stroke="#5f3a24" strokeWidth="2">
        <path d="M544 114 L544 92 L566 76 L588 92 L588 114 Z" fill="#f4efe5" />
        <rect x="560" y="97" width="12" height="13" fill="#e7a54a" />
        <path d="M560 97 L572 97 M566 97 L566 110" strokeWidth="1.3" />
      </g>

      {/* the old cliff stairs: short steep, landing, short steep, landing, then
          one long run down to the beach. Dashed and light so it reads as steps,
          not a road. */}
      <path
        d="M566 116 L572 130 L596 130 L602 144 L626 144 L676 186"
        stroke="#8a5a36"
        strokeWidth="1.6"
        strokeDasharray="5 4"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.6"
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
