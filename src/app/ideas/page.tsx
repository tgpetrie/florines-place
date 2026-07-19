"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { IdeaBadge } from "@/components/status-badge";
import { ideas as demoIdeas } from "@/data/ideas";
import { APP_MODE } from "@/lib/app-mode";
import { useRole } from "@/lib/role-context";
import { addIdea, loadIdeas, updateIdea } from "@/lib/ideas-client";
import type { Idea, IdeaCategory, IdeaStatus, SupplyPriority } from "@/lib/types";

export const dynamic = "force-dynamic";

const boardColumns: IdeaStatus[] = ["Idea", "Worth Discussing", "Approved", "In Progress", "Done", "Not Now"];
const categoryOptions: IdeaCategory[] = [
  "Repairs needed", "Improvements", "Decoration ideas", "Outdoor projects",
  "Comfort upgrades", "Accessibility ideas", "Family traditions", "Future dreams",
];

const inputClass =
  "w-full rounded-xl border border-sand-deep/70 bg-shell px-3 py-2 text-sm text-ink placeholder:text-driftwood/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";

function AddIdeaForm({ onAdded }: { onAdded: (ideas: Idea[]) => void }) {
  const { email } = useRole();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IdeaCategory>("Improvements");
  const [priority, setPriority] = useState<SupplyPriority>("normal");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [addedBy, setAddedBy] = useState(email?.split("@")[0] ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="mt-12 space-y-3 rounded-2xl border-2 border-dashed border-sand-deep/70 p-6 sm:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!title.trim() || !addedBy.trim()) return;
        setSubmitting(true);
        setError("");
        try {
          const ideas = await addIdea({
            title: title.trim(), description: description.trim(), category, priority,
            estimatedCost: estimatedCost.trim(), addedBy: addedBy.trim(),
          });
          onAdded(ideas);
          setTitle("");
          setDescription("");
          setEstimatedCost("");
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "The idea could not be saved.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <p className="font-bold text-ink">+ Add an idea</p>
      <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Idea title" className={inputClass} />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Details (optional)" className={inputClass} />
      <div className="grid gap-3 sm:grid-cols-2">
        <select value={category} onChange={(e) => setCategory(e.target.value as IdeaCategory)} className={inputClass}>
          {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input value={estimatedCost} onChange={(e) => setEstimatedCost(e.target.value)} placeholder="Est. cost (optional)" className={inputClass} />
        <input required value={addedBy} onChange={(e) => setAddedBy(e.target.value)} placeholder="Your name" className={inputClass} />
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" checked={priority === "high"} onChange={(e) => setPriority(e.target.checked ? "high" : "normal")} className="h-4 w-4 accent-rust" />
          High priority
        </label>
      </div>
      {error && <p role="alert" className="text-sm font-semibold text-rust">{error}</p>}
      <button type="submit" disabled={submitting} className="btn btn-primary text-sm disabled:cursor-wait disabled:opacity-60">
        {submitting ? "Adding…" : "Add idea"}
      </button>
    </form>
  );
}

function IdeaCard({ idea, onUpdated }: { idea: Idea; onUpdated: (ideas: Idea[]) => void }) {
  const [busy, setBusy] = useState(false);

  async function setStatus(status: IdeaStatus) {
    setBusy(true);
    try {
      onUpdated(await updateIdea({ id: idea.id, status }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg leading-snug text-heading-strong">{idea.title}</h3>
        {idea.priority === "high" && (
          <span className="whitespace-nowrap rounded-full bg-rust/12 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-rust">High</span>
        )}
      </div>
      {idea.description && <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{idea.description}</p>}
      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-driftwood">{idea.category}</p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-sand-deep/40 pt-3 text-xs text-ink-soft">
        <span>
          {idea.addedBy}{idea.estimatedCost && <> · est. <span className="font-bold">{idea.estimatedCost}</span></>}
        </span>
      </div>
      {idea.contact && <p className="mt-1 text-xs font-semibold text-cedarwarm">Contact: {idea.contact}</p>}
      <select
        disabled={busy}
        value={idea.status}
        onChange={(e) => void setStatus(e.target.value as IdeaStatus)}
        className="mt-3 rounded-lg border border-sand-deep/60 bg-shell px-2 py-1 text-xs text-ink"
      >
        {boardColumns.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </article>
  );
}

export default function IdeasPage() {
  const [liveIdeas, setLiveIdeas] = useState<Idea[]>([]);

  const refresh = useCallback(() => {
    if (APP_MODE !== "live") return;
    loadIdeas().then(setLiveIdeas).catch(() => setLiveIdeas([]));
  }, []);

  useEffect(() => refresh(), [refresh]);

  const boardIdeas = APP_MODE === "demo" ? demoIdeas : liveIdeas;
  const grouped = boardColumns
    .map((status) => ({ status, items: boardIdeas.filter((idea) => idea.status === status) }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Dreams & driftwood"
        title="Ideas for the cabin"
        lede="Repairs, upgrades, traditions, and future dreams. Nothing here is a commitment — it's the family thinking out loud about what this place could be."
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {APP_MODE === "live" && (
          <p className="mb-6 text-center text-sm text-driftwood">
            Anyone can{" "}
            <Link href="/suggest-idea" className="font-semibold text-link">suggest an idea</Link>{" "}
            without signing in — it lands here for the family to consider.
          </p>
        )}

        <div className="space-y-10">
          {grouped.length === 0 && (
            <p className="rounded-xl bg-oyster/60 px-4 py-6 text-center text-sm text-driftwood">
              Nothing on the board yet.
            </p>
          )}
          {grouped.map(({ status, items }) => (
            <section key={status}>
              <div className="flex items-center gap-3">
                <IdeaBadge status={status} />
                <span className="text-sm text-driftwood">{items.length} {items.length === 1 ? "idea" : "ideas"}</span>
              </div>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((idea) =>
                  APP_MODE === "live"
                    ? <IdeaCard key={idea.id} idea={idea} onUpdated={setLiveIdeas} />
                    : (
                      <article key={idea.id} className="card flex flex-col p-5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg leading-snug text-heading-strong">{idea.title}</h3>
                          {idea.priority === "high" && (
                            <span className="whitespace-nowrap rounded-full bg-rust/12 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-rust">High</span>
                          )}
                        </div>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{idea.description}</p>
                        <p className="mt-3 text-xs font-bold uppercase tracking-wide text-driftwood">{idea.category}</p>
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-sand-deep/40 pt-3 text-xs text-ink-soft">
                          <span>{idea.addedBy} · est. <span className="font-bold">{idea.estimatedCost}</span></span>
                          <span className="text-driftwood">💬 {idea.commentCount}</span>
                        </div>
                      </article>
                    ),
                )}
              </div>
            </section>
          ))}
        </div>

        {APP_MODE === "live" && <AddIdeaForm onAdded={setLiveIdeas} />}
      </div>
    </div>
  );
}
