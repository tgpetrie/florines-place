"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MonthCalendar, CalendarLegend, buildDayMap } from "@/components/month-calendar";
import { CalendarBadge } from "@/components/status-badge";
import { loadReservations, resetDemoReservations } from "@/lib/reservations-client";
import { dateRange } from "@/lib/selectors";
import type { AppMode } from "@/lib/app-mode";
import type { CalendarEvent, FamilyPlan } from "@/lib/types";

export function CalendarPageClient({
  mode,
  months,
  today,
  demoFamilyPlans,
}: {
  mode: AppMode;
  months: Array<{ year: number; month: number }>;
  today: string;
  demoFamilyPlans: FamilyPlan[];
}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const snapshot = await loadReservations();
      setEvents(snapshot.events);
    } catch (reason) {
      setEvents([]);
      setError(reason instanceof Error ? reason.message : "Reservations could not be loaded.");
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

  const dayMap = buildDayMap(events);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="mb-7 flex flex-wrap items-center justify-center gap-3">
        <Link href="/request" className="btn btn-primary">Request a Stay</Link>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
          mode === "demo" ? "bg-sand/70 text-cedar" : "bg-seaglass/45 text-heading-strong"
        }`}>
          {mode === "demo" ? "Demo calendar · saved in this browser" : "Live calendar"}
        </span>
        {mode === "demo" && (
          <button
            type="button"
            className="btn btn-quiet btn-sm"
            onClick={() => {
              resetDemoReservations();
              void refresh();
            }}
          >
            Reset demo year
          </button>
        )}
      </div>

      <CalendarLegend />

      {error && (
        <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-rust/35 bg-rust/10 px-4 py-3 text-center text-sm text-rust" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading reservations">
          {months.map(({ year, month }) => (
            <div key={`${year}-${month}`} className="card h-80 animate-pulse bg-shell/55" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {months.map(({ year, month }) => (
            <MonthCalendar
              key={`${year}-${month}`}
              year={year}
              month={month}
              dayMap={dayMap}
              requestableFrom={error ? undefined : today}
            />
          ))}
        </div>
      )}

      <section className="mt-12">
        <h2 className="text-2xl text-heading">Coming up</h2>
        {events.length === 0 ? (
          <div className="card mt-4 p-6 text-center">
            <p className="text-lg text-heading-strong">
              {mode === "live" ? "No stays or holds yet." : "The demo calendar is open."}
            </p>
            <p className="mt-2 text-sm text-ink-soft">Choose any unfilled dates to make the first request.</p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {events.map((event) => (
              <li key={event.id} className="card flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
                <span className="min-w-36 font-bold text-heading-strong">{dateRange(event.start, event.end)}</span>
                <CalendarBadge status={event.status} />
                <span className="text-ink-soft">
                  {event.who}
                  {event.label && event.status !== "approved" && event.status !== "requested" ? (
                    <span className="text-driftwood"> — {event.label}</span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {mode === "demo" && (
        <section className="mt-14">
          <p className="eyebrow">Softer demo plans</p>
          <h2 className="mt-2 text-2xl text-heading">Who&rsquo;s thinking about going</h2>
          <p className="mt-2 max-w-2xl text-ink-soft">
            These sample notes live only in the demo build. Firm requests still cannot overlap a filled week.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {demoFamilyPlans.map((plan) => (
              <div key={plan.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-heading-strong">{plan.who}</span>
                  <span className="rounded-full bg-sand/60 px-2.5 py-0.5 text-xs font-bold text-cedar">{plan.intent}</span>
                </div>
                <p className="mt-2 text-ink">{plan.window}</p>
                <p className="mt-1 text-sm font-bold text-tide">{plan.mode}</p>
                {plan.note && <p className="mt-2 text-sm italic text-ink-soft">&ldquo;{plan.note}&rdquo;</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-14 text-center">
        <Link href="/request" className="btn btn-primary">Request a Stay</Link>
        <p className="mt-3 text-sm text-driftwood">Filled dates cannot be requested again.</p>
      </div>
    </div>
  );
}
