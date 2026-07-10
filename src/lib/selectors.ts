/**
 * Small derived-data helpers, kept separate from the mock data so they can
 * survive the move to Supabase (they'd run on query results instead).
 */
import type {
  CalendarEvent,
  CleaningFeeStatus,
  Role,
  StayRequest,
  SupplyItem,
  SupplyStatus,
  TideEvent,
  Visibility,
} from "@/lib/types";

/**
 * Visibility gate for guide content. The mock "guest" role represents an
 * APPROVED guest (they're in the app); truly public visitors — rank 0 —
 * exist only once real auth lands.
 */
const visibilityRank: Record<Visibility, number> = {
  public: 0,
  approved_guest: 1,
  family: 2,
  admin: 3,
};

const roleRank: Record<Role, number> = {
  guest: 1, // mock guest = approved guest
  family: 2,
  admin: 3,
};

export function canSee(role: Role, visibility: Visibility): boolean {
  return roleRank[role] >= visibilityRank[visibility];
}

/**
 * "Before You Go" checklist: what someone should bring or check before
 * heading to the cabin.
 *
 * Current rule: anything Out or Need to Buy always makes the list; Running
 * Low and Not Sure make it only when marked high priority (low-priority
 * "running low" items would make the list nag too much).
 *
 * This rule is a judgment call about how naggy the list should feel —
 * tune it here as the family actually uses it.
 */
export function beforeYouGoItems(items: SupplyItem[]): SupplyItem[] {
  const always: SupplyStatus[] = ["Out", "Need to Buy"];
  const whenHighPriority: SupplyStatus[] = ["Running Low", "Not Sure"];

  return items
    .filter(
      (item) =>
        always.includes(item.status) ||
        (whenHighPriority.includes(item.status) && item.priority === "high"),
    )
    .sort((a, b) => priorityRank(b) - priorityRank(a));
}

function priorityRank(item: SupplyItem): number {
  const byPriority = { high: 2, normal: 1, low: 0 }[item.priority];
  const byStatus = item.status === "Out" ? 1 : 0;
  return byPriority * 2 + byStatus;
}

/**
 * Find the next tide of a given type at/after a reference day + minute.
 * The mock "now" is July 9, 9:00 AM (see callers). Returns undefined if none.
 * BACKEND NOTE: with live NOAA data, "now" becomes the real clock.
 */
export function nextTide(
  events: TideEvent[],
  type: TideEvent["type"],
  today: string,
  nowMinutes: number,
): TideEvent | undefined {
  return events.find((t) => {
    if (t.type !== type) return false;
    if (t.date > today) return true;
    return t.date === today && tideTimeToMinutes(t.time) >= nowMinutes;
  });
}

function tideTimeToMinutes(time: string): number {
  const [clock, meridiem] = time.split(" ");
  const [h, m] = clock.split(":").map(Number);
  return ((h % 12) + (meridiem === "PM" ? 12 : 0)) * 60 + m;
}

/** Whole nights between two ISO dates. */
export function nightsBetween(startIso: string, endIso: string): number {
  const [sy, sm, sd] = startIso.split("-").map(Number);
  const [ey, em, ed] = endIso.split("-").map(Number);
  const ms = new Date(ey, em - 1, ed).getTime() - new Date(sy, sm - 1, sd).getTime();
  return Math.max(1, Math.round(ms / 86_400_000));
}

/**
 * "Who's at the Cabin" — current stay, else the next upcoming one, else none.
 * Pure: the caller passes the data + the mock "today".
 * BACKEND NOTE: with live data, `today` is the real clock and this reads from
 * the stays/calendar tables.
 */
export interface StayStatusResult {
  kind: "current" | "next" | "none";
  name?: string;
  arrival?: string;
  departure?: string;
  nights?: number;
  guestCount?: number;
  status?: "approved" | "pending" | "considering";
  cleaningFee?: CleaningFeeStatus;
}

export function stayStatus(
  requests: StayRequest[],
  events: CalendarEvent[],
  today: string,
): StayStatusResult {
  // Someone here right now?
  const current = requests.find(
    (r) => r.status === "approved" && r.arrival <= today && today <= r.departure,
  );
  if (current) {
    return {
      kind: "current",
      name: current.name,
      arrival: current.arrival,
      departure: current.departure,
      nights: nightsBetween(current.arrival, current.departure),
      guestCount: current.guestCount,
      cleaningFee: current.cleaningFee,
    };
  }

  // Otherwise the soonest upcoming stay — approved, pending, or considering.
  type Upcoming = Required<Pick<StayStatusResult, "name" | "arrival" | "departure" | "status">> & {
    guestCount?: number;
    cleaningFee?: CleaningFeeStatus;
  };
  const upcoming: Upcoming[] = [];

  for (const r of requests) {
    if (r.departure >= today && (r.status === "approved" || r.status === "pending")) {
      upcoming.push({
        name: r.name,
        arrival: r.arrival,
        departure: r.departure,
        status: r.status,
        guestCount: r.guestCount,
        cleaningFee: r.cleaningFee,
      });
    }
  }
  for (const e of events) {
    if (e.status === "considering" && e.end >= today) {
      upcoming.push({ name: e.who, arrival: e.start, departure: e.end, status: "considering" });
    }
  }

  upcoming.sort((a, b) => a.arrival.localeCompare(b.arrival));
  const next = upcoming[0];
  if (next) {
    return {
      kind: "next",
      name: next.name,
      arrival: next.arrival,
      departure: next.departure,
      nights: nightsBetween(next.arrival, next.departure),
      guestCount: next.guestCount,
      status: next.status,
      cleaningFee: next.cleaningFee,
    };
  }

  return { kind: "none" };
}

/** Format an ISO date like "2026-07-24" as "July 24". */
export function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

/**
 * Format a date with its year, e.g. "May 1, 2020" — used for lastVerified
 * dates, where hiding the year would make 2020-era info look current.
 */
export function fullDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Format a stay range like "July 24 – 27" or "July 30 – August 2". */
export function dateRange(startIso: string, endIso: string): string {
  const start = shortDate(startIso);
  const end = shortDate(endIso);
  const sameMonth = startIso.slice(0, 7) === endIso.slice(0, 7);
  return sameMonth ? `${start} – ${end.split(" ")[1]}` : `${start} – ${end}`;
}
