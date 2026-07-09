/**
 * Minimal fine-line icons for guide topics, keyed by GuideTopic["icon"].
 * Same stroke-only language as shore-art.tsx.
 */
import { Lantern, SandDollar } from "@/components/shore-art";
import type { GuideTopic } from "@/lib/types";

function Stroke({ children, viewBox = "0 0 32 32", className = "" }: { children: React.ReactNode; viewBox?: string; className?: string }) {
  return (
    <svg viewBox={viewBox} fill="none" aria-hidden="true" className={className} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export function GuideIcon({ name, className = "h-7 w-7" }: { name: GuideTopic["icon"]; className?: string }) {
  switch (name) {
    case "water":
      return (
        <Stroke className={className}>
          <path d="M16 4 Q 24 14 24 20 A 8 8 0 1 1 8 20 Q 8 14 16 4 Z" />
          <path d="M12.5 20.5 Q 12.5 24 15.5 25" opacity="0.6" />
        </Stroke>
      );
    case "flame":
      return (
        <Stroke className={className}>
          <path d="M16 4 Q 22 11 19 15 Q 24 14 24 21 A 8 7 0 1 1 8 21 Q 8 15 13 11 Q 12 8 16 4 Z" />
          <path d="M16 19 Q 19 22 16 25 Q 13 22 16 19 Z" opacity="0.7" />
        </Stroke>
      );
    case "bed":
      return (
        <Stroke className={className}>
          <path d="M4 24 L 4 10 M4 20 L 28 20 L 28 24 M4 16 L 28 16 L 28 20" />
          <path d="M7 16 Q 7 12 11 12 Q 15 12 15 16" opacity="0.7" />
        </Stroke>
      );
    case "signal":
      return (
        <Stroke className={className}>
          <path d="M8 18 Q 16 11 24 18 M11.5 22 Q 16 18 20.5 22" />
          <circle cx="16" cy="26" r="1.2" fill="currentColor" />
        </Stroke>
      );
    case "grill":
      return (
        <Stroke className={className}>
          <path d="M7 12 L 25 12 A 9 8 0 0 1 7 12 Z M12 20 L 9 28 M20 20 L 23 28 M16 21 L 16 25" />
          <path d="M13 8 Q 12 6 13 4 M19 8 Q 18 6 19 4" opacity="0.6" />
        </Stroke>
      );
    case "broom":
      return (
        <Stroke className={className}>
          <path d="M22 4 L 14 16 M14 16 Q 8 18 6 26 Q 14 27 18 22 Q 20 19 14 16 Z" />
          <path d="M9 22 L 12 24 M11 19.5 L 14 21.5" opacity="0.6" />
        </Stroke>
      );
    case "trash":
      return (
        <Stroke className={className}>
          <path d="M8 10 L 24 10 L 22.5 27 L 9.5 27 Z M6 10 L 26 10 M12 10 L 12.5 6.5 L 19.5 6.5 L 20 10" />
          <path d="M13 14 L 13.4 23 M19 14 L 18.6 23" opacity="0.6" />
        </Stroke>
      );
    case "supplies":
      return (
        <Stroke className={className}>
          <path d="M5 13 L 16 7 L 27 13 L 27 26 L 5 26 Z M5 13 L 16 18 L 27 13 M16 18 L 16 26" />
        </Stroke>
      );
    case "emergency":
      return (
        <Stroke className={className}>
          <path d="M16 4 L 27 9 L 27 17 Q 27 25 16 29 Q 5 25 5 17 L 5 9 Z" />
          <path d="M16 11 L 16 19 M12 15 L 20 15" />
        </Stroke>
      );
    case "lantern":
      return <Lantern className={className} />;
    case "shore":
      return <SandDollar className={className} />;
  }
}
