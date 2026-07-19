import { NextRequest, NextResponse } from "next/server";
import { APP_MODE } from "@/lib/app-mode";
import { createSupabaseAdmin, liveReservationsConfigured } from "@/lib/supabase-admin";
import { checkRateLimit, requestIp } from "@/lib/server-rate-limit";
import { getViewer } from "@/lib/viewer-role.server";
import { loadPorchNotesSnapshot } from "@/lib/porch-notes.server";

export const dynamic = "force-dynamic";

const noStoreHeaders = { "Cache-Control": "private, no-store, max-age=0" };

function clean(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export async function GET() {
  const snapshot = await loadPorchNotesSnapshot();
  return NextResponse.json(snapshot, { headers: noStoreHeaders });
}

export async function POST(request: NextRequest) {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) {
    return NextResponse.json(
      { error: "The live message board is not connected yet." },
      { status: 503, headers: noStoreHeaders },
    );
  }

  const viewer = await getViewer();
  if (!viewer.id) {
    return NextResponse.json(
      { error: "Sign in to post a porch note." },
      { status: 401, headers: noStoreHeaders },
    );
  }

  const limit = checkRateLimit(`porch-note:${viewer.id}:${requestIp(request.headers)}`, 20, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many notes posted. Please try again later." },
      { status: 429, headers: { ...noStoreHeaders, "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Write a note before sending." }, { status: 400, headers: noStoreHeaders });
  }

  const message = clean((body as Record<string, unknown>)?.message, 1000);
  if (message.length < 1) {
    return NextResponse.json({ error: "Write a note before sending." }, { status: 400, headers: noStoreHeaders });
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("porch_notes").insert({ author_id: viewer.id, message });

  if (error) {
    return NextResponse.json({ error: "The note could not be posted." }, { status: 502, headers: noStoreHeaders });
  }

  const snapshot = await loadPorchNotesSnapshot();
  return NextResponse.json(snapshot, { status: 201, headers: noStoreHeaders });
}
