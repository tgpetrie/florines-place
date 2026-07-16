"use client";

/**
 * Home-page forecast: shows the next three days, expands inline to ten like a
 * tide table unfolding. Data is mock (see src/data/conditions.ts). The 3 → 10
 * expansion needs no layout change — it just renders more of the same array,
 * with the extra rows unfolding in.
 */

import { useState } from "react";
import Link from "next/link";
import type { ForecastDay } from "@/lib/types";

function DayRow({ day, featured, animate }: { day: ForecastDay; featured?: boolean; animate?: boolean }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl px-4 py-2.5 ${
        featured ? "bg-wetsand/40" : ""
      } ${animate ? "unfold" : ""}`}
    >
      <span className="w-24 shrink-0 font-semibold text-cedardark">{day.label}</span>
      <span className="min-w-40 flex-1 text-sm text-ink-soft">{day.summary}</span>
      <span className="tnum text-sm font-semibold text-ink">
        {day.highF}° <span className="font-normal text-driftwood">/ {day.lowF}°</span>
      </span>
      <span className="tnum w-16 text-sm text-canal">{day.rainChance} rain</span>
      <span className="tnum w-44 text-sm text-cedarwarm">Low {day.lowTide}</span>
      {day.tideNote && (
        <span className="w-full text-sm italic text-driftwood sm:pl-24">{day.tideNote}</span>
      )}
    </div>
  );
}

export function ForecastPreview({ days }: { days: ForecastDay[] }) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? days : days.slice(0, 3);

  return (
    <div>
      <div id="forecast-outlook" className="divide-y divide-sandshadow/30">
        {shown.map((day, i) => (
          <DayRow key={day.date} day={day} featured={i === 0} animate={expanded && i >= 3} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-sandshadow/30 pt-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls="forecast-outlook"
          className="text-sm font-bold text-cedarwarm underline underline-offset-2 hover:text-cedardark"
        >
          {expanded ? "Show three days" : "View 10-day outlook"}
        </button>
        <Link
          href="/local#conditions"
          className="text-sm font-bold text-driftwood underline underline-offset-2 hover:text-ink"
        >
          Full conditions &amp; tides →
        </Link>
      </div>
    </div>
  );
}
