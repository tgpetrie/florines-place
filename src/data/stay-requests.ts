/**
 * Mock stay requests.
 *
 * BACKEND NOTE: becomes a `stay_requests` table in Supabase. The Request a
 * Stay form inserts a row with status "pending"; the Family Dashboard
 * updates status and cleaning fee via row-level-secured mutations.
 */
import type { StayRequest } from "@/lib/types";

export const stayRequests: StayRequest[] = [
  {
    id: "sr-1",
    name: "Aunt Carol",
    contact: "carol@example.com",
    arrival: "2026-07-24",
    departure: "2026-07-27",
    guestCount: 2,
    party: "Carol and Jim",
    pets: "",
    note: "Hoping to catch the morning low tides and put the kayak in. Happy to shift dates if anyone else was thinking of that weekend.",
    specialCircumstances: "",
    status: "pending",
    cleaningFee: "due",
    submitted: "2026-07-06",
  },
  {
    id: "sr-2",
    name: "The Hendersons",
    contact: "(360) 555-0143",
    arrival: "2026-08-07",
    departure: "2026-08-09",
    guestCount: 4,
    party: "Mark, Dana, and the two kids",
    pets: "One well-behaved dog (Salty)",
    note: "The kids have been asking about the crab pots all year.",
    specialCircumstances: "",
    status: "pending",
    cleaningFee: "due",
    submitted: "2026-07-08",
  },
  {
    id: "sr-3",
    name: "Your sister",
    contact: "sister@example.com",
    arrival: "2026-07-17",
    departure: "2026-07-19",
    guestCount: 3,
    party: "Us three, quiet weekend",
    pets: "",
    note: "Just need a couple of slow mornings on the water.",
    specialCircumstances: "",
    status: "approved",
    cleaningFee: "paid",
    submitted: "2026-06-28",
  },
  {
    id: "sr-4",
    name: "Your mother",
    contact: "mom@example.com",
    arrival: "2026-08-21",
    departure: "2026-08-24",
    guestCount: 2,
    party: "Mom and a garden-club friend",
    pets: "",
    note: "Late-summer stay. I'll water the pots and check the linens while I'm there.",
    specialCircumstances: "Fee waived — she's doing the fall linen wash.",
    status: "approved",
    cleaningFee: "waived",
    submitted: "2026-06-30",
  },
];
