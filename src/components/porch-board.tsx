"use client";

import { useEffect, useState } from "react";
import { PorchNotesList } from "@/components/porch-notes";
import { OpenBoardComposer } from "@/components/open-board-composer";
import { submitPorchNote } from "@/lib/porch-notes-client";
import type { PorchNote, PorchNoteCategory } from "@/lib/types";

const CATEGORIES: { value: PorchNoteCategory; label: string }[] = [
  { value: "supplies", label: "Something we need" },
  { value: "maintenance", label: "Something needs fixing / attention" },
];

/** Full board: list + open compose form. No account required to post. */
export function PorchBoard({
  initialNotes,
  showContact = false,
}: {
  initialNotes: PorchNote[];
  showContact?: boolean;
}) {
  const [notes, setNotes] = useState(initialNotes);

  // Keep in sync when the caller loads notes asynchronously (e.g. the
  // dashboard fetches after mount) or provides a fresh server-rendered list.
  useEffect(() => setNotes(initialNotes), [initialNotes]);

  return (
    <div className="rounded-2xl border border-sandshadow/40 bg-oystercard">
      <PorchNotesList notes={notes} showContact={showContact} />
      <div className="border-t border-sandshadow/30">
        <OpenBoardComposer
          categories={CATEGORIES}
          messagePlaceholder="What's needed, or what did you notice?"
          submitLabel="Post note"
          onSubmit={(fields) =>
            submitPorchNote({
              posterName: fields.posterName,
              contact: fields.contact,
              message: fields.message,
              category: (fields.category as PorchNoteCategory) ?? "supplies",
              image: fields.image,
            })
          }
          onPosted={setNotes}
        />
      </div>
    </div>
  );
}
