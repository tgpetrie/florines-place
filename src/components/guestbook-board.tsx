"use client";

import { useEffect, useState } from "react";
import { GuestbookLiveList } from "@/components/guestbook-live";
import { OpenBoardComposer } from "@/components/open-board-composer";
import { submitGuestbookEntry } from "@/lib/guestbook-client";
import type { LiveGuestbookEntry } from "@/lib/types";

/** Full live guestbook: list + open compose form. No account required to post. */
export function GuestbookBoard({
  initialEntries,
  showContact = false,
}: {
  initialEntries: LiveGuestbookEntry[];
  showContact?: boolean;
}) {
  const [entries, setEntries] = useState(initialEntries);

  useEffect(() => setEntries(initialEntries), [initialEntries]);

  return (
    <div className="rounded-2xl border border-sandshadow/40 bg-oystercard">
      <GuestbookLiveList entries={entries} showContact={showContact} />
      <div className="border-t border-sandshadow/30">
        <OpenBoardComposer
          messagePlaceholder="A memory, a thank you, how the stay went…"
          submitLabel="Sign the guestbook"
          onSubmit={submitGuestbookEntry}
          onPosted={setEntries}
        />
      </div>
    </div>
  );
}
