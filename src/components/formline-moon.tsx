/**
 * FormlineMoon — an original, stylized moon face in a Pacific Northwest Coast
 * visual idiom, designed as the cool-palette sibling to FormlineSun.
 *
 * Decorative, original homage — NOT a trace or reproduction of any specific
 * artist's or nation's moon mask, which may carry family or spiritual meaning.
 * Hood Canal is Coast Salish (Twana / Skokomish) land. Palette: moonlight,
 * midnight navy, muted tidal teal, and oyster shell.
 */
export function FormlineMoon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className={className}>
      {/* Four tidal crescents around the face, quieter than the sun's rays. */}
      {[0, 90, 180, 270].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 60 60)`}>
          <path
            d="M60 5 C72 19 71 31 60 40 C66 27 64 16 60 5 Z"
            fill="#7aa5a3"
            stroke="#131a38"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M60 12 C65 21 65 29 60 35" stroke="#e9edf3" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}

      {/* Moon disc and crescent rim. */}
      <circle cx="60" cy="60" r="38" fill="#e9edf3" stroke="#131a38" strokeWidth="3.4" />
      <path
        d="M76 31 C91 43 95 65 84 82 C77 92 66 98 54 97 C70 89 79 75 79 59 C79 47 75 37 68 29"
        fill="#7aa5a3"
        opacity="0.72"
      />
      <path
        d="M74 31 C88 44 91 64 82 80 C76 90 66 95 56 96"
        stroke="#131a38"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Ovoid eyes. */}
      <g>
        <ellipse cx="46" cy="56" rx="9" ry="10" fill="#131a38" />
        <ellipse cx="46" cy="57" rx="5.2" ry="6.5" fill="#f4efe5" />
        <path d="M40.5 54 Q46 50 51.5 54" stroke="#4f8b8a" strokeWidth="2.4" />
        <circle cx="46" cy="58" r="2.5" fill="#131a38" />
      </g>
      <g>
        <ellipse cx="72" cy="56" rx="9" ry="10" fill="#131a38" />
        <ellipse cx="72" cy="57" rx="5.2" ry="6.5" fill="#f4efe5" />
        <path d="M66.5 54 Q72 50 77.5 54" stroke="#4f8b8a" strokeWidth="2.4" />
        <circle cx="72" cy="58" r="2.5" fill="#131a38" />
      </g>

      {/* Nose, cheeks, and a calm closed mouth. */}
      <path
        d="M59 59 L53 73 Q59 77 65 73 Z"
        fill="#7aa5a3"
        stroke="#131a38"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M35 70 Q41 76 48 72" stroke="#4f8b8a" strokeWidth="3" strokeLinecap="round" />
      <path d="M69 72 Q76 76 83 69" stroke="#4f8b8a" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 83 Q59 91 74 82 Q59 96 44 83 Z" fill="#131a38" />
      <path d="M48 84 Q59 89 70 83" stroke="#f4efe5" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
