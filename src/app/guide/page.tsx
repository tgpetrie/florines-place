"use client";

/**
 * Cabin Guide — a calm family cheat sheet, not a documentation portal.
 *
 * Layout: four glanceable summary cards answer "what do I need to know right
 * now?" (arriving, leaving, something broke, supplies). The complete
 * 2020-letter detail lives below in accordions, closed by default except
 * Arrival. Visibility gating still applies (see canSee in lib/selectors.ts).
 *
 * BACKEND NOTE: with Supabase, visibility becomes row-level security and the
 * placeholder actions become mutations.
 */

import Link from "next/link";
import { useState } from "react";
import { useRole } from "@/lib/role-context";
import { GuideIcon } from "@/components/guide-icons";
import { PlaceSignalsDetailed } from "@/components/place-signals";
import { PrivateDirections } from "@/components/private-directions";
import {
  contactsPrivacyNote,
  emergencyInfo,
  familyContacts,
  guidePrinciple,
  guideTopics,
} from "@/data/guide";
import { supplyItems } from "@/data/supplies";
import { beforeYouGoItems, canSee, fullDate } from "@/lib/selectors";
import type { GuideTopic } from "@/lib/types";
import { APP_MODE } from "@/lib/app-mode";

function mockAction(label: string) {
  window.alert(`"${label}" is a placeholder — real guide editing arrives with the backend.`);
}

/** Small, quiet tags — no loud badges in the accordion headers. */
function QuietTags({ topic }: { topic: Pick<GuideTopic, "needsVerification" | "visibility"> }) {
  return (
    <span className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-wide text-driftwood">
      {topic.needsVerification && <span className="text-cedar">Family check</span>}
      {topic.visibility !== "public" && topic.visibility !== "approved_guest" && (
        <span>{topic.visibility === "family" ? "Family" : "Admin"}</span>
      )}
    </span>
  );
}

// --- Reusable bits shared by summary cards and accordions ------------------------

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 rounded-lg bg-oyster/70 px-4 py-2.5">
          <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-navy" aria-label={`Done: ${item}`} />
          <span className="text-ink">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A plain glance-list for the summary cards (not interactive). */
function GlanceList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-0.5 text-seaweed" aria-hidden="true">
            ✓
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function TopicFooter({ topic }: { topic: { lastVerified?: string; sourceNote?: string; title: string } }) {
  const { role } = useRole();
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-sand-deep/40 pt-3">
      <span className="text-xs text-driftwood">
        {topic.lastVerified ? `Last verified ${fullDate(topic.lastVerified)}` : "Not yet verified"}
        {topic.sourceNote ? ` · ${topic.sourceNote}` : ""}
      </span>
      {role === "admin" && (
        <span className="flex gap-2">
          <button
            type="button"
            className="rounded-full border border-rust/30 px-2.5 py-0.5 text-xs font-bold text-rust hover:bg-rust hover:text-shell"
            onClick={() => mockAction(`Edit "${topic.title}"`)}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-full border border-seaweed/40 px-2.5 py-0.5 text-xs font-bold text-seaweed hover:bg-seaweed hover:text-shell"
            onClick={() => mockAction(`Mark "${topic.title}" verified today`)}
          >
            Mark verified
          </button>
        </span>
      )}
    </div>
  );
}

/** The inner detail of a guide topic — rendered inside an open accordion. */
function TopicBody({ topic }: { topic: GuideTopic }) {
  return (
    <>
      {topic.summary && <p className="font-bold text-ink">{topic.summary}</p>}

      {topic.body?.map((paragraph, i) => (
        <p key={i} className="mt-3 leading-relaxed text-ink-soft">
          {paragraph}
        </p>
      ))}

      {topic.steps && (
        <ol className="mt-4 space-y-3">
          {topic.steps.map((step, i) => (
            <li key={i} className="flex gap-3.5 rounded-xl bg-oyster/70 p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-moon">
                {i + 1}
              </span>
              <div>
                <p className="font-bold text-night">{step.label}</p>
                {step.detail && <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{step.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
      )}

      {topic.checklist && (
        <div className="mt-4">
          <Checklist items={topic.checklist} />
        </div>
      )}

      {topic.checklistGroups?.map((group) => (
        <div key={group.title} className="mt-5">
          <h4 className="text-lg text-heading-strong">{group.title}</h4>
          <div className="mt-2">
            <Checklist items={group.items} />
          </div>
        </div>
      ))}

      {topic.notes && (
        <ul className="mt-4 space-y-2">
          {topic.notes.map((note, i) => (
            <li key={i} className="rounded-lg bg-sand/30 px-4 py-2.5 text-sm leading-relaxed text-cedar">
              {note}
            </li>
          ))}
        </ul>
      )}

      {topic.id === "internet" && <PrivateDirections className="mt-4" />}

      {topic.photoPlaceholders && (
        <div className="mt-4 flex flex-wrap gap-2">
          {topic.photoPlaceholders.map((label) => (
            <span
              key={label}
              className="rounded-xl border-2 border-dashed border-sand-deep/70 px-3.5 py-2 text-xs font-bold text-driftwood"
            >
              📷 Photo coming: {label}
            </span>
          ))}
        </div>
      )}

      {topic.sourceLinks && topic.sourceLinks.length > 0 && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {topic.sourceLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-tide/30 bg-tide/10 px-4 py-2 text-sm font-bold text-tide transition hover:bg-tide hover:text-white"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}

      <TopicFooter topic={topic} />
    </>
  );
}

export default function GuidePage() {
  const { role } = useRole();
  const [openId, setOpenId] = useState<string>("arrival");

  const visibleTopics = guideTopics.filter(
    (t) => t.id !== "breaks" && canSee(role, t.visibility),
  );
  const showEmergency = canSee(role, emergencyInfo.visibility);
  const showContacts = canSee(role, "family");

  // Full Guide is grouped by category; "If Something Breaks" is a summary card.
  const guideGroups: { title: string; ids: string[] }[] = [
    { title: "Getting Settled", ids: ["arrival", "water", "heating", "bedding"] },
    { title: "Using the Cabin", ids: ["internet", "barbecue", "parking", "neighbors", "pets"] },
    { title: "Leaving", ids: ["cleaning", "departure", "trash", "restock"] },
    { title: "Private / Important", ids: ["emergency", "contacts"] },
  ];

  function openAndScroll(id: string) {
    setOpenId(id);
    window.setTimeout(() => {
      document.getElementById(`acc-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  }

  // --- Supplies glance ---
  const inventory = APP_MODE === "demo" ? supplyItems : [];
  const outCount = inventory.filter((s) => s.status === "Out" || s.status === "Need to Buy").length;
  const lowCount = inventory.filter((s) => s.status === "Running Low").length;
  const bringCount = beforeYouGoItems(inventory).length;

  // Accordion header + body wrapper
  function Accordion({
    id,
    title,
    icon,
    tags,
    children,
  }: {
    id: string;
    title: string;
    icon: React.ReactNode;
    tags?: React.ReactNode;
    children: React.ReactNode;
  }) {
    const open = openId === id;
    return (
      <div id={`acc-${id}`} className="scroll-mt-24 border-b border-sand-deep/40 last:border-b-0">
        <h3>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`acc-panel-${id}`}
            onClick={() => setOpenId(open ? "" : id)}
            className="flex w-full items-center gap-3 py-4 text-left"
          >
            <span className="text-cedar/80">{icon}</span>
            <span className="flex-1 text-lg font-bold text-heading-strong" style={{ fontFamily: "var(--font-display)" }}>
              {title}
            </span>
            {tags}
            <svg
              viewBox="0 0 12 8"
              className={`h-2 w-3 shrink-0 text-driftwood transition-transform ${open ? "rotate-180" : ""}`}
              fill="none"
              aria-hidden="true"
            >
              <path d="M1 1.5 L6 6.5 L11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </h3>
        {open && (
          <div id={`acc-panel-${id}`} className="pb-6">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Simple, calm header — no eyebrow, no quote card */}
      <header className="mx-auto max-w-3xl px-6 pt-14 pb-8 text-center sm:pt-20">
        <h1 className="text-4xl text-heading sm:text-5xl">Cabin Guide</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
          The few things to check when you arrive, before you leave, and when the
          cabin needs care.
        </p>
      </header>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Four glanceable cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Arriving */}
          <section className="card p-6">
            <div className="flex items-center gap-2.5">
              <span className="text-cedar"><GuideIcon name="lantern" className="h-6 w-6" /></span>
              <h2 className="text-xl text-heading">Arriving</h2>
            </div>
            <GlanceList
              items={[
                "Try the kitchen faucet",
                "Turn on the water if needed",
                "Turn on the water heater if needed",
                "Start heat if needed",
                "Filtered water: small faucet beside the sink",
                "Note: motion-sensor faucet — double-check it stops",
              ]}
            />
            <PrivateDirections className="mt-5" />
            <button
              type="button"
              className="text-link mt-4 text-sm font-bold"
              onClick={() => openAndScroll("arrival")}
            >
              View arrival details →
            </button>
          </section>

          {/* Before You Leave */}
          <section className="card p-6">
            <div className="flex items-center gap-2.5">
              <span className="text-cedar"><GuideIcon name="shore" className="h-6 w-6" /></span>
              <h2 className="text-xl text-heading">Before You Leave</h2>
            </div>
            <GlanceList
              items={[
                "Wash used bedding and towels",
                "Clean the kitchen and bathrooms",
                "Run the dishwasher early",
                "Remove perishables, take trash & recycling",
                "Water heater off; shut off water if appropriate",
                "Lock doors and windows",
                "Update the Supplies page",
              ]}
            />
            <button
              type="button"
              className="text-link mt-4 text-sm font-bold"
              onClick={() => openAndScroll("departure")}
            >
              View full departure checklist →
            </button>
          </section>

          {/* If Something Breaks */}
          <section className="card p-6">
            <div className="flex items-center gap-2.5">
              <span className="text-rust"><GuideIcon name="emergency" className="h-6 w-6" /></span>
              <h2 className="text-xl text-heading">If Something Breaks</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{guidePrinciple}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full border border-navy/25 bg-shell px-3.5 py-1.5 text-sm font-bold text-navy hover:bg-navy hover:text-moon"
                onClick={() => mockAction("Report an issue")}
              >
                Report an issue
              </button>
              <button
                type="button"
                className="rounded-full border border-navy/25 bg-shell px-3.5 py-1.5 text-sm font-bold text-navy hover:bg-navy hover:text-moon"
                onClick={() => mockAction("Add a maintenance note")}
              >
                Add maintenance note
              </button>
            </div>
            {showEmergency && (
              <button
                type="button"
                className="mt-3 block text-sm font-bold text-rust underline underline-offset-2 hover:text-night"
                onClick={() => openAndScroll("emergency")}
              >
                Emergency info & the cabin address →
              </button>
            )}
          </section>

          {/* Supplies & Restocking */}
          <section className="card p-6">
            <div className="flex items-center gap-2.5">
              <span className="text-cedar"><GuideIcon name="supplies" className="h-6 w-6" /></span>
              <h2 className="text-xl text-heading">Supplies &amp; Restocking</h2>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-rust/12 px-3 py-1 font-bold text-rust">{outCount} out or needed</span>
              <span className="rounded-full bg-sand/60 px-3 py-1 font-bold text-cedar">{lowCount} running low</span>
              <span className="rounded-full bg-tide/12 px-3 py-1 font-bold text-tide">{bringCount} to bring</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Instead of emailing a list, please update the Supplies page before you leave.
            </p>
            <Link
              href="/supplies"
              className="text-link mt-4 inline-block text-sm font-bold"
            >
              Open the Supplies page →
            </Link>
          </section>
        </div>

        {/* Place Signals — seasonal / situational field notes with sources */}
        <section className="mt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl text-heading">Place Signals</h2>
            <span className="text-sm text-driftwood">What&rsquo;s happening around the cabin</span>
          </div>
          <p className="metadata mt-1 mb-4">
            Small seasonal notes. Harvesting, fishing, crab pots, and outdoor fires always need an official rule check.
          </p>
          <PlaceSignalsDetailed />
        </section>

        {/* Full Guide — accordions, closed by default except the open one */}
        <section className="mt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl text-heading">Full Guide</h2>
            <span className="text-sm text-driftwood">Open a section when you need it</span>
          </div>

          {guideGroups.map((group) => {
            const groupTopics = group.ids
              .map((id) => visibleTopics.find((t) => t.id === id))
              .filter((t): t is GuideTopic => Boolean(t));
            const groupEmergency = group.ids.includes("emergency") && showEmergency;
            const groupContacts = group.ids.includes("contacts") && showContacts;
            if (groupTopics.length === 0 && !groupEmergency && !groupContacts) return null;

            return (
              <div key={group.title} className="mt-6">
                <p className="eyebrow">{group.title}</p>
                <div className="card mt-2 px-5 sm:px-7">
                  {groupTopics.map((topic) => (
                    <Accordion
                      key={topic.id}
                      id={topic.id}
                      title={topic.title}
                      icon={<GuideIcon name={topic.icon} className="h-5 w-5" />}
                      tags={<QuietTags topic={topic} />}
                    >
                      <TopicBody topic={topic} />
                    </Accordion>
                  ))}

                  {/* Emergency Info — private, gated */}
                  {groupEmergency && (
                    <Accordion
                      id="emergency"
                      title="Emergency Info"
                      icon={<GuideIcon name="emergency" className="h-5 w-5" />}
                      tags={
                        <span className="text-[0.68rem] font-bold uppercase tracking-wide text-rust">Private</span>
                      }
                    >
                      <div className="rounded-xl bg-rust/10 p-5">
                        <p className="eyebrow !text-rust/80">Emergency location</p>
                        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{emergencyInfo.responderNote}</p>
                      </div>
                      <PrivateDirections className="mt-4" />
                      <dl className="mt-4 space-y-2">
                        {emergencyInfo.items.map((item) => (
                          <div key={item.label} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg bg-oyster/70 px-4 py-2.5">
                            <dt className="w-36 shrink-0 text-sm font-bold text-cedar">{item.label}</dt>
                            <dd className="text-sm text-ink">
                              {item.value}
                              {item.needsVerification && (
                                <span className="ml-2 text-[0.68rem] font-bold uppercase tracking-wide text-driftwood">
                                  Family check
                                </span>
                              )}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      <TopicFooter topic={{ ...emergencyInfo, title: "Emergency Info" }} />
                    </Accordion>
                  )}

                  {/* Family Contacts — family/admin only */}
                  {groupContacts && (
                    <Accordion
                      id="contacts"
                      title="Family Contacts"
                      icon={<GuideIcon name="lantern" className="h-5 w-5" />}
                      tags={
                        <span className="text-[0.68rem] font-bold uppercase tracking-wide text-driftwood">Family</span>
                      }
                    >
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {familyContacts.map((contact) => (
                          <li key={contact.id} className="rounded-xl bg-oyster/70 p-4">
                            <p className="font-bold text-night">{contact.name}</p>
                            <p className="text-xs font-bold uppercase tracking-wide text-driftwood">{contact.role}</p>
                            <p className="mt-2 text-sm text-ink-soft">{contact.phone}</p>
                            <p className="text-sm text-ink-soft">{contact.email}</p>
                            <p className="mt-1.5 text-xs text-driftwood">Last verified {fullDate(contact.lastVerified)}</p>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 rounded-lg bg-sand/30 px-4 py-2.5 text-xs leading-relaxed text-cedar">{contactsPrivacyNote}</p>
                    </Accordion>
                  )}
                </div>
              </div>
            );
          })}

          <p className="mt-6 text-center text-sm italic text-driftwood">
            With a group effort the house cleans up in about an hour — and it makes
            all the difference for whoever arrives next. Cheers.
          </p>
        </section>
      </div>
    </div>
  );
}
