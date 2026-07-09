import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { SupplyBadge, Badge } from "@/components/status-badge";
import { supplyItems } from "@/data/supplies";
import { beforeYouGoItems, shortDate } from "@/lib/selectors";
import type { SupplyCategory } from "@/lib/types";

export const metadata: Metadata = { title: "Supplies" };

const categoryOrder: SupplyCategory[] = [
  "Groceries",
  "Paper goods",
  "Cleaning supplies",
  "Toiletries",
  "Firewood / propane / utilities",
  "Tools / hardware",
  "Linens / towels",
  "Emergency supplies",
  "Wanted items",
];

export default function SuppliesPage() {
  const bringList = beforeYouGoItems(supplyItems);
  const byCategory = categoryOrder
    .map((category) => ({
      category,
      items: supplyItems.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="The living pantry board"
        title="Supplies"
        lede="What's at the cabin, what's running low, and what to bring on the next trip. The pantry tide is going out — help it come back in."
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* The restock habit — replaces the 2020 letter's email-a-list workflow */}
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

        {/* Before You Go checklist */}
        <section className="card border-2 !border-rust/30 bg-shell p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-2xl text-night">Before you go</h2>
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
                  <p className="mt-0.5 text-sm text-ink-soft">{item.notes}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Full board by category */}
        <div className="mt-12 space-y-10">
          {byCategory.map(({ category, items }) => (
            <section key={category}>
              <h2 className="text-xl text-night">{category}</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {items.map((item) => (
                  <div key={item.id} className="card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-night">{item.name}</span>
                      <SupplyBadge status={item.status} />
                    </div>
                    <p className="mt-1 text-sm text-ink">{item.quantity}</p>
                    {item.notes && <p className="mt-1 text-sm text-ink-soft">{item.notes}</p>}
                    <p className="mt-2 text-xs text-driftwood">
                      Updated by {item.updatedBy} · {shortDate(item.updatedAt)}
                      {item.priority === "high" && (
                        <span className="ml-2 font-bold text-rust">High priority</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Placeholder add/edit — becomes real with Supabase real-time */}
        <div className="mt-12 rounded-2xl border-2 border-dashed border-sand-deep/70 p-8 text-center">
          <p className="font-bold text-ink">+ Add or update an item</p>
          <p className="mt-1 text-sm text-driftwood">
            Editing arrives with the backend — this board will update live while
            someone stands in the cabin kitchen taking inventory.
          </p>
        </div>
      </div>
    </div>
  );
}
