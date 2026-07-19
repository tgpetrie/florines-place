/**
 * Demo-mode mock data for the two open public boards.
 * Live mode reads from Supabase instead — see porch-notes.server.ts /
 * guestbook.server.ts. `contact` is omitted here since demo mode never
 * shows the admin-only view.
 */
import type { LiveGuestbookEntry, PorchNote } from "@/lib/types";

export const demoPorchNotes: PorchNote[] = [
  {
    id: "pn-1",
    posterName: "Kate P.",
    initials: "KP",
    message: "We're almost out of dish soap and paper towels — could use a restock next trip.",
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    category: "supplies",
  },
  {
    id: "pn-2",
    posterName: "Greg P.",
    initials: "GP",
    message: "The porch light bulb burned out. Might just need a replacement, not sure if it's the fixture.",
    postedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    category: "maintenance",
  },
  {
    id: "pn-3",
    posterName: "Maya O.",
    initials: "MO",
    message: "Left a full bag of coffee in the pantry for whoever's next. Also we're low on firewood.",
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: "supplies",
  },
];

export const demoGuestbookEntries: LiveGuestbookEntry[] = [
  {
    id: "gb-1",
    posterName: "Maya O.",
    initials: "MO",
    message: "We'll arrive around 4:30 Friday. Can someone leave the porch light on? Can't wait to be back on the canal.",
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "gb-2",
    posterName: "Tom P.",
    initials: "TP",
    message: "Porch light switch is behind the fridge — leaving it on for you. Have a good trip!",
    postedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "gb-3",
    posterName: "Greg P.",
    initials: "GP",
    message: "Low tide at 11am Saturday looked incredible — dug clams for the first time in years with the kids.",
    postedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "gb-4",
    posterName: "Peggy P.",
    initials: "PP",
    message: "Quiet weekend, good weather, the eagles were out every morning. This place never gets old.",
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
