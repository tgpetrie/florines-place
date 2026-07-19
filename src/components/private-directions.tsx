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
  address?: string;
  wifiName?: string;
  wifiPassword?: string;
  doorCode?: string;
  sent?: boolean;
  mailtoUrl?: string;
};

type AccessDetails = Required<Pick<ApiMessage, "url" | "address" | "wifiName" | "wifiPassword" | "doorCode">>;

export function PrivateDirections({ className = "" }: { className?: string }) {
  const panelId = useId();
  const [mode, setMode] = useState<Mode>("closed");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [access, setAccess] = useState<AccessDetails | null>(null);
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  function chooseMode(next: Exclude<Mode, "closed">) {
    setMode(next);
    setStatus("");
  }

  async function unlockAccess(event: FormEvent<HTMLFormElement>) {
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
      if (
        !response.ok || !data.url || !data.address || !data.wifiName ||
        !data.wifiPassword || !data.doorCode
      ) {
        setStatus(data.error ?? "Cabin access could not be opened.");
        return;
      }

      setPasscode("");
      setAccess({
        url: data.url,
        address: data.address,
        wifiName: data.wifiName,
        wifiPassword: data.wifiPassword,
        doorCode: data.doorCode,
      });
      setStatus("Cabin access unlocked for this page.");
    } catch {
      setStatus("Cabin access could not be opened. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyValue(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(`${label} copied.`);
    } catch {
      setStatus(`Could not copy ${label.toLowerCase()}. Press and hold the value to copy it.`);
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
      <div className="rounded-2xl border border-canal/35 bg-foam/45 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-seaglass/45 text-heading-strong" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-base text-heading-strong">Cabin access</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              Unlock private directions, Wi-Fi, and the front-door code when your stay is approved.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm mt-4 w-full sm:w-auto"
          aria-expanded={mode !== "closed"}
          aria-controls={panelId}
          onClick={() => {
            const closing = mode !== "closed";
            setMode(closing ? "closed" : "passcode");
            setStatus("");
            if (closing) {
              setAccess(null);
              setPasscode("");
              setShowWifiPassword(false);
            }
          }}
        >
          {mode === "closed" ? "Open cabin access" : "Close access"}
        </button>

        {mode !== "closed" && (
          <div id={panelId} className="mt-4 border-t border-canal/25 pt-4">
            {access ? (
              <div className="space-y-3">
                <div className="rounded-xl border border-seaglass/60 bg-shell p-4">
                  <p className="label">Cabin address</p>
                  <p className="mt-1 select-all break-words font-semibold text-heading-strong">{access.address}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button type="button" className="btn btn-quiet btn-sm" onClick={() => void copyValue(access.address, "Address")}>Copy</button>
                    <a href={access.url} className="btn btn-primary btn-sm text-center" rel="noreferrer">Google Maps</a>
                  </div>
                </div>

                <div className="rounded-xl border border-seaglass/60 bg-shell p-4">
                  <p className="label">Xfinity Wi-Fi</p>
                  <dl className="mt-2 space-y-3">
                    <div>
                      <dt className="text-xs font-bold text-driftwood">Network</dt>
                      <dd className="mt-0.5 flex items-center justify-between gap-3">
                        <span className="min-w-0 select-all break-all font-semibold text-heading-strong">{access.wifiName}</span>
                        <button type="button" className="text-link shrink-0 text-xs font-bold" onClick={() => void copyValue(access.wifiName, "Wi-Fi network")}>Copy</button>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-bold text-driftwood">Password</dt>
                      <dd className="mt-0.5 flex items-center justify-between gap-3">
                        <span className="min-w-0 select-all break-all font-mono font-bold tracking-wide text-heading-strong">
                          {showWifiPassword ? access.wifiPassword : "••••••••••"}
                        </span>
                        <span className="flex shrink-0 gap-3">
                          <button type="button" className="text-link text-xs font-bold" onClick={() => setShowWifiPassword((shown) => !shown)}>
                            {showWifiPassword ? "Hide" : "Show"}
                          </button>
                          <button type="button" className="text-link text-xs font-bold" onClick={() => void copyValue(access.wifiPassword, "Wi-Fi password")}>Copy</button>
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-xl border border-seaglass/60 bg-shell p-4">
                  <p className="label">Front door</p>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <p className="select-all font-mono text-xl font-bold tracking-[0.2em] text-heading-strong">{access.doorCode}</p>
                    <button type="button" className="text-link text-xs font-bold" onClick={() => void copyValue(access.doorCode, "Door code")}>Copy</button>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-driftwood">These details disappear when you close this panel or leave the page.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 rounded-xl bg-seaglass/25 p-1" role="tablist" aria-label="Cabin access method">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "passcode"}
                    className={`rounded-lg px-2 py-2.5 text-sm font-bold transition-colors ${
                      mode === "passcode" ? "bg-heading text-shell" : "text-heading hover:bg-shell/70"
                    }`}
                    onClick={() => chooseMode("passcode")}
                  >
                    Use access code
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "request"}
                    className={`rounded-lg px-2 py-2.5 text-sm font-bold transition-colors ${
                      mode === "request" ? "bg-heading text-shell" : "text-heading hover:bg-shell/70"
                    }`}
                    onClick={() => chooseMode("request")}
                  >
                    Ask family
                  </button>
                </div>

                {mode === "passcode" ? (
                  <form className="mt-4" onSubmit={unlockAccess}>
                    <label className="label" htmlFor={`${panelId}-passcode`}>Four-digit access code</label>
                    <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
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
                        className="min-w-0 rounded-xl border border-canal/45 bg-shell px-4 py-3 text-center text-lg font-bold tracking-[0.35em] text-heading-strong outline-none focus:border-heading focus:ring-2 focus:ring-seaglass"
                        aria-describedby={`${panelId}-privacy`}
                      />
                      <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={loading || passcode.length !== 4}>
                        {loading ? "Checking…" : "Unlock access"}
                      </button>
                    </div>
                    <p id={`${panelId}-privacy`} className="mt-2 text-xs leading-relaxed text-driftwood">
                      Checked on the server and never saved in your browser.
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
                <div className="grid gap-2 sm:grid-cols-[auto_1fr] sm:items-center">
                  <button type="submit" className="btn btn-secondary w-full sm:w-auto" disabled={loading}>
                    {loading ? "Preparing…" : "Ask for cabin access"}
                  </button>
                  <p className="text-xs leading-relaxed text-driftwood">
                    A family member confirms the stay before sharing the access code.
                  </p>
                </div>
              </form>
                )}
              </>
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
