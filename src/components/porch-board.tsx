"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PorchNotesList } from "@/components/porch-notes";
import { submitPorchNote } from "@/lib/porch-notes-client";
import type { PorchNote } from "@/lib/types";

const textareaClass =
  "w-full rounded-xl border border-sand-deep/70 bg-shell px-4 py-3 text-sm text-ink placeholder:text-driftwood/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/20";

function PorchComposer({
  isAuthenticated,
  onPosted,
}: {
  isAuthenticated: boolean;
  onPosted: (notes: PorchNote[]) => void;
}) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthenticated) {
    return (
      <div className="px-5 py-4">
        <p className="font-hand text-lg text-driftwood">Sign in to leave a note for the family.</p>
        <Link href="/login?next=/porch" className="mt-1 inline-block text-sm font-semibold text-link">
          Family sign in →
        </Link>
      </div>
    );
  }

  return (
    <form
      className="space-y-2 px-5 py-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const trimmed = message.trim();
        if (!trimmed) return;
        setSubmitting(true);
        setError("");
        try {
          const notes = await submitPorchNote(trimmed);
          onPosted(notes);
          setMessage("");
        } catch (reason) {
          setError(reason instanceof Error ? reason.message : "The note could not be posted.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        rows={2}
        maxLength={1000}
        placeholder="Leave a note for the family…"
        className={textareaClass}
      />
      {error && (
        <p role="alert" className="text-sm font-semibold text-rust">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting || !message.trim()}
        className="btn btn-primary text-sm disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? "Posting…" : "Post note"}
      </button>
    </form>
  );
}

/** Full board: list + compose form. Holds its own state so posting updates the list instantly. */
export function PorchBoard({
  initialNotes,
  isAuthenticated,
}: {
  initialNotes: PorchNote[];
  isAuthenticated: boolean;
}) {
  const [notes, setNotes] = useState(initialNotes);

  // Keep in sync when the caller loads notes asynchronously (e.g. the
  // dashboard fetches after mount) or provides a fresh server-rendered list.
  useEffect(() => setNotes(initialNotes), [initialNotes]);

  return (
    <div className="rounded-2xl border border-sandshadow/40 bg-oystercard">
      <PorchNotesList notes={notes} />
      <div className="border-t border-sandshadow/30">
        <PorchComposer isAuthenticated={isAuthenticated} onPosted={setNotes} />
      </div>
    </div>
  );
}
