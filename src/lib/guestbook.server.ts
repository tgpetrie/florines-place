import "server-only";

import { APP_MODE } from "@/lib/app-mode";
import { createSupabaseAdmin, liveReservationsConfigured } from "@/lib/supabase-admin";
import { publicImageUrl } from "@/lib/board-posts.server";
import type { LiveGuestbookEntry } from "@/lib/types";

export interface GuestbookSnapshot {
  connected: boolean;
  entries: LiveGuestbookEntry[];
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface GuestbookRow {
  id: string;
  poster_name: string;
  contact: string;
  message: string;
  image_path: string | null;
  posted_at: string;
}

/** includeContact should only ever be true for an admin viewer — never expose it publicly. */
export async function loadGuestbookSnapshot(includeContact = false): Promise<GuestbookSnapshot> {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) {
    return { connected: false, entries: [] };
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("guestbook_entries")
    .select("id, poster_name, contact, message, image_path, posted_at")
    .order("posted_at", { ascending: false })
    .limit(200);

  if (error) return { connected: false, entries: [] };

  const entries: LiveGuestbookEntry[] = ((data ?? []) as GuestbookRow[]).map((row) => ({
    id: row.id,
    posterName: row.poster_name,
    initials: initialsFor(row.poster_name),
    message: row.message,
    postedAt: row.posted_at,
    imageUrl: publicImageUrl(row.image_path),
    contact: includeContact ? row.contact : undefined,
  }));

  return { connected: true, entries };
}
