/**
 * Mock current conditions and tide data — PLACEHOLDER, not live.
 * The UI must always label this as placeholder data.
 *
 * BACKEND NOTE — future live sources:
 *   - Weather: a weather API (e.g. Open-Meteo or NWS api.weather.gov)
 *   - Tides: NOAA CO-OPS (tidesandcurrents.noaa.gov) for the nearest
 *     Hood Canal station, fetched server-side and cached
 *   - Sunrise/sunset + moon phase: a sun/moon API or local calculation
 * Historical reference would come from the same NOAA/weather archives,
 * joined with guestbook entries by date.
 */
import type { TideEvent, TideWindow, WeatherSummary } from "@/lib/types";

export const weatherNow: WeatherSummary = {
  asOf: "Thursday, July 9 · placeholder snapshot",
  condition: "Partly sunny, light marine haze",
  tempF: 68,
  highF: 73,
  lowF: 54,
  rainChance: "10% — a stray sprinkle at most",
  wind: "SW 7 mph, easing by evening",
  sunrise: "5:24 AM",
  sunset: "9:08 PM",
  moonPhase: "Waxing gibbous",
  moonNote: "Bright nights on the flats this week.",
};

/** A few days of mock tides, two highs and two lows per day. */
export const tideEvents: TideEvent[] = [
  // Today — July 9
  { id: "t-1", date: "2026-07-09", time: "4:32 AM", type: "high", heightFt: 11.8 },
  { id: "t-2", date: "2026-07-09", time: "11:54 AM", type: "low", heightFt: -1.9, note: "Minus tide — the flats open at lunchtime." },
  { id: "t-3", date: "2026-07-09", time: "7:26 PM", type: "high", heightFt: 12.4 },
  { id: "t-4", date: "2026-07-09", time: "11:58 PM", type: "low", heightFt: 6.1 },
  // July 10
  { id: "t-5", date: "2026-07-10", time: "5:14 AM", type: "high", heightFt: 11.5 },
  { id: "t-6", date: "2026-07-10", time: "12:38 PM", type: "low", heightFt: -2.3, note: "Best low of the week." },
  { id: "t-7", date: "2026-07-10", time: "8:04 PM", type: "high", heightFt: 12.7 },
  // July 11
  { id: "t-8", date: "2026-07-11", time: "12:42 AM", type: "low", heightFt: 5.8 },
  { id: "t-9", date: "2026-07-11", time: "5:58 AM", type: "high", heightFt: 11.2 },
  { id: "t-10", date: "2026-07-11", time: "1:22 PM", type: "low", heightFt: -2.0 },
  { id: "t-11", date: "2026-07-11", time: "8:44 PM", type: "high", heightFt: 12.9 },
  // July 12
  { id: "t-12", date: "2026-07-12", time: "1:30 AM", type: "low", heightFt: 5.2 },
  { id: "t-13", date: "2026-07-12", time: "6:44 AM", type: "high", heightFt: 10.9 },
  { id: "t-14", date: "2026-07-12", time: "2:06 PM", type: "low", heightFt: -1.4 },
  { id: "t-15", date: "2026-07-12", time: "9:22 PM", type: "high", heightFt: 13.0 },
  // July 13
  { id: "t-16", date: "2026-07-13", time: "2:20 AM", type: "low", heightFt: 4.5 },
  { id: "t-17", date: "2026-07-13", time: "7:34 AM", type: "high", heightFt: 10.7 },
  { id: "t-18", date: "2026-07-13", time: "2:52 PM", type: "low", heightFt: -0.6 },
  { id: "t-19", date: "2026-07-13", time: "10:00 PM", type: "high", heightFt: 13.1 },
];

/** Curated "plan a morning around this" windows. */
export const tideWindows: TideWindow[] = [
  {
    id: "tw-1",
    date: "2026-07-10",
    window: "11:30 AM – 1:45 PM",
    lowHeightFt: -2.3,
    note: "The best low of the week. Sand dollars past the point, moon snail collars everywhere.",
  },
  {
    id: "tw-2",
    date: "2026-07-11",
    window: "12:15 – 2:30 PM",
    lowHeightFt: -2.0,
    note: "Nearly as good as Friday's, and usually quieter on the flats.",
  },
  {
    id: "tw-3",
    date: "2026-07-24",
    window: "10:40 PM – midnight",
    lowHeightFt: -0.8,
    note: "Low tide under moonlight — bring the lantern and warm layers.",
    moonlight: true,
  },
];

export const historicalPlaceholder = {
  title: "Looking back at the canal",
  copy: "Eventually this section can show what the tide and weather were like during past stays, helping connect guestbook memories with the actual conditions of the canal — Aunt Carol's -2.1 ft morning, the windy weekend the Hendersons watched eagles, the full-moon low your mother wrote about.",
  futureSources: [
    "NOAA historical tide data for the nearest Hood Canal station",
    "A historical weather archive, by date",
    "Guestbook entries (tide & weather notes are already collected)",
    "Family notes from previous stays",
  ],
};
