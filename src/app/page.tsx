import Link from "next/link";
import type { CSSProperties } from "react";
import { LandscapeBackground } from "@/components/landscape-bg";
import { CabinScene } from "@/components/cabin-scene";
import { FormlineCrest } from "@/components/formline-crest";
import { MoonIcon } from "@/components/shore-art";
import { GuideIcon } from "@/components/guide-icons";
import { ForecastPreview } from "@/components/forecast-preview";
import { StayStatusCard } from "@/components/stay-status-card";
import { PlaceSignalsHome } from "@/components/place-signals";
import { PorchNotesPreview } from "@/components/porch-notes";
import { loadConditionsSnapshot } from "@/lib/conditions.server";
import { loadPorchNotesSnapshot } from "@/lib/porch-notes.server";
import { porchNotes as demoPorchNotes } from "@/data/messages";
import { APP_MODE } from "@/lib/app-mode";
import { nextTide } from "@/lib/selectors";

const quickActions = [
  { href: "/request",   label: "Request a Stay",   icon: "lantern"  as const },
  { href: "/calendar",  label: "View Availability", icon: "shore"    as const },
  { href: "/guide",     label: "Open Guide",        icon: "water"    as const },
  { href: "/supplies",  label: "Update Supplies",   icon: "supplies" as const },
];

export default async function HomePage() {
  const conditions = await loadConditionsSnapshot();
  const nextLow  = nextTide(conditions.tideEvents, "low",  conditions.today, conditions.nowMinutes);
  const nextHigh = nextTide(conditions.tideEvents, "high", conditions.today, conditions.nowMinutes);
  const weatherNow = conditions.weatherNow;
  const porchNotes = APP_MODE === "demo" ? demoPorchNotes : (await loadPorchNotesSnapshot()).notes;

  return (
    <>
      {/* ── Hero — sky backdrop + centred cabin scene ────────────────────── */}
      {/*
        LandscapeBackground fills the whole hero (sky, sun/moon, mountains).
        CabinScene sits as a fixed-height strip pinned to the bottom, so the
        centred cabin-above-the-water survives at any width. Hero text floats
        over the open sky above it.
      */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: "clamp(27rem, 54vw, 35rem)",
          "--scene-height": "clamp(12rem, 21vw, 21rem)",
        } as CSSProperties}
      >
        <LandscapeBackground className="absolute inset-0 h-full w-full" />
        <CabinScene className="absolute inset-x-0 bottom-0 z-10 h-[var(--scene-height)] w-full" />

        {/* Hero text — upper-centre, over open sky */}
        <div className="relative z-20 mx-auto max-w-3xl px-6 pt-12 pb-8 text-center sm:pt-16">
          <p className="label rise inline-block rounded-full bg-oystercard/80 px-3 py-1 !tracking-[0.14em] text-cedarwarm backdrop-blur-sm">
            Petrie Family Cabin
          </p>
          <div className="rise-2 mt-3 flex items-center justify-center gap-3 sm:gap-4">
            <FormlineCrest className="hidden h-7 w-8 shrink-0 sm:block" />
            <h1
              className="text-4xl text-oystercard sm:text-5xl"
              style={{ textShadow: "0 1px 16px rgba(8,15,34,0.55), 0 2px 4px rgba(8,15,34,0.3)" }}
            >
              Florine&rsquo;s Place
            </h1>
            <FormlineCrest className="hidden h-7 w-8 shrink-0 sm:block" />
          </div>
          <p
            className="rise-2 mt-2 text-sm font-semibold text-oystercard/90"
            style={{ textShadow: "0 1px 6px rgba(8,15,34,0.45)" }}
          >
            Hood Canal, WA
          </p>
          <div className="rise-3 mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/calendar"
              className="btn shadow-lg"
              style={{ background: "rgba(138,90,54,0.92)", color: "#fff9ee", backdropFilter: "blur(4px)" }}
            >
              View Availability
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Who's at the Cabin ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
        <StayStatusCard />
      </section>

      {/* ── 3. Today at Florine's Place ───────────────────────────────────── */}
      {conditions.connected && weatherNow ? <section className="mx-auto max-w-5xl px-4 pt-12 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-2xl text-heading">Today at Florine&rsquo;s Place</h2>
          <p className="metadata">
            {conditions.mode === "demo" ? "Mock data · live weather & tides planned" : "Live weather · NOAA tides"}
          </p>
        </div>

        <div className="card mt-4 !bg-oystercard/95 p-5 sm:p-6" style={{ backdropFilter: "blur(6px)" }}>
          <div className="grid gap-4 lg:grid-cols-5">
            {/* Tide */}
            <div className="relative overflow-hidden rounded-2xl bg-canaldeep p-6 text-oyster lg:col-span-3">
              <p className="label !text-oyster/70">The tide right now</p>
              <p className="mt-2 text-2xl leading-snug text-oystercard sm:text-3xl">
                The tide is pulling back.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {nextLow && (
                  <div className="rounded-xl bg-oyster/10 px-4 py-3">
                    <p className="label !text-oyster/60">Next low</p>
                    <p className="tnum mt-1 text-lg font-semibold text-oystercard">{nextLow.time}</p>
                    <p className="tnum text-sm text-oyster/80">{nextLow.heightFt.toFixed(1)} ft</p>
                  </div>
                )}
                {nextHigh && (
                  <div className="rounded-xl bg-oyster/10 px-4 py-3">
                    <p className="label !text-oyster/60">Next high</p>
                    <p className="tnum mt-1 text-lg font-semibold text-oystercard">{nextHigh.time}</p>
                    <p className="tnum text-sm text-oyster/80">{nextHigh.heightFt.toFixed(1)} ft</p>
                  </div>
                )}
              </div>
              {nextLow?.note && <p className="mt-4 text-sm text-oyster/75">{nextLow.note}</p>}
            </div>

            {/* Weather */}
            <div className="rounded-2xl bg-wetsand/30 p-6 lg:col-span-2">
              <p className="label">Weather</p>
              <p className="tnum mt-2 text-4xl font-semibold text-heading-strong">{weatherNow.tempF}°</p>
              <p className="mt-1 text-ink">{weatherNow.condition}</p>
              <dl className="mt-4 space-y-1.5 text-sm text-ink-soft">
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold text-cedar">High / low</dt>
                  <dd className="tnum">{weatherNow.highF}° / {weatherNow.lowF}°</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold text-cedar">Rain</dt>
                  <dd className="text-right">{weatherNow.rainChance}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="font-semibold text-cedar">Wind</dt>
                  <dd className="text-right">{weatherNow.wind}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Moon / sun strip */}
          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 rounded-2xl border border-sandshadow/40 px-5 py-4">
            <div className="flex items-center gap-3">
              <MoonIcon className="h-8 w-8 shrink-0 text-canal" />
              <div>
                <p className="label">Moon</p>
                <p className="text-ink">{weatherNow.moonPhase}</p>
              </div>
            </div>
            <div>
              <p className="label">Sunrise</p>
              <p className="tnum text-ink">{weatherNow.sunrise}</p>
            </div>
            <div>
              <p className="label">Sunset</p>
              <p className="tnum text-ink">{weatherNow.sunset}</p>
            </div>
            {weatherNow.moonNote && (
              <p className="metadata flex-1 sm:text-right">{weatherNow.moonNote}</p>
            )}
          </div>
        </div>
      </section> : (
        <section className="mx-auto max-w-5xl px-4 pt-12 sm:px-6">
          <h2 className="text-2xl text-heading">Today at Florine&rsquo;s Place</h2>
          <div className="card mt-4 p-8 text-center">
            <p className="text-lg font-bold text-heading-strong">Live weather and tides are not connected yet.</p>
            <p className="mt-2 text-sm text-ink-soft">The live build does not substitute sample conditions.</p>
          </div>
        </section>
      )}

      {/* ── 4. Place Signals ─────────────────────────────────────────────── */}
      <PlaceSignalsHome />

      {/* ── 5. Porch Notes ───────────────────────────────────────────────── */}
      <PorchNotesPreview notes={porchNotes} />

      {/* ── 6. Next few days ─────────────────────────────────────────────── */}
      {conditions.connected && <section className="mx-auto max-w-5xl px-4 pt-12 sm:px-6">
        <h2 className="text-xl text-heading">The next few days</h2>
        <div className="mt-3 rounded-2xl border border-sandshadow/40 bg-oyster/40 p-4 sm:p-5">
          <ForecastPreview days={conditions.tenDayOutlook} />
        </div>
      </section>}

      {/* ── 7. Quick actions ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 pt-12 sm:px-6">
        <h2 className="text-xl text-heading">Quick actions</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-sandshadow/50 bg-oystercard p-5 text-center transition-all hover:-translate-y-0.5 hover:border-cedarwarm/50 hover:bg-wetsand/30"
            >
              <span className="text-cedarwarm">
                <GuideIcon name={a.icon} className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold text-heading-strong">{a.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 8. Closing note ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-4 pt-12 pb-4 sm:px-6">
        <div className="rounded-2xl bg-wetsand/40 p-8 text-center">
          <h3 className="text-xl text-heading-strong">A Shared Family Place</h3>
          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-ink-soft">
            This place works because everyone respects the cabin, the neighbors,
            the people arriving next, and the time it takes to keep it peaceful.
            Every stay is part of caring for Florine&rsquo;s Place.
          </p>
        </div>
      </section>
    </>
  );
}
