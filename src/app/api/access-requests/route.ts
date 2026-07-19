import { NextRequest, NextResponse } from "next/server";
import { APP_MODE } from "@/lib/app-mode";
import { createSupabaseAdmin, liveReservationsConfigured } from "@/lib/supabase-admin";
import { checkRateLimit, requestIp } from "@/lib/server-rate-limit";
import { getViewer } from "@/lib/viewer-role.server";
import type { AccessRequestStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const noStoreHeaders = { "Cache-Control": "private, no-store, max-age=0" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function isAccessRequestStatus(value: unknown): value is AccessRequestStatus {
  return value === "pending" || value === "approved" || value === "declined";
}

function unavailable() {
  return NextResponse.json(
    { error: "The live access-request queue is not connected yet." },
    { status: 503, headers: noStoreHeaders },
  );
}

export async function GET() {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) {
    return NextResponse.json({ requests: [] }, { headers: noStoreHeaders });
  }

  const viewer = await getViewer();
  if (viewer.role !== "admin") {
    return NextResponse.json({ requests: [] }, { headers: noStoreHeaders });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("access_requests")
    .select("id,name,email,message,status,submitted_at")
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Access requests could not be loaded." }, { status: 502, headers: noStoreHeaders });
  }

  return NextResponse.json({
    requests: (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      message: row.message,
      status: row.status,
      submitted: row.submitted_at,
    })),
  }, { headers: noStoreHeaders });
}

export async function POST(request: NextRequest) {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) return unavailable();

  const limit = checkRateLimit(`access-request:${requestIp(request.headers)}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests were sent. Please try again later." },
      { status: 429, headers: { ...noStoreHeaders, "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Complete the access request form." }, { status: 400, headers: noStoreHeaders });
  }

  const payload = body as Record<string, unknown>;
  const name = clean(payload.name, 120);
  const email = clean(payload.email, 160).toLowerCase();
  const message = clean(payload.message, 1000);

  if (name.length < 2 || !EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ error: "Enter a name and a valid email." }, { status: 400, headers: noStoreHeaders });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("access_requests")
    .insert({ name, email, message })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "The access request could not be saved." }, { status: 502, headers: noStoreHeaders });
  }

  return NextResponse.json({ id: data.id }, { status: 201, headers: noStoreHeaders });
}

export async function PATCH(request: NextRequest) {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) return unavailable();

  const viewer = await getViewer();
  if (viewer.role !== "admin") {
    return NextResponse.json({ error: "Only admins can manage access requests." }, { status: 403, headers: noStoreHeaders });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request update payload is invalid." }, { status: 400, headers: noStoreHeaders });
  }

  const payload = body as Record<string, unknown>;
  const id = clean(payload.id, 80);
  const status = payload.status;

  if (!id || !isAccessRequestStatus(status)) {
    return NextResponse.json({ error: "Request update details are invalid." }, { status: 400, headers: noStoreHeaders });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("access_requests")
    .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: viewer.id })
    .eq("id", id)
    .select("id,name,email,message,status,submitted_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "The access request could not be updated." }, { status: 502, headers: noStoreHeaders });
  }

  if (!data) {
    return NextResponse.json({ error: "Access request not found." }, { status: 404, headers: noStoreHeaders });
  }

  return NextResponse.json({
    request: {
      id: data.id,
      name: data.name,
      email: data.email,
      message: data.message,
      status: data.status,
      submitted: data.submitted_at,
    },
  }, { headers: noStoreHeaders });
}
