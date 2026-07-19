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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRole } from "@/lib/role-context";
import { Badge } from "@/components/status-badge";
import { dateRange, nightsBetween, shortDate } from "@/lib/selectors";
import { formatIsoDate } from "@/lib/date-ranges";
import { loadReservations } from "@/lib/reservations-client";
import type { CalendarEvent } from "@/lib/types";

const statusTone = { approved: "seaweed", considering: "tide", requested: "sand" } as const;
const statusLabel = {
  approved: "Approved Stay",
  considering: "Family Considering",
  requested: "Pending",
} as const;

export function StayStatusCard() {
  const { role } = useRole();
  const canSeeDetail = role !== "guest";
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const snapshot = await loadReservations();
      setEvents(snapshot.events);
      setLoadError("");
    } catch (reason) {
      setEvents([]);
      setLoadError(reason instanceof Error ? reason.message : "Calendar unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    window.addEventListener("florines:reservations-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("florines:reservations-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [refresh]);

  const stay = useMemo(() => {
    const today = formatIsoDate(new Date());
    const candidates = events
      .filter((event) => ["approved", "requested", "considering"].includes(event.status) && event.end >= today)
      .sort((a, b) => a.start.localeCompare(b.start));
    const current = candidates.find((event) => event.status === "approved" && event.start <= today && today <= event.end);
    const event = current ?? candidates[0];
    if (!event) return { kind: "none" as const };
    return {
      kind: current ? "current" as const : "next" as const,
      name: event.who,
      arrival: event.start,
      departure: event.end,
      nights: nightsBetween(event.start, event.end),
      status: event.status as "approved" | "requested" | "considering",
    };
  }, [events]);

  if (loading) {
    return <div className="card h-24 animate-pulse !bg-oystercard" aria-label="Loading next stay" />;
  }

  // --- Empty state -----------------------------------------------------------
  if (stay.kind === "none") {
    return (
      <div className="card !bg-oystercard px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="label">Who&rsquo;s at the Cabin</p>
            <p className="mt-1 font-hand text-lg text-ink">
              {loadError || "No upcoming stays scheduled."}
            </p>
          </div>
          <Link
            href="/calendar"
            className="btn btn-secondary btn-sm"
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
          <p className="mt-1 text-2xl font-medium text-heading leading-tight"
             style={{ fontFamily: "var(--font-display)" }}>
            {stay.name}
          </p>
          <p className="tnum mt-1 text-sm text-ink-soft">
            {dateRange(stay.arrival!, stay.departure!)}
            <span className="mx-1.5 text-sandshadow">·</span>
            {stay.nights} {stay.nights === 1 ? "night" : "nights"}
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
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link
              href="/calendar"
              className="btn btn-secondary btn-sm"
            >
              {isCurrent ? "Stay details" : "View stay"} →
            </Link>
            {canSeeDetail && (
              <Link
                href="/dashboard"
                className="btn btn-tertiary btn-sm"
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
