"use client";

import { FormEvent, useId, useState } from "react";

const approvers = [
  { id: "tom", name: "Tom" },
  { id: "kate", name: "Kate" },
  { id: "peggy", name: "Peggy" },
  { id: "greg", name: "Greg" },
] as const;

type Mode = "closed" | "passcode" | "request";

type ApiMessage = {
  error?: string;
  message?: string;
  url?: string;
  sent?: boolean;
  mailtoUrl?: string;
};

export function PrivateDirections({ className = "" }: { className?: string }) {
  const panelId = useId();
  const [mode, setMode] = useState<Mode>("closed");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  function chooseMode(next: Exclude<Mode, "closed">) {
    setMode(next);
    setStatus("");
  }

  async function openDirections(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/directions/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = (await response.json()) as ApiMessage;
      if (!response.ok || !data.url) {
        setStatus(data.error ?? "Directions could not be opened.");
        return;
      }

      setPasscode("");
      window.location.assign(data.url);
    } catch {
      setStatus("Directions could not be opened. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function requestAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setLoading(true);
    setStatus("");

    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/directions/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterName: form.get("requesterName"),
          requesterEmail: form.get("requesterEmail"),
          approver: form.get("approver"),
          note: form.get("note"),
        }),
      });
      const data = (await response.json()) as ApiMessage;
      if (!response.ok) {
        setStatus(data.error ?? "The access request could not be prepared.");
        return;
      }

      setStatus(data.message ?? "Request ready.");
      if (data.mailtoUrl) window.location.assign(data.mailtoUrl);
      if (data.sent) formElement.reset();
    } catch {
      setStatus("The access request could not be prepared. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={className}>
      <div className="rounded-xl border border-canal/35 bg-foam/45 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-seaglass/45 text-heading-strong" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <h3 className="text-base text-heading-strong">How to get there</h3>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                  The address is private. Approved directions open in Google Maps from your current location.
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            aria-expanded={mode !== "closed"}
            aria-controls={panelId}
            onClick={() => {
              setMode((current) => (current === "closed" ? "passcode" : "closed"));
              setStatus("");
            }}
          >
            {mode === "closed" ? "Directions" : "Close"}
          </button>
        </div>

        {mode !== "closed" && (
          <div id={panelId} className="mt-4 border-t border-canal/25 pt-4">
            <div className="flex rounded-full bg-seaglass/25 p-1" role="tablist" aria-label="Directions access method">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "passcode"}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-bold transition-colors ${
                  mode === "passcode" ? "bg-heading text-shell" : "text-heading hover:bg-shell/70"
                }`}
                onClick={() => chooseMode("passcode")}
              >
                Use passcode
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "request"}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-bold transition-colors ${
                  mode === "request" ? "bg-heading text-shell" : "text-heading hover:bg-shell/70"
                }`}
                onClick={() => chooseMode("request")}
              >
                Request access
              </button>
            </div>

            {mode === "passcode" ? (
              <form className="mt-4" onSubmit={openDirections}>
                <label className="label" htmlFor={`${panelId}-passcode`}>Family passcode</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <input
                    id={`${panelId}-passcode`}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    maxLength={4}
                    autoComplete="one-time-code"
                    required
                    value={passcode}
                    onChange={(event) => setPasscode(event.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="min-w-0 flex-1 rounded-full border border-canal/45 bg-shell px-4 py-2.5 text-center text-lg font-bold tracking-[0.35em] text-heading-strong outline-none focus:border-heading focus:ring-2 focus:ring-seaglass"
                    aria-describedby={`${panelId}-privacy`}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" disabled={loading || passcode.length !== 4}>
                    {loading ? "Checking…" : "Open Google Maps"}
                  </button>
                </div>
                <p id={`${panelId}-privacy`} className="mt-2 text-xs leading-relaxed text-driftwood">
                  The passcode is checked on the server and is never stored in your browser.
                </p>
              </form>
            ) : (
              <form className="mt-4 space-y-3" onSubmit={requestAccess}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-sm font-bold text-ink">
                    Your name
                    <input
                      name="requesterName"
                      type="text"
                      maxLength={80}
                      required
                      autoComplete="name"
                      className="mt-1.5 w-full rounded-xl border border-sandshadow/60 bg-shell px-3 py-2.5 font-normal text-ink outline-none focus:border-heading focus:ring-2 focus:ring-seaglass"
                    />
                  </label>
                  <label className="text-sm font-bold text-ink">
                    Your email
                    <input
                      name="requesterEmail"
                      type="email"
                      maxLength={160}
                      required
                      autoComplete="email"
                      className="mt-1.5 w-full rounded-xl border border-sandshadow/60 bg-shell px-3 py-2.5 font-normal text-ink outline-none focus:border-heading focus:ring-2 focus:ring-seaglass"
                    />
                  </label>
                </div>
                <label className="block text-sm font-bold text-ink">
                  Ask
                  <select
                    name="approver"
                    className="mt-1.5 w-full rounded-xl border border-sandshadow/60 bg-shell px-3 py-2.5 font-normal text-ink outline-none focus:border-heading focus:ring-2 focus:ring-seaglass"
                    defaultValue="tom"
                  >
                    {approvers.map((approver) => (
                      <option key={approver.id} value={approver.id}>{approver.name}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-bold text-ink">
                  Stay dates or note <span className="font-normal text-driftwood">(optional)</span>
                  <textarea
                    name="note"
                    rows={2}
                    maxLength={500}
                    className="mt-1.5 w-full resize-y rounded-xl border border-sandshadow/60 bg-shell px-3 py-2.5 font-normal text-ink outline-none focus:border-heading focus:ring-2 focus:ring-seaglass"
                  />
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" className="btn btn-secondary btn-sm" disabled={loading}>
                    {loading ? "Preparing…" : "Ask for directions"}
                  </button>
                  <p className="text-xs leading-relaxed text-driftwood">
                    A family member should confirm the stay before sharing access.
                  </p>
                </div>
              </form>
            )}

            {status && (
              <p className="mt-3 rounded-lg bg-shell px-3 py-2 text-sm text-ink-soft" role="status" aria-live="polite">
                {status}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
