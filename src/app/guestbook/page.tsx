"use client";

/**
 * Guestbook — a digital version of the paper cabin guestbook.
 * Never reviews, never ratings. Entries marked "admins" only appear when
 * viewing as Admin (mock for future row-level security).
 */

import { useRole } from "@/lib/role-context";
import { PageHeader } from "@/components/page-header";
import { SandDollar } from "@/components/shore-art";
import { guestbookEntries } from "@/data/guestbook";
import { APP_MODE } from "@/lib/app-mode";

export default function GuestbookPage() {
  const { role } = useRole();
  const visible = (APP_MODE === "demo" ? guestbookEntries : []).filter(
    (entry) => entry.visibility === "family" || role === "admin",
  );

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="Guestbook"
        title="A little history of every stay"
        lede="Florine's Place holds more than dates on a calendar. It holds mornings, meals, walks, weather, low tides, late talks, quiet coffee, family visits, hard seasons, easy laughter, and the small moments people carry home with them."
      />

      <div className="mx-auto max-w-2xl space-y-6 px-4 sm:px-6">
        {APP_MODE === "live" && (
          <div className="card p-8 text-center">
            <h2 className="text-xl text-heading">The live guestbook is empty</h2>
            <p className="mt-2 text-sm text-ink-soft">No sample stays or notes are shown in the live build.</p>
          </div>
        )}
        {visible.map((entry) => (
          <article key={entry.id} className="card p-6 sm:p-8">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-xl text-heading">{entry.name}</h2>
              <span className="whitespace-nowrap text-sm text-driftwood">{entry.stayDates}</span>
            </div>
            <p className="mt-4 font-hand text-xl leading-relaxed text-ink">{entry.message}</p>

            {(entry.favoriteMoment || entry.tideNote) && (
              <div className="mt-5 space-y-2 rounded-xl bg-sand/30 p-4 text-sm">
                {entry.favoriteMoment && (
                  <p className="text-ink-soft">
                    <span className="font-bold text-cedar">Favorite moment: </span>
                    <span className="font-hand text-base text-ink">{entry.favoriteMoment}</span>
                  </p>
                )}
                {entry.tideNote && (
                  <p className="text-ink-soft">
                    <span className="font-bold text-tide">Tide &amp; weather: </span>
                    {entry.tideNote}
                  </p>
                )}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-xs text-driftwood">
              <span>
                {entry.hasPhoto ? "📷 Photo coming in a future version" : ""}
              </span>
              {entry.visibility === "admins" && (
                <span className="rounded-full bg-driftwood/15 px-2.5 py-0.5 font-bold">
                  Private to admins
                </span>
              )}
            </div>
          </article>
        ))}

        {APP_MODE === "demo" && role !== "admin" && (
          <p className="text-center text-xs text-driftwood">
            Some entries are kept private to admins.
          </p>
        )}

        {/* Placeholder: leaving an entry becomes real with the backend */}
        {APP_MODE === "demo" && <div className="rounded-2xl border-2 border-dashed border-sand-deep/70 p-8 text-center">
          <SandDollar className="mx-auto h-8 w-8 text-driftwood" />
          <p className="mt-3 font-hand text-2xl text-ink">Stayed recently? Leave a page in the book.</p>
          <p className="mt-1 text-sm text-driftwood">
            Writing entries from the app arrives with the backend — name, dates,
            your words, a favorite moment, a tide note, and someday a photo.
          </p>
        </div>}
      </div>
    </div>
  );
}
