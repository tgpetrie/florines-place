import type { CalendarEvent, CalendarStatus } from "@/lib/types";
import Link from "next/link";
import { addDays } from "@/lib/date-ranges";

/**
 * A single month grid. Pure server component — takes precomputed mock events.
 * BACKEND NOTE: with Supabase, the day map would be built from a
 * `calendar_events` range query for the visible month.
 */

const dayCellTones: Record<CalendarStatus, string> = {
  available: "",
  requested: "bg-sand/70 border-sand-deep text-cedar border-dashed",
  approved: "bg-seaweed/20 border-seaweed/50 text-seaweed",
  considering: "bg-tide/15 border-tide/40 text-tide",
  blocked: "bg-driftwood/25 border-driftwood/50 text-ink-soft",
  cleaning: "bg-navy/12 border-navy/35 text-navy",
  maintenance: "bg-rust/15 border-rust/40 text-rust",
};

function isoOf(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Expand events (inclusive ranges) into a date -> event lookup. */
export function buildDayMap(events: CalendarEvent[]): Map<string, CalendarEvent> {
  const map = new Map<string, CalendarEvent>();
  for (const event of events) {
    const [sy, sm, sd] = event.start.split("-").map(Number);
    const [ey, em, ed] = event.end.split("-").map(Number);
    const cursor = new Date(sy, sm - 1, sd); // local time, avoids UTC day-shift
    const last = new Date(ey, em - 1, ed);
    while (cursor <= last) {
      map.set(isoOf(cursor.getFullYear(), cursor.getMonth() + 1, cursor.getDate()), event);
      cursor.setDate(cursor.getDate() + 1);
    }
  }
  return map;
}

const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function MonthCalendar({
  year,
  month, // 1-based
  dayMap,
  requestableFrom,
}: {
  year: number;
  month: number;
  dayMap: Map<string, CalendarEvent>;
  requestableFrom?: string;
}) {
  const first = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const leadingBlanks = first.getDay();
  const monthName = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const cells: Array<{ day: number; event?: CalendarEvent } | null> = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      event: dayMap.get(isoOf(year, month, i + 1)),
    })),
  ];

  return (
    <div className="card p-5 sm:p-6">
      <h3 className="text-center text-xl text-heading-strong">{monthName}</h3>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {weekdays.map((d) => (
          <div key={d} className="pb-1 text-[0.68rem] font-bold uppercase tracking-wider text-driftwood">
            {d}
          </div>
        ))}
        {cells.map((cell, i) => {
          if (!cell) return <div key={`blank-${i}`} />;
          const iso = isoOf(year, month, cell.day);
          const tone = cell.event ? dayCellTones[cell.event.status] : "";
          const title = cell.event
            ? `${cell.event.label ?? cell.event.status} — ${cell.event.who}`
            : "Available";
          if (!cell.event && requestableFrom && iso >= requestableFrom) {
            return (
              <Link
                key={cell.day}
                href={`/request?arrival=${iso}&departure=${addDays(iso, 2)}`}
                title="Available — request these dates"
                aria-label={`${monthName} ${cell.day}, available. Start a stay request.`}
                className="flex aspect-square items-center justify-center rounded-lg border border-transparent text-sm font-bold text-ink-soft transition-colors hover:border-tide/45 hover:bg-seaglass/30 hover:text-heading-strong focus:outline-none focus:ring-2 focus:ring-tide"
              >
                {cell.day}
              </Link>
            );
          }

          return (
            <div
              key={cell.day}
              title={title}
              className={`flex aspect-square items-center justify-center rounded-lg border text-sm font-bold ${
                tone || "border-transparent text-driftwood/60"
              }`}
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CalendarLegend() {
  const entries: Array<{ status: CalendarStatus; label: string }> = [
    { status: "available", label: "Available" },
    { status: "requested", label: "Requested" },
    { status: "approved", label: "Approved Stay" },
    { status: "considering", label: "Family Considering" },
    { status: "blocked", label: "Blocked" },
    { status: "cleaning", label: "Cleaning" },
    { status: "maintenance", label: "Maintenance" },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      {entries.map(({ status, label }) => (
        <span key={status} className="flex items-center gap-1.5 text-sm text-ink-soft">
          <span
            className={`inline-block h-3.5 w-3.5 rounded border ${
              dayCellTones[status] || "border-pearl bg-shell"
            }`}
          />
          {label}
        </span>
      ))}
    </div>
  );
}
