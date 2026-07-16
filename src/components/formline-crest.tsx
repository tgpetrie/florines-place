/**
 * FormlineCrest — a small, original ovoid "crest" flourish in the Pacific
 * Northwest Coast visual idiom (a formline ovoid eye with a U-form curl below),
 * used to bracket the "Florine's Place" wordmark on the hero.
 *
 * This is a decorative, original homage — NOT a reproduction of any nation's
 * actual crest, which carry family/spiritual meaning. Hood Canal is the land of
 * the Coast Salish (Twana / Skokomish) peoples. Colours are drawn from the warm
 * cabin palette (cream shell, crab-shell rust, carved brown, a seaweed-teal arc).
 */
export function FormlineCrest({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 44" fill="none" aria-hidden="true" className={className}>
      {/* ovoid body */}
      <path
        d="M6 22 Q 6 6 26 6 Q 46 6 46 22 Q 46 38 26 38 Q 6 38 6 22 Z"
        fill="#f4efe5"
        stroke="#3a2417"
        strokeWidth="3.5"
      />
      {/* inner ring + pupil */}
      <ellipse cx="26" cy="21" rx="11" ry="9" fill="#b0522c" />
      <ellipse cx="26" cy="20" rx="4.5" ry="6" fill="#1a1a1a" />
      {/* U-form curl below, teal brow arc above */}
      <path d="M12 33 Q 26 44 40 33" stroke="#3a2417" strokeWidth="3" fill="none" />
      <path d="M14 12 Q 26 4 38 12" stroke="#2f6d6a" strokeWidth="2.5" fill="none" />
    </svg>
  );
}
