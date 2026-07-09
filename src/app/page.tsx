import Link from "next/link";
import { MoonlitShore, MoonIcon, SandDollar } from "@/components/shore-art";
import { GuideIcon } from "@/components/guide-icons";
import { ForecastPreview } from "@/components/forecast-preview";
import { weatherNow, tideEvents, tenDayOutlook } from "@/data/conditions";
import { nextTide } from "@/lib/selectors";

/** Mock "now": July 9, 9:00 AM — matches the conditions snapshot. */
const TODAY = "2026-07-09";
const NOW_MINUTES = 9 * 60;

const quickActions = [
  { href: "/request", label: "Request a Stay", icon: "lantern" as const },
  { href: "/calendar", label: "View Calendar", icon: "shore" as const },
  { href: "/guide", label: "Open Cabin Guide", icon: "water" as const },
  { href: "/supplies", label: "Update Supplies", icon: "supplies" as const },
  { href: "/guestbook", label: "Read the Guestbook", icon: "bed" as const },
];

export default function HomePage() {
  const nextLow = nextTide(tideEvents, "low", TODAY, NOW_MINUTES);
  const nextHigh = nextTide(tideEvents, "high", TODAY, NOW_MINUTES);

  return (
    <>
      {/* 1. Hero / welcome */}
      <section className="relative overflow-hidden bg-night text-moon">
        <MoonlitShore className="absolute inset-0 h-full w-full text-moon/80" />
        <div className="relative mx-auto max-w-3xl px-6 pt-24 pb-32 text-center sm:pt-28 sm:pb-40">
          <p className="rise eyebrow !text-pearl/80">Hood Canal, Washington</p>
          <h1 className="rise mt-4 text-5xl leading-tight sm:text-7xl">Florine&rsquo;s Place</h1>
          <p className="rise-2 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pearl">
            Florine&rsquo;s Place is our family cabin on Hood Canal, built in the
            early 1980s by our great aunt Florine.
          </p>
          <p className="rise-2 mx-auto mt-4 max-w-xl leading-relaxed text-pearl/85">
            It is a truly special, slightly quirky place. Her presence is still
            felt here — in the quiet, the water, the wood, the low tide, and the
            way the cabin gathers people.
          </p>
          <p className="rise-3 mx-auto mt-4 max-w-xl leading-relaxed text-pearl/70">
            The calendar, pantry list, guide, and guestbook are simply ways of
            caring for the place and for each other.
          </p>
          <div className="rise-3 mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/request" className="btn btn-primary !bg-moon !text-night hover:!bg-white">
              Request a Stay
            </Link>
            <Link href="/calendar" className="btn btn-quiet !border-moon/40 !text-moon hover:!bg-moon/10">
              View Calendar
            </Link>
          </div>
        </div>
      </section>

      {/* 2. At-a-glance conditions */}
      <section className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="text-3xl text-night">Today at Florine&rsquo;s Place</h2>
          <p className="text-xs text-driftwood">
            Mock data for first version · live weather &amp; NOAA tide connection planned
          </p>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-5">
          {/* Featured tide card — the important one on Hood Canal */}
          <div className="card relative overflow-hidden bg-night p-7 text-moon lg:col-span-3">
            <SandDollar className="absolute -right-6 -top-6 h-32 w-32 text-moon/10" />
            <p className="eyebrow !text-pearl/80">The tide right now</p>
            <p className="mt-3 text-2xl leading-snug sm:text-3xl">The tide is pulling back.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {nextLow && (
                <div className="rounded-xl bg-moon/10 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-pearl/70">Next low</p>
                  <p className="mt-1 text-lg font-bold">{nextLow.time}</p>
                  <p className="text-sm text-pearl">{nextLow.heightFt.toFixed(1)} ft</p>
                </div>
              )}
              {nextHigh && (
                <div className="rounded-xl bg-moon/10 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-pearl/70">Next high</p>
                  <p className="mt-1 text-lg font-bold">{nextHigh.time}</p>
                  <p className="text-sm text-pearl">{nextHigh.heightFt.toFixed(1)} ft</p>
                </div>
              )}
            </div>
            {nextLow?.note && <p className="mt-4 text-sm italic text-pearl/85">{nextLow.note}</p>}
          </div>

          {/* Compact weather */}
          <div className="card p-6 lg:col-span-2">
            <p className="eyebrow">Weather</p>
            <p className="mt-2 text-4xl text-night" style={{ fontFamily: "var(--font-display)" }}>
              {weatherNow.tempF}°
            </p>
            <p className="mt-1 text-ink">{weatherNow.condition}</p>
            <dl className="mt-4 space-y-1.5 text-sm text-ink-soft">
              <div className="flex justify-between">
                <dt className="font-bold text-cedar">High / low</dt>
                <dd>{weatherNow.highF}° / {weatherNow.lowF}°</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="font-bold text-cedar">Rain</dt>
                <dd className="text-right">{weatherNow.rainChance}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="font-bold text-cedar">Wind</dt>
                <dd className="text-right">{weatherNow.wind}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Compact sun/moon strip */}
        <div className="card mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 p-5">
          <div className="flex items-center gap-3">
            <MoonIcon className="h-8 w-8 shrink-0 text-navy" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-driftwood">Moon</p>
              <p className="text-ink">{weatherNow.moonPhase}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-driftwood">Sunrise</p>
            <p className="text-ink">{weatherNow.sunrise}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-driftwood">Sunset</p>
            <p className="text-ink">{weatherNow.sunset}</p>
          </div>
          {weatherNow.moonNote && (
            <p className="flex-1 text-sm italic text-ink-soft sm:text-right">{weatherNow.moonNote}</p>
          )}
        </div>
      </section>

      {/* 3. Three-day forecast preview */}
      <section className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <h2 className="text-2xl text-night">The next few days</h2>
        <div className="card mt-4 p-5 sm:p-6">
          <ForecastPreview days={tenDayOutlook} />
        </div>
      </section>

      {/* 4. Quick actions */}
      <section className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <h2 className="text-2xl text-night">Quick actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="card flex flex-col items-center gap-2 p-5 text-center transition-transform hover:-translate-y-0.5"
            >
              <span className="text-cedar">
                <GuideIcon name={action.icon} className="h-7 w-7" />
              </span>
              <span className="text-sm font-bold text-night">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5 & 6. Shared family place + cleaning fee */}
      <section className="mx-auto max-w-5xl px-4 pt-14 pb-4 sm:px-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card p-8">
            <h3 className="text-2xl text-night">A Shared Family Place</h3>
            <p className="mt-4 leading-relaxed text-ink-soft">
              This place works because everyone respects the cabin, the neighbors,
              the people arriving next, and the time it takes to keep it peaceful.
            </p>
            <p className="mt-3 leading-relaxed text-ink-soft">
              Every stay is part of caring for Florine&rsquo;s Place.
            </p>
          </div>

          <div className="card p-8">
            <p className="eyebrow">The cleaning fee</p>
            <h3 className="mt-3 text-2xl text-night">$150 helps reset the cabin for everyone.</h3>
            <p className="mt-4 leading-relaxed text-ink-soft">
              The standard cleaning fee is not rent. It helps keep Florine&rsquo;s
              Place clean, peaceful, and ready for whoever arrives next.
            </p>
            <p className="mt-3 leading-relaxed text-ink-soft">
              In special circumstances, the family may waive it.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
