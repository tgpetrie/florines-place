"use client";

/**
 * Place Signals — small seasonal / situational field notes.
 *
 * Two surfaces:
 *  - <PlaceSignalsHome/>: up to 3 active signals, compact, for the Home page.
 *  - <PlaceSignalsDetailed/>: fuller list with official-check notes + source
 *    links, for the Guide.
 *
 * Both are role-aware (visibility) and calm by design — no flashing, one motif
 * per signal, restrained severity colors.
 */

import Link from "next/link";
import { useRole } from "@/lib/role-context";
import { SignalIcon } from "@/components/signal-icons";
import { placeSignals } from "@/data/signals";
import { canSee, fullDate } from "@/lib/selectors";
import type { PlaceSignal, SignalCategory, SignalSeverity } from "@/lib/types";

/** Restrained per-severity tones (note → oyster/sand, safety → rust). */
const severityTone: Record<SignalSeverity, { wrap: string; icon: string }> = {
  note: { wrap: "border-sandshadow/50 bg-wetsand/25", icon: "text-driftwood" },
  reminder: { wrap: "border-canal/30 bg-canal/10", icon: "text-canaldeep" },
  important: { wrap: "border-cedarwarm/40 bg-cedarwarm/10", icon: "text-cedarwarm" },
  safety: { wrap: "border-rust/40 bg-rust/10", icon: "text-rust" },
};

const homeCategoryPriority: Partial<Record<SignalCategory, number>> = {
  shellfish: 0,
  fire: 1,
  crabbing: 2,
  fishing: 3,
};

function useVisibleSignals(): PlaceSignal[] {
  const { role } = useRole();
  return placeSignals.filter((s) => canSee(role, s.visibility));
}

const officialCheckCategories: SignalCategory[] = ["crabbing", "shellfish", "fishing", "fire"];
const CHECK_NOTE =
  "Official check required before harvesting, fishing, setting pots, or lighting outdoor fires.";

function requiresOfficialCheck(signal: PlaceSignal): boolean {
  return signal.requiresOfficialCheck || officialCheckCategories.includes(signal.category);
}

// --- Home: compact strips -------------------------------------------------------

export function PlaceSignalsHome() {
  const signals = useVisibleSignals()
    .filter((s) => s.isActive)
    .sort(
      (a, b) =>
        (homeCategoryPriority[a.category] ?? 10) -
          (homeCategoryPriority[b.category] ?? 10) ||
        placeSignals.indexOf(a) - placeSignals.indexOf(b),
    )
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-5xl px-4 pt-12 sm:px-6">
      <h2 className="text-xl text-cedardark">What&rsquo;s happening around the cabin</h2>
      {signals.length === 0 ? (
        <p className="mt-3 font-hand text-lg text-driftwood">Nothing special to flag right now.</p>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {signals.map((s) => {
            const tone = severityTone[s.severity];
            return (
              <div key={s.id} className={`flex gap-3 rounded-2xl border p-4 ${tone.wrap}`}>
                <span className={`mt-0.5 shrink-0 ${tone.icon}`}>
                  <SignalIcon motif={s.motif} className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{s.shortLabel}</p>
                  <p className="mt-1 line-clamp-3 text-sm text-ink-soft">{s.message}</p>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    {requiresOfficialCheck(s) && (
                      <span className="text-xs font-semibold text-rust">Official check required</span>
                    )}
                    {s.linkHref && (
                      <Link
                        href={s.linkHref}
                        className="text-xs font-semibold text-cedarwarm underline underline-offset-2 hover:text-cedardark"
                      >
                        {s.linkText ?? "More"} →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// --- Guide: detailed list -------------------------------------------------------

export function PlaceSignalsDetailed() {
  const signals = useVisibleSignals();
  if (signals.length === 0) return null;

  return (
    <div className="space-y-3">
      {signals.map((s) => {
        const tone = severityTone[s.severity];
        return (
          <article key={s.id} className={`rounded-2xl border p-5 ${tone.wrap}`}>
            <div className="flex items-start gap-3">
              <span className={`mt-0.5 shrink-0 ${tone.icon}`}>
                <SignalIcon motif={s.motif} className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="text-base text-ink">{s.title}</h3>
                  <span className={`text-[0.68rem] font-semibold uppercase tracking-wide ${tone.icon}`}>
                    {s.isActive ? s.severity : "seasonal"}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.message}</p>

                {requiresOfficialCheck(s) && (
                  <p className="mt-2 rounded-lg bg-rust/10 px-3 py-2 text-xs text-rust">
                    <span className="font-semibold">{CHECK_NOTE}</span>
                    {s.sourceType ? ` Source to confirm: ${s.sourceType}.` : ""}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  {s.linkHref && (
                    <Link
                      href={s.linkHref}
                      className="text-sm font-semibold text-cedarwarm underline underline-offset-2 hover:text-cedardark"
                    >
                      {s.linkText ?? "More"} →
                    </Link>
                  )}
                  {s.sourceUrl && requiresOfficialCheck(s) && (
                    <a
                      href={s.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-canaldeep underline underline-offset-2 hover:text-cedardark"
                    >
                      Official source →
                    </a>
                  )}
                  {s.lastVerified && <span className="metadata">Last verified {fullDate(s.lastVerified)}</span>}
                  {s.startDate && s.endDate && (
                    <span className="metadata">
                      Window {fullDate(s.startDate)} – {fullDate(s.endDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
