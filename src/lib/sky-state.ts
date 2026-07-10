/**
 * Sky state and lunar phase for Florine's Place, Hood Canal / Hansville WA.
 * All math is local — no API key, no network call, works offline.
 *
 * Coordinates: 47.93°N, 122.59°W (Hansville, WA)
 */

export type SkyState = "day" | "sunset" | "dusk" | "night";

export interface LunarPhase {
  /** 0–1: 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter */
  phase: number;
  name: string;
  /** Illuminated fraction, 0–1 */
  illumination: number;
  /** True when the lit side faces right (waxing crescent/gibbous) */
  waxing: boolean;
}

/**
 * Approximate monthly [sunrise_hour, sunset_hour] in Pacific local time
 * for Hansville WA (47.93°N). Values are mid-month medians, good enough
 * for a visual sky-state widget.
 */
const SOLAR_TABLE: [number, number][] = [
  [8.0, 16.5],  // Jan
  [7.2, 17.4],  // Feb
  [6.1, 18.2],  // Mar
  [5.0, 19.0],  // Apr
  [4.1, 19.9],  // May
  [3.7, 20.5],  // Jun
  [4.0, 20.3],  // Jul
  [4.9, 19.4],  // Aug
  [6.0, 18.2],  // Sep
  [7.1, 17.0],  // Oct
  [7.2, 16.1],  // Nov
  [8.0, 15.9],  // Dec
];

export function getSunTimes(date: Date = new Date()): { sunrise: number; sunset: number } {
  const month = date.getMonth(); // 0-indexed
  const [sunrise, sunset] = SOLAR_TABLE[month];
  return { sunrise, sunset };
}

/** Returns the sky state for a given time (defaults to now, cabin local time). */
export function getSkyState(now: Date = new Date()): SkyState {
  // Treat the system clock as cabin local time for the mock — real app would
  // use the cabin's IANA tz ("America/Los_Angeles") via Intl.DateTimeFormat.
  const h = now.getHours() + now.getMinutes() / 60;
  const { sunrise, sunset } = getSunTimes(now);

  if (h < sunrise - 0.5 || h >= sunset + 1.5) return "night";
  if (h < sunrise + 0.75) return "dusk";
  if (h >= sunset - 0.75) return "sunset";
  return "day";
}

/** Julian date from a JS Date. */
function toJulian(d: Date): number {
  return d.getTime() / 86400000 + 2440587.5;
}

const SYNODIC = 29.53058868;
const KNOWN_NEW = 2451550.1; // Jan 6, 2000 new moon (JD)

export function getLunarPhase(now: Date = new Date()): LunarPhase {
  const jd = toJulian(now);
  let phase = ((jd - KNOWN_NEW) % SYNODIC) / SYNODIC;
  if (phase < 0) phase += 1;

  const illumination = 0.5 * (1 - Math.cos(2 * Math.PI * phase));
  const waxing = phase < 0.5;

  let name: string;
  if (phase < 0.03 || phase > 0.97) name = "New Moon";
  else if (phase < 0.22) name = "Waxing Crescent";
  else if (phase < 0.28) name = "First Quarter";
  else if (phase < 0.47) name = "Waxing Gibbous";
  else if (phase < 0.53) name = "Full Moon";
  else if (phase < 0.72) name = "Waning Gibbous";
  else if (phase < 0.78) name = "Last Quarter";
  else name = "Waning Crescent";

  return { phase, name, illumination, waxing };
}
