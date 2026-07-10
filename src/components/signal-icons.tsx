/**
 * Small line icons for Place Signal motifs. One motif per signal — no sticker
 * sheets. Reuses the shore-art icons where they already exist; the rest are
 * simple strokes drawn to the same fine-line language.
 */
import { CrabIcon, GeoduckIcon, MoonIcon, SandDollar, CedarSprig, Lantern } from "@/components/shore-art";
import type { SignalMotif } from "@/lib/types";

function S({ children, vb = "0 0 32 32", className = "" }: { children: React.ReactNode; vb?: string; className?: string }) {
  return (
    <svg viewBox={vb} fill="none" aria-hidden="true" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

export function SignalIcon({ motif, className = "h-5 w-5" }: { motif: SignalMotif; className?: string }) {
  switch (motif) {
    case "crab":
      return <CrabIcon className={className} />;
    case "geoduck":
      return <GeoduckIcon className={className} />;
    case "moon":
      return <MoonIcon className={className} />;
    case "sanddollar":
      return <SandDollar className={className} />;
    case "cedar":
      return <CedarSprig className={className} />;
    case "lantern":
      return <Lantern className={className} />;
    case "oyster":
      return (
        <S className={className}>
          <path d="M6 20 Q 7 8 16 7 Q 25 8 26 19 Q 16 25 6 20 Z" />
          <path d="M10 18 Q 16 12 22 17" opacity="0.6" />
        </S>
      );
    case "blackberry":
      return (
        <S className={className}>
          <circle cx="13" cy="17" r="3" />
          <circle cx="19" cy="17" r="3" />
          <circle cx="16" cy="22" r="3" />
          <path d="M16 14 Q 18 8 24 7" />
          <path d="M22 6 L 25 6 L 24 9" opacity="0.7" />
        </S>
      );
    case "flame":
      return (
        <S className={className}>
          <path d="M16 4 Q 23 12 19 17 Q 24 16 23 22 A 7 7 0 1 1 9 22 Q 8 16 13 12 Q 12 8 16 4 Z" />
        </S>
      );
    case "woodstove":
      return (
        <S className={className}>
          <rect x="7" y="8" width="18" height="16" rx="2" />
          <path d="M10 20 L 22 20 M13 8 L 13 3 M19 8 L 19 3" opacity="0.7" />
          <path d="M12 14 Q 16 11 20 14" />
        </S>
      );
    case "firewood":
      return (
        <S className={className}>
          <path d="M6 22 L 26 22 M9 22 L 12 12 L 20 12 L 23 22" />
          <path d="M12 12 L 16 22 M20 12 L 16 22" opacity="0.6" />
          <circle cx="12" cy="12" r="1" />
          <circle cx="20" cy="12" r="1" />
        </S>
      );
    case "eagle":
      return (
        <S className={className}>
          <path d="M4 16 Q 12 8 16 15 Q 20 8 28 16" />
          <path d="M16 15 L 16 21 M13 21 L 19 21" opacity="0.7" />
        </S>
      );
    case "deer":
      return (
        <S className={className}>
          <path d="M11 6 Q 12 11 15 13 M11 6 L 8 8 M11 6 L 13 4 M21 6 Q 20 11 17 13 M21 6 L 24 8 M21 6 L 19 4" />
          <path d="M15 13 Q 16 15 17 13 L 17 22 M13 16 L 13 22 M19 16 L 19 22" />
        </S>
      );
    case "tide":
      return (
        <S className={className}>
          <path d="M4 14 Q 9 9 14 14 T 24 14 T 28 13" />
          <path d="M4 20 Q 9 15 14 20 T 24 20 T 28 19" opacity="0.6" />
        </S>
      );
    case "stairs":
      return (
        <S className={className}>
          <path d="M6 24 L 6 20 L 12 20 L 12 16 L 18 16 L 18 12 L 24 12 L 24 8" />
          <path d="M26 8 L 24 8 L 24 24 L 6 24" opacity="0.5" />
        </S>
      );
    case "dinghy":
      return (
        <S className={className}>
          <path d="M5 18 L 27 18 Q 24 24 16 24 Q 8 24 5 18 Z" />
          <path d="M16 18 L 16 6 L 24 14 Z" opacity="0.8" />
        </S>
      );
    case "submarine":
      return (
        <S className={className}>
          <path d="M5 18 Q 5 14 12 14 L 24 14 Q 28 14 28 16 Q 28 18 24 18 L 12 18 Q 5 22 5 18 Z" />
          <path d="M15 14 L 15 9 L 19 9 L 19 14 M17 9 L 17 6" opacity="0.8" />
          <circle cx="23" cy="16" r="1" />
        </S>
      );
  }
}
