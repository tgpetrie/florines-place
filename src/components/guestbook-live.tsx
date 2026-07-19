/**
 * The live Guestbook — an open, ongoing version of the paper cabin
 * guestbook. Anyone can post; no account required.
 */

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

import type { LiveGuestbookEntry } from "@/lib/types";

function Avatar({ initials }: { initials: string }) {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cedarwarm/20 text-xs font-bold text-cedarwarm">
      {initials}
    </span>
  );
}

export function GuestbookLiveList({
  entries,
  showContact = false,
}: {
  entries: LiveGuestbookEntry[];
  showContact?: boolean;
}) {
  return (
    <div className="divide-y divide-sandshadow/30">
      {entries.map((entry) => (
        <div key={entry.id} className="flex items-start gap-3 px-5 py-4">
          <Avatar initials={entry.initials} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-semibold text-ink">{entry.posterName}</span>
              <span className="text-sm text-driftwood">{timeAgo(entry.postedAt)}</span>
            </div>
            <p className="mt-1 font-hand text-lg leading-relaxed text-ink">{entry.message}</p>
            {entry.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={entry.imageUrl}
                alt=""
                className="mt-2 max-h-64 rounded-xl border border-sandshadow/40 object-cover"
              />
            )}
            {showContact && entry.contact && (
              <p className="mt-1 text-xs font-semibold text-cedarwarm">Contact: {entry.contact}</p>
            )}
          </div>
        </div>
      ))}

      {entries.length === 0 && (
        <p className="px-5 py-6 text-center text-sm text-driftwood">Nothing in the guestbook yet — be the first to sign it.</p>
      )}
    </div>
  );
}
