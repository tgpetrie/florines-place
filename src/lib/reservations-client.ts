"use client";

import { isValidStayRange } from "@/lib/date-ranges";
import type { CalendarEvent, StayRequest, StayRequestInput } from "@/lib/types";

export interface ReservationSnapshot {
  events: CalendarEvent[];
  mode: "live";
}

export function loadDemoStayRequests(): StayRequest[] {
  return [];
}

export async function loadReservations(): Promise<ReservationSnapshot> {
  const response = await fetch("/api/reservations", { cache: "no-store" });
  const data = (await response.json()) as { events?: CalendarEvent[]; configured?: boolean; error?: string };
  if (!response.ok) throw new Error(data.error ?? "Live reservations could not be loaded.");
  if (data.configured === false) throw new Error(data.error ?? "The live reservation database is not connected yet.");
  return { events: data.events ?? [], mode: "live" };
}

export async function submitStayRequest(input: StayRequestInput) {
  if (!isValidStayRange(input.arrival, input.departure)) {
    throw new Error("Departure must be after arrival.");
  }

  const response = await fetch("/api/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await response.json()) as { id?: string; error?: string };
  if (!response.ok || !data.id) throw new Error(data.error ?? "The stay request could not be saved.");
  return { id: data.id, mode: "live" as const };
}

export function resetDemoReservations() {
  // Live builds have no demo store to reset.
}
