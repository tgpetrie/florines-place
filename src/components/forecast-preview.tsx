"use client";

/**
 * Home-page forecast: shows the next three days, expands inline to ten.
 * Data is mock (see src/data/conditions.ts). The 3 → 10 expansion needs no
 * layout change — it just renders more of the same array.
 */

import { useState } from "react";
import Link from "next/link";
import type { ForecastDay } from "@/lib/types";

function DayRow({ day, featured }: { day: ForecastDay; featured?: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-4 py-3 ${
        featured ? "bg-sand/40" : "bg-oyster/60"
      }`}
    >
      <span className="w-24 shrink-0 font-bold text-night">{day.label}</span>
      <span className="min-w-40 flex-1 text-sm text-ink-soft">{day.summary}</span>
      <span className="text-sm font-bold text-ink">
        {day.highF}° <span className="font-normal text-driftwood">/ {day.lowF}°</span>
      </span>
      <span className="w-16 text-sm text-tide">{day.rainChance} rain</span>
      <span className="w-44 text-sm text-cedar">Low {day.lowTide}</span>
      {day.tideNote && <span className="w-full text-sm italic text-ink-soft sm:pl-24">{day.tideNote}</span>}
    </div>
  );
}

export function ForecastPreview({ days }: { days: ForecastDay[] }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? days : days.slice(0, 3);

  return (
    <div>
      <div className="space-y-2">
        {shown.map((day, i) => (
          <DayRow key={day.date} day={day} featured={i === 0} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-sm font-bold text-navy underline underline-offset-2 hover:text-night"
        >
          {expanded ? "Show three days" : "View 10-day outlook"}
        </button>
        <Link
          href="/local#conditions"
          className="text-sm font-bold text-driftwood underline underline-offset-2 hover:text-ink"
        >
          Full conditions & tides →
        </Link>
      </div>
    </div>
  );
}
