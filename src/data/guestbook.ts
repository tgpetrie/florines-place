/**
 * Mock guestbook entries.
 *
 * BACKEND NOTE: becomes a `guestbook_entries` table. `visibility` maps to a
 * row-level security policy: "family" rows visible to all family logins,
 * "admins" rows only to admins. `hasPhoto` is a placeholder for a future
 * Supabase Storage photo upload.
 */
import type { GuestbookEntry } from "@/lib/types";

export const guestbookEntries: GuestbookEntry[] = [
  {
    id: "g-1",
    name: "Your sister",
    stayDates: "June 12–14, 2026",
    message:
      "Rained the whole first day and none of us minded. We played the card games from the hutch and ate too much bread. The kids fell asleep before nine both nights, which the cabin somehow always does to them.",
    favoriteMoment: "Watching the fog lift off the canal with coffee, everyone still asleep.",
    tideNote: "Soft rain, glassy water, tide never seemed to come all the way in.",
    hasPhoto: true,
    visibility: "family",
  },
  {
    id: "g-2",
    name: "Aunt Carol",
    stayDates: "May 22–25, 2026",
    message:
      "Jim got his first geoduck at 71 years old and talked about it for the rest of the weekend. Thank you for letting us have these days. The cabin smells like cedar and every good summer I can remember.",
    favoriteMoment: "The minus tide on Saturday morning. Sand dollars everywhere.",
    tideNote: "-2.1 ft at 8:40am Saturday. Unreal.",
    hasPhoto: false,
    visibility: "family",
  },
  {
    id: "g-3",
    name: "The Hendersons",
    stayDates: "April 3–5, 2026",
    message:
      "Our first stay and we already understand why this place matters to your family. We left it as we found it, plus one more oyster shell on the windowsill — hope that's a tradition.",
    favoriteMoment: "Dungeness crab dinner with butter and nothing else.",
    tideNote: "Windy, whitecaps on the canal, eagles out both mornings.",
    hasPhoto: true,
    visibility: "family",
  },
  {
    id: "g-4",
    name: "Your mother",
    stayDates: "March 14–16, 2026",
    message:
      "I came alone this time. I sat in Florine's chair by the window and did the crossword like she used to, and it was a hard, good, quiet weekend. This entry is just for the family that keeps this place.",
    favoriteMoment: "Moonlight on the low tide flats. It looked like a second shore.",
    tideNote: "Cold and clear. Full moon.",
    hasPhoto: false,
    visibility: "admins",
  },
];
