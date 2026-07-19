"use client";

import { isValidStayRange } from "@/lib/date-ranges";
import type { CalendarEvent, StayRequest, StayRequestInput } from "@/lib/types";

export interface ReservationSnapshot {
  events: CalendarEvent[];
  requests: StayRequest[];
  mode: "live";
}

interface ReservationResponse {
  events?: CalendarEvent[];
  requests?: StayRequest[];
  configured?: boolean;
  error?: string;
}

export function loadDemoStayRequests(): StayRequest[] {
  return [];
}

export async function loadReservations(): Promise<ReservationSnapshot> {
  const response = await fetch("/api/reservations", { cache: "no-store" });
  const data = (await response.json()) as ReservationResponse;
  if (!response.ok) throw new Error(data.error ?? "Live reservations could not be loaded.");
  if (data.configured === false) throw new Error(data.error ?? "The live reservation database is not connected yet.");
  return { events: data.events ?? [], requests: data.requests ?? [], mode: "live" };
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

export async function updateStayRequest(input: {
  id: string;
  status: "pending" | "approved" | "declined";
  cleaningFee?: "due" | "paid" | "waived";
}) {
  const response = await fetch("/api/reservations", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(data.error ?? "The stay request could not be updated.");
}
