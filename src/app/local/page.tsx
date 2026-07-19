import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/status-badge";
import {
  CedarSprig,
  CrabIcon,
  GeoduckIcon,
  Lantern,
  MoonIcon,
  SandDollar,
  TideLine,
} from "@/components/shore-art";
import { AdminEditBanner, HarvestCard, PlaceCard } from "@/components/field-guide";
import {
  historicalPlaceholder,
} from "@/data/conditions";
import { specialDates } from "@/data/special-dates";
import { localPlaces } from "@/data/local-places";
import { harvestResources, harvestWarning, officialLinks } from "@/data/harvest";
import { loadConditionsSnapshot } from "@/lib/conditions.server";
import { shortDate, tideTimeToMinutes } from "@/lib/selectors";
import type { SpecialDateKind } from "@/lib/types";

export const metadata: Metadata = { title: "Tides, Weather & Nearby" };
const sections = [
  { id: "conditions", label: "Current Conditions" },
  { id: "tides", label: "Tide Calendar" },
  { id: "history", label: "Looking Back" },
  { id: "dates", label: "Holidays & Dates" },
  { id: "essentials", label: "Nearby Essentials" },
  { id: "stops", label: "Local Stops & Experiences" },
  { id: "events", label: "Community Events" },
  { id: "harvest", label: "Fishing & Shellfish" },
];

function SectionHeading({
  id,
  icon,
  title,
  lede,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  lede: string;
}) {
  return (
    <div id={id} className="scroll-mt-24 pt-14">
      <div className="flex items-center gap-3">
        <span className="text-cedar">{icon}</span>
        <h2 className="text-2xl text-heading sm:text-3xl">{title}</h2>
      </div>
      <p className="mt-2 max-w-2xl text-ink-soft">{lede}</p>
    </div>
  );
}

function PlaceholderTag() {
  return (
    <span className="rounded-full bg-driftwood/15 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-driftwood">
      Placeholder data — not live
    </span>
  );
}

const kindTone: Record<SpecialDateKind, Parameters<typeof Badge>[0]["tone"]> = {
  "Federal holiday": "navy",
  "Family date": "rust",
  "Cabin date": "seaweed",
  "Local event": "tide",
  "Seasonal reminder": "sand",
};

function isUpcoming(event: { date: string; time: string }, today: string, nowMinutes: number) {
  if (event.date > today) return true;
  return event.date === today && tideTimeToMinutes(event.time) >= nowMinutes;
}

export default async function LocalPage() {
  const conditions = await loadConditionsSnapshot();
  const { tideEvents, tideWindows, weatherNow, today, nowMinutes } = conditions;

  const todaysTides = tideEvents.filter((t) => t.date === today);
  const nextHigh = tideEvents.find((t) => t.type === "high" && isUpcoming(t, today, nowMinutes));
  const nextLow = tideEvents.find((t) => t.type === "low" && isUpcoming(t, today, nowMinutes));
  const upcomingLows = tideEvents.filter((t) => t.date > today && t.type === "low" && t.heightFt < 1);
  const upcomingHighs = tideEvents.filter((t) => t.date > today && t.type === "high").slice(0, 4);

  const essentials = localPlaces.filter((p) => p.group === "essentials");
  const stops = localPlaces.filter((p) => p.group === "stops");
  const yard = localPlaces.filter((p) => p.group === "yard");
  const events = localPlaces.filter((p) => p.group === "events");

  const datedSpecials = specialDates.filter((d) => d.date).sort((a, b) => a.date.localeCompare(b.date));
  const reminders = specialDates.filter((d) => !d.date);

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow="The cabin's local field guide"
        title="Tides, Weather & Nearby"
        lede="Conditions on the canal, the tides worth planning around, and the nearby places people may find useful, interesting, or worth checking before a stay."
      />

      {/* Jump nav */}
      <nav className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2 px-4" aria-label="Page sections">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="rounded-full border border-sand-deep/60 bg-shell px-3.5 py-1.5 text-sm font-bold text-navy hover:bg-sand/40"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* 1. Current conditions */}
        {conditions.connected && weatherNow ? (
          <>
            <SectionHeading
              id="conditions"
              icon={<MoonIcon className="h-8 w-8" />}
              title="Current Conditions"
              lede={conditions.mode === "demo"
                ? "A snapshot of the canal right now. Mock data for this first version — live weather, NOAA tides, and sun/moon data connect here later."
                : "A live snapshot of the canal right now, with free weather, NOAA tides, and the current moon phase."}
            />
            {conditions.mode === "demo" && <div className="mt-2"><PlaceholderTag /></div>}

            <div className="mt-5 grid gap-6 lg:grid-cols-3">
          {/* Weather */}
          <div className="card p-6">
            <p className="eyebrow">Weather · {weatherNow.asOf}</p>
            <p className="mt-3 text-4xl text-night" style={{ fontFamily: "var(--font-display)" }}>
              {weatherNow.tempF}°F
            </p>
            <p className="mt-1 text-ink">{weatherNow.condition}</p>
            <dl className="mt-4 space-y-1.5 text-sm text-ink-soft">
              <div className="flex justify-between"><dt className="font-bold text-cedar">High / low</dt><dd>{weatherNow.highF}° / {weatherNow.lowF}°</dd></div>
              <div className="flex justify-between"><dt className="font-bold text-cedar">Rain chance</dt><dd className="text-right">{weatherNow.rainChance}</dd></div>
              <div className="flex justify-between"><dt className="font-bold text-cedar">Wind</dt><dd className="text-right">{weatherNow.wind}</dd></div>
            </dl>
          </div>

          {/* Tide now */}
          <div className="card bg-navy p-6 text-moon">
            <p className="eyebrow !text-pearl/80">The tide right now</p>
            <p className="mt-3 text-xl leading-snug">The tide is pulling back — a minus low around midday.</p>
            <dl className="mt-4 space-y-2 text-sm text-pearl">
              {nextLow && (
                <div className="flex justify-between rounded-lg bg-moon/10 px-3 py-2">
                  <dt className="font-bold">Next low</dt>
                  <dd>{nextLow.time} · {nextLow.heightFt.toFixed(1)} ft</dd>
                </div>
              )}
              {nextHigh && (
                <div className="flex justify-between rounded-lg bg-moon/10 px-3 py-2">
                  <dt className="font-bold">Next high</dt>
                  <dd>{nextHigh.time} · {nextHigh.heightFt.toFixed(1)} ft</dd>
                </div>
              )}
            </dl>
            <p className="mt-3 text-xs text-pearl/70">Future source: NOAA tide predictions for the nearest Hood Canal station.</p>
          </div>

          {/* Sun & moon */}
          <div className="card p-6">
            <p className="eyebrow">Sun &amp; moon</p>
            <dl className="mt-4 space-y-1.5 text-sm text-ink-soft">
              <div className="flex justify-between"><dt className="font-bold text-cedar">Sunrise</dt><dd>{weatherNow.sunrise}</dd></div>
              <div className="flex justify-between"><dt className="font-bold text-cedar">Sunset</dt><dd>{weatherNow.sunset}</dd></div>
              <div className="flex justify-between"><dt className="font-bold text-cedar">Moon</dt><dd>{weatherNow.moonPhase}</dd></div>
            </dl>
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-oyster/70 px-3 py-2.5">
              <MoonIcon className="h-7 w-7 shrink-0 text-navy" />
              <p className="text-sm italic text-ink-soft">{weatherNow.moonNote}</p>
            </div>
          </div>
            </div>
          </>
        ) : (
          <>
            <SectionHeading
              id="conditions"
              icon={<MoonIcon className="h-8 w-8" />}
              title="Current Conditions"
              lede="Live conditions will appear here after the weather and NOAA tide feeds are connected."
            />
            <div className="card mt-5 p-8 text-center">
              <p className="text-lg font-bold text-heading-strong">Live weather and tides are not connected yet.</p>
              <p className="mt-2 text-sm text-ink-soft">No sample conditions are shown in the live site.</p>
            </div>
          </>
        )}

        {/* 2. Tide calendar */}
        <>
        <SectionHeading
          id="tides"
          icon={<SandDollar className="h-7 w-7" />}
          title="Tide Calendar"
          lede={conditions.mode === "demo"
            ? "Today's tides and the lows worth planning a morning around. Heights are placeholder numbers until NOAA data is connected."
            : "Today's tides and the lows worth planning around, sourced from NOAA predictions."}
        />
        {conditions.mode === "demo" && <div className="mt-2"><PlaceholderTag /></div>}

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          {/* Today's tides */}
          <div className="card p-6">
            <h3 className="text-xl text-heading-strong">Today — {shortDate(today)}</h3>
            <ul className="mt-4 space-y-2">
              {todaysTides.map((tide) => (
                <li
                  key={tide.id}
                  className={`flex items-center justify-between rounded-lg px-4 py-2.5 ${
                    tide.type === "low" ? "bg-sand/40" : "bg-tide/10"
                  }`}
                >
                  <span className="font-bold text-night">
                    {tide.type === "low" ? "Low" : "High"} · {tide.time}
                  </span>
                  <span className={`text-sm font-bold ${tide.heightFt < 0 ? "text-rust" : "text-ink-soft"}`}>
                    {tide.heightFt.toFixed(1)} ft
                  </span>
                </li>
              ))}
            </ul>
            {todaysTides.some((t) => t.note) && (
              <p className="mt-3 text-sm italic text-ink-soft">
                {todaysTides.find((t) => t.note)?.note}
              </p>
            )}
          </div>

          {/* Upcoming highs & lows */}
          <div className="card p-6">
            <h3 className="text-xl text-heading-strong">Coming days</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-rust">Upcoming low tides</p>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
                  {upcomingLows.map((t) => (
                    <li key={t.id} className="flex justify-between gap-2">
                      <span>{shortDate(t.date)} · {t.time}</span>
                      <span className="font-bold">{t.heightFt.toFixed(1)} ft</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-tide">Upcoming high tides</p>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
                  {upcomingHighs.map((t) => (
                    <li key={t.id} className="flex justify-between gap-2">
                      <span>{shortDate(t.date)} · {t.time}</span>
                      <span className="font-bold">{t.heightFt.toFixed(1)} ft</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Best windows */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {tideWindows.map((w) => (
            <div key={w.id} className={`card p-5 ${w.moonlight ? "bg-night text-moon" : ""}`}>
              <p className={`eyebrow ${w.moonlight ? "!text-pearl/80" : ""}`}>
                {w.moonlight ? "Low tide under moonlight" : "Best low-tide window"}
              </p>
              <p className={`mt-2 text-lg font-bold ${w.moonlight ? "" : "text-night"}`}>
                {shortDate(w.date)} · {w.window}
              </p>
              <p className={`text-sm font-bold ${w.moonlight ? "text-pearl" : "text-rust"}`}>
                down to {w.lowHeightFt.toFixed(1)} ft
              </p>
              <p className={`mt-2 text-sm italic ${w.moonlight ? "text-pearl/90" : "text-ink-soft"}`}>{w.note}</p>
            </div>
          ))}
        </div>

        {/* 3. Historical reference */}
        <SectionHeading
          id="history"
          icon={<MoonIcon className="h-7 w-7" />}
          title="Looking Back at the Canal"
          lede="Historical tide and weather reference — a placeholder for now."
        />
        <div className="card mt-5 border-2 border-dashed !border-sand-deep/70 !bg-oyster/60 p-8 text-center !shadow-none">
          <TideLine className="mb-4" />
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-soft">{historicalPlaceholder.copy}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-driftwood">Future sources</p>
          <p className="mx-auto mt-1 max-w-xl text-sm text-driftwood">
            {historicalPlaceholder.futureSources.join(" · ")}
          </p>
        </div>

        {/* 4. Holidays & special dates */}
        <SectionHeading
          id="dates"
          icon={<Lantern className="h-8 w-7" />}
          title="Holidays & Special Dates"
          lede="For planning visits — holidays, family dates, and the cabin's own calendar. Family dates are placeholders until admins add the real ones."
        />
        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <ul className="space-y-2.5">
              {datedSpecials.map((d) => (
                <li key={d.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-oyster/60 px-4 py-2.5">
                  <span className="w-28 shrink-0 font-bold text-night">{shortDate(d.date)}</span>
                  <Badge tone={kindTone[d.kind]}>{d.kind}</Badge>
                  <span className="text-ink">{d.name}</span>
                  {d.note && <span className="w-full text-sm italic text-ink-soft sm:w-auto">— {d.note}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-6">
            <p className="eyebrow">Seasonal reminders</p>
            <ul className="mt-3 space-y-2.5">
              {reminders.map((d) => (
                <li key={d.id} className="rounded-lg bg-sand/30 px-4 py-3 text-sm text-ink">
                  <span className="font-bold">{d.name}</span>
                  {d.note && <span className="block text-ink-soft">{d.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
        </>

        {/* 5. Nearby essentials */}
        <SectionHeading
          id="essentials"
          icon={<Lantern className="h-8 w-7" />}
          title="Nearby Essentials"
          lede="Current grocery, waste, and medical essentials. Drive times are off-peak estimates from the cabin; open Directions for live routing from your phone."
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {essentials.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        {/* 6. Local stops & experiences */}
        <SectionHeading
          id="stops"
          icon={<SandDollar className="h-7 w-7" />}
          title="Local Stops & Experiences"
          lede="Nearby places people may find useful, interesting, or worth checking before a stay — restaurants, farms, beaches, and rainy-day options, listed plainly. Some have age or seasonal notes; none of this is an advertisement."
        />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stops.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        {/* 6a. Delivery to the cabin */}
        <div className="mt-6 rounded-2xl border border-sandshadow/40 bg-oyster/40 p-5 text-sm text-ink-soft">
          <p className="font-bold text-heading-strong">Food delivered to the cabin?</p>
          <p className="mt-1.5 leading-relaxed">
            Uber Eats and DoorDash both technically operate around Kingston and Poulsbo, but coverage
            way out in Hansville is inconsistent and depends on whether a driver is willing to make the
            trip that day. Don&rsquo;t count on it — open the app and check with the cabin&rsquo;s actual
            address before ordering, and have a backup plan (like calling ahead for pickup on the way in).
          </p>
        </div>

        {/* 6b. Community events */}
        {events.length > 0 && (
          <>
            <SectionHeading
              id="events"
              icon={<Lantern className="h-8 w-8" />}
              title="Community Events"
              lede="Rummage sales, garage sales, and other neighborhood happenings found online — dates shift year to year, so check the linked source before planning around one."
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </>
        )}

        {/* 7. Yard work & equipment */}
        {yard.length > 0 && (
          <>
            <SectionHeading
              id="yard"
              icon={<CedarSprig className="h-8 w-8" />}
              title="Yard Work & Equipment Help"
              lede="Family-confirmed vendors and equipment options for the cabin's bigger chores."
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {yard.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </>
        )}

        {/* 8. Fishing, crabbing & shellfish */}
        <SectionHeading
          id="harvest"
          icon={
            <span className="flex gap-1.5">
              <CrabIcon className="h-7 w-9" />
              <GeoduckIcon className="h-7 w-9" />
            </span>
          }
          title="Fishing, Crabbing, Shellfish & Seasons"
          lede="The canal feeds this family — carefully. Rules change by marine area, season, species, closures, and biotoxins, so this section stores no rules as truth. It points at the official sources, every time."
        />

        {/* The warning, unmissable */}
        <div className="mt-5 rounded-2xl border-2 border-rust/40 bg-rust/10 p-6 text-center">
          <p className="mx-auto max-w-3xl font-bold leading-relaxed text-rust">{harvestWarning}</p>
        </div>

        {/* Official sources */}
        <div className="card mt-6 p-6">
          <p className="eyebrow">Official sources — always primary</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {officialLinks.map((link) => (
              <li key={link.url} className="rounded-lg bg-oyster/60 px-4 py-3">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link font-bold"
                >
                  {link.label}
                </a>
                <p className="text-xs text-driftwood">{link.org}</p>
                {link.note && <p className="mt-1 text-sm text-ink-soft">{link.note}</p>}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {harvestResources.map((resource) => (
            <HarvestCard key={resource.id} resource={resource} />
          ))}
        </div>

        {/* Admin layer */}
        <AdminEditBanner />
      </div>
    </div>
  );
}
