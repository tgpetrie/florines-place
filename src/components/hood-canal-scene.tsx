"use client";

/**
 * Hood Canal Scene — illustrated backdrop for Florine's Place homepage.
 *
 * ViewBox 1600 × 560, preserveAspectRatio="xMinYMax slice"
 *   – left edge (cliff / cabin) always visible
 *   – bottom (water) always visible
 *   – hero min-h clamp(26rem, 55vw, 56rem) gives full-scene room
 *
 * Render order (back → front):
 *   sky → stars → sun/moon → distant mountains → far shore trees
 *   → CLIFF FIRST (so water paints over the cliff base)
 *   → water → submerged zone → beach
 *   → vegetation → cabin → staircase → beach-edge plants → wildlife
 */

import { getSkyState, getLunarPhase } from "@/lib/sky-state";
import type { SkyState } from "@/lib/sky-state";

// ─── Colours ─────────────────────────────────────────────────────────────────

const FIR_DARK  = "#1a3820";
const FIR_MID   = "#254a28";
const FIR_LITE  = "#2e6030";
const CEDAR_C   = "#234220";
const FERN_C    = "#2c6e2e";
const SALAL_C   = "#295526";
const BRAMBLE_C = "#1a2e18";
const GRASS_C   = "#386430";

const CLIFF_TOP  = "#9a8a6a";   // lighter, sunlit headland surface
const CLIFF_FACE = "#7a6040";   // shadow side of cliff face
const CLIFF_ROCK = "#6a5438";   // darker rock pockets
const BEACH_DRY  = "#8a7a60";   // pebbly gray-brown (not too dark)
const BEACH_WET  = "#6a5e4c";   // wet tide zone

// ─── Fir (filled dark-green silhouette) ──────────────────────────────────────

function Fir({ x, y, h, fill = FIR_DARK, op = 1 }: {
  x: number; y: number; h: number; fill?: string; op?: number;
}) {
  const w = h * 0.38, t = y - h;
  const d = [
    `M${x} ${t}`,
    `L${x-w*.22} ${t+h*.35} L${x-w*.12} ${t+h*.35}`,
    `L${x-w*.38} ${t+h*.62} L${x-w*.22} ${t+h*.62}`,
    `L${x-w*.50} ${y}       L${x+w*.50} ${y}`,
    `L${x+w*.22} ${t+h*.62} L${x+w*.38} ${t+h*.62}`,
    `L${x+w*.12} ${t+h*.35} L${x+w*.22} ${t+h*.35}`,
    "Z",
  ].join(" ");
  return (
    <g opacity={op}>
      <line x1={x} y1={y} x2={x} y2={y+5} stroke={fill} strokeWidth="2.2"/>
      <path d={d} fill={fill}/>
    </g>
  );
}

// ─── Cedar ────────────────────────────────────────────────────────────────────

function Cedar({ x, y, h, op = 1 }: { x: number; y: number; h: number; op?: number }) {
  const w = h * 0.5, t = y - h, f = CEDAR_C;
  const d = [
    `M${x} ${t}`,
    `L${x-w*.18} ${t+h*.26} L${x-w*.08} ${t+h*.23}`,
    `L${x-w*.35} ${t+h*.50} L${x-w*.20} ${t+h*.46}`,
    `L${x-w*.52} ${t+h*.76} L${x-w*.32} ${t+h*.72}`,
    `L${x-w*.58} ${y}       L${x+w*.58} ${y}`,
    `L${x+w*.32} ${t+h*.72} L${x+w*.52} ${t+h*.76}`,
    `L${x+w*.20} ${t+h*.46} L${x+w*.35} ${t+h*.50}`,
    `L${x+w*.08} ${t+h*.23} L${x+w*.18} ${t+h*.26}`,
    "Z",
  ].join(" ");
  return (
    <g opacity={op}>
      <line x1={x} y1={y} x2={x} y2={y+6} stroke={f} strokeWidth="2.5"/>
      <path d={d} fill={f}/>
    </g>
  );
}

// ─── Fern fronds ─────────────────────────────────────────────────────────────

function Fern({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const l = s * 20;
  return (
    <g stroke={FERN_C} fill="none" strokeLinecap="round">
      {([-30,-15,0,15,30] as number[]).map((a, i) => {
        const r = (a-15)*Math.PI/180;
        return <path key={i}
          d={`M${x} ${y} Q${x+Math.sin(r)*l*.5} ${y-Math.cos(r)*l*.5-3*s} ${x+Math.sin(r)*l} ${y-Math.cos(r)*l}`}
          strokeWidth={1.1*s}/>;
      })}
    </g>
  );
}

// ─── Salal blob ───────────────────────────────────────────────────────────────

function Salal({ x, y, r = 18, op = 1 }: { x: number; y: number; r?: number; op?: number }) {
  const d = `M${x} ${y-r*.85}
    Q${x+r*.75} ${y-r*.75} ${x+r} ${y-r*.15}
    Q${x+r*.85} ${y+r*.45} ${x+r*.25} ${y+r*.3}
    Q${x} ${y+r*.55} ${x-r*.4} ${y+r*.2}
    Q${x-r*.85} ${y-.05*r} ${x-r*.75} ${y-r*.5}
    Q${x-r*.45} ${y-r*.95} ${x} ${y-r*.85} Z`;
  return <path d={d} fill={SALAL_C} opacity={op}/>;
}

// ─── Bramble canes ────────────────────────────────────────────────────────────

function Bramble({ x, y, w = 55, h = 28 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g stroke={BRAMBLE_C} fill="none" strokeLinecap="round">
      <path d={`M${x} ${y} Q${x+w*.3} ${y-h} ${x+w} ${y-h*.3}`} strokeWidth="1.4"/>
      <path d={`M${x+w*.15} ${y+h*.15} Q${x+w*.55} ${y-h*1.1} ${x+w*.9} ${y-h*.55}`} strokeWidth="1.2"/>
      <path d={`M${x} ${y-h*.25} Q${x+w*.4} ${y-h*.75} ${x+w*.7} ${y+h*.1}`} strokeWidth="1.0"/>
      {([
        [x+w*.25, y-h*.3],[x+w*.6, y-h*.7],[x+w*.8, y-h*.5],
      ] as [number,number][]).map(([bx,by],i) => (
        <circle key={i} cx={bx} cy={by} r="1.4" fill={BRAMBLE_C} stroke="none"/>
      ))}
    </g>
  );
}

// ─── Grass tuft ───────────────────────────────────────────────────────────────

function Grass({ x, y, h = 16 }: { x: number; y: number; h?: number }) {
  return (
    <g stroke={GRASS_C} strokeWidth="1.1" fill="none" strokeLinecap="round">
      {([-22,-10,2,14,26] as number[]).map((a,i) => {
        const r = a*Math.PI/180;
        return <line key={i} x1={x} y1={y} x2={x+Math.sin(r)*h*.6} y2={y-Math.cos(r)*h}/>;
      })}
    </g>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────

const STAR_PTS: [number,number][] = [
  [120,24],[265,13],[388,29],[524,17],[682,7],[830,21],[958,9],[1088,27],
  [1232,14],[1382,23],[175,51],[332,61],[494,47],[662,57],[844,43],
  [1012,59],[1182,51],[1352,55],[62,37],[1483,31],[732,71],[902,64],
  [1102,77],[452,79],[252,73],[1540,50],[600,38],[780,18],[1020,32],
];
function Stars({ op }: { op: number }) {
  return (
    <g>
      {STAR_PTS.map(([x,y],i) => (
        <circle key={i} cx={x} cy={y}
          r={i%4===0?1.8:1.2}
          fill="#e9edf3"
          opacity={(0.4+(i%5)*.12)*op}/>
      ))}
    </g>
  );
}

// ─── Sun ─────────────────────────────────────────────────────────────────────

function Sun({ state }: { state: SkyState }) {
  if (state==="night"||state==="dusk") return null;
  if (state==="sunset") return (
    <g>
      <circle cx={180} cy={265} r={55} fill="#f08030" opacity={0.14}/>
      <circle cx={180} cy={265} r={38} fill="#f09040" opacity={0.6}/>
      <circle cx={180} cy={265} r={28} fill="#f0a040" opacity={0.9}/>
    </g>
  );
  return (
    <g>
      <circle cx={1390} cy={78} r={62} fill="#fff8e0" opacity={0.16}/>
      <circle cx={1390} cy={78} r={44} fill="#ffe570" opacity={0.48}/>
      <circle cx={1390} cy={78} r={30} fill="#ffd030" opacity={0.85}/>
    </g>
  );
}

// ─── Moon ────────────────────────────────────────────────────────────────────

function Moon({ state, phase, waxing }: { state: SkyState; phase: number; waxing: boolean }) {
  if (state==="day"||state==="sunset") return null;
  const cx=1360, cy=72, r=26;
  const lit = phase<=.5 ? phase*2 : (1-phase)*2;
  const off = waxing ? -(r-r*lit) : r-r*lit;
  const bg  = state==="night" ? "#080f22" : "#131a38";
  return (
    <g>
      <circle cx={cx} cy={cy} r={r+20} fill="#e9edf3" opacity={state==="night"?.18:.09}/>
      <circle cx={cx} cy={cy} r={r}    fill="#e9edf3" opacity={0.88}/>
      {phase>.04&&phase<.96&&(
        <>
          <defs><clipPath id="mc"><circle cx={cx} cy={cy} r={r}/></clipPath></defs>
          <circle cx={cx+off} cy={cy} r={r} fill={bg} clipPath="url(#mc)" opacity={0.95}/>
        </>
      )}
      {(phase<=.04||phase>=.96)&&
        <circle cx={cx} cy={cy} r={r} fill={bg} opacity={0.92}/>}
    </g>
  );
}

// ─── Mountains ───────────────────────────────────────────────────────────────

function Mountains({ state }: { state: SkyState }) {
  const cols: Record<SkyState,[string,string,number]> = {
    day:    ["#7aabb8","#4a7a90",0.65],
    sunset: ["#4a3565","#2e2050",0.75],
    dusk:   ["#252c58","#18203a",0.80],
    night:  ["#111d32","#0c1625",0.85],
  };
  const [c1,c2,op] = cols[state];
  // Three ridges — farther is lighter/smaller
  const r1 = "M0 188 L90 170 L200 154 L320 138 L460 122 L600 113 L740 108 L880 112 L1020 121 L1160 133 L1300 146 L1440 158 L1600 167 L1600 218 L0 218 Z";
  const r2 = "M0 210 L180 203 L380 196 L580 191 L780 189 L980 193 L1180 199 L1400 206 L1600 210 L1600 248 L0 248 Z";
  const r3 = "M0 238 L250 233 L550 228 L850 226 L1150 229 L1400 234 L1600 237 L1600 262 L0 262 Z";
  return (
    <g>
      <path d={r1} fill={c1} opacity={op*.5}/>
      <path d={r2} fill={c1} opacity={op*.75}/>
      <path d={r3} fill={c2} opacity={op*.85}/>
    </g>
  );
}

// ─── Far shore treeline ───────────────────────────────────────────────────────

function FarTrees({ state }: { state: SkyState }) {
  const f = state==="day" ? "#1a2e16" : state==="sunset" ? "#1a1e2e" : "#0e1620";
  const op = state==="day" ? 0.42 : 0.52;
  const d = "M0 260 Q120 252 260 256 Q420 248 600 253 Q780 246 960 250 Q1120 244 1300 248 Q1460 242 1600 245 L1600 270 L0 270 Z";
  return <path d={d} fill={f} opacity={op}/>;
}

// ─── Cliff — ONLY the elevated headland (narrow top + face strip) ─────────────
// Rendered BEFORE water so the water layer paints over the cliff base,
// making the lower-left read as water, not land.

function Cliff({ state }: { state: SkyState }) {
  const light = state==="day"||state==="sunset";
  const topFill = light ? CLIFF_TOP : "#756040";

  // Plateau top surface — thin, wedge-shaped
  // stays at roughly y=148–165 across x=0–390
  const plateau = [
    "M0 0",
    "L0 162",
    "Q55 155 130 152",
    "Q230 148 330 153",
    "Q368 157 390 168",
    "L380 160",
    "Q345 150 230 146",
    "Q130 143 55 147",
    "Q20 150 0 155",
    "Z",
  ].join(" ");

  // Cliff face — narrow diagonal strip (right side of headland)
  const face = [
    "M370 157",
    "Q390 205 400 248",
    "Q408 268 418 283",
    "L407 289",
    "Q395 272 386 250",
    "Q373 208 353 160",
    "Z",
  ].join(" ");

  // Small rocky ledges on the face
  return (
    <g>
      <path d={plateau} fill={topFill} opacity={0.94}/>
      <path d={face}    fill={CLIFF_FACE} opacity={0.9}/>
      {/* Rock texture on face */}
      <ellipse cx={378} cy={195} rx={8}  ry={5}  fill={CLIFF_ROCK} opacity={0.5}/>
      <ellipse cx={387} cy={228} rx={7}  ry={4}  fill={CLIFF_ROCK} opacity={0.42}/>
      <ellipse cx={395} cy={258} rx={6}  ry={4}  fill={CLIFF_ROCK} opacity={0.38}/>
      {/* Mossy patches */}
      <ellipse cx={374} cy={208} rx={6}  ry={4}  fill="#3a5030" opacity={0.45}/>
      <ellipse cx={382} cy={240} rx={5}  ry={3}  fill="#3a5030" opacity={0.38}/>
    </g>
  );
}

// ─── Hood Canal water ─────────────────────────────────────────────────────────
// Rendered AFTER cliff so water covers the cliff base — lower-left reads as water.

function Water({ state }: { state: SkyState }) {
  const W: Record<SkyState,{deep:string;shal:string;shim:string}> = {
    day:    {deep:"#2e5268", shal:"#4a8090", shim:"#fff9ee"},
    sunset: {deep:"#2a1e42", shal:"#5a4068", shim:"#f0a040"},
    dusk:   {deep:"#0e1628", shal:"#2a3558", shim:"#5868a0"},
    night:  {deep:"#080e1a", shal:"#142030", shim:"#e9edf3"},
  };
  const c = W[state];
  return (
    <g>
      {/* Deep base — full width, starts below the cliff's plateau */}
      <rect x={0} y={275} width={1600} height={285} fill={c.deep}/>
      {/* Shallow near-shore band */}
      <path d="M0 275 Q350 268 700 272 Q1050 267 1400 270 Q1520 268 1600 269 L1600 320 L0 320 Z"
        fill={c.shal} opacity={0.65}/>
      {/* Surface edge line */}
      <path d="M0 275 Q350 268 700 272 Q1050 267 1400 270 Q1520 268 1600 269"
        stroke={c.shim} strokeWidth="1.8" fill="none" opacity={0.28}/>
      {/* Ripples */}
      <g stroke={c.shim} strokeWidth="1.2" fill="none" opacity={0.13}>
        <path d="M0 295 Q400 290 800 294 Q1200 289 1600 292"/>
        <path d="M0 315 Q400 311 800 315 Q1200 310 1600 313"/>
        <path d="M50 338 Q450 334 850 338 Q1250 333 1600 336"/>
        <path d="M0 362 Q450 358 900 362 Q1350 357 1600 360"/>
        <path d="M50 390 Q500 386 950 390 Q1350 385 1600 388"/>
        <path d="M0 420 Q500 416 1000 420 Q1350 415 1600 418"/>
        <path d="M0 452 Q500 448 1000 452 Q1400 447 1600 450"/>
        <path d="M80 486 Q600 482 1100 486 Q1400 481 1600 484"/>
        <path d="M0 520 Q600 516 1100 520 Q1400 515 1600 518"/>
      </g>
      {/* Shimmer sweep */}
      <defs>
        <linearGradient id="wshim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor={c.shim} stopOpacity="0"/>
          <stop offset="40%"  stopColor={c.shim} stopOpacity="0.09"/>
          <stop offset="60%"  stopColor={c.shim} stopOpacity="0.13"/>
          <stop offset="100%" stopColor={c.shim} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <rect x={0} y={275} width={1600} height={120} fill="url(#wshim)" className="tide-shimmer"/>
    </g>
  );
}

// ─── Submerged near-shore ─────────────────────────────────────────────────────

function SubZone({ state }: { state: SkyState }) {
  const tint = state==="night"?"#0e1a30":state==="dusk"?"#1e2a50":"#3a6070";
  return (
    <g>
      <ellipse cx={450} cy={292} rx={9}  ry={4} fill="#4a3a2c" opacity={0.2}/>
      <ellipse cx={530} cy={300} rx={7}  ry={3} fill="#3a2e22" opacity={0.16}/>
      <path d="M420 288 Q460 284 500 288" stroke="#5a4a38" strokeWidth="1.1" fill="none" opacity={0.22}/>
      <path d="M550 296 Q600 292 650 296" stroke="#4a3a2c" strokeWidth="0.9" fill="none" opacity={0.18}/>
      <path d="M390 272 Q700 264 1000 268 Q1300 264 1600 266 L1600 310 Q1300 308 1000 312 Q700 308 390 312 Z"
        fill={tint} opacity={0.22}/>
    </g>
  );
}

// ─── Beach — narrow strip, runs wall to wall ──────────────────────────────────

function Beach() {
  return (
    <g>
      {/* Dry pebble beach */}
      <path d="M390 259 Q650 253 950 257 Q1200 252 1450 255 Q1540 253 1600 254 L1600 278 Q1540 277 1450 277 Q1200 274 950 275 Q650 273 390 275 Z"
        fill={BEACH_DRY} opacity={0.88}/>
      {/* Wet tide zone */}
      <path d="M390 273 Q700 270 1050 273 Q1350 269 1600 271 L1600 280 Q1350 278 1050 280 Q700 278 390 280 Z"
        fill={BEACH_WET} opacity={0.82}/>
      {/* Pebbles */}
      <g fill="#7a6848" opacity={0.5}>
        {([
          [430,268],[480,271],[535,268],[600,266],[680,268],[770,265],
          [860,267],[970,264],[1080,266],[1200,263],[1330,265],[1460,262],
          [1560,264],
        ] as [number,number][]).map(([px,py],i) => (
          <ellipse key={i} cx={px} cy={py} rx={i%3===0?3.5:2.5} ry={i%3===0?2:1.5}/>
        ))}
      </g>
      {/* Larger rocks near cliff foot */}
      <ellipse cx={415} cy={273} rx={10} ry={6} fill="#5a4a38" opacity={0.7}/>
      <ellipse cx={438} cy={276} rx={8}  ry={5} fill="#4a3c2c" opacity={0.62}/>
      <ellipse cx={458} cy={271} rx={6}  ry={4} fill="#6a5a48" opacity={0.65}/>
      {/* Driftwood */}
      <path d="M740 264 Q795 260 845 263" stroke="#5a4832" strokeWidth="3" fill="none" strokeLinecap="round" opacity={0.75}/>
      <path d="M1120 260 Q1160 257 1195 260" stroke="#4e4028" strokeWidth="2.2" fill="none" strokeLinecap="round" opacity={0.65}/>
      <path d="M1010 266 Q1040 264 1065 266" stroke="#5a4832" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity={0.6}/>
      {/* Seaweed */}
      <path d="M610 273 Q640 271 670 273" stroke="#2a4a22" strokeWidth="1.2" fill="none" opacity={0.48}/>
    </g>
  );
}

// ─── Cabin ────────────────────────────────────────────────────────────────────

function Cabin({ state }: { state: SkyState }) {
  const dark = state==="night"||state==="dusk";
  const wall = dark ? "#c8c4ba" : "#f4efe5";
  const win  = dark ? "#e7a54a" : "#ffe8a0";
  return (
    <g>
      {dark && <circle cx={162} cy={188} r={16} fill="#e7a54a" opacity={0.28} className="cabin-glow"/>}
      <path d="M135 208 L135 184 L162 167 L189 184 L189 208 Z" fill={wall} stroke="#5f3a24" strokeWidth="2"/>
      <path d="M130 184 L162 165 L194 184 Z" fill="#5f3a24" stroke="#5f3a24" strokeWidth="1.5"/>
      <rect x="156" y="188" width="12" height="14" fill={win} stroke="#5f3a24" strokeWidth="1.2"
        className={dark?"cabin-glow":""}/>
      <line x1="156" y1="195" x2="168" y2="195" stroke="#5f3a24" strokeWidth="0.9"/>
      <line x1="162" y1="188" x2="162" y2="202" stroke="#5f3a24" strokeWidth="0.9"/>
    </g>
  );
}

// ─── Staircase ────────────────────────────────────────────────────────────────

function Staircase() {
  // Two short flights (with landings) → long descent to beach
  return (
    <g>
      <path d="M189 207 L196 223 L222 223 L229 240 L254 240 L330 276"
        stroke="#8a5a36" strokeWidth="1.9" strokeDasharray="5 4"
        strokeLinejoin="round" strokeLinecap="round" fill="none" opacity={0.72}/>
      <rect x="320" y="273" width="18" height="7" rx="2" fill="#7a6850" opacity={0.55}/>
    </g>
  );
}

// ─── Dense green vegetation ───────────────────────────────────────────────────

function Vegetation() {
  return (
    <g>
      {/* ── Background fir forest ── */}
      <Fir x={68}  y={148} h={94}  fill={FIR_DARK} op={0.9}/>
      <Fir x={106} y={137} h={110} fill="#1e3f22"  op={0.95}/>
      <Fir x={44}  y={154} h={74}  fill={FIR_DARK} op={0.88}/>
      <Fir x={144} y={141} h={98}  fill="#1e3f22"  op={0.92}/>
      <Fir x={192} y={147} h={88}  fill={FIR_MID}  op={0.88}/>
      <Fir x={238} y={152} h={78}  fill={FIR_DARK} op={0.84}/>
      <Fir x={284} y={157} h={66}  fill="#1e3f22"  op={0.82}/>
      <Fir x={316} y={162} h={56}  fill={FIR_MID}  op={0.80}/>

      {/* ── Cedars ── */}
      <Cedar x={26}  y={152} h={82}  op={0.88}/>
      <Cedar x={170} y={149} h={74}  op={0.82}/>
      <Cedar x={308} y={160} h={58}  op={0.78}/>
      <Cedar x={348} y={166} h={48}  op={0.74}/>

      {/* ── Cliff-edge trees (foreground) ── */}
      <Fir x={336} y={170} h={54} fill={FIR_LITE} op={0.9}/>
      <Fir x={363} y={177} h={42} fill={FIR_MID}  op={0.85}/>

      {/* ── Cliff face plants ── */}
      <Salal  x={358} y={210} r={12} op={0.8}/>
      <Salal  x={372} y={236} r={10} op={0.74}/>
      <Salal  x={381} y={260} r={9}  op={0.68}/>
      <Bramble x={346} y={196} w={30} h={18}/>
      <Bramble x={362} y={232} w={22} h={14}/>
      <Fern   x={354} y={205} s={0.7}/>
      <Fern   x={376} y={250} s={0.6}/>
      <Grass  x={384} y={270} h={14}/>
      <Grass  x={399} y={273} h={12}/>

      {/* ── Beach edge (dense, in front of cliff) ── */}
      <Bramble x={388} y={270} w={52} h={20}/>
      <Salal   x={440} y={268} r={10} op={0.74}/>
      <Grass   x={460} y={271} h={14}/>
      <Grass   x={478} y={270} h={16}/>
      <Fern    x={498} y={268} s={0.64}/>
      <Salal   x={526} y={266} r={9}  op={0.68}/>
      <Bramble x={546} y={266} w={46} h={18}/>
      <Grass   x={612} y={267} h={13}/>
      <Salal   x={656} y={264} r={11} op={0.62}/>
      <Fern    x={694} y={265} s={0.58}/>
      <Bramble x={724} y={264} w={38} h={15}/>
      <Grass   x={784} y={266} h={12}/>
      <Salal   x={834} y={262} r={9}  op={0.58}/>

      {/* ── Viewer-edge foreground (left margin) ── */}
      <Fir    x={0}   y={200} h={52} fill={FIR_DARK} op={0.94}/>
      <Fern   x={-4}  y={228} s={0.78}/>
      <Salal  x={12}  y={238} r={14} op={0.84}/>
      <Bramble x={-4} y={248} w={28} h={20}/>
    </g>
  );
}

// ─── Wildlife ─────────────────────────────────────────────────────────────────

function Wildlife({ state }: { state: SkyState }) {
  const col = state==="day" ? "#2e5060" : "#1a3040";
  return (
    <g opacity={0.58}>
      {/* Small orca pod */}
      <g transform="translate(870,332)" fill={col}>
        <path d="M0 0 Q8-8 16 0 Q8 4 0 0 Z"/>
        <path d="M10-4 L14-14 L17-11 Z"/>
        <path d="M28 1 Q36-7 44 1 Q36 5 28 1 Z"/>
        <path d="M38-3 L42-12 L45-9 Z"/>
      </g>
      {/* Harbor seal */}
      <ellipse cx={665} cy={292} rx={10} ry={4.5} fill={col} opacity={0.48}/>
      <ellipse cx={668} cy={290} rx={4.5} ry={3.5} fill={col} opacity={0.48}/>
      {/* Seabirds */}
      <path d="M1040 298 Q1047 293 1054 298" stroke={col} strokeWidth="1.6" fill="none" opacity={0.68}/>
      <path d="M1155 310 Q1161 305 1167 310" stroke={col} strokeWidth="1.4" fill="none" opacity={0.58}/>
      <path d="M1270 290 Q1275 286 1280 290" stroke={col} strokeWidth="1.3" fill="none" opacity={0.52}/>
      {/* Wake */}
      <path d="M850 334 Q870 331 890 334" stroke="#5a8898" strokeWidth="0.9" fill="none" opacity={0.32}/>
    </g>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function HoodCanalScene({ className = "" }: { className?: string }) {
  const state   = getSkyState();
  const lunar   = getLunarPhase();
  const showStars = state==="night"||state==="dusk";
  const SKY: Record<SkyState,[string,string,string]> = {
    day:    ["#5fa8d3","#8fc8e8","#c0def5"],
    sunset: ["#1e2a5e","#b04a30","#f0a040"],
    dusk:   ["#131a38","#3a4278","#7a6090"],
    night:  ["#080f22","#111b3e","#192a4c"],
  };
  const [gT,gM,gB] = SKY[state];

  return (
    <svg
      viewBox="0 0 1600 560"
      preserveAspectRatio="xMinYMax slice"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={gT}/>
          <stop offset="55%"  stopColor={gM}/>
          <stop offset="100%" stopColor={gB}/>
        </linearGradient>
      </defs>

      {/* 1. Sky */}
      <rect x="0" y="0" width="1600" height="560" fill="url(#sky)"/>

      {/* 2. Stars */}
      {showStars && <Stars op={state==="night"?.9:.45}/>}

      {/* 3. Celestial body */}
      <Sun state={state}/>
      <Moon state={state} phase={lunar.phase} waxing={lunar.waxing}/>

      {/* 4. Mountains */}
      <Mountains state={state}/>

      {/* 5. Far shore treeline */}
      <FarTrees state={state}/>

      {/* 6. CLIFF — rendered BEFORE water so water covers the cliff base */}
      <Cliff state={state}/>

      {/* 7. Water — paints over the cliff's lower portion, reads as submerged */}
      <Water state={state}/>

      {/* 8. Submerged zone (near-shore tint) */}
      <SubZone state={state}/>

      {/* 9. Beach */}
      <Beach/>

      {/* 10. Dense green vegetation */}
      <Vegetation/>

      {/* 11. Cabin */}
      <Cabin state={state}/>

      {/* 12. Staircase */}
      <Staircase/>

      {/* 13. Wildlife */}
      <Wildlife state={state}/>
    </svg>
  );
}
