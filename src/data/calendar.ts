/**
 * Mock calendar events and soft family plans.
 *
 * BACKEND NOTE: becomes `calendar_events` and `family_plans` tables.
 * Approved stay requests should generate an "approved" calendar event
 * automatically (a Supabase trigger or a server action would do this),
 * with a "cleaning" day appended after each departure.
 */
import type { CalendarEvent, FamilyPlan } from "@/lib/types";

export const calendarEvents: CalendarEvent[] = [
  {
    id: "ce-1",
    start: "2026-07-17",
    end: "2026-07-19",
    status: "approved",
    who: "Your sister",
    label: "Approved Stay",
  },
  {
    id: "ce-2",
    start: "2026-07-20",
    end: "2026-07-20",
    status: "cleaning",
    who: "Cabin care",
    label: "Resetting the shore",
  },
  {
    id: "ce-3",
    start: "2026-07-24",
    end: "2026-07-27",
    status: "requested",
    who: "Aunt Carol",
    label: "Requested",
  },
  {
    id: "ce-4",
    start: "2026-08-01",
    end: "2026-08-02",
    status: "maintenance",
    who: "Your dad",
    label: "Deck boards + gutter check",
  },
  {
    id: "ce-5",
    start: "2026-08-07",
    end: "2026-08-09",
    status: "requested",
    who: "The Hendersons",
    label: "Requested",
  },
  {
    id: "ce-6",
    start: "2026-08-14",
    end: "2026-08-16",
    status: "considering",
    who: "You + sister",
    label: "Family considering",
  },
  {
    id: "ce-7",
    start: "2026-08-21",
    end: "2026-08-24",
    status: "approved",
    who: "Your mother",
    label: "Approved Stay",
  },
  {
    id: "ce-8",
    start: "2026-08-25",
    end: "2026-08-25",
    status: "cleaning",
    who: "Cabin care",
    label: "Resetting the shore",
  },
  {
    id: "ce-9",
    start: "2026-08-28",
    end: "2026-08-31",
    status: "blocked",
    who: "Family hold",
    label: "Labor Day prep",
  },
];

export const familyPlans: FamilyPlan[] = [
  {
    id: "fp-1",
    who: "You",
    window: "Mid-August (14th–16th)",
    intent: "Thinking about going",
    mode: "Open to sharing",
    note: "Would love company if anyone's free — big minus tide that Saturday.",
  },
  {
    id: "fp-2",
    who: "Your dad",
    window: "First weekend of August",
    intent: "Confirmed",
    mode: "Maintenance trip",
    note: "Deck boards and the gutter over the kitchen window.",
  },
  {
    id: "fp-3",
    who: "Your sister",
    window: "Sometime in September",
    intent: "Planning to go",
    mode: "Private family time",
  },
  {
    id: "fp-4",
    who: "Your mother",
    window: "Any nice Tuesday",
    intent: "Thinking about going",
    mode: "Day trip only",
    note: "Just to sit on the porch for an afternoon.",
  },
];
