import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PorchBoard } from "@/components/porch-board";
import { APP_MODE } from "@/lib/app-mode";
import { getAuthViewer } from "@/lib/auth";
import { loadPorchNotesSnapshot } from "@/lib/porch-notes.server";
import { demoPorchNotes } from "@/data/messages";

export const metadata: Metadata = { title: "Porch Notes" };
export const dynamic = "force-dynamic";

export default async function PorchPage() {
  const viewer = await getAuthViewer();
  const isAdmin = viewer.role === "admin";
  const notes = APP_MODE === "demo" ? demoPorchNotes : (await loadPorchNotesSnapshot(isAdmin)).notes;

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Porch Notes"
        title="Supplies needed, things to fix"
        lede="Open to everyone — no account needed. Leave your name and a phone or email so the family can follow up privately if needed; everything else you post is public."
      />
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <PorchBoard initialNotes={notes} showContact={isAdmin} />
      </div>
    </div>
  );
}
