"use client";

import type { Idea, IdeaCategory, IdeaStatus, SupplyPriority } from "@/lib/types";

interface IdeasResponse {
  connected: boolean;
  ideas: Idea[];
  error?: string;
}

export async function loadIdeas(): Promise<Idea[]> {
  const response = await fetch("/api/ideas", { cache: "no-store" });
  const data = (await response.json()) as IdeasResponse;
  if (!response.ok) throw new Error(data.error ?? "Ideas could not be loaded.");
  return data.ideas;
}

export interface NewIdeaInput {
  title: string;
  description: string;
  category: IdeaCategory;
  priority: SupplyPriority;
  estimatedCost: string;
  addedBy: string;
}

export async function addIdea(input: NewIdeaInput): Promise<Idea[]> {
  const response = await fetch("/api/ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await response.json()) as IdeasResponse;
  if (!response.ok) throw new Error(data.error ?? "The idea could not be saved.");
  return data.ideas;
}

export async function suggestIdea(input: { title: string; description: string; posterName: string; contact: string }) {
  const response = await fetch("/api/ideas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await response.json()) as { ok?: boolean; error?: string };
  if (!response.ok) throw new Error(data.error ?? "The idea could not be saved.");
}

export async function updateIdea(input: { id: string; status?: IdeaStatus; priority?: SupplyPriority; estimatedCost?: string }): Promise<Idea[]> {
  const response = await fetch("/api/ideas", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await response.json()) as IdeasResponse;
  if (!response.ok) throw new Error(data.error ?? "The idea could not be updated.");
  return data.ideas;
}
