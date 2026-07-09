/**
 * Fine-line SVG illustrations for the Hood Canal / low tide / moonlight motif.
 * Everything is stroke-based line work — no fills, no clip art.
 */

/** The hero scene: moon over the canal at minus tide, tide lines below. */
export function MoonlitShore({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 340"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      {/* moon with a soft halo — kept near center-right so cover-cropping never clips it */}
      <circle cx="540" cy="86" r="38" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="540" cy="86" r="54" stroke="currentColor" strokeWidth="0.75" opacity="0.4" />
      <circle cx="540" cy="86" r="70" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      {/* moon craters, faint */}
      <circle cx="528" cy="75" r="6" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
      <circle cx="550" cy="96" r="4.5" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
      {/* far shore of the canal */}
      <path
        d="M0 176 Q 140 160 300 172 T 560 170 T 800 164"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      {/* moonlight path on the water, directly below the moon */}
      <path d="M522 176 L 558 176" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
      <path d="M514 188 L 568 188" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M520 200 L 562 200" stroke="currentColor" strokeWidth="1" opacity="0.45" />
      <path d="M510 213 L 574 213" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
      {/* receding tide lines on wet sand */}
      <path
        d="M0 228 Q 200 216 420 226 T 800 222"
        stroke="currentColor"
        strokeWidth="0.9"
        opacity="0.55"
      />
      <path
        d="M0 262 Q 240 250 460 260 T 800 254"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <path
        d="M0 296 Q 220 286 480 294 T 800 290"
        stroke="currentColor"
        strokeWidth="0.7"
        opacity="0.28"
      />
      {/* sand dollar resting on the flats */}
      <g transform="translate(180 268)" opacity="0.75">
        <ellipse cx="0" cy="0" rx="26" ry="22" stroke="currentColor" strokeWidth="1" />
        <path d="M0 -14 L 0 -3 M0 -3 L -9 8 M0 -3 L 9 8 M-11 -6 L -3 -1 M11 -6 L 3 -1" stroke="currentColor" strokeWidth="0.9" />
      </g>
      {/* oyster shells */}
      <g transform="translate(340 292)" opacity="0.6">
        <path d="M-16 4 Q -14 -10 0 -12 Q 15 -10 17 3 Q 8 9 0 8 Q -8 9 -16 4 Z" stroke="currentColor" strokeWidth="0.9" />
        <path d="M-11 1 Q 0 -7 12 0" stroke="currentColor" strokeWidth="0.6" />
      </g>
      <g transform="translate(520 300) rotate(14)" opacity="0.5">
        <path d="M-13 3 Q -11 -8 0 -10 Q 12 -8 14 2 Q 6 7 0 6 Q -6 7 -13 3 Z" stroke="currentColor" strokeWidth="0.8" />
      </g>
      {/* little crab near the tide line */}
      <g transform="translate(680 276)" opacity="0.65">
        <ellipse cx="0" cy="0" rx="13" ry="8" stroke="currentColor" strokeWidth="0.9" />
        <path d="M-11 -4 Q -18 -12 -13 -16 M11 -4 Q 18 -12 13 -16" stroke="currentColor" strokeWidth="0.9" />
        <path d="M-12 4 L -19 8 M-9 7 L -14 12 M12 4 L 19 8 M9 7 L 14 12" stroke="currentColor" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

/** Small inline sand dollar, used as a decorative divider mark. */
export function SandDollar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" className={className}>
      <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M20 8 L 20 17 M20 17 L 12 27 M20 17 L 28 27 M9.5 13.5 L 17 16 M30.5 13.5 L 23 16"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="20" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** A single tide line, used as a section divider. */
export function TideLine({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 8" fill="none" className="h-2 w-28 text-driftwood/50">
        <path d="M0 4 Q 15 0 30 4 T 60 4 T 90 4 T 120 4" stroke="currentColor" strokeWidth="1" />
      </svg>
      <SandDollar className="h-5 w-5 text-driftwood/70" />
      <svg viewBox="0 0 120 8" fill="none" className="h-2 w-28 text-driftwood/50">
        <path d="M0 4 Q 15 8 30 4 T 60 4 T 90 4 T 120 4" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}

/** Gibbous moon for weather/tide cards. */
export function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.3" />
      <path d="M12 5.8 A 11 11 0 0 1 12 26.2 A 14 14 0 0 0 12 5.8 Z" fill="currentColor" opacity="0.25" />
      <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <circle cx="21" cy="19" r="1.4" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
    </svg>
  );
}

/** Fine-line geoduck for the shellfish section. */
export function GeoduckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 32" fill="none" aria-hidden="true" className={className}>
      {/* shell */}
      <ellipse cx="13" cy="21" rx="10" ry="7.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 18 Q 13 14 21 18" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      {/* the famous siphon */}
      <path
        d="M21 18 Q 28 14 31 9 Q 32.5 6.5 35 6"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M22 21 Q 30 17 33 11 Q 34.5 8.5 36.5 8.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M35 6 Q 37 6.6 36.5 8.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Standalone crab for the crabbing section. */
export function CrabIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 28" fill="none" aria-hidden="true" className={className}>
      <ellipse cx="20" cy="15" rx="11" ry="7" stroke="currentColor" strokeWidth="1.2" />
      <path d="M11 11 Q 5 4 9 1 M29 11 Q 35 4 31 1" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9 1 Q 11 3 9.5 5 M31 1 Q 29 3 30.5 5" stroke="currentColor" strokeWidth="1" />
      <path d="M10 18 L 4 21 M12 21 L 8 25 M30 18 L 36 21 M28 21 L 32 25" stroke="currentColor" strokeWidth="1" />
      <circle cx="16.5" cy="12.5" r="0.9" fill="currentColor" />
      <circle cx="23.5" cy="12.5" r="0.9" fill="currentColor" />
    </svg>
  );
}

/** Cedar sprig for yard work & resources. */
export function CedarSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 32" fill="none" aria-hidden="true" className={className}>
      <path d="M6 28 Q 16 18 30 6" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M12 22 Q 10 18 6 17 M12 22 Q 16 20 17 16 M17 17.5 Q 15 13.5 11 12.5 M17 17.5 Q 21 15.5 22 11.5 M22 13 Q 20 9 16 8 M22 13 Q 26 11 27 7 M26 9 Q 25 6 22 5"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.8"
      />
    </svg>
  );
}

/** Tiny lantern for the header wordmark. */
export function Lantern({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" fill="none" aria-hidden="true" className={className}>
      <path d="M8 6 Q 12 1 16 6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="6.5" y="6" width="11" height="16" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 22 L 9 26 M15 22 L 15 26 M7 26 L 17 26" stroke="currentColor" strokeWidth="1.4" />
      {/* the flame */}
      <path d="M12 11 Q 14.5 14.5 12 17.5 Q 9.5 14.5 12 11 Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
