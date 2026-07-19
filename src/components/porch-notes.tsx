/**
 * Porch Notes — the open public board for practical reports: supplies
 * needed, or something noticed that needs fixing or attention. Anyone can
 * post; no account required.
 *
 * Two surfaces:
 *   <PorchNotesPreview notes /> — compact 3-message strip for the homepage
 *   <PorchNotesList notes />    — full list, used inside <PorchBoard>
 *
 * Both are pure/presentational — the caller supplies notes (live snapshot or
 * demo mock data). Posting lives in <PorchBoard> / <OpenBoardComposer>.
 */

import Link from "next/link";
import type { PorchNote, PorchNoteCategory } from "@/lib/types";

const CATEGORY_LABEL: Record<PorchNoteCategory, string> = {
  supplies: "Supplies",
  maintenance: "Needs attention",
};

const CATEGORY_TONE: Record<PorchNoteCategory, string> = {
  supplies: "bg-tide/15 text-tide",
  maintenance: "bg-rust/15 text-rust",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cedarwarm/20 text-[0.65rem] font-bold text-cedarwarm">
      {initials}
    </span>
  );
}

function CategoryBadge({ category }: { category: PorchNoteCategory }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold ${CATEGORY_TONE[category]}`}>
      {CATEGORY_LABEL[category]}
    </span>
  );
}

// --- Homepage preview -------------------------------------------------------

export function PorchNotesPreview({ notes }: { notes: PorchNote[] }) {
  const recent = notes.slice(0, 3);

  return (
    <section className="mx-auto max-w-5xl px-4 pt-12 sm:px-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl text-heading">Porch Notes</h2>
        <Link href="/porch" className="text-link text-sm font-semibold">
          All notes →
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="mt-3 font-hand text-lg text-driftwood">Nothing on the porch yet.</p>
      ) : (
        <div className="mt-3 divide-y divide-sandshadow/30 rounded-2xl border border-sandshadow/40 bg-oystercard">
          {recent.map((note) => (
            <div key={note.id} className="flex items-start gap-3 px-4 py-3.5">
              <Avatar initials={note.initials} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-sm font-semibold text-ink">{note.posterName}</span>
                  <span className="text-xs text-driftwood">{timeAgo(note.postedAt)}</span>
                  <CategoryBadge category={note.category} />
                </div>
                <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-ink-soft">{note.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// --- Full list ----------------------------------------------------------------

export function PorchNotesList({ notes, showContact = false }: { notes: PorchNote[]; showContact?: boolean }) {
  return (
    <div className="divide-y divide-sandshadow/30">
      {notes.map((note) => (
        <div key={note.id} className="flex items-start gap-3 px-5 py-4">
          <Avatar initials={note.initials} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-semibold text-ink">{note.posterName}</span>
              <span className="text-sm text-driftwood">{timeAgo(note.postedAt)}</span>
              <CategoryBadge category={note.category} />
            </div>
            <p className="mt-1 leading-relaxed text-ink-soft">{note.message}</p>
            {note.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={note.imageUrl}
                alt=""
                className="mt-2 max-h-64 rounded-xl border border-sandshadow/40 object-cover"
              />
            )}
            {showContact && note.contact && (
              <p className="mt-1 text-xs font-semibold text-cedarwarm">Contact: {note.contact}</p>
            )}
          </div>
        </div>
      ))}

      {notes.length === 0 && (
        <p className="px-5 py-6 text-center text-sm text-driftwood">Nothing on the porch yet.</p>
      )}
    </div>
  );
}
