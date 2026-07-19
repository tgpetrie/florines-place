import { NextRequest, NextResponse } from "next/server";
import { APP_MODE } from "@/lib/app-mode";
import { createSupabaseAdmin, liveReservationsConfigured } from "@/lib/supabase-admin";
import { getViewerRole } from "@/lib/viewer-role.server";
import { loadSuppliesSnapshot } from "@/lib/supplies.server";
import type { SupplyCategory, SupplyPriority, SupplyStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const noStoreHeaders = { "Cache-Control": "private, no-store, max-age=0" };

const CATEGORIES: SupplyCategory[] = [
  "Groceries", "Paper goods", "Cleaning supplies", "Toiletries",
  "Firewood / propane / utilities", "Tools / hardware", "Linens / towels",
  "Emergency supplies", "Wanted items",
];
const STATUSES: SupplyStatus[] = [
  "In Stock", "Running Low", "Out", "Need to Buy", "Wanted", "Purchased", "Not Sure",
];
const PRIORITIES: SupplyPriority[] = ["low", "normal", "high"];

function clean(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function forbidden() {
  return NextResponse.json({ error: "Family sign-in required." }, { status: 403, headers: noStoreHeaders });
}

function unavailable() {
  return NextResponse.json({ error: "The live supplies board is not connected yet." }, { status: 503, headers: noStoreHeaders });
}

async function requireFamily() {
  const role = await getViewerRole();
  return role === "admin" || role === "family";
}

export async function GET() {
  if (!(await requireFamily())) return forbidden();
  const snapshot = await loadSuppliesSnapshot();
  return NextResponse.json(snapshot, { headers: noStoreHeaders });
}

export async function POST(request: NextRequest) {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) return unavailable();
  if (!(await requireFamily())) return forbidden();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Complete the item details." }, { status: 400, headers: noStoreHeaders });
  }

  const payload = body as Record<string, unknown>;
  const name = clean(payload.name, 120);
  const category = clean(payload.category, 60) as SupplyCategory;
  const status = clean(payload.status, 20) as SupplyStatus;
  const quantity = clean(payload.quantity, 160);
  const notes = clean(payload.notes, 500);
  const updatedBy = clean(payload.updatedBy, 80);
  const priority = clean(payload.priority, 10) as SupplyPriority;

  if (
    name.length < 1 || !CATEGORIES.includes(category) || !STATUSES.includes(status) ||
    updatedBy.length < 1 || !PRIORITIES.includes(priority)
  ) {
    return NextResponse.json({ error: "Check the item details and try again." }, { status: 400, headers: noStoreHeaders });
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("supply_items").insert({
    name, category, status, quantity, notes, updated_by: updatedBy, priority,
  });

  if (error) {
    return NextResponse.json({ error: "The item could not be saved." }, { status: 502, headers: noStoreHeaders });
  }

  return NextResponse.json(await loadSuppliesSnapshot(), { status: 201, headers: noStoreHeaders });
}

export async function PATCH(request: NextRequest) {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) return unavailable();
  if (!(await requireFamily())) return forbidden();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Update payload is invalid." }, { status: 400, headers: noStoreHeaders });
  }

  const payload = body as Record<string, unknown>;
  const id = clean(payload.id, 80);
  if (!id) return NextResponse.json({ error: "Item id is required." }, { status: 400, headers: noStoreHeaders });

  const updatePatch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (payload.status !== undefined) {
    const status = clean(payload.status, 20) as SupplyStatus;
    if (!STATUSES.includes(status)) return NextResponse.json({ error: "Invalid status." }, { status: 400, headers: noStoreHeaders });
    updatePatch.status = status;
  }
  if (payload.quantity !== undefined) updatePatch.quantity = clean(payload.quantity, 160);
  if (payload.notes !== undefined) updatePatch.notes = clean(payload.notes, 500);
  if (payload.updatedBy !== undefined) {
    const updatedBy = clean(payload.updatedBy, 80);
    if (updatedBy.length < 1) return NextResponse.json({ error: "Updated-by name is required." }, { status: 400, headers: noStoreHeaders });
    updatePatch.updated_by = updatedBy;
  }
  if (payload.priority !== undefined) {
    const priority = clean(payload.priority, 10) as SupplyPriority;
    if (!PRIORITIES.includes(priority)) return NextResponse.json({ error: "Invalid priority." }, { status: 400, headers: noStoreHeaders });
    updatePatch.priority = priority;
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("supply_items").update(updatePatch).eq("id", id);

  if (error) {
    return NextResponse.json({ error: "The item could not be updated." }, { status: 502, headers: noStoreHeaders });
  }

  return NextResponse.json(await loadSuppliesSnapshot(), { headers: noStoreHeaders });
}

export async function DELETE(request: NextRequest) {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) return unavailable();
  if (!(await requireFamily())) return forbidden();

  const id = clean(new URL(request.url).searchParams.get("id"), 80);
  if (!id) return NextResponse.json({ error: "Item id is required." }, { status: 400, headers: noStoreHeaders });

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("supply_items").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "The item could not be removed." }, { status: 502, headers: noStoreHeaders });
  }

  return NextResponse.json(await loadSuppliesSnapshot(), { headers: noStoreHeaders });
}
