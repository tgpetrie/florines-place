/**
 * Fishing, crabbing & shellfish resource hub.
 *
 * DELIBERATE DESIGN: rules change by marine area, season, species, emergency
 * closures, biotoxins, and license type — so nothing here is stored as
 * permanent truth. Every card is a pointer to official sources plus a
 * last-verified date. Statuses are placeholders the family updates.
 *
 * BACKEND NOTE: becomes an admin-editable `harvest_resources` table; a
 * future version could surface WDFW emergency-rule feeds and the DOH
 * biotoxin map directly, but the official links must always remain primary.
 */
import type { HarvestResource, OfficialLink } from "@/lib/types";

export const harvestWarning =
  "Fishing, crabbing, and shellfish rules change often. Always check official Washington state rules, marine area regulations, emergency closures, and shellfish safety warnings before harvesting.";

/** The canonical official sources — shown prominently, linked from every card. */
export const officialLinks: OfficialLink[] = [
  {
    label: "Fishing & shellfishing regulations",
    org: "Washington Department of Fish & Wildlife",
    url: "https://wdfw.wa.gov/fishing",
    note: "Seasons, species rules, and emergency rule changes.",
  },
  {
    label: "Shellfish safety map (biotoxins / red tide)",
    org: "Washington Department of Health",
    url: "https://doh.wa.gov/community-and-environment/shellfish",
    note: "Check the beach status EVERY time before digging or gathering.",
  },
  {
    label: "Licenses & permits",
    org: "WDFW Licensing",
    url: "https://wdfw.wa.gov/licenses",
    note: "Everyone harvesting needs the right license on them.",
  },
  {
    label: "Tide predictions",
    org: "NOAA Tides & Currents",
    url: "https://tidesandcurrents.noaa.gov",
    note: "Official tide predictions for Hood Canal stations.",
  },
  {
    label: "Marine Area 12 (Hood Canal) rules",
    org: "WDFW",
    url: "https://wdfw.wa.gov/places-to-go/marine-areas",
    note: "The cabin's waters — area-specific seasons and closures.",
  },
];

export const harvestResources: HarvestResource[] = [
  {
    id: "h-1",
    activity: "Fishing (salmon & saltwater)",
    status: "Check Rules",
    seasonNote: "Placeholder — Hood Canal (Marine Area 12) salmon openings vary by year and species. Check current WDFW rules before every trip.",
    licenseNote: "Saltwater or combination license required; catch record card for salmon.",
    safetyNote: "Watch the emergency-rules page — in-season closures are common.",
    familyNote: "Dad keeps a spare rod in the shed. Ask before borrowing the good one.",
    links: [officialLinks[0], officialLinks[4], officialLinks[2]],
    lastVerified: "2026-06-01",
  },
  {
    id: "h-2",
    activity: "Crabbing (Dungeness)",
    status: "Seasonal",
    seasonNote: "Placeholder — summer seasons typically run on select days of the week; exact dates and areas change every year.",
    licenseNote: "Shellfish license + crab endorsement and catch record card required.",
    safetyNote: "Measure carefully, males only, and record your catch — the rules are enforced.",
    familyNote: "The pots and gauge are in the shed loft. The kids' favorite tradition on the canal.",
    links: [officialLinks[0], officialLinks[4], officialLinks[2]],
    lastVerified: "2026-06-15",
  },
  {
    id: "h-3",
    activity: "Clamming",
    status: "Check Rules",
    seasonNote: "Placeholder — beach-by-beach seasons; some Hood Canal beaches are open much of the year, others closed.",
    licenseNote: "Shellfish/seaweed license required.",
    safetyNote: "ALWAYS check the DOH biotoxin map for the specific beach the same day. When in doubt, don't dig.",
    familyNote: "Check shellfish safety before digging — house rule, no exceptions.",
    links: [officialLinks[1], officialLinks[0], officialLinks[2]],
    lastVerified: "2026-06-15",
  },
  {
    id: "h-4",
    activity: "Oysters",
    status: "Check Rules",
    seasonNote: "Placeholder — public tideland rules apply; harvest is typically shuck-on-the-beach, shells left where you found them.",
    licenseNote: "Shellfish/seaweed license required.",
    safetyNote: "Biotoxin closures apply to oysters too; summer heat raises vibrio risk — check DOH advisories.",
    familyNote: "Florine's rule stands: shells go back to the beach, below the tide line.",
    links: [officialLinks[1], officialLinks[0]],
    lastVerified: "2026-06-15",
  },
  {
    id: "h-5",
    activity: "Geoducks",
    status: "Check Rules",
    seasonNote: "Placeholder — recreational geoduck digging is limited to specific beaches and very low tides.",
    licenseNote: "Shellfish/seaweed license required.",
    safetyNote: "Deep holes in soft sand — fill them back in, and never dig alone with kids near the water line.",
    familyNote: "Jim's 71st-birthday geoduck is family legend now. See the guestbook.",
    links: [officialLinks[0], officialLinks[1]],
    lastVerified: "2026-05-20",
  },
  {
    id: "h-6",
    activity: "Shrimp (spot prawn)",
    status: "Closed",
    seasonNote: "Placeholder — Hood Canal spot prawn season is famously short (a few days in May). Assume closed unless WDFW says otherwise.",
    licenseNote: "Shellfish license + shrimp gear rules apply.",
    safetyNote: "Season dates announce in spring — watch WDFW news releases.",
    links: [officialLinks[0], officialLinks[4]],
    lastVerified: "2026-06-01",
  },
  {
    id: "h-7",
    activity: "Shellfish safety (red tide / biotoxins)",
    status: "Check Rules",
    seasonNote: "Not a season — a same-day check. Closures can happen any time of year, fast.",
    licenseNote: "No license needed to check the map. Everyone should know how.",
    safetyNote: "Paralytic shellfish poisoning is serious. The DOH map is the source of truth; the beach can look perfect and still be closed.",
    familyNote: "Bookmark the map on your phone before you walk down.",
    links: [officialLinks[1]],
    lastVerified: "2026-07-01",
  },
];
