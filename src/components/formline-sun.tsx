/**
 * FormlineSun — an original, stylized smiling sun in the Pacific Northwest Coast
 * idiom (a formline face with ovoid eyes and U-forms, ringed by pointed rays),
 * used as the hero's sun so it reads as one family with the totem and the
 * headline crests.
 *
 * Decorative, original homage — NOT a trace or reproduction of any specific
 * artist's or nation's sun mask, which carry cultural meaning. Hood Canal is
 * Coast Salish (Twana / Skokomish) land. Palette: sun-gold, crab-shell orange,
 * carved black, oyster cream.
 */
export function FormlineSun({ className = "" }: { className?: string }) {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className={className}>
      {/* pointed rays */}
      {rays.map((a) => (
        <g key={a} transform={`rotate(${a} 60 60)`}>
          <path
            d="M60 3 C 67 22 67 33 60 43 C 53 33 53 22 60 3 Z"
            fill="#ffd23f"
            stroke="#1a1a1a"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <path d="M60 12 C 63 22 63 30 60 37 C 57 30 57 22 60 12 Z" fill="#ef8a2a" />
        </g>
      ))}

      {/* face disc */}
      <circle cx="60" cy="60" r="33" fill="#ffd23f" stroke="#1a1a1a" strokeWidth="3.4" />

      {/* brows */}
      <path d="M39 50 Q 49 42 57 49" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M63 49 Q 71 42 81 50" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* eyes (formline ovoids) */}
      <g>
        <ellipse cx="49" cy="57" rx="7.5" ry="8.5" fill="#1a1a1a" />
        <ellipse cx="49" cy="58" rx="4.4" ry="5.6" fill="#fff9ee" />
        <path d="M44 55 Q 49 52 54 55" stroke="#ef8a2a" strokeWidth="2.4" fill="none" />
        <circle cx="49" cy="59" r="2.4" fill="#1a1a1a" />
      </g>
      <g>
        <ellipse cx="71" cy="57" rx="7.5" ry="8.5" fill="#1a1a1a" />
        <ellipse cx="71" cy="58" rx="4.4" ry="5.6" fill="#fff9ee" />
        <path d="M66 55 Q 71 52 76 55" stroke="#ef8a2a" strokeWidth="2.4" fill="none" />
        <circle cx="71" cy="59" r="2.4" fill="#1a1a1a" />
      </g>

      {/* nose */}
      <path
        d="M60 60 L55 72 Q 60 75 65 72 Z"
        fill="#ef8a2a"
        stroke="#1a1a1a"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* cheeks */}
      <path d="M37 66 Q 43 71 48 67" stroke="#ef8a2a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d="M72 67 Q 77 71 83 66" stroke="#ef8a2a" strokeWidth="2.8" fill="none" strokeLinecap="round" />

      {/* smiling mouth with teeth */}
      <path d="M45 80 Q 60 95 75 80 Q 60 86 45 80 Z" fill="#1a1a1a" />
      <path d="M47.5 81 Q 60 90 72.5 81 Q 60 84.5 47.5 81 Z" fill="#fff9ee" />
      <g stroke="#1a1a1a" strokeWidth="1">
        <line x1="54" y1="82" x2="54" y2="86" />
        <line x1="60" y1="83" x2="60" y2="87" />
        <line x1="66" y1="82" x2="66" y2="86" />
      </g>
    </svg>
  );
}
