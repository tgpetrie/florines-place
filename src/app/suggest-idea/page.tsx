import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { SuggestIdeaForm } from "@/components/suggest-idea-form";

export const metadata: Metadata = { title: "Suggest an Idea" };

export default function SuggestIdeaPage() {
  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Dreams & driftwood"
        title="Got an idea for the cabin?"
        lede="Open to everyone — no account needed. Repairs, upgrades, traditions, anything. It goes straight to the family's board."
      />
      <div className="px-4 sm:px-6">
        <SuggestIdeaForm />
      </div>
    </div>
  );
}
