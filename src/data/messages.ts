/**
 * Porch Notes — the family cabin message board.
 * Mock data only; real notes arrive with the backend.
 * BACKEND NOTE: replace with a Supabase query on `porch_notes`,
 * filtered by visibility and ordered by postedAt desc.
 */
import type { PorchNote } from "@/lib/types";

export const porchNotes: PorchNote[] = [
  {
    id: "pn-1",
    author: "Maya",
    initials: "M",
    message: "We'll arrive around 4:30 Friday. Can someone leave the porch light on?",
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    visibility: "family",
    stayId: "sr-3",
  },
  {
    id: "pn-2",
    author: "Tom",
    initials: "T",
    message: "Porch light switch is behind the fridge — I'll leave it on. Have a good trip.",
    postedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5h ago
    visibility: "family",
    stayId: "sr-3",
  },
  {
    id: "pn-3",
    author: "Greg",
    initials: "G",
    message: "Does anyone know if the dinghy is inflated? Was thinking of taking it out.",
    postedAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), // ~yesterday
    visibility: "family",
  },
  {
    id: "pn-4",
    author: "Kate",
    initials: "K",
    message: "I left a full bag of coffee in the pantry for whoever arrives next. Enjoy.",
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    visibility: "family",
  },
  {
    id: "pn-5",
    author: "Maya",
    initials: "M",
    message: "Low tide at 11am Saturday looks really good — planning to dig for clams if the season is open. Anyone want to join?",
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    visibility: "family",
  },
];
