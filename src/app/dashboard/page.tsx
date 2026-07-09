"use client";

/**
 * Family Dashboard — the family/admin control center.
 *
 * All actions are placeholders (they don't mutate anything yet).
 * BACKEND NOTE: each action button becomes a Supabase mutation —
 * update stay_requests.status, update cleaning fee, insert calendar blocks.
 * Role gating here becomes real row-level security once Supabase Auth lands.
 */

import Link from "next/link";
import { useRole } from "@/lib/role-context";
import { PageHeader } from "@/components/page-header";
import { CalendarBadge, FeeBadge, SupplyBadge, Badge } from "@/components/status-badge";
import { stayRequests } from "@/data/stay-requests";
import { calendarEvents, familyPlans } from "@/data/calendar";
import { supplyItems } from "@/data/supplies";
import { guestbookEntries } from "@/data/guestbook";
import { dateRange, shortDate } from "@/lib/selectors";

function mockAction(label: string) {
  // Placeholder: real mutations arrive with Supabase.
  window.alert(`"${label}" is a placeholder for now — it will do the real thing once the backend is connected.`);
}

const actionBtn =
  "rounded-full border border-navy/25 bg-shell px-3.5 py-1.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-moon";
const adminBtn =
  "rounded-full border border-rust/30 bg-shell px-3.5 py-1.5 text-sm font-bold text-rust transition-colors hover:bg-rust hover:text-shell";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <h2 className="text-xl text-night">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function DashboardPage() {
  const { role } = useRole();
  const isAdmin = role === "admin";

  // Guests see a gentle door, plus their own request status.
  if (role === "guest") {
    const myRequest = stayRequests.find((r) => r.name === "The Hendersons");
    return (
      <div className="pb-8">
        <PageHeader
          eyebrow="Family Dashboard"
          title="This room is for the family"
          lede="The dashboard is where the family reviews requests and cares for the cabin. If you have a stay request in, its status lives right here."
        />
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          {myRequest && (
            <div className="card p-6">
              <p className="eyebrow">Your stay request</p>
              <p className="mt-2 text-lg font-bold text-night">
                {dateRange(myRequest.arrival, myRequest.departure)}
              </p>
              <p className="mt-1 text-ink-soft">{myRequest.party}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone={myRequest.status === "approved" ? "seaweed" : "sand"}>
                  {myRequest.status === "pending" ? "Waiting for family approval" : myRequest.status}
                </Badge>
                <FeeBadge status={myRequest.cleaningFee} />
              </div>
              <p className="mt-4 text-sm text-driftwood">
                Please wait for family approval before making firm plans.
              </p>
            </div>
          )}
          <p className="mt-6 text-center text-sm text-driftwood">
            Family member? Use the &ldquo;Viewing as&rdquo; switcher in the header
            (a stand-in for real logins, coming later).
          </p>
        </div>
      </div>
    );
  }

  const pending = stayRequests.filter((r) => r.status === "pending");
  const approved = stayRequests.filter((r) => r.status === "approved");
  const recentSupplies = [...supplyItems]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);
  const maintenance = calendarEvents.filter((e) => e.status === "maintenance");
  const recentEntries = guestbookEntries.filter(
    (e) => e.visibility === "family" || isAdmin,
  ).slice(0, 2);

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow={isAdmin ? "Family Dashboard · Admin" : "Family Dashboard"}
        title="Keeping the lantern lit"
        lede="Requests to review, stays coming up, and the small acts of care that keep Florine's Place ready for everyone."
      />

      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
        {/* Pending requests — full width */}
        <section className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-night">Pending stay requests</h2>
            <Badge tone="sand">{pending.length} waiting</Badge>
          </div>
          <div className="mt-4 space-y-4">
            {pending.map((req) => (
              <div key={req.id} className="rounded-xl border border-sand-deep/50 bg-oyster/60 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <span className="text-lg font-bold text-night">{req.name}</span>
                    <span className="ml-3 text-ink-soft">{dateRange(req.arrival, req.departure)}</span>
                  </div>
                  <span className="text-xs text-driftwood">
                    {req.guestCount} guests · asked {shortDate(req.submitted)}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-soft">
                  {req.party}
                  {req.pets && ` · ${req.pets}`}
                </p>
                <p className="mt-1 text-sm italic text-ink-soft">&ldquo;{req.note}&rdquo;</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button className={actionBtn} onClick={() => mockAction("Approve")}>
                    Approve
                  </button>
                  <button className={actionBtn} onClick={() => mockAction("Decline")}>
                    Decline
                  </button>
                  <button className={actionBtn} onClick={() => mockAction("Ask a question")}>
                    Ask a question
                  </button>
                  {isAdmin && (
                    <>
                      <button className={adminBtn} onClick={() => mockAction("Approve & waive cleaning fee")}>
                        Approve &amp; waive fee
                      </button>
                      <button className={adminBtn} onClick={() => mockAction("Mark cleaning fee paid")}>
                        Mark fee paid
                      </button>
                      <button className={adminBtn} onClick={() => mockAction("Block dates")}>
                        Block dates
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming approved stays + fee status */}
        <Section title="Upcoming Approved Stays">
          <ul className="space-y-3">
            {approved.map((req) => (
              <li key={req.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-oyster/60 px-4 py-3">
                <div>
                  <span className="font-bold text-night">{req.name}</span>
                  <span className="ml-2 text-sm text-ink-soft">{dateRange(req.arrival, req.departure)}</span>
                </div>
                <FeeBadge status={req.cleaningFee} />
              </li>
            ))}
          </ul>
          {isAdmin && (
            <p className="mt-4 text-xs text-driftwood">
              Admins can waive fees or mark them paid from each request.
              Payment tracking stays manual until the family decides otherwise.
            </p>
          )}
        </Section>

        {/* Family considering */}
        <Section title="Family considering">
          <ul className="space-y-3">
            {familyPlans.map((plan) => (
              <li key={plan.id} className="rounded-lg bg-oyster/60 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-night">{plan.who}</span>
                  <span className="text-xs font-bold text-cedar">{plan.intent}</span>
                </div>
                <p className="text-sm text-ink-soft">
                  {plan.window} · {plan.mode}
                </p>
              </li>
            ))}
          </ul>
          <button className={`${actionBtn} mt-4`} onClick={() => mockAction("Add thinking-about-going dates")}>
            + Add &ldquo;thinking about going&rdquo; dates
          </button>
        </Section>

        {/* Supply updates */}
        <Section title="Recent supply updates">
          <ul className="space-y-3">
            {recentSupplies.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-oyster/60 px-4 py-3">
                <div>
                  <span className="font-bold text-night">{item.name}</span>
                  <span className="ml-2 text-xs text-driftwood">
                    {item.updatedBy}, {shortDate(item.updatedAt)}
                  </span>
                </div>
                <SupplyBadge status={item.status} />
              </li>
            ))}
          </ul>
          <Link href="/supplies" className="mt-4 inline-block text-sm font-bold text-navy underline underline-offset-2">
            Open the pantry board →
          </Link>
        </Section>

        {/* Maintenance notes */}
        <Section title="Maintenance notes">
          <ul className="space-y-3">
            {maintenance.map((event) => (
              <li key={event.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-oyster/60 px-4 py-3">
                <CalendarBadge status={event.status} />
                <span className="text-sm text-ink">
                  <span className="font-bold">{dateRange(event.start, event.end)}</span> — {event.who}: {event.label}
                </span>
              </li>
            ))}
            <li className="rounded-lg bg-oyster/60 px-4 py-3 text-sm text-ink">
              <span className="font-bold">Ongoing</span> — shower re-caulk in progress; propane level unknown
              (flagged in Supplies).
            </li>
          </ul>
        </Section>

        {/* Guestbook */}
        <Section title="Recent guestbook entries">
          <ul className="space-y-3">
            {recentEntries.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-oyster/60 px-4 py-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-bold text-night">{entry.name}</span>
                  <span className="text-xs text-driftwood">{entry.stayDates}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm italic text-ink-soft">&ldquo;{entry.message}&rdquo;</p>
              </li>
            ))}
          </ul>
          <Link href="/guestbook" className="mt-4 inline-block text-sm font-bold text-navy underline underline-offset-2">
            Read the guestbook →
          </Link>
        </Section>

        {/* Quick actions — full width */}
        <section className="card bg-navy p-6 text-moon lg:col-span-2">
          <h2 className="text-xl">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Add family hold", "Add cleaning day", "Note a maintenance trip", "Update supplies"].map((label) => (
              <button
                key={label}
                className="rounded-full border border-moon/30 px-4 py-2 text-sm font-bold text-moon transition-colors hover:bg-moon/10"
                onClick={() => mockAction(label)}
              >
                {label}
              </button>
            ))}
            {isAdmin &&
              ["Manage users", "Manage calendar blocks", "Edit cabin guide", "App settings"].map((label) => (
                <button
                  key={label}
                  className="rounded-full border border-rust/60 bg-rust/20 px-4 py-2 text-sm font-bold text-moon transition-colors hover:bg-rust/40"
                  onClick={() => mockAction(label)}
                >
                  {label}
                </button>
              ))}
          </div>
          {!isAdmin && (
            <p className="mt-3 text-xs text-pearl/70">
              User management, calendar blocks, guide editing, and settings are admin tools —
              switch to Admin in the header to preview them.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
