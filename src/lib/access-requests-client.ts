"use client";

import type { AccessRequest, AccessRequestInput, AccessRequestStatus } from "@/lib/types";

export async function submitAccessRequest(input: AccessRequestInput) {
  const response = await fetch("/api/access-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await response.json()) as { id?: string; error?: string };
  if (!response.ok || !data.id) throw new Error(data.error ?? "The access request could not be saved.");
  return { id: data.id };
}

export async function loadAccessRequests(): Promise<AccessRequest[]> {
  const response = await fetch("/api/access-requests", { cache: "no-store" });
  const data = (await response.json()) as { requests?: AccessRequest[]; error?: string };
  if (!response.ok) throw new Error(data.error ?? "Access requests could not be loaded.");
  return data.requests ?? [];
}

export async function updateAccessRequest(input: { id: string; status: AccessRequestStatus }) {
  const response = await fetch("/api/access-requests", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await response.json()) as { error?: string };
  if (!response.ok) throw new Error(data.error ?? "The access request could not be updated.");
}
