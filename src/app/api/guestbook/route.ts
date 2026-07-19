import { NextRequest, NextResponse } from "next/server";
import { APP_MODE } from "@/lib/app-mode";
import { createSupabaseAdmin, liveReservationsConfigured } from "@/lib/supabase-admin";
import { checkRateLimit, requestIp } from "@/lib/server-rate-limit";
import { getViewerRole } from "@/lib/viewer-role.server";
import { parseBoardPostForm, uploadBoardImage } from "@/lib/board-posts.server";
import { loadGuestbookSnapshot } from "@/lib/guestbook.server";

export const dynamic = "force-dynamic";

const noStoreHeaders = { "Cache-Control": "private, no-store, max-age=0" };

export async function GET() {
  const viewerRole = await getViewerRole();
  const snapshot = await loadGuestbookSnapshot(viewerRole === "admin");
  return NextResponse.json(snapshot, { headers: noStoreHeaders });
}

export async function POST(request: NextRequest) {
  if (APP_MODE !== "live" || !liveReservationsConfigured()) {
    return NextResponse.json(
      { error: "The live guestbook is not connected yet." },
      { status: 503, headers: noStoreHeaders },
    );
  }

  const limit = checkRateLimit(`guestbook:${requestIp(request.headers)}`, 10, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many entries posted. Please try again later." },
      { status: 429, headers: { ...noStoreHeaders, "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const parsed = await parseBoardPostForm(request);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400, headers: noStoreHeaders });
  }

  let imagePath: string | null = null;
  if (parsed.post.imageFile) {
    const uploaded = await uploadBoardImage(parsed.post.imageFile, "guestbook");
    if (!uploaded.ok) {
      return NextResponse.json({ error: uploaded.error }, { status: 502, headers: noStoreHeaders });
    }
    imagePath = uploaded.path;
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("guestbook_entries").insert({
    poster_name: parsed.post.posterName,
    contact: parsed.post.contact,
    message: parsed.post.message,
    image_path: imagePath,
  });

  if (error) {
    return NextResponse.json({ error: "The entry could not be posted." }, { status: 502, headers: noStoreHeaders });
  }

  const viewerRole = await getViewerRole();
  const snapshot = await loadGuestbookSnapshot(viewerRole === "admin");
  return NextResponse.json(snapshot, { status: 201, headers: noStoreHeaders });
}
