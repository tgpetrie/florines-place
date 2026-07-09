/**
 * Mock holidays & special dates.
 *
 * BACKEND NOTE: federal holidays could come from a small static table or a
 * holidays API; family dates and cabin dates become an admin-editable
 * `special_dates` table. Dates marked "placeholder" need the real ones.
 */
import type { SpecialDate } from "@/lib/types";

export const specialDates: SpecialDate[] = [
  {
    id: "d-1",
    date: "2026-09-07",
    name: "Labor Day",
    kind: "Federal holiday",
    note: "The busiest cabin weekend of the year — dates are already family-held.",
  },
  {
    id: "d-2",
    date: "2026-10-12",
    name: "Indigenous Peoples' Day / Columbus Day",
    kind: "Federal holiday",
  },
  {
    id: "d-3",
    date: "2026-11-11",
    name: "Veterans Day",
    kind: "Federal holiday",
  },
  {
    id: "d-4",
    date: "2026-11-26",
    name: "Thanksgiving",
    kind: "Federal holiday",
    note: "The cabin sleeps eight if two of them are small and agreeable.",
  },
  {
    id: "d-5",
    date: "2026-12-25",
    name: "Christmas Day",
    kind: "Federal holiday",
  },
  {
    id: "d-6",
    date: "2026-08-15",
    name: "Florine's birthday (placeholder date)",
    kind: "Family date",
    note: "Replace with her real birthday — worth a quiet visit or a guestbook entry.",
  },
  {
    id: "d-7",
    date: "2026-09-20",
    name: "Family anniversary (placeholder)",
    kind: "Family date",
    note: "Placeholder — admins can add the family's real dates here.",
  },
  {
    id: "d-8",
    date: "2026-10-24",
    name: "Fall shutdown weekend",
    kind: "Cabin date",
    note: "Drain the hoses, stack the wood, put the cabin to bed for the cold months.",
  },
  {
    id: "d-9",
    date: "2026-08-08",
    name: "Community oyster feed (placeholder)",
    kind: "Local event",
    note: "Placeholder local event — swap in real Hood Canal happenings.",
  },
  {
    id: "d-10",
    date: "",
    name: "Restock firewood before fall",
    kind: "Seasonal reminder",
    note: "Already flagged on the Supplies board.",
  },
  {
    id: "d-11",
    date: "",
    name: "Check gutters after the first big autumn blow",
    kind: "Seasonal reminder",
  },
];
