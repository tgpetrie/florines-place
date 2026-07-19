import "server-only";

import { APP_MODE } from "@/lib/app-mode";
import { createSupabaseAdmin, liveReservationsConfigured } from "@/lib/supabase-admin";
import type { PorchNote } from "@/lib/types";

export interface PorchNotesSnapshot {
  connected: boolean;
  notes: PorchNote[];
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function displayNameFor(rawDisplayName: string | null | undefined): string {
  const trimmed = rawDisplayName?.trim();
  return trimmed || "A family member";
}

interface PorchNoteRow {
  id: string;
  message: string;
  posted_at: string;
  profiles: { display_name: string | null } | { display_name: string | null }[] | null;
}

function authorDisplayName(row: PorchNoteRow): string {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  return displayNameFor(profile?.display_name);
}

export async function loadPorchNotesSnapshot(): Promise<PorchNotesSnapshot> {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) {
    return { connected: false, notes: [] };
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("porch_notes")
    .select("id, message, posted_at, profiles(display_name)")
    .order("posted_at", { ascending: false })
    .limit(200);

  if (error) return { connected: false, notes: [] };

  const notes: PorchNote[] = ((data ?? []) as PorchNoteRow[]).map((row) => {
    const author = authorDisplayName(row);
    return {
      id: row.id,
      author,
      initials: initialsFor(author),
      message: row.message,
      postedAt: row.posted_at,
      visibility: "public",
    };
  });

  return { connected: true, notes };
}
