import { NextRequest, NextResponse } from "next/server";
import { APP_MODE } from "@/lib/app-mode";
import { isValidStayRange } from "@/lib/date-ranges";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAuthConfigured } from "@/lib/supabase/config";
import { createSupabaseAdmin, liveReservationsConfigured } from "@/lib/supabase-admin";
import { checkRateLimit, requestIp } from "@/lib/server-rate-limit";
import type { StayRequestInput } from "@/lib/types";

export const dynamic = "force-dynamic";

const noStoreHeaders = { "Cache-Control": "private, no-store, max-age=0" };

function clean(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function asInput(value: unknown): StayRequestInput | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const input: StayRequestInput = {
    name: clean(body.name, 80),
    contact: clean(body.contact, 160),
    arrival: clean(body.arrival, 10),
    departure: clean(body.departure, 10),
    guestCount: Number(body.guestCount),
    party: clean(body.party, 240),
    pets: clean(body.pets, 240),
    note: clean(body.note, 1000),
    specialCircumstances: clean(body.specialCircumstances, 1000),
    feeAcknowledged: body.feeAcknowledged === true,
    guideAcknowledged: body.guideAcknowledged === true,
  };

  if (
    input.name.length < 2 || input.contact.length < 3 || input.party.length < 2 ||
    !Number.isInteger(input.guestCount) || input.guestCount < 1 || input.guestCount > 12 ||
    !input.feeAcknowledged || !input.guideAcknowledged ||
    !isValidStayRange(input.arrival, input.departure)
  ) return null;

  return input;
}

function unavailable() {
  return NextResponse.json(
    { error: "The live reservation database is not connected yet." },
    { status: 503, headers: noStoreHeaders },
  );
}

async function getViewerRole() {
  if (!supabaseAuthConfigured()) return "guest" as const;

  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (userError || !userId) return "guest" as const;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.role === "admin" || profile?.role === "family") return profile.role;
  return "guest" as const;
}

function isStayRequestStatus(value: unknown): value is "pending" | "approved" | "declined" {
  return value === "pending" || value === "approved" || value === "declined";
}

function isCleaningFee(value: unknown): value is "due" | "paid" | "waived" {
  return value === "due" || value === "paid" || value === "waived";
}

export async function GET() {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) {
    return NextResponse.json(
      {
        events: [],
        configured: false,
        error: "The live reservation database is not connected yet.",
      },
      { headers: noStoreHeaders },
    );
  }
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("calendar_events")
    .select("id,start_date,end_date,status,who,label")
    .order("start_date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Live reservations could not be loaded." }, { status: 502, headers: noStoreHeaders });
  }

  const viewerRole = await getViewerRole();
  let requests: Array<Record<string, unknown>> = [];

  if (viewerRole === "admin") {
    const { data: requestRows, error: requestError } = await supabase
      .from("stay_requests")
      .select("id,name,contact,arrival,departure,guest_count,party,pets,note,special_circumstances,status,cleaning_fee,submitted_at")
      .order("submitted_at", { ascending: false });

    if (requestError) {
      return NextResponse.json({ error: "Live stay requests could not be loaded." }, { status: 502, headers: noStoreHeaders });
    }

    requests = (requestRows ?? []).map((requestRow) => ({
      id: requestRow.id,
      name: requestRow.name,
      contact: requestRow.contact,
      arrival: requestRow.arrival,
      departure: requestRow.departure,
      guestCount: requestRow.guest_count,
      party: requestRow.party,
      pets: requestRow.pets,
      note: requestRow.note,
      specialCircumstances: requestRow.special_circumstances,
      status: requestRow.status,
      cleaningFee: requestRow.cleaning_fee,
      submitted: requestRow.submitted_at,
    }));
  }

  return NextResponse.json({
    configured: true,
    events: (data ?? []).map((event) => ({
      id: event.id,
      start: event.start_date,
      end: event.end_date,
      status: event.status,
      who: event.who,
      label: event.label ?? undefined,
    })),
    requests,
  }, { headers: noStoreHeaders });
}

export async function POST(request: NextRequest) {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) return unavailable();

  const limit = checkRateLimit(`stay-request:${requestIp(request.headers)}`, 10, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many stay requests were sent. Please try again later." },
      {
        status: 429,
        headers: { ...noStoreHeaders, "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Complete the stay request form." }, { status: 400, headers: noStoreHeaders });
  }

  const input = asInput(body);
  if (!input) {
    return NextResponse.json({ error: "Check the dates and required request details." }, { status: 400, headers: noStoreHeaders });
  }

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("stay_requests")
    .insert({
      name: input.name,
      contact: input.contact,
      arrival: input.arrival,
      departure: input.departure,
      guest_count: input.guestCount,
      party: input.party,
      pets: input.pets,
      note: input.note,
      special_circumstances: input.specialCircumstances,
      fee_acknowledged: input.feeAcknowledged,
      guide_acknowledged: input.guideAcknowledged,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23P01") {
      return NextResponse.json(
        { error: "Those dates overlap an existing stay or hold. Choose open dates." },
        { status: 409, headers: noStoreHeaders },
      );
    }
    return NextResponse.json({ error: "The stay request could not be saved." }, { status: 502, headers: noStoreHeaders });
  }

  return NextResponse.json({ id: data.id }, { status: 201, headers: noStoreHeaders });
}

export async function PATCH(request: NextRequest) {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) return unavailable();

  const viewerRole = await getViewerRole();
  if (viewerRole !== "admin") {
    return NextResponse.json({ error: "Only admins can manage stay requests." }, { status: 403, headers: noStoreHeaders });
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
  const cleaningFee = payload.cleaningFee;

  if (!id || !isStayRequestStatus(status) || (cleaningFee !== undefined && !isCleaningFee(cleaningFee))) {
    return NextResponse.json({ error: "Request update details are invalid." }, { status: 400, headers: noStoreHeaders });
  }

  if (status !== "approved" && status !== "declined" && status !== "pending") {
    return NextResponse.json({ error: "Only pending, approved, or declined statuses are supported." }, { status: 400, headers: noStoreHeaders });
  }

  const supabase = createSupabaseAdmin();
  const updatePatch: { status: "pending" | "approved" | "declined"; cleaning_fee?: "due" | "paid" | "waived" } = { status };
  if (cleaningFee !== undefined) updatePatch.cleaning_fee = cleaningFee;

  const { data, error } = await supabase
    .from("stay_requests")
    .update(updatePatch)
    .eq("id", id)
    .select("id,name,contact,arrival,departure,guest_count,party,pets,note,special_circumstances,status,cleaning_fee,submitted_at")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "The stay request could not be updated." }, { status: 502, headers: noStoreHeaders });
  }

  if (!data) {
    return NextResponse.json({ error: "Stay request not found." }, { status: 404, headers: noStoreHeaders });
  }

  return NextResponse.json({
    request: {
      id: data.id,
      name: data.name,
      contact: data.contact,
      arrival: data.arrival,
      departure: data.departure,
      guestCount: data.guest_count,
      party: data.party,
      pets: data.pets,
      note: data.note,
      specialCircumstances: data.special_circumstances,
      status: data.status,
      cleaningFee: data.cleaning_fee,
      submitted: data.submitted_at,
    },
  }, { headers: noStoreHeaders });
}
