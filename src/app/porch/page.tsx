import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PorchBoard } from "@/components/porch-board";
import { APP_MODE } from "@/lib/app-mode";
import { getAuthViewer } from "@/lib/auth";
import { loadPorchNotesSnapshot } from "@/lib/porch-notes.server";
import { porchNotes as demoPorchNotes } from "@/data/messages";

export const metadata: Metadata = { title: "Porch Notes" };
export const dynamic = "force-dynamic";

export default async function PorchPage() {
  const viewer = await getAuthViewer();
  const notes = APP_MODE === "demo" ? demoPorchNotes : (await loadPorchNotesSnapshot()).notes;

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Porch Notes"
        title="The family cabin conversation"
        lede="Open to everyone who visits Florine's Place — sign in to leave a note of your own."
      />
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <PorchBoard initialNotes={notes} isAuthenticated={viewer.isAuthenticated} />
      </div>
    </div>
  );
}
