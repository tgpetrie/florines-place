import "server-only";

import { APP_MODE } from "@/lib/app-mode";
import { createSupabaseAdmin, liveReservationsConfigured } from "@/lib/supabase-admin";
import type { SupplyItem } from "@/lib/types";

export interface SuppliesSnapshot {
  connected: boolean;
  items: SupplyItem[];
}

interface SupplyRow {
  id: string;
  name: string;
  category: SupplyItem["category"];
  status: SupplyItem["status"];
  quantity: string;
  notes: string;
  updated_by: string;
  priority: SupplyItem["priority"];
  updated_at: string;
}

export async function loadSuppliesSnapshot(): Promise<SuppliesSnapshot> {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) {
    return { connected: false, items: [] };
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("supply_items")
    .select("id, name, category, status, quantity, notes, updated_by, priority, updated_at")
    .order("updated_at", { ascending: false });

  if (error) return { connected: false, items: [] };

  const items: SupplyItem[] = ((data ?? []) as SupplyRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    status: row.status,
    quantity: row.quantity,
    notes: row.notes,
    updatedBy: row.updated_by,
    updatedAt: row.updated_at.slice(0, 10), // shortDate() expects a plain YYYY-MM-DD date
    priority: row.priority,
  }));

  return { connected: true, items };
}
