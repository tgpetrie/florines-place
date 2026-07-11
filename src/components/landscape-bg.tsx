"use client";

/**
 * LandscapeBackground — sky and terrain backdrop for the homepage hero.
 *
 * Layers (back to front):
 *   1. Sky gradient (CSS div — changes by state, fills full hero)
 *   2. Stars (CSS, upper portion, night/dusk only)
 *   3. Sun or moon (absolutely-positioned CSS — stays in sky on all screen sizes)
 *   4. Distant Olympic Peninsula mountain silhouette (SVG strip above CabinScene)
 *
 * CabinScene (cabin + trees + Hood Canal water) sits on top at z-10.
 * Hero text sits at z-20.
 */

import { getSkyState, getLunarPhase } from "@/lib/sky-state";
import type { SkyState } from "@/lib/sky-state";

// ---------------------------------------------------------------------------
// Sky palettes
// ---------------------------------------------------------------------------

const SKY: Record<SkyState, { top: string; mid: string; bottom: string }> = {
  day:    { top: "#5fa8d3", mid: "#8fc8e8", bottom: "#bde0f5" },
  sunset: { top: "#1e2a5e", mid: "#b04a30", bottom: "#f0a040" },
  dusk:   { top: "#131a38", mid: "#3a4278", bottom: "#7a6090" },
  night:  { top: "#080f22", mid: "#111b3e", bottom: "#192a4c" },
};

// ---------------------------------------------------------------------------
// Stars — CSS dots scattered in the upper sky region
// ---------------------------------------------------------------------------

const STAR_POSITIONS = [
  [6, 8], [14, 22], [22, 5], [31, 15], [39, 28], [47, 9], [55, 18],
  [63, 6], [70, 24], [78, 12], [84, 30], [91, 7], [96, 20],
  [10, 38], [24, 42], [38, 35], [52, 45], [66, 38], [80, 44], [93, 36],
  [18, 55], [34, 58], [50, 52], [68, 56], [85, 50],
] as [number, number][];

function StarField() {
  return (
    <div className="absolute inset-x-0 top-0" style={{ bottom: "35%" }}>
      {STAR_POSITIONS.map(([x, y], i) => (
        <div
          key={i}
          className="absolute rounded-full bg-moon"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: i % 3 === 0 ? 2 : 1.5,
            height: i % 3 === 0 ? 2 : 1.5,
            opacity: 0.4 + (i % 5) * 0.1,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sun — CSS circle, positioned in the sky area
// ---------------------------------------------------------------------------

function Sun({ state }: { state: SkyState }) {
  if (state === "night" || state === "dusk") return null;

  const isSunset = state === "sunset";

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        top: isSunset ? "55%" : "14%",
        right: isSunset ? "auto" : "18%",
        left: isSunset ? "14%" : "auto",
        width: isSunset ? 72 : 56,
        height: isSunset ? 72 : 56,
      }}
    >
      {/* Outer glow */}
      <div
        className="absolute rounded-full"
        style={{
          inset: -20,
          background: isSunset
            ? "radial-gradient(circle, rgba(240,140,40,0.35) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(255,220,60,0.35) 0%, transparent 70%)",
        }}
      />
      {/* Sun disc */}
      <div
        className="h-full w-full rounded-full"
        style={{
          background: isSunset ? "#f08030" : "#ffd040",
          opacity: isSunset ? 0.9 : 0.85,
          boxShadow: isSunset
            ? "0 0 24px 8px rgba(240,140,40,0.4)"
            : "0 0 20px 6px rgba(255,220,60,0.35)",
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Moon — CSS circle with phase mask, positioned in sky
// ---------------------------------------------------------------------------

function Moon({ state, phase, waxing }: { state: SkyState; phase: number; waxing: boolean }) {
  if (state === "day" || state === "sunset") return null;

  const r = 22;
  const diameter = r * 2;
  // How much of the lit side to show (0 = new, 1 = full)
  const lit = phase <= 0.5 ? phase * 2 : (1 - phase) * 2;
  // Shadow offset: negative pushes shadow right (waxing crescent shows left edge lit)
  const shadowOffset = waxing ? -(r - r * lit) : r - r * lit;

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        top: "14%",
        right: "18%",
        width: diameter,
        height: diameter,
      }}
    >
      {/* Glow */}
      <div
        className="absolute rounded-full"
        style={{
          inset: -14,
          background: "radial-gradient(circle, rgba(233,237,243,0.25) 0%, transparent 70%)",
        }}
      />
      {/* Lit disc */}
      <div
        className="relative h-full w-full overflow-hidden rounded-full"
        style={{ background: "#e9edf3", opacity: 0.88 }}
      >
        {/* Shadow that carves the phase */}
        {phase > 0.03 && phase < 0.97 && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: state === "night" ? "#090f22" : "#131a38",
              transform: `translateX(${shadowOffset}px)`,
              opacity: 0.95,
            }}
          />
        )}
        {/* New moon — completely dark */}
        {(phase <= 0.03 || phase >= 0.97) && (
          <div className="absolute inset-0 rounded-full" style={{ background: "#090f22", opacity: 0.95 }} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mountain silhouette — Olympic Peninsula, sits above the CabinScene strip
// ---------------------------------------------------------------------------

function MountainSilhouettes({ state }: { state: SkyState; className?: string }) {
  const fill: Record<SkyState, string> = {
    day: "#6a9db5",
    sunset: "#4a3565",
    dusk: "#252c58",
    night: "#111d32",
  };
  const opacity: Record<SkyState, number> = {
    day: 0.7,
    sunset: 0.8,
    dusk: 0.85,
    night: 0.9,
  };

  // Farther ridge — taller peaks (Olympic Peninsula feel)
  const ridge1 = "M0 55 L70 46 L160 34 L250 22 L340 14 L440 9 L530 6 L620 4 L710 8 L800 16 L890 25 L980 35 L1070 44 L1150 50 L1200 54 L1200 80 L0 80 Z";
  // Nearer ridge — lower, rounder
  const ridge2 = "M0 65 L90 60 L190 54 L290 48 L390 52 L490 46 L590 44 L690 50 L790 56 L890 60 L990 62 L1100 64 L1200 66 L1200 80 L0 80 Z";

  return (
    <svg
      viewBox="0 0 1200 80"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      aria-hidden="true"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <path d={ridge1} fill={fill[state]} opacity={opacity[state] * 0.65} />
      <path d={ridge2} fill={fill[state]} opacity={opacity[state]} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function LandscapeBackground({
  className = "",
  sky = "day",
}: {
  className?: string;
  /**
   * Which sky to render. Defaults to a fixed bright "day" so the welcome hero
   * looks the same at any hour. Pass "auto" to bring back the time-of-day
   * behaviour (day → sunset → dusk → night from the local clock), or pin any
   * specific state.
   */
  sky?: SkyState | "auto";
}) {
  const state: SkyState = sky === "auto" ? getSkyState() : sky;
  const lunar = getLunarPhase();
  const pal = SKY[state];
  const showStars = state === "night" || state === "dusk";

  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      style={{
        background: `linear-gradient(to bottom, ${pal.top} 0%, ${pal.mid} 55%, ${pal.bottom} 100%)`,
      }}
    >
      {/* Stars — upper sky only */}
      {showStars && (
        <div style={{ opacity: state === "night" ? 0.9 : 0.45 }}>
          <StarField />
        </div>
      )}

      {/* Sun or Moon — absolutely placed in sky, works at any viewport width */}
      <Sun state={state} />
      <Moon state={state} phase={lunar.phase} waxing={lunar.waxing} />

      {/* Mountain silhouettes — anchored just above the CabinScene strip.
          CabinScene is h-44 (176px) mobile, h-52 (208px) sm+.
          Mountains sit in a band that starts at the top of the CabinScene
          and extends upward by clamp(60px, 14vw, 120px). */}
      <div
        className="absolute inset-x-0 bottom-44 sm:bottom-52"
        style={{ height: "clamp(60px, 14vw, 120px)" }}
      >
        <MountainSilhouettes state={state} />
      </div>
    </div>
  );
}
