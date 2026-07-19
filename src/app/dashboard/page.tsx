"use client";

/**
 * Family Dashboard — the family/admin control center.
 *
 * Stay request decisions now use live Supabase mutations in live mode.
 * Remaining quick actions are still placeholders until their backend routes exist.
 */

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRole } from "@/lib/role-context";
import { PageHeader } from "@/components/page-header";
import { CalendarBadge, FeeBadge, SupplyBadge, IdeaBadge, Badge } from "@/components/status-badge";
import { PorchBoard } from "@/components/porch-board";
import { familyPlans as demoFamilyPlans } from "@/data/calendar";
import { supplyItems } from "@/data/supplies";
import { ideas } from "@/data/ideas";
import { guestbookEntries } from "@/data/guestbook";
import { porchNotes as demoPorchNotes } from "@/data/messages";
import { dateRange, shortDate } from "@/lib/selectors";
import { APP_MODE } from "@/lib/app-mode";
import { loadDemoStayRequests, loadReservations, updateStayRequest } from "@/lib/reservations-client";
import { loadPorchNotes } from "@/lib/porch-notes-client";
import { loadAccessRequests, updateAccessRequest } from "@/lib/access-requests-client";
import type { AccessRequest, CalendarEvent, PorchNote, StayRequest } from "@/lib/types";

function mockAction(label: string) {
  // Placeholder: real mutations arrive with Supabase.
  window.alert(`"${label}" is a placeholder for now — it will do the real thing once the backend is connected.`);
}

const actionBtn =
  "rounded-full border border-navy/25 bg-shell px-3.5 py-1.5 text-sm font-bold text-navy transition-colors hover:bg-navy hover:text-moon";
const adminBtn =
  "rounded-full border border-rust/30 bg-shell px-3.5 py-1.5 text-sm font-bold text-rust transition-colors hover:bg-rust hover:text-shell";

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="card scroll-mt-24 p-6">
      <h2 className="text-xl text-heading">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function DashboardPage() {
  const { role, isAuthenticated } = useRole();
  const isAdmin = role === "admin";
  const [reservationRequests, setReservationRequests] = useState<StayRequest[]>([]);
  const [reservationEvents, setReservationEvents] = useState<CalendarEvent[]>([]);
  const [decisionBusyId, setDecisionBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [porchNotes, setPorchNotes] = useState<PorchNote[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [accessBusyId, setAccessBusyId] = useState<string | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);

  useEffect(() => {
    if (APP_MODE === "demo") {
      setPorchNotes(demoPorchNotes);
      return;
    }
    loadPorchNotes().then(setPorchNotes).catch(() => setPorchNotes([]));
  }, []);

  const refreshAccessRequests = useCallback(async () => {
    if (APP_MODE !== "live" || role !== "admin") return;
    try {
      setAccessRequests(await loadAccessRequests());
    } catch {
      setAccessRequests([]);
    }
  }, [role]);

  useEffect(() => {
    void refreshAccessRequests();
  }, [refreshAccessRequests]);

  const decideAccessRequest = useCallback(async (id: string, status: "approved" | "declined") => {
    setAccessError(null);
    setAccessBusyId(id);
    try {
      await updateAccessRequest({ id, status });
      await refreshAccessRequests();
    } catch (error) {
      setAccessError(error instanceof Error ? error.message : "The access request update failed.");
    } finally {
      setAccessBusyId(null);
    }
  }, [refreshAccessRequests]);

  const refreshReservations = useCallback(async () => {
    if (APP_MODE === "demo") setReservationRequests(loadDemoStayRequests());
    try {
      const snapshot = await loadReservations();
      setReservationEvents(snapshot.events);
      if (APP_MODE === "live") setReservationRequests(snapshot.requests);
    } catch {
      setReservationEvents([]);
      if (APP_MODE === "live") setReservationRequests([]);
    }
  }, []);

  const decideRequest = useCallback(async (
    id: string,
    status: "approved" | "declined",
    cleaningFee?: "due" | "paid" | "waived",
  ) => {
    setActionError(null);
    setDecisionBusyId(id);
    try {
      await updateStayRequest({ id, status, cleaningFee });
      await refreshReservations();
      window.dispatchEvent(new Event("florines:reservations-changed"));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "The stay request update failed.");
    } finally {
      setDecisionBusyId(null);
    }
  }, [refreshReservations]);

  const markCleaningFeePaid = useCallback(async (id: string, status: "pending" | "approved" | "declined") => {
    setActionError(null);
    setDecisionBusyId(id);
    try {
      await updateStayRequest({ id, status, cleaningFee: "paid" });
      await refreshReservations();
      window.dispatchEvent(new Event("florines:reservations-changed"));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "The stay request update failed.");
    } finally {
      setDecisionBusyId(null);
    }
  }, [refreshReservations]);

  useEffect(() => {
    void refreshReservations();
    window.addEventListener("florines:reservations-changed", refreshReservations);
    window.addEventListener("storage", refreshReservations);
    return () => {
      window.removeEventListener("florines:reservations-changed", refreshReservations);
      window.removeEventListener("storage", refreshReservations);
    };
  }, [refreshReservations]);

  const familyPlans = APP_MODE === "demo" ? demoFamilyPlans : [];

  // Guests see a gentle door, plus their own request status.
  if (role === "guest") {
    const myRequest = reservationRequests[0];
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

  const pending = reservationRequests.filter((r) => r.status === "pending");
  const approved = reservationRequests.filter((r) => r.status === "approved");
  const recentSupplies = [...(APP_MODE === "demo" ? supplyItems : [])]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);
  const activeIdeas = (APP_MODE === "demo" ? ideas : [])
    .filter((i) => i.status !== "Done" && i.status !== "Not Now")
    .slice(0, 4);
  const maintenance = reservationEvents.filter((e) => e.status === "maintenance");
  const recentEntries = (APP_MODE === "demo" ? guestbookEntries : []).filter(
    (e) => e.visibility === "family" || isAdmin,
  ).slice(0, 2);

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow={isAdmin ? "Family Dashboard · Admin" : "Family Dashboard"}
        title="Keeping the lantern lit"
        lede="Requests to review, stays coming up, and the small acts of care that keep Florine's Place ready for everyone."
      />

      {/* Sub-sections — Supplies & Ideas now live here rather than in the top nav */}
      <nav className="mx-auto mb-2 flex max-w-6xl flex-wrap justify-center gap-2 px-4 sm:px-6" aria-label="Dashboard sections">
        {[
          { href: "#requests", label: "Stay Requests" },
          ...(isAdmin ? [{ href: "#access-requests", label: "Access Requests" }] : []),
          { href: "/supplies", label: "Supplies" },
          { href: "/ideas", label: "Ideas" },
          { href: "#maintenance", label: "Maintenance" },
          { href: "#porch-notes", label: "Porch Notes" },
          { href: "#guestbook", label: "Family Notes" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-full border border-sand-deep/60 bg-shell px-3.5 py-1.5 text-sm font-semibold text-navy hover:bg-sand/40"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
        {/* Pending requests — full width */}
        <section id="requests" className="card scroll-mt-24 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl text-heading">Pending stay requests</h2>
            <Badge tone="sand">{pending.length} waiting</Badge>
          </div>
          <div className="mt-4 space-y-4">
            {actionError && (
              <p className="rounded-xl border border-rust/40 bg-rust/10 px-4 py-3 text-sm text-rust">
                {actionError}
              </p>
            )}
            {pending.length === 0 && (
              <p className="rounded-xl bg-oyster/60 px-4 py-5 text-center text-sm text-driftwood">
                No pending stay requests.
              </p>
            )}
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
                  <button
                    className={actionBtn}
                    disabled={decisionBusyId === req.id}
                    onClick={() => void decideRequest(req.id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className={actionBtn}
                    disabled={decisionBusyId === req.id}
                    onClick={() => void decideRequest(req.id, "declined")}
                  >
                    Decline
                  </button>
                  <button className={actionBtn} onClick={() => mockAction("Ask a question")}>
                    Ask a question
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        className={adminBtn}
                        disabled={decisionBusyId === req.id}
                        onClick={() => void decideRequest(req.id, "approved", "waived")}
                      >
                        Approve &amp; waive fee
                      </button>
                      <button
                        className={adminBtn}
                        disabled={decisionBusyId === req.id}
                        onClick={() => void markCleaningFeePaid(req.id, req.status)}
                      >
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

        {/* Access requests — admin only */}
        {isAdmin && (
          <section id="access-requests" className="card scroll-mt-24 p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-heading">Access requests</h2>
              <Badge tone="sand">
                {accessRequests.filter((r) => r.status === "pending").length} waiting
              </Badge>
            </div>
            <div className="mt-4 space-y-4">
              {accessError && (
                <p className="rounded-xl border border-rust/40 bg-rust/10 px-4 py-3 text-sm text-rust">
                  {accessError}
                </p>
              )}
              {accessRequests.filter((r) => r.status === "pending").length === 0 && (
                <p className="rounded-xl bg-oyster/60 px-4 py-5 text-center text-sm text-driftwood">
                  No pending access requests.
                </p>
              )}
              {accessRequests.filter((r) => r.status === "pending").map((req) => (
                <div key={req.id} className="rounded-xl border border-sand-deep/50 bg-oyster/60 p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <span className="text-lg font-bold text-night">{req.name}</span>
                      <span className="ml-3 text-ink-soft">{req.email}</span>
                    </div>
                    <span className="text-xs text-driftwood">asked {shortDate(req.submitted)}</span>
                  </div>
                  {req.message && <p className="mt-2 text-sm italic text-ink-soft">&ldquo;{req.message}&rdquo;</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className={actionBtn}
                      disabled={accessBusyId === req.id}
                      onClick={() => void decideAccessRequest(req.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className={actionBtn}
                      disabled={accessBusyId === req.id}
                      onClick={() => void decideAccessRequest(req.id, "declined")}
                    >
                      Decline
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-driftwood">
                    Approving is a note-to-self — invite {req.name.split(" ")[0]} through Supabase to actually grant access.
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming approved stays + fee status */}
        <Section title="Upcoming Approved Stays">
          <ul className="space-y-3">
            {approved.length === 0 && <li className="text-sm text-driftwood">No approved request records yet.</li>}
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
            {familyPlans.length === 0 && <li className="text-sm text-driftwood">No softer plans yet.</li>}
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
            {recentSupplies.length === 0 && <li className="text-sm text-driftwood">No live supply updates yet.</li>}
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
          <Link href="/supplies" className="text-link mt-4 inline-block text-sm font-bold">
            Open the pantry board →
          </Link>
        </Section>

        {/* Ideas & improvements */}
        <Section title="Ideas &amp; improvements">
          <ul className="space-y-3">
            {activeIdeas.length === 0 && <li className="text-sm text-driftwood">No live ideas yet.</li>}
            {activeIdeas.map((idea) => (
              <li key={idea.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-oyster/60 px-4 py-3">
                <div>
                  <span className="font-bold text-night">{idea.title}</span>
                  <span className="ml-2 text-xs text-driftwood">{idea.addedBy}</span>
                </div>
                <IdeaBadge status={idea.status} />
              </li>
            ))}
          </ul>
          <Link href="/ideas" className="text-link mt-4 inline-block text-sm font-bold">
            Open the ideas board →
          </Link>
        </Section>

        {/* Maintenance notes */}
        <Section id="maintenance" title="Maintenance notes">
          <ul className="space-y-3">
            {maintenance.map((event) => (
              <li key={event.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-oyster/60 px-4 py-3">
                <CalendarBadge status={event.status} />
                <span className="text-sm text-ink">
                  <span className="font-bold">{dateRange(event.start, event.end)}</span> — {event.who}: {event.label}
                </span>
              </li>
            ))}
            {APP_MODE === "demo" && <li className="rounded-lg bg-oyster/60 px-4 py-3 text-sm text-ink">
              <span className="font-bold">Ongoing</span> — shower re-caulk in progress; propane level unknown
              (flagged in Supplies).
            </li>}
            {maintenance.length === 0 && <li className="text-sm text-driftwood">No live maintenance notes yet.</li>}
          </ul>
        </Section>

        {/* Porch Notes — full width */}
        <section id="porch-notes" className="card scroll-mt-24 p-6 lg:col-span-2">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl text-heading">Porch Notes</h2>
            <Link href="/porch" className="text-sm font-semibold text-link">
              Open full board →
            </Link>
          </div>
          <div className="mt-4">
            <PorchBoard initialNotes={porchNotes} isAuthenticated={isAuthenticated} />
          </div>
        </section>

        {/* Guestbook */}
        <Section id="guestbook" title="Recent guestbook entries">
          <ul className="space-y-3">
            {recentEntries.length === 0 && <li className="text-sm text-driftwood">No live guestbook entries yet.</li>}
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
          <Link href="/guestbook" className="text-link mt-4 inline-block text-sm font-bold">
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
