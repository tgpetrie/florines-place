import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { MonthCalendar, CalendarLegend, buildDayMap } from "@/components/month-calendar";
import { CalendarBadge } from "@/components/status-badge";
import { calendarEvents, familyPlans } from "@/data/calendar";
import { dateRange } from "@/lib/selectors";

export const metadata: Metadata = { title: "Calendar" };

export default function CalendarPage() {
  const dayMap = buildDayMap(calendarEvents);

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="The tide is out"
        title="The calendar is open"
        lede="See who's requested dates, what's approved, and what the family is quietly considering — so nobody overlaps and everybody gets their days on the water."
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <CalendarLegend />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <MonthCalendar year={2026} month={7} dayMap={dayMap} />
          <MonthCalendar year={2026} month={8} dayMap={dayMap} />
        </div>

        {/* What's on the calendar */}
        <section className="mt-12">
          <h2 className="text-2xl text-night">Coming up</h2>
          <ul className="mt-4 space-y-3">
            {calendarEvents.map((event) => (
              <li key={event.id} className="card flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4">
                <span className="min-w-36 font-bold text-navy">{dateRange(event.start, event.end)}</span>
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
        </section>

        {/* Soft family planning */}
        <section className="mt-14">
          <p className="eyebrow">Softer plans</p>
          <h2 className="mt-2 text-2xl text-night">Who&rsquo;s thinking about going</h2>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Not everything needs a firm request. This is where the family floats
            ideas — a weekend someone&rsquo;s eyeing, a maintenance trip, an open
            invitation to share the cabin.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {familyPlans.map((plan) => (
              <div key={plan.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-night">{plan.who}</span>
                  <span className="rounded-full bg-sand/60 px-2.5 py-0.5 text-xs font-bold text-cedar">
                    {plan.intent}
                  </span>
                </div>
                <p className="mt-2 text-ink">{plan.window}</p>
                <p className="mt-1 text-sm font-bold text-tide">{plan.mode}</p>
                {plan.note && <p className="mt-2 text-sm italic text-ink-soft">&ldquo;{plan.note}&rdquo;</p>}
              </div>
            ))}
          </div>
        </section>

        <div className="mt-14 text-center">
          <Link href="/request" className="btn btn-primary">
            Request a Stay
          </Link>
          <p className="mt-3 text-sm text-driftwood">
            Approved stays only become firm once the family confirms them.
          </p>
        </div>
      </div>
    </div>
  );
}
