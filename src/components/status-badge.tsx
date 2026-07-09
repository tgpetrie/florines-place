import type { CalendarStatus, CleaningFeeStatus, IdeaStatus, SupplyStatus } from "@/lib/types";

/**
 * One shared pill for every status in the app, so statuses always read the
 * same way everywhere. Colors come from the theme palette in globals.css.
 */

const tones = {
  seaweed: "bg-seaweed/15 text-seaweed border-seaweed/30",
  rust: "bg-rust/12 text-rust border-rust/30",
  navy: "bg-navy/10 text-navy border-navy/25",
  tide: "bg-tide/12 text-tide border-tide/30",
  sand: "bg-sand/60 text-cedar border-sand-deep/60",
  driftwood: "bg-driftwood/15 text-driftwood border-driftwood/35",
  pearl: "bg-pearl/30 text-ink-soft border-pearl/60",
} as const;

type Tone = keyof typeof tones;

export function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-bold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

// --- Domain-specific badges ---------------------------------------------------

const calendarTones: Record<CalendarStatus, { tone: Tone; label: string }> = {
  available: { tone: "pearl", label: "Available" },
  requested: { tone: "sand", label: "Requested" },
  approved: { tone: "seaweed", label: "Approved Stay" },
  considering: { tone: "tide", label: "Family Considering" },
  blocked: { tone: "driftwood", label: "Blocked" },
  cleaning: { tone: "navy", label: "Cleaning" },
  maintenance: { tone: "rust", label: "Maintenance" },
};

export function CalendarBadge({ status }: { status: CalendarStatus }) {
  const { tone, label } = calendarTones[status];
  return <Badge tone={tone}>{label}</Badge>;
}

const supplyTones: Record<SupplyStatus, Tone> = {
  "In Stock": "seaweed",
  "Running Low": "sand",
  Out: "rust",
  "Need to Buy": "rust",
  Wanted: "tide",
  Purchased: "navy",
  "Not Sure": "driftwood",
};

export function SupplyBadge({ status }: { status: SupplyStatus }) {
  return <Badge tone={supplyTones[status]}>{status}</Badge>;
}

const ideaTones: Record<IdeaStatus, Tone> = {
  Idea: "pearl",
  "Worth Discussing": "tide",
  Approved: "seaweed",
  "In Progress": "sand",
  Done: "navy",
  "Not Now": "driftwood",
};

export function IdeaBadge({ status }: { status: IdeaStatus }) {
  return <Badge tone={ideaTones[status]}>{status}</Badge>;
}

const feeTones: Record<CleaningFeeStatus, { tone: Tone; label: string }> = {
  due: { tone: "sand", label: "Cleaning fee due" },
  paid: { tone: "seaweed", label: "Cleaning fee paid" },
  waived: { tone: "tide", label: "Fee waived" },
};

export function FeeBadge({ status }: { status: CleaningFeeStatus }) {
  const { tone, label } = feeTones[status];
  return <Badge tone={tone}>{label}</Badge>;
}
