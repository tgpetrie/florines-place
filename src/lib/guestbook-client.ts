"use client";

import type { LiveGuestbookEntry } from "@/lib/types";

interface GuestbookResponse {
  connected: boolean;
  entries: LiveGuestbookEntry[];
  error?: string;
}

export async function loadGuestbookEntries(): Promise<LiveGuestbookEntry[]> {
  const response = await fetch("/api/guestbook", { cache: "no-store" });
  const data = (await response.json()) as GuestbookResponse;
  if (!response.ok) throw new Error(data.error ?? "The guestbook could not be loaded.");
  return data.entries;
}

export interface GuestbookSubmission {
  posterName: string;
  contact: string;
  message: string;
  image?: File | null;
}

export async function submitGuestbookEntry(input: GuestbookSubmission): Promise<LiveGuestbookEntry[]> {
  const form = new FormData();
  form.set("posterName", input.posterName);
  form.set("contact", input.contact);
  form.set("message", input.message);
  if (input.image) form.set("image", input.image);

  const response = await fetch("/api/guestbook", { method: "POST", body: form });
  const data = (await response.json()) as GuestbookResponse;
  if (!response.ok) throw new Error(data.error ?? "The entry could not be posted.");
  return data.entries;
}
