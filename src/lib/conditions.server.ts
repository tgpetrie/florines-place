import "server-only";

import {
  MOCK_TODAY,
  tenDayOutlook as demoTenDayOutlook,
  threeDayForecast as demoThreeDayForecast,
  tideEvents as demoTideEvents,
  tideWindows as demoTideWindows,
  weatherNow as demoWeatherNow,
} from "@/data/conditions";
import { APP_MODE } from "@/lib/app-mode";
import { getLunarPhase } from "@/lib/sky-state";
import { tideTimeToMinutes } from "@/lib/selectors";
import type { ForecastDay, TideEvent, TideWindow, WeatherSummary } from "@/lib/types";

const CABIN_TIMEZONE = "America/Los_Angeles";
const DEFAULT_LATITUDE = 47.93;
const DEFAULT_LONGITUDE = -122.59;
const DEFAULT_NOAA_STATION = "9444090";

const weatherDescriptions: Record<number, string> = {
  0: "Clear sky",
  1: "Mostly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Frequent rain showers",
  82: "Heavy rain showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm with hail",
};

interface ConditionsSnapshot {
  connected: boolean;
  mode: "demo" | "live";
  today: string;
  nowMinutes: number;
  weatherNow: WeatherSummary | null;
  tideEvents: TideEvent[];
  tideWindows: TideWindow[];
  tenDayOutlook: ForecastDay[];
  threeDayForecast: ForecastDay[];
}

interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    precipitation_probability: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
    wind_speed_10m_max: number[];
  };
}

interface NoaaResponse {
  predictions?: Array<{ t: string; v: string; type: "H" | "L" }>;
}

function getCabinCoords() {
  const latitude = Number(process.env.CABIN_LATITUDE ?? DEFAULT_LATITUDE);
  const longitude = Number(process.env.CABIN_LONGITUDE ?? DEFAULT_LONGITUDE);

  return {
    latitude: Number.isFinite(latitude) ? latitude : DEFAULT_LATITUDE,
    longitude: Number.isFinite(longitude) ? longitude : DEFAULT_LONGITUDE,
  };
}

function cabinNow() {
  return new Date();
}

function getCabinClock(now: Date = cabinNow()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CABIN_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const today = `${values.year}-${values.month}-${values.day}`;
  const nowMinutes = Number(values.hour) * 60 + Number(values.minute);

  return { today, nowMinutes };
}

function formatClock(hour: number, minute: number) {
  const meridiem = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${meridiem}`;
}

function parseCompactDateTime(value: string) {
  const [date, time] = value.split(/[T ]/);
  const [hour, minute] = time.split(":").map(Number);
  return { date, hour, minute };
}

function formatClockFromTimestamp(value: string) {
  const { hour, minute } = parseCompactDateTime(value);
  return formatClock(hour, minute);
}

function formatAsOf(value: string) {
  const { date, hour, minute } = parseCompactDateTime(value);
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: CABIN_TIMEZONE,
    weekday: "long",
  }).format(new Date(`${date}T12:00:00-07:00`));

  return `${weekday}, ${date} · ${formatClock(hour, minute)}`;
}

function describeWeather(code: number) {
  return weatherDescriptions[code] ?? "Mixed canal weather";
}

function formatRainChance(value: number) {
  return `${Math.round(value)}%`;
}

function formatWind(value: number) {
  return `${Math.round(value)} mph`;
}

function formatForecastLabel(date: string, index: number) {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: CABIN_TIMEZONE,
    weekday: "long",
  }).format(new Date(`${date}T12:00:00-07:00`));
}

function moonNote(name: string, illumination: number) {
  if (name === "Full Moon") return "Bright nights on the flats this week.";
  if (name.includes("Waxing") && illumination > 0.6) {
    return "Evenings stay bright enough for a late beach walk.";
  }
  if (name.includes("Waning") && illumination > 0.5) {
    return "The moon still keeps the shoreline bright after sunset.";
  }
  return "Moonlight shifts through the week as the canal turns with the tide.";
}

function formatTideWindow(time: string) {
  const center = tideTimeToMinutes(time);
  const startMinutes = Math.max(0, center - 90);
  const endMinutes = Math.min(23 * 60 + 59, center + 90);

  return `${formatClock(Math.floor(startMinutes / 60), startMinutes % 60)} – ${formatClock(Math.floor(endMinutes / 60), endMinutes % 60)}`;
}

function tideNote(event: TideEvent) {
  if (event.heightFt <= -1) return "A strong minus tide — plan a beach walk around the flats.";
  if (event.heightFt <= 0.5) return "A very good low tide window for beach wandering and shell watching.";
  if (event.heightFt <= 2) return "A solid low tide, though not a true minus tide.";
  return "A moderate low tide that still opens some of the beach.";
}

function toTideEvents(response: NoaaResponse): TideEvent[] {
  return (response.predictions ?? []).map((prediction, index) => ({
    id: `live-tide-${index}`,
    date: prediction.t.slice(0, 10),
    time: formatClockFromTimestamp(prediction.t),
    type: prediction.type === "H" ? "high" : "low",
    heightFt: Number(prediction.v),
  }));
}

function dailyTideStrings(events: TideEvent[], date: string) {
  const daily = events.filter((event) => event.date === date);
  const lows = daily.filter((event) => event.type === "low").sort((a, b) => a.heightFt - b.heightFt);
  const highs = daily.filter((event) => event.type === "high").sort((a, b) => b.heightFt - a.heightFt);

  const low = lows[0];
  const high = highs[0];

  return {
    low,
    high,
    lowText: low ? `${low.time} · ${low.heightFt.toFixed(1)} ft` : "No low prediction",
    highText: high ? `${high.time} · ${high.heightFt.toFixed(1)} ft` : "No high prediction",
  };
}

function toTideWindows(events: TideEvent[]) {
  return events
    .filter((event) => event.type === "low")
    .sort((a, b) => a.heightFt - b.heightFt)
    .slice(0, 3)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .map((event, index): TideWindow => ({
      id: `live-window-${index}`,
      date: event.date,
      window: formatTideWindow(event.time),
      lowHeightFt: event.heightFt,
      note: tideNote(event),
      moonlight: tideTimeToMinutes(event.time) >= 20 * 60 || tideTimeToMinutes(event.time) < 5 * 60,
    }));
}

function buildDemoSnapshot(): ConditionsSnapshot {
  return {
    connected: true,
    mode: "demo",
    today: MOCK_TODAY,
    nowMinutes: 9 * 60,
    weatherNow: demoWeatherNow,
    tideEvents: demoTideEvents,
    tideWindows: demoTideWindows,
    tenDayOutlook: demoTenDayOutlook,
    threeDayForecast: demoThreeDayForecast,
  };
}

async function fetchOpenMeteo() {
  const { latitude, longitude } = getCabinCoords();
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m,precipitation_probability,weather_code,wind_speed_10m");
  url.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,wind_speed_10m_max");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("wind_speed_unit", "mph");
  url.searchParams.set("timezone", CABIN_TIMEZONE);
  url.searchParams.set("forecast_days", "10");

  const response = await fetch(url, { next: { revalidate: 1800 } });
  if (!response.ok) throw new Error("Open-Meteo request failed.");
  return response.json() as Promise<OpenMeteoResponse>;
}

async function fetchNoaaPredictions(today: string) {
  const station = process.env.NOAA_TIDE_STATION_ID?.trim() || DEFAULT_NOAA_STATION;
  const beginDate = today.replaceAll("-", "");
  const url = new URL("https://api.tidesandcurrents.noaa.gov/api/prod/datagetter");
  url.searchParams.set("product", "predictions");
  url.searchParams.set("application", "florines-place");
  url.searchParams.set("begin_date", beginDate);
  url.searchParams.set("range", "240");
  url.searchParams.set("datum", "MLLW");
  url.searchParams.set("station", station);
  url.searchParams.set("time_zone", "lst_ldt");
  url.searchParams.set("units", "english");
  url.searchParams.set("interval", "hilo");
  url.searchParams.set("format", "json");

  const response = await fetch(url, { next: { revalidate: 1800 } });
  if (!response.ok) throw new Error("NOAA tide request failed.");
  return response.json() as Promise<NoaaResponse>;
}

async function buildLiveSnapshot(): Promise<ConditionsSnapshot> {
  const { today, nowMinutes } = getCabinClock();
  const [weatherResponse, tideResponse] = await Promise.all([
    fetchOpenMeteo(),
    fetchNoaaPredictions(today),
  ]);

  const tideEvents = toTideEvents(tideResponse);
  const tideWindows = toTideWindows(tideEvents);
  const lunar = getLunarPhase(cabinNow());
  const weatherNow: WeatherSummary = {
    asOf: formatAsOf(weatherResponse.current.time),
    condition: describeWeather(weatherResponse.current.weather_code),
    tempF: Math.round(weatherResponse.current.temperature_2m),
    highF: Math.round(weatherResponse.daily.temperature_2m_max[0]),
    lowF: Math.round(weatherResponse.daily.temperature_2m_min[0]),
    rainChance: formatRainChance(weatherResponse.current.precipitation_probability),
    wind: formatWind(weatherResponse.current.wind_speed_10m),
    sunrise: formatClockFromTimestamp(weatherResponse.daily.sunrise[0]),
    sunset: formatClockFromTimestamp(weatherResponse.daily.sunset[0]),
    moonPhase: lunar.name,
    moonNote: moonNote(lunar.name, lunar.illumination),
  };

  const tenDayOutlook = weatherResponse.daily.time.map((date, index): ForecastDay => {
    const tide = dailyTideStrings(tideEvents, date);
    return {
      date,
      label: formatForecastLabel(date, index),
      summary: describeWeather(weatherResponse.daily.weather_code[index]),
      highF: Math.round(weatherResponse.daily.temperature_2m_max[index]),
      lowF: Math.round(weatherResponse.daily.temperature_2m_min[index]),
      rainChance: formatRainChance(weatherResponse.daily.precipitation_probability_max[index]),
      wind: formatWind(weatherResponse.daily.wind_speed_10m_max[index]),
      lowTide: tide.lowText,
      highTide: tide.highText,
      tideNote: tide.low ? tideNote(tide.low) : undefined,
      sourceStatus: "Live weather and NOAA tides",
      lastUpdated: formatAsOf(weatherResponse.current.time),
    };
  });

  return {
    connected: Boolean(weatherNow && tideEvents.length > 0),
    mode: "live",
    today,
    nowMinutes,
    weatherNow,
    tideEvents,
    tideWindows,
    tenDayOutlook,
    threeDayForecast: tenDayOutlook.slice(0, 3),
  };
}

export async function loadConditionsSnapshot(): Promise<ConditionsSnapshot> {
  if (APP_MODE === "demo") return buildDemoSnapshot();

  try {
    return await buildLiveSnapshot();
  } catch {
    const { today, nowMinutes } = getCabinClock();
    return {
      connected: false,
      mode: "live",
      today,
      nowMinutes,
      weatherNow: null,
      tideEvents: [],
      tideWindows: [],
      tenDayOutlook: [],
      threeDayForecast: [],
    };
  }
}