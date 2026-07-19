/**
 * Porch Notes — the public family cabin message board.
 *
 * Two surfaces:
 *   <PorchNotesPreview notes /> — compact 3-message strip for the homepage
 *   <PorchNotesList notes />    — full list, used inside <PorchBoard>
 *
 * Both are pure/presentational — the caller supplies notes (live snapshot or
 * demo mock data). Posting lives in <PorchBoard> / <PorchComposer>.
 */

import Link from "next/link";
import type { PorchNote } from "@/lib/types";

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
                  <span className="text-sm font-semibold text-ink">{note.author}</span>
                  <span className="text-xs text-driftwood">{timeAgo(note.postedAt)}</span>
                  {note.stayId && (
                    <span className="rounded-full bg-sandshadow/25 px-2 py-0.5 text-[0.65rem] font-semibold text-driftwood">
                      re: stay
                    </span>
                  )}
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

export function PorchNotesList({ notes }: { notes: PorchNote[] }) {
  return (
    <div className="divide-y divide-sandshadow/30">
      {notes.map((note) => (
        <div key={note.id} className="flex items-start gap-3 px-5 py-4">
          <Avatar initials={note.initials} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-semibold text-ink">{note.author}</span>
              <span className="text-sm text-driftwood">{timeAgo(note.postedAt)}</span>
              {note.stayId && (
                <span className="rounded-full bg-sandshadow/25 px-2 py-0.5 text-[0.65rem] font-semibold text-driftwood">
                  stay note
                </span>
              )}
            </div>
            <p className="mt-1 leading-relaxed text-ink-soft">{note.message}</p>
          </div>
        </div>
      ))}

      {notes.length === 0 && (
        <p className="px-5 py-6 text-center text-sm text-driftwood">Nothing on the porch yet.</p>
      )}
    </div>
  );
}
