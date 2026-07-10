"use client";

/**
 * "Who's at the Cabin" — compact card at the top of Home.
 *
 * Information hierarchy:
 *   1. Label (NEXT STAY / CURRENTLY STAYING / WHO'S AT THE CABIN)
 *   2. Guest name (prominent)
 *   3. Dates and nights
 *   4. Status badge
 *   5. Primary action (stay details or request)
 *
 * Role-aware: family/admin see guest count and cleaning-fee status.
 * Guests see name, dates, and status only.
 */

import Link from "next/link";
import { useRole } from "@/lib/role-context";
import { stayRequests } from "@/data/stay-requests";
import { calendarEvents } from "@/data/calendar";
import { MOCK_TODAY } from "@/data/conditions";
import { FeeBadge, Badge } from "@/components/status-badge";
import { dateRange, shortDate, stayStatus } from "@/lib/selectors";

const statusTone = { approved: "seaweed", considering: "tide", pending: "sand" } as const;
const statusLabel = {
  approved: "Approved Stay",
  considering: "Family Considering",
  pending: "Pending",
} as const;

export function StayStatusCard() {
  const { role } = useRole();
  const canSeeDetail = role !== "guest";
  const stay = stayStatus(stayRequests, calendarEvents, MOCK_TODAY);

  // --- Empty state -----------------------------------------------------------
  if (stay.kind === "none") {
    return (
      <div className="card !bg-oystercard px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="label">Who&rsquo;s at the Cabin</p>
            <p className="mt-1 font-hand text-lg text-ink">No upcoming stays scheduled.</p>
          </div>
          <Link
            href="/calendar"
            className="rounded-full bg-cedarwarm px-4 py-1.5 text-sm font-semibold text-oystercard hover:bg-cedardark"
          >
            Check Availability
          </Link>
        </div>
      </div>
    );
  }

  // --- Active or upcoming stay -----------------------------------------------
  const isCurrent = stay.kind === "current";
  const label = isCurrent ? "Currently Staying" : "Next Stay";

  return (
    <div className="card !bg-oystercard px-5 py-4 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">

        {/* Left: identity block */}
        <div className="min-w-0">
          <p className="label">{label}</p>
          <p className="mt-1 text-2xl font-medium text-cedardark leading-tight"
             style={{ fontFamily: "var(--font-display)" }}>
            {stay.name}
          </p>
          <p className="tnum mt-1 text-sm text-ink-soft">
            {dateRange(stay.arrival!, stay.departure!)}
            <span className="mx-1.5 text-sandshadow">·</span>
            {stay.nights} {stay.nights === 1 ? "night" : "nights"}
            {canSeeDetail && stay.guestCount
              ? <><span className="mx-1.5 text-sandshadow">·</span>{stay.guestCount} guests</>
              : null}
            {isCurrent
              ? <><span className="mx-1.5 text-sandshadow">·</span>out {shortDate(stay.departure!)}</>
              : null}
          </p>
        </div>

        {/* Right: status + action */}
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2">
            {isCurrent ? (
              <Badge tone="seaweed">Here now</Badge>
            ) : (
              <Badge tone={statusTone[stay.status!]}>{statusLabel[stay.status!]}</Badge>
            )}
            {canSeeDetail && stay.cleaningFee && (
              <FeeBadge status={stay.cleaningFee} />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link
              href="/calendar"
              className="text-sm font-semibold text-cedarwarm underline underline-offset-2 hover:text-cedardark"
            >
              {isCurrent ? "Stay details" : "View stay"} →
            </Link>
            {canSeeDetail && (
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-driftwood underline underline-offset-2 hover:text-ink"
              >
                Dashboard →
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
