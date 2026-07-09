"use client";

/**
 * Cards for the Tides, Weather & Nearby page.
 *
 * Client components because the family-notes and admin controls are
 * role-aware (useRole). All edit actions are placeholders.
 * BACKEND NOTE: "Edit", "Mark verified", and "Add a note" become Supabase
 * mutations on the `local_places` / `harvest_resources` tables; `familyNotes`
 * becomes its own `guide_notes` table joined by place id.
 */

import { useRole } from "@/lib/role-context";
import { Badge } from "@/components/status-badge";
import { SandDollar } from "@/components/shore-art";
import { fullDate } from "@/lib/selectors";
import type { HarvestResource, HarvestStatus, LocalPlace, PlaceStatus } from "@/lib/types";

function mockAction(label: string) {
  window.alert(`"${label}" is a placeholder — it becomes real once the backend is connected.`);
}

// --- Status badges -------------------------------------------------------------

const placeTones: Record<PlaceStatus, Parameters<typeof Badge>[0]["tone"]> = {
  Recommended: "seaweed",
  "Used Before": "navy",
  "Need to Verify": "sand",
  Seasonal: "tide",
  "Not Recommended": "driftwood",
};

export function PlaceBadge({ status }: { status: PlaceStatus }) {
  return <Badge tone={placeTones[status]}>{status}</Badge>;
}

const harvestTones: Record<HarvestStatus, Parameters<typeof Badge>[0]["tone"]> = {
  Open: "seaweed",
  Closed: "rust",
  "Check Rules": "sand",
  Seasonal: "tide",
};

export function HarvestBadge({ status }: { status: HarvestStatus }) {
  return <Badge tone={harvestTones[status]}>{status}</Badge>;
}

// --- Shared bits -----------------------------------------------------------------

function FamilyNotes({ notes }: { notes: string[] }) {
  const { role } = useRole();
  const canAdd = role !== "guest";
  if (notes.length === 0 && !canAdd) return null;
  return (
    <div className="mt-3 space-y-1.5">
      {notes.map((note, i) => (
        <p key={i} className="flex items-start gap-2 text-sm italic text-ink-soft">
          <SandDollar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-driftwood/70" />
          <span>&ldquo;{note}&rdquo;</span>
        </p>
      ))}
      {canAdd && (
        <button
          type="button"
          className="text-xs font-bold text-navy underline underline-offset-2 hover:text-night"
          onClick={() => mockAction("Add a family note")}
        >
          + Add a family note
        </button>
      )}
    </div>
  );
}

function VerifiedRow({ lastVerified, itemName }: { lastVerified: string; itemName: string }) {
  const { role } = useRole();
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-sand-deep/40 pt-2.5">
      <span className="text-xs text-driftwood">Last verified {fullDate(lastVerified)}</span>
      {role === "admin" && (
        <span className="flex gap-2">
          <button
            type="button"
            className="rounded-full border border-rust/30 px-2.5 py-0.5 text-xs font-bold text-rust hover:bg-rust hover:text-shell"
            onClick={() => mockAction(`Edit ${itemName}`)}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-full border border-seaweed/40 px-2.5 py-0.5 text-xs font-bold text-seaweed hover:bg-seaweed hover:text-shell"
            onClick={() => mockAction(`Mark ${itemName} verified today`)}
          >
            Mark verified
          </button>
        </span>
      )}
    </div>
  );
}

// --- Local place card ---------------------------------------------------------

export function PlaceCard({ place }: { place: LocalPlace }) {
  return (
    <article className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg leading-snug text-night">{place.name}</h3>
          <p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-driftwood">
            {place.category} · {place.distance}
          </p>
        </div>
        <PlaceBadge status={place.status} />
      </div>

      <dl className="mt-3 space-y-1 text-sm text-ink-soft">
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 font-bold text-cedar">Address</dt>
          <dd>{place.address}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 font-bold text-cedar">Phone</dt>
          <dd>{place.phone}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 font-bold text-cedar">Web</dt>
          <dd className="break-all">{place.website}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 font-bold text-cedar">Hours</dt>
          <dd>{place.hours}</dd>
        </div>
      </dl>

      {place.seasonalNote && (
        <p className="mt-2 rounded-lg bg-tide/10 px-3 py-2 text-xs text-tide">
          <span className="font-bold">Seasonal: </span>
          {place.seasonalNote}
        </p>
      )}
      {place.ageNote && (
        <p className="mt-2 rounded-lg bg-sand/40 px-3 py-2 text-xs text-cedar">{place.ageNote}</p>
      )}

      {place.goodFor && place.goodFor.length > 0 && (
        <p className="mt-2 text-xs text-driftwood">
          <span className="font-bold">Good for: </span>
          {place.goodFor.join(" · ")}
        </p>
      )}

      <div className="flex-1" />
      <FamilyNotes notes={place.familyNotes} />
      <VerifiedRow lastVerified={place.lastVerified} itemName={place.name} />
    </article>
  );
}

// --- Harvest card ---------------------------------------------------------------

export function HarvestCard({ resource }: { resource: HarvestResource }) {
  return (
    <article className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg leading-snug text-night">{resource.activity}</h3>
        <HarvestBadge status={resource.status} />
      </div>

      <div className="mt-3 space-y-2 text-sm text-ink-soft">
        <p>
          <span className="font-bold text-cedar">Season: </span>
          {resource.seasonNote}
        </p>
        <p>
          <span className="font-bold text-cedar">License: </span>
          {resource.licenseNote}
        </p>
        <p className="rounded-lg bg-rust/10 px-3 py-2 text-rust">
          <span className="font-bold">Safety: </span>
          {resource.safetyNote}
        </p>
      </div>

      <div className="mt-3">
        <p className="text-xs font-bold uppercase tracking-wide text-driftwood">Official sources</p>
        <ul className="mt-1 space-y-1">
          {resource.links.map((link) => (
            <li key={link.url} className="text-sm">
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-navy underline underline-offset-2 hover:text-night"
              >
                {link.label}
              </a>
              <span className="text-xs text-driftwood"> — {link.org}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1" />
      <FamilyNotes notes={resource.familyNote ? [resource.familyNote] : []} />
      <VerifiedRow lastVerified={resource.lastVerified} itemName={resource.activity} />
    </article>
  );
}

// --- Admin section banner --------------------------------------------------------

export function AdminEditBanner() {
  const { role } = useRole();
  if (role !== "admin") return null;
  return (
    <div className="mt-10 rounded-2xl border-2 border-dashed border-rust/40 p-6 text-center">
      <p className="font-bold text-rust">Admin tools (placeholders)</p>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {[
          "Add a local place",
          "Add a seasonal reminder",
          "Add an official link",
          "Add a warning",
          "Archive outdated entries",
        ].map((label) => (
          <button
            key={label}
            type="button"
            className="rounded-full border border-rust/30 bg-shell px-3.5 py-1.5 text-sm font-bold text-rust hover:bg-rust hover:text-shell"
            onClick={() => mockAction(label)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-driftwood">
        These become real editing once the backend is connected — hours and rules
        change, so the family keeps this page honest.
      </p>
    </div>
  );
}
