import { NextRequest, NextResponse } from "next/server";
import { APP_MODE } from "@/lib/app-mode";
import { isValidStayRange } from "@/lib/date-ranges";
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
