import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { IdeaBadge } from "@/components/status-badge";
import { ideas } from "@/data/ideas";
import type { IdeaStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Ideas" };

const boardColumns: IdeaStatus[] = [
  "Idea",
  "Worth Discussing",
  "Approved",
  "In Progress",
  "Done",
  "Not Now",
];

export default function IdeasPage() {
  const grouped = boardColumns
    .map((status) => ({
      status,
      items: ideas.filter((idea) => idea.status === status),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Dreams & driftwood"
        title="Ideas for the cabin"
        lede="Repairs, upgrades, traditions, and future dreams. Nothing here is a commitment — it's the family thinking out loud about what this place could be."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="space-y-10">
          {grouped.map(({ status, items }) => (
            <section key={status}>
              <div className="flex items-center gap-3">
                <IdeaBadge status={status} />
                <span className="text-sm text-driftwood">
                  {items.length} {items.length === 1 ? "idea" : "ideas"}
                </span>
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((idea) => (
                  <article key={idea.id} className="card flex flex-col p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg leading-snug text-night">{idea.title}</h3>
                      {idea.priority === "high" && (
                        <span className="whitespace-nowrap rounded-full bg-rust/12 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-rust">
                          High
                        </span>
                      )}
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{idea.description}</p>
                    <p className="mt-3 text-xs font-bold uppercase tracking-wide text-driftwood">
                      {idea.category}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-sand-deep/40 pt-3 text-xs text-ink-soft">
                      <span>
                        {idea.addedBy} · est. <span className="font-bold">{idea.estimatedCost}</span>
                      </span>
                      {/* Placeholder until real comments exist */}
                      <span className="text-driftwood">
                        💬 {idea.commentCount}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border-2 border-dashed border-sand-deep/70 p-8 text-center">
          <p className="font-bold text-ink">+ Add an idea</p>
          <p className="mt-1 text-sm text-driftwood">
            Adding, voting, and comments arrive with the backend. For now, tell
            the family the old-fashioned way — at the cabin, over crab.
          </p>
        </div>
      </div>
    </div>
  );
}
