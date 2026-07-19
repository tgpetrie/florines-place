"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { SupplyBadge, Badge } from "@/components/status-badge";
import { supplyItems as demoSupplyItems } from "@/data/supplies";
import { beforeYouGoItems, shortDate } from "@/lib/selectors";
import { APP_MODE } from "@/lib/app-mode";
import { useRole } from "@/lib/role-context";
import { addSupplyItem, loadSupplies, updateSupplyItem } from "@/lib/supplies-client";
import type { SupplyCategory, SupplyItem, SupplyPriority, SupplyStatus } from "@/lib/types";

const categoryOrder: SupplyCategory[] = [
  "Groceries", "Paper goods", "Cleaning supplies", "Toiletries",
  "Firewood / propane / utilities", "Tools / hardware", "Linens / towels",
  "Emergency supplies", "Wanted items",
];
const statusOptions: SupplyStatus[] = [
  "In Stock", "Running Low", "Out", "Need to Buy", "Wanted", "Purchased", "Not Sure",
];

const inputClass =
  "w-full rounded-xl border border-sand-deep/70 bg-shell px-3 py-2 text-sm text-ink placeholder:text-driftwood/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";

function AddItemForm({ onAdded }: { onAdded: (items: SupplyItem[]) => void }) {
  const { email } = useRole();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<SupplyCategory>("Groceries");
  const [quantity, setQuantity] = useState("");
  const [updatedBy, setUpdatedBy] = useState(email?.split("@")[0] ?? "");
  const [priority, setPriority] = useState<SupplyPriority>("normal");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="mt-12 space-y-3 rounded-2xl border-2 border-dashed border-sand-deep/70 p-6 sm:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        if (!name.trim() || !updatedBy.trim()) return;
        setSubmitting(true);
        setError("");
        try {
          const items = await addSupplyItem({
            name: name.trim(),
            category,
            status: "Need to Buy",
            quantity: quantity.trim(),
            notes: "",
            updatedBy: updatedBy.trim(),
            priority,
          });
          onAdded(items);
          setName("");
          setQuantity("");
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "The item could not be saved.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <p className="font-bold text-ink">+ Add an item</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" className={inputClass} />
        <select value={category} onChange={(e) => setCategory(e.target.value as SupplyCategory)} className={inputClass}>
          {categoryOrder.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity (e.g. 'One roll left')" className={inputClass} />
        <input required value={updatedBy} onChange={(e) => setUpdatedBy(e.target.value)} placeholder="Your name" className={inputClass} />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input type="checkbox" checked={priority === "high"} onChange={(e) => setPriority(e.target.checked ? "high" : "normal")} className="h-4 w-4 accent-rust" />
        High priority
      </label>
      {error && <p role="alert" className="text-sm font-semibold text-rust">{error}</p>}
      <button type="submit" disabled={submitting} className="btn btn-primary text-sm disabled:cursor-wait disabled:opacity-60">
        {submitting ? "Adding…" : "Add item"}
      </button>
    </form>
  );
}

function ItemCard({ item, onUpdated }: { item: SupplyItem; onUpdated: (items: SupplyItem[]) => void }) {
  const [busy, setBusy] = useState(false);

  async function setStatus(status: SupplyStatus) {
    setBusy(true);
    try {
      onUpdated(await updateSupplyItem({ id: item.id, status, updatedBy: item.updatedBy }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold text-night">{item.name}</span>
        <SupplyBadge status={item.status} />
      </div>
      {item.quantity && <p className="mt-1 text-sm text-ink">{item.quantity}</p>}
      {item.notes && <p className="mt-1 text-sm text-ink-soft">{item.notes}</p>}
      <p className="mt-2 text-xs text-driftwood">
        Updated by {item.updatedBy} · {shortDate(item.updatedAt)}
        {item.priority === "high" && <span className="ml-2 font-bold text-rust">High priority</span>}
      </p>
      <select
        disabled={busy}
        value={item.status}
        onChange={(e) => void setStatus(e.target.value as SupplyStatus)}
        className="mt-2 rounded-lg border border-sand-deep/60 bg-shell px-2 py-1 text-xs text-ink"
      >
        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}

export default function SuppliesPage() {
  const [liveItems, setLiveItems] = useState<SupplyItem[]>([]);

  const refresh = useCallback(() => {
    if (APP_MODE !== "live") return;
    loadSupplies().then(setLiveItems).catch(() => setLiveItems([]));
  }, []);

  useEffect(() => refresh(), [refresh]);

  const items = APP_MODE === "demo" ? demoSupplyItems : liveItems;
  const bringList = beforeYouGoItems(items);
  const byCategory = categoryOrder
    .map((category) => ({ category, items: items.filter((item) => item.category === category) }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="The living pantry board"
        title="Supplies"
        lede="What's at the cabin, what's running low, and what to bring on the next trip. The pantry tide is going out — help it come back in."
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="card mb-8 bg-navy p-6 text-center text-moon">
          <p className="leading-relaxed">
            Instead of emailing a list, please update the Supplies page before you
            leave so the next person knows what is low, out, or worth bringing.
          </p>
          <p className="mt-2 text-xs text-pearl/70">
            Worth a glance: staples, paper products, bottled water, cleaning supplies,
            dish towels, firewood &amp; kindling, charcoal, toiletries, trash bags, and
            laundry supplies.
          </p>
        </div>

        {bringList.length > 0 && (
          <section className="card border-2 !border-rust/30 bg-shell p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-2xl text-heading">Before you go</h2>
              <Badge tone="rust">{bringList.length} things to bring or check</Badge>
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              Heading to the cabin? Here&rsquo;s what to bring or check, pulled from
              everything below that&rsquo;s out, needed, or uncertain.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {bringList.map((item) => (
                <li key={item.id} className="flex items-start gap-3 rounded-xl bg-oyster/70 px-4 py-3">
                  <input type="checkbox" className="mt-1 h-5 w-5 accent-[#b0522c]" aria-label={`Handled: ${item.name}`} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-night">{item.name}</span>
                      <SupplyBadge status={item.status} />
                    </div>
                    {item.notes && <p className="mt-0.5 text-sm text-ink-soft">{item.notes}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 space-y-10">
          {byCategory.length === 0 && (
            <p className="rounded-xl bg-oyster/60 px-4 py-6 text-center text-sm text-driftwood">
              Nothing on the board yet — add the first item below.
            </p>
          )}
          {byCategory.map(({ category, items }) => (
            <section key={category}>
              <h2 className="text-xl text-heading">{category}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {items.map((item) =>
                  APP_MODE === "live"
                    ? <ItemCard key={item.id} item={item} onUpdated={setLiveItems} />
                    : (
                      <div key={item.id} className="card p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-night">{item.name}</span>
                          <SupplyBadge status={item.status} />
                        </div>
                        <p className="mt-1 text-sm text-ink">{item.quantity}</p>
                        {item.notes && <p className="mt-1 text-sm text-ink-soft">{item.notes}</p>}
                        <p className="mt-2 text-xs text-driftwood">
                          Updated by {item.updatedBy} · {shortDate(item.updatedAt)}
                          {item.priority === "high" && <span className="ml-2 font-bold text-rust">High priority</span>}
                        </p>
                      </div>
                    ),
                )}
              </div>
            </section>
          ))}
        </div>

        {APP_MODE === "live" && <AddItemForm onAdded={setLiveItems} />}
      </div>
    </div>
  );
}
