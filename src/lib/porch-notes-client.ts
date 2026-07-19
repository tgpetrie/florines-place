"use client";

import type { PorchNote, PorchNoteCategory } from "@/lib/types";

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

export interface PorchNoteSubmission {
  posterName: string;
  contact: string;
  message: string;
  category: PorchNoteCategory;
  image?: File | null;
}

export async function submitPorchNote(input: PorchNoteSubmission): Promise<PorchNote[]> {
  const form = new FormData();
  form.set("posterName", input.posterName);
  form.set("contact", input.contact);
  form.set("message", input.message);
  form.set("category", input.category);
  if (input.image) form.set("image", input.image);

  const response = await fetch("/api/porch-notes", { method: "POST", body: form });
  const data = (await response.json()) as PorchNotesResponse;
  if (!response.ok) throw new Error(data.error ?? "The note could not be posted.");
  return data.notes;
}
