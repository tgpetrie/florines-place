"use client";

import type { SupplyCategory, SupplyItem, SupplyPriority, SupplyStatus } from "@/lib/types";

interface SuppliesResponse {
  connected: boolean;
  items: SupplyItem[];
  error?: string;
}

export async function loadSupplies(): Promise<SupplyItem[]> {
  const response = await fetch("/api/supplies", { cache: "no-store" });
  const data = (await response.json()) as SuppliesResponse;
  if (!response.ok) throw new Error(data.error ?? "Supplies could not be loaded.");
  return data.items;
}

export interface NewSupplyInput {
  name: string;
  category: SupplyCategory;
  status: SupplyStatus;
  quantity: string;
  notes: string;
  updatedBy: string;
  priority: SupplyPriority;
}

export async function addSupplyItem(input: NewSupplyInput): Promise<SupplyItem[]> {
  const response = await fetch("/api/supplies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await response.json()) as SuppliesResponse;
  if (!response.ok) throw new Error(data.error ?? "The item could not be saved.");
  return data.items;
}

export async function updateSupplyItem(input: {
  id: string;
  status?: SupplyStatus;
  quantity?: string;
  notes?: string;
  updatedBy?: string;
  priority?: SupplyPriority;
}): Promise<SupplyItem[]> {
  const response = await fetch("/api/supplies", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = (await response.json()) as SuppliesResponse;
  if (!response.ok) throw new Error(data.error ?? "The item could not be updated.");
  return data.items;
}

export async function removeSupplyItem(id: string): Promise<SupplyItem[]> {
  const response = await fetch(`/api/supplies?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  const data = (await response.json()) as SuppliesResponse;
  if (!response.ok) throw new Error(data.error ?? "The item could not be removed.");
  return data.items;
}
