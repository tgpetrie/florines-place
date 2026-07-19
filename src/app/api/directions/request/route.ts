import { NextRequest, NextResponse } from "next/server";
import { getApprover } from "@/lib/private-directions";
import { checkRateLimit, requestIp } from "@/lib/server-rate-limit";

export const dynamic = "force-dynamic";

const noStoreHeaders = { "Cache-Control": "no-store, max-age=0" };

type RequestBody = {
  requesterName?: unknown;
  requesterEmail?: unknown;
  approver?: unknown;
  note?: unknown;
};

function clean(value: unknown, maximum: number) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

export async function POST(request: NextRequest) {
  const limit = checkRateLimit(`directions-request:${requestIp(request.headers)}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many access requests. Please wait before trying again." },
      {
        status: 429,
        headers: { ...noStoreHeaders, "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please complete the request form." }, { status: 400, headers: noStoreHeaders });
  }

  const requesterName = clean(body.requesterName, 80);
  const requesterEmail = clean(body.requesterEmail, 160);
  const approver = getApprover(clean(body.approver, 20));
  const note = clean(body.note, 500);

  if (requesterName.length < 2 || !/^\S+@\S+\.\S+$/.test(requesterEmail) || !approver) {
    return NextResponse.json(
      { error: "Add your name, a valid email, and the family member you want to ask." },
      { status: 400, headers: noStoreHeaders },
    );
  }

  const subject = `Cabin access request from ${requesterName}`;
  const message = [
    `${requesterName} is requesting cabin access for Florine's Place.`,
    "",
    `Reply to: ${requesterEmail}`,
    note ? `Visit note: ${note}` : "Visit note: none provided",
    "",
    "Please confirm their stay before sharing the access code. The private address, Wi-Fi password, and door code are not included in this request.",
  ].join("\n");

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const requestFrom = process.env.DIRECTIONS_REQUEST_FROM?.trim();

  if (resendKey && requestFrom) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: requestFrom,
        to: [approver.email],
        reply_to: requesterEmail,
        subject,
        text: message,
      }),
      cache: "no-store",
    });

    if (response.ok) {
      return NextResponse.json(
        { sent: true, message: `Request sent to ${approver.name}.` },
        { headers: noStoreHeaders },
      );
    }
  }

  const params = new URLSearchParams({ subject, body: message });
  return NextResponse.json(
    {
      sent: false,
      mailtoUrl: `mailto:${approver.email}?${params.toString()}`,
      message: `Your email app will open a request addressed to ${approver.name}.`,
    },
    { headers: noStoreHeaders },
  );
}
