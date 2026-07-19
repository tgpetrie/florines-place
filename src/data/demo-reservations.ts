import type { CalendarEvent } from "@/lib/types";
import { DEMO_START_MONTH } from "@/lib/app-mode";
import { addDays, formatIsoDate, monthWindow } from "@/lib/date-ranges";

const demoFamilies = [
  "Maya’s family",
  "Carol & Jim",
  "The Hendersons",
  "Linda & company",
  "Sam’s family",
  "Greg & friends",
  "Kate’s family",
  "Peggy’s family",
  "Tom’s family",
  "The cousins",
  "Family gathering",
  "Winter cabin week",
] as const;

/** One deterministic seven-day occupied range in every demo month. */
export function demoReservationSeed(): CalendarEvent[] {
  return monthWindow(DEMO_START_MONTH).map(({ year, month }, index) => {
    const startDay = index === 0 ? 21 : 8 + (index % 3) * 4;
    const start = formatIsoDate(new Date(year, month - 1, startDay));
    return {
      id: `demo-seed-${year}-${String(month).padStart(2, "0")}`,
      start,
      end: addDays(start, 6),
      status: "approved",
      who: demoFamilies[index % demoFamilies.length],
      label: "Demo approved stay",
    };
  });
}
