import "server-only";

import { APP_MODE } from "@/lib/app-mode";
import { createSupabaseAdmin, liveReservationsConfigured } from "@/lib/supabase-admin";
import type { Idea } from "@/lib/types";

export interface IdeasSnapshot {
  connected: boolean;
  ideas: Idea[];
}

interface IdeaRow {
  id: string;
  title: string;
  description: string;
  category: Idea["category"];
  added_by: string;
  contact: string | null;
  priority: Idea["priority"];
  estimated_cost: string;
  status: Idea["status"];
}

/** includeContact should only ever be true for an admin viewer — never expose it publicly. */
export async function loadIdeasSnapshot(includeContact = false): Promise<IdeasSnapshot> {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) {
    return { connected: false, ideas: [] };
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("cabin_ideas")
    .select("id, title, description, category, added_by, contact, priority, estimated_cost, status")
    .order("created_at", { ascending: false });

  if (error) return { connected: false, ideas: [] };

  const ideas: Idea[] = ((data ?? []) as IdeaRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    addedBy: row.added_by,
    priority: row.priority,
    estimatedCost: row.estimated_cost,
    status: row.status,
    commentCount: 0,
    ...(includeContact && row.contact ? { contact: row.contact } : {}),
  }));

  return { connected: true, ideas };
}
