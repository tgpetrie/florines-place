/**
 * Mock users.
 *
 * BACKEND NOTE: replace with Supabase Auth. Each family member gets a real
 * login; `role` becomes a column on a `profiles` table keyed to auth.users.
 * Names here are placeholders — rename them to the real family.
 */
import type { User } from "@/lib/types";

export const users: User[] = [
  { id: "u-1", name: "You", relation: "Admin", role: "admin" },
  { id: "u-2", name: "Your sister", relation: "Family owner", role: "family" },
  { id: "u-3", name: "Your mother", relation: "Family owner", role: "family" },
  { id: "u-4", name: "Your brother-in-law", relation: "Family owner", role: "family" },
  { id: "u-5", name: "Your dad", relation: "Family owner", role: "family" },
  { id: "u-6", name: "The Hendersons", relation: "Approved friends", role: "guest" },
];
