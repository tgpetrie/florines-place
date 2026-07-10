"use client";

/**
 * Porch Notes — the family cabin message board.
 *
 * Two surfaces:
 *   <PorchNotesPreview /> — compact 2-message strip for the homepage
 *   <PorchNotesFull />    — full list for a dedicated board page
 *
 * "Porch Notes" felt right: informal, personal, specific to this place.
 * Messages use the regular UI font; the empty-state prompt uses font-hand.
 */

import Link from "next/link";
import { porchNotes } from "@/data/messages";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
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

export function PorchNotesPreview() {
  const recent = porchNotes.slice(0, 3);

  return (
    <section className="mx-auto max-w-5xl px-4 pt-12 sm:px-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl text-cedardark">Porch Notes</h2>
        <Link
          href="/dashboard#porch-notes"
          className="text-sm font-semibold text-cedarwarm underline underline-offset-2 hover:text-cedardark"
        >
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

// --- Full list (for dashboard) -----------------------------------------------

export function PorchNotesFull() {
  return (
    <div id="porch-notes" className="scroll-mt-24">
      <div className="flex items-baseline justify-between">
        <h2 className="text-2xl text-cedardark">Porch Notes</h2>
        <span className="text-sm text-driftwood">Family cabin conversation</span>
      </div>

      <div className="mt-4 divide-y divide-sandshadow/30 rounded-2xl border border-sandshadow/40 bg-oystercard">
        {porchNotes.map((note) => (
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

        {/* Placeholder write area */}
        <div className="px-5 py-4">
          <p className="font-hand text-lg text-driftwood">Leave a note for the family…</p>
          <p className="mt-1 text-xs text-driftwood">
            Writing notes from the app arrives with the backend.
          </p>
        </div>
      </div>
    </div>
  );
}
