import { NextRequest, NextResponse } from "next/server";
import {
  getPrivateDirectionsConfig,
  googleMapsDirectionsUrl,
  passcodeMatches,
} from "@/lib/private-directions";
import { checkRateLimit, requestIp } from "@/lib/server-rate-limit";

export const dynamic = "force-dynamic";

const noStoreHeaders = { "Cache-Control": "no-store, max-age=0" };

export async function POST(request: NextRequest) {
  const limit = checkRateLimit(`directions:${requestIp(request.headers)}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many passcode attempts. Please wait before trying again." },
      {
        status: 429,
        headers: { ...noStoreHeaders, "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: { passcode?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Enter the four-digit passcode." }, { status: 400, headers: noStoreHeaders });
  }

  const passcode = typeof body.passcode === "string" ? body.passcode.trim() : "";
  if (!/^\d{4}$/.test(passcode)) {
    return NextResponse.json({ error: "Enter the four-digit passcode." }, { status: 400, headers: noStoreHeaders });
  }

  const config = getPrivateDirectionsConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Private directions are not configured yet." },
      { status: 503, headers: noStoreHeaders },
    );
  }

  if (!passcodeMatches(passcode, config.passcode)) {
    return NextResponse.json({ error: "That passcode was not recognized." }, { status: 401, headers: noStoreHeaders });
  }

  return NextResponse.json(
    {
      address: config.address,
      wifiName: config.wifiName,
      wifiPassword: config.wifiPassword,
      doorCode: config.doorCode,
      url: googleMapsDirectionsUrl(config.address),
    },
    {
      headers: {
        ...noStoreHeaders,
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
