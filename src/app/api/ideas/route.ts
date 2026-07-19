import { NextRequest, NextResponse } from "next/server";
import { APP_MODE } from "@/lib/app-mode";
import { createSupabaseAdmin, liveReservationsConfigured } from "@/lib/supabase-admin";
import { checkRateLimit, requestIp } from "@/lib/server-rate-limit";
import { getViewerRole } from "@/lib/viewer-role.server";
import { isValidContact } from "@/lib/board-posts.server";
import { loadIdeasSnapshot } from "@/lib/ideas.server";
import type { IdeaCategory, IdeaStatus, SupplyPriority } from "@/lib/types";

export const dynamic = "force-dynamic";

const noStoreHeaders = { "Cache-Control": "private, no-store, max-age=0" };

const CATEGORIES: IdeaCategory[] = [
  "Repairs needed", "Improvements", "Decoration ideas", "Outdoor projects",
  "Comfort upgrades", "Accessibility ideas", "Family traditions", "Future dreams",
];
const STATUSES: IdeaStatus[] = ["Idea", "Worth Discussing", "Approved", "In Progress", "Done", "Not Now"];
const PRIORITIES: SupplyPriority[] = ["low", "normal", "high"];

function clean(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function unavailable() {
  return NextResponse.json({ error: "The live ideas board is not connected yet." }, { status: 503, headers: noStoreHeaders });
}

export async function GET() {
  const role = await getViewerRole();
  if (role !== "admin" && role !== "family") {
    return NextResponse.json({ connected: true, ideas: [] }, { headers: noStoreHeaders });
  }
  const snapshot = await loadIdeasSnapshot(role === "admin");
  return NextResponse.json(snapshot, { headers: noStoreHeaders });
}

export async function POST(request: NextRequest) {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) return unavailable();

  const role = await getViewerRole();
  const isFamily = role === "admin" || role === "family";

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Complete the idea details." }, { status: 400, headers: noStoreHeaders });
  }
  const payload = body as Record<string, unknown>;

  const title = clean(payload.title, 120);
  const description = clean(payload.description, 1000);
  if (title.length < 2) {
    return NextResponse.json({ error: "Give the idea a short title." }, { status: 400, headers: noStoreHeaders });
  }

  const insertRow: Record<string, unknown> = { title, description, status: "Idea" };

  // Branch on which form actually sent the request (its field shape), not
  // just on role — a signed-in family member can still use the open public
  // suggestion form, and that submission should be handled the same way a
  // guest's would be, not rejected for missing family-only fields.
  const isFamilySubmission = isFamily && typeof payload.addedBy === "string";

  if (isFamilySubmission) {
    const category = clean(payload.category, 60) as IdeaCategory;
    const priority = clean(payload.priority, 10) as SupplyPriority;
    const addedBy = clean(payload.addedBy, 80);
    if (!CATEGORIES.includes(category) || !PRIORITIES.includes(priority) || addedBy.length < 1) {
      return NextResponse.json({ error: "Check the idea details and try again." }, { status: 400, headers: noStoreHeaders });
    }
    insertRow.category = category;
    insertRow.priority = priority;
    insertRow.added_by = addedBy;
    insertRow.estimated_cost = clean(payload.estimatedCost, 60);
  } else {
    const limit = checkRateLimit(`idea-suggest:${requestIp(request.headers)}`, 8, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many ideas submitted. Please try again later." },
        { status: 429, headers: { ...noStoreHeaders, "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }
    const posterName = clean(payload.posterName, 80);
    const contact = clean(payload.contact, 160);
    if (posterName.length < 2) {
      return NextResponse.json({ error: "Enter your first name and last initial." }, { status: 400, headers: noStoreHeaders });
    }
    if (!isValidContact(contact)) {
      return NextResponse.json({ error: "Enter a phone number or email so the family can reach you if needed." }, { status: 400, headers: noStoreHeaders });
    }
    insertRow.category = "Improvements";
    insertRow.priority = "normal";
    insertRow.added_by = posterName;
    insertRow.contact = contact;
    insertRow.estimated_cost = "";
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("cabin_ideas").insert(insertRow);

  if (error) {
    return NextResponse.json({ error: "The idea could not be saved." }, { status: 502, headers: noStoreHeaders });
  }

  if (!isFamilySubmission) {
    return NextResponse.json({ ok: true }, { status: 201, headers: noStoreHeaders });
  }
  return NextResponse.json(await loadIdeasSnapshot(role === "admin"), { status: 201, headers: noStoreHeaders });
}

export async function PATCH(request: NextRequest) {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) return unavailable();

  const role = await getViewerRole();
  if (role !== "admin" && role !== "family") {
    return NextResponse.json({ error: "Family sign-in required." }, { status: 403, headers: noStoreHeaders });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Update payload is invalid." }, { status: 400, headers: noStoreHeaders });
  }
  const payload = body as Record<string, unknown>;
  const id = clean(payload.id, 80);
  if (!id) return NextResponse.json({ error: "Idea id is required." }, { status: 400, headers: noStoreHeaders });

  const updatePatch: Record<string, unknown> = {};
  if (payload.status !== undefined) {
    const status = clean(payload.status, 20) as IdeaStatus;
    if (!STATUSES.includes(status)) return NextResponse.json({ error: "Invalid status." }, { status: 400, headers: noStoreHeaders });
    updatePatch.status = status;
  }
  if (payload.priority !== undefined) {
    const priority = clean(payload.priority, 10) as SupplyPriority;
    if (!PRIORITIES.includes(priority)) return NextResponse.json({ error: "Invalid priority." }, { status: 400, headers: noStoreHeaders });
    updatePatch.priority = priority;
  }
  if (payload.estimatedCost !== undefined) updatePatch.estimated_cost = clean(payload.estimatedCost, 60);

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("cabin_ideas").update(updatePatch).eq("id", id);

  if (error) {
    return NextResponse.json({ error: "The idea could not be updated." }, { status: 502, headers: noStoreHeaders });
  }

  return NextResponse.json(await loadIdeasSnapshot(role === "admin"), { headers: noStoreHeaders });
}
