"use client";

import { rangesOverlap, isValidStayRange } from "@/lib/date-ranges";
import { demoReservationSeed } from "@/data/demo-reservations";
import type { CalendarEvent, StayRequest, StayRequestInput } from "@/lib/types";

const DEMO_EVENTS_KEY = "florines-place:demo-calendar:v2";
const DEMO_REQUESTS_KEY = "florines-place:demo-stay-requests:v2";

export interface ReservationSnapshot {
  events: CalendarEvent[];
  mode: "demo";
}

function isCalendarEvent(value: unknown): value is CalendarEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<CalendarEvent>;
  return Boolean(
    typeof event.id === "string" &&
    typeof event.start === "string" &&
    typeof event.end === "string" &&
    typeof event.status === "string" &&
    typeof event.who === "string",
  );
}

function readArray<T>(key: string, guard: (value: unknown) => value is T): T[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown;
    return Array.isArray(parsed) ? parsed.filter(guard) : [];
  } catch {
    return [];
  }
}

function demoEvents(): CalendarEvent[] {
  const saved = readArray(DEMO_EVENTS_KEY, isCalendarEvent);
  const byId = new Map(demoReservationSeed().map((event) => [event.id, event]));
  saved.forEach((event) => byId.set(event.id, event));
  const events = [...byId.values()].sort((a, b) => a.start.localeCompare(b.start));
  window.localStorage.setItem(DEMO_EVENTS_KEY, JSON.stringify(events));
  return events;
}

export function loadDemoStayRequests(): StayRequest[] {
  return readArray(DEMO_REQUESTS_KEY, (value): value is StayRequest =>
    Boolean(value && typeof value === "object" && typeof (value as StayRequest).id === "string"),
  ).sort((a, b) => b.submitted.localeCompare(a.submitted));
}

export async function loadReservations(): Promise<ReservationSnapshot> {
  return { events: demoEvents(), mode: "demo" };
}

export async function submitStayRequest(input: StayRequestInput) {
  if (!isValidStayRange(input.arrival, input.departure)) {
    throw new Error("Departure must be after arrival.");
  }

  const events = demoEvents();
  const conflict = events.find((event) =>
    rangesOverlap(input.arrival, input.departure, event.start, event.end),
  );
  if (conflict) throw new Error("Those dates overlap an existing stay or hold. Choose open dates.");

  const id = `demo-request-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const submitted = new Date().toISOString().slice(0, 10);
  const request: StayRequest = {
    id,
    name: input.name,
    contact: input.contact,
    arrival: input.arrival,
    departure: input.departure,
    guestCount: input.guestCount,
    party: input.party,
    pets: input.pets,
    note: input.note,
    specialCircumstances: input.specialCircumstances,
    status: "pending",
    cleaningFee: "due",
    submitted,
  };
  const requests = loadDemoStayRequests();
  requests.push(request);
  window.localStorage.setItem(DEMO_REQUESTS_KEY, JSON.stringify(requests));

  events.push({
    id,
    start: input.arrival,
    end: input.departure,
    status: "requested",
    who: input.name,
    label: "Demo request",
  });
  window.localStorage.setItem(DEMO_EVENTS_KEY, JSON.stringify(events));
  window.dispatchEvent(new Event("florines:reservations-changed"));
  return { id, mode: "demo" as const };
}

export function resetDemoReservations() {
  window.localStorage.removeItem(DEMO_EVENTS_KEY);
  window.localStorage.removeItem(DEMO_REQUESTS_KEY);
  window.dispatchEvent(new Event("florines:reservations-changed"));
}
