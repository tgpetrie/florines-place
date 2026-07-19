"use client";

import type { PorchNote } from "@/lib/types";

interface PorchNotesResponse {
  connected: boolean;
  notes: PorchNote[];
  error?: string;
}

export async function loadPorchNotes(): Promise<PorchNote[]> {
  const response = await fetch("/api/porch-notes", { cache: "no-store" });
  const data = (await response.json()) as PorchNotesResponse;
  if (!response.ok) throw new Error(data.error ?? "Porch notes could not be loaded.");
  return data.notes;
}

export async function submitPorchNote(message: string): Promise<PorchNote[]> {
  const response = await fetch("/api/porch-notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = (await response.json()) as PorchNotesResponse;
  if (!response.ok) throw new Error(data.error ?? "The note could not be posted.");
  return data.notes;
}
