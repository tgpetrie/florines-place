/**
 * Shared types for Florine's Place.
 *
 * These mirror the shape of the future Supabase tables. When the backend is
 * wired up, each interface here should map 1:1 to a table (or view), and the
 * mock data in `src/data/` gets replaced by Supabase queries.
 */

// --- People -----------------------------------------------------------------

export type Role = "guest" | "family" | "admin";

export interface User {
  id: string;
  name: string;
  relation: string; // e.g. "Sister", "Approved friend"
  role: Role;
}

// --- Stays ------------------------------------------------------------------

export type StayRequestStatus = "pending" | "approved" | "declined";

/** Where the cleaning fee stands for a given stay. Never called "payment" in the UI. */
export type CleaningFeeStatus = "due" | "paid" | "waived";

export interface StayRequest {
  id: string;
  name: string;
  contact: string;
  arrival: string; // ISO date
  departure: string; // ISO date
  guestCount: number;
  party: string; // who is coming
  pets: string; // "" if none
  note: string; // reason for stay / note to family
  specialCircumstances: string;
  status: StayRequestStatus;
  cleaningFee: CleaningFeeStatus;
  submitted: string; // ISO date
}

// --- Calendar ---------------------------------------------------------------

export type CalendarStatus =
  | "available"
  | "requested"
  | "approved"
  | "considering"
  | "blocked"
  | "cleaning"
  | "maintenance";

export interface CalendarEvent {
  id: string;
  start: string; // ISO date, inclusive
  end: string; // ISO date, inclusive
  status: CalendarStatus;
  who: string;
  label?: string;
}

/** Softer family planning, separate from firm calendar events. */
export type PlanIntent = "Thinking about going" | "Planning to go" | "Confirmed";
export type PlanMode =
  | "Open to sharing"
  | "Private family time"
  | "Maintenance trip"
  | "Day trip only";

export interface FamilyPlan {
  id: string;
  who: string;
  window: string; // human-readable, e.g. "Late August"
  intent: PlanIntent;
  mode: PlanMode;
  note?: string;
}

// --- Supplies ---------------------------------------------------------------

export type SupplyCategory =
  | "Groceries"
  | "Paper goods"
  | "Cleaning supplies"
  | "Toiletries"
  | "Firewood / propane / utilities"
  | "Tools / hardware"
  | "Linens / towels"
  | "Emergency supplies"
  | "Wanted items";

export type SupplyStatus =
  | "In Stock"
  | "Running Low"
  | "Out"
  | "Need to Buy"
  | "Wanted"
  | "Purchased"
  | "Not Sure";

export type SupplyPriority = "low" | "normal" | "high";

export interface SupplyItem {
  id: string;
  name: string;
  category: SupplyCategory;
  status: SupplyStatus;
  quantity: string; // free-form estimate, e.g. "One roll left"
  notes: string;
  updatedBy: string;
  updatedAt: string; // ISO date
  priority: SupplyPriority;
}

// --- Ideas ------------------------------------------------------------------

export type IdeaCategory =
  | "Repairs needed"
  | "Improvements"
  | "Decoration ideas"
  | "Outdoor projects"
  | "Comfort upgrades"
  | "Accessibility ideas"
  | "Family traditions"
  | "Future dreams";

export type IdeaStatus =
  | "Idea"
  | "Worth Discussing"
  | "Approved"
  | "In Progress"
  | "Done"
  | "Not Now";

export interface Idea {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  addedBy: string;
  priority: SupplyPriority;
  estimatedCost: string; // free-form, e.g. "$200–400"
  status: IdeaStatus;
  commentCount: number; // placeholder until real comments exist
}

// --- Guestbook ---------------------------------------------------------------

export interface GuestbookEntry {
  id: string;
  name: string;
  stayDates: string; // human-readable
  message: string;
  favoriteMoment?: string;
  tideNote?: string; // tide / weather note
  hasPhoto: boolean; // placeholder for a future photo upload
  visibility: "family" | "admins";
}

// --- Cabin guide ---------------------------------------------------------------

/**
 * Who can see a piece of guide content. The mock role switcher maps:
 * guest → approved_guest (an approved guest using the app), family → family,
 * admin → admin. Truly public visitors (no login) see only "public".
 * BACKEND NOTE: becomes a row-level security policy per visibility level.
 */
export type Visibility = "public" | "approved_guest" | "family" | "admin";

/**
 * One structured guide topic — never a giant text blob. Content is derived
 * from the May 2020 "Hood Canal Beach House Welcome Letter" (see sourceNote
 * per topic), modernized for Florine's Place.
 */
export interface GuideTopic {
  id: string;
  title: string;
  category: string; // e.g. "Systems", "Cleaning", "Around the cabin"
  icon:
    | "water"
    | "flame"
    | "bed"
    | "signal"
    | "grill"
    | "broom"
    | "trash"
    | "supplies"
    | "emergency"
    | "lantern"
    | "shore";
  visibility: Visibility;
  summary?: string; // one-line quick summary
  body?: string[]; // short paragraphs
  steps?: { label: string; detail?: string }[]; // numbered step-by-step
  checklist?: string[]; // simple checkbox list
  checklistGroups?: { title: string; items: string[] }[]; // grouped checklists
  notes?: string[]; // callout notes / reminders
  photoPlaceholders?: string[]; // future photos/diagrams
  lastVerified?: string; // ISO date
  needsVerification?: boolean; // info may have changed since the source
  sourceNote?: string; // where this content came from
}

export interface EmergencyItem {
  label: string;
  value: string;
  needsVerification?: boolean;
}

/** Private emergency card. Never rendered on public pages. */
export interface EmergencyInfo {
  visibility: Visibility;
  address: string;
  responderNote: string;
  items: EmergencyItem[];
  lastVerified: string;
  sourceNote: string;
}

/**
 * Family contacts — family/admin only. Phones and emails are deliberately
 * MASKED placeholders: the 2020 letter contains the real ones, but they
 * should not be hard-coded into the app until real logins protect them.
 * BACKEND NOTE: store real values in a Supabase table behind RLS, never in
 * this repo.
 */
export interface FamilyContact {
  id: string;
  name: string;
  role: string;
  phone: string; // masked placeholder
  email: string; // masked placeholder
  visibility: Visibility;
  lastVerified: string;
}

// --- Tides, Weather & Nearby (the local field guide) -------------------------

/**
 * Current conditions snapshot. MOCK for now.
 * BACKEND NOTE: later filled by a weather API, NOAA tides
 * (tidesandcurrents.noaa.gov), and a sunrise/moon API — fetched server-side
 * and cached, never hard-coded.
 */
export interface WeatherSummary {
  asOf: string; // human-readable timestamp of the mock snapshot
  condition: string;
  tempF: number;
  highF: number;
  lowF: number;
  rainChance: string;
  wind: string;
  sunrise: string;
  sunset: string;
  moonPhase: string;
  moonNote?: string;
}

export type TideType = "high" | "low";

export interface TideEvent {
  id: string;
  date: string; // ISO date
  time: string; // human-readable, e.g. "11:54 AM"
  type: TideType;
  heightFt: number;
  note?: string;
}

/** A "best low-tide window" worth planning a morning around. */
export interface TideWindow {
  id: string;
  date: string; // ISO date
  window: string; // e.g. "11am – 1:30pm"
  lowHeightFt: number;
  note: string; // one poetic-but-practical line
  moonlight?: boolean; // a night low under the moon
}

/**
 * One day in a forecast. MOCK for now. Home shows the first three of these;
 * the same shape scales to a 10-day outlook without any redesign.
 * BACKEND NOTE: later filled per day from a weather API + NOAA tide
 * predictions; `sourceStatus`/`lastUpdated` become real provenance.
 */
export interface ForecastDay {
  date: string; // ISO date
  label: string; // "Today", "Tomorrow", or a weekday
  summary: string; // short weather summary
  highF: number;
  lowF: number;
  rainChance: string;
  wind: string;
  lowTide: string; // e.g. "11:54 AM · -1.9 ft"
  highTide: string; // e.g. "7:26 PM · 12.4 ft"
  tideNote?: string; // the day's most notable window / low
  sourceStatus: string; // e.g. "Mock data for first version"
  lastUpdated: string; // human-readable
}

export type SpecialDateKind =
  | "Federal holiday"
  | "Family date"
  | "Cabin date"
  | "Local event"
  | "Seasonal reminder";

export interface SpecialDate {
  id: string;
  date: string; // ISO date, or "" for undated reminders
  name: string;
  kind: SpecialDateKind;
  note?: string;
}

/**
 * One model for every nearby listing — essentials, stops & experiences, and
 * yard/equipment help — discriminated by `group`. They share all fields, so
 * they share one card, one admin flow, and (later) one Supabase table.
 */
export type PlaceGroup = "essentials" | "stops" | "yard";

export type PlaceStatus =
  | "Recommended"
  | "Used Before"
  | "Need to Verify"
  | "Seasonal"
  | "Not Recommended";

export interface LocalPlace {
  id: string;
  name: string;
  group: PlaceGroup;
  category: string; // e.g. "Grocery", "Brewery", "Equipment rental"
  address: string;
  distance: string; // placeholder, e.g. "~8 min north"
  phone: string;
  website: string;
  hours: string;
  seasonalNote?: string;
  ageNote?: string; // age restrictions / legal requirements, stated plainly
  goodFor?: string[]; // e.g. ["kids", "rainy day", "views"]
  familyNotes: string[]; // the family notes layer
  lastVerified: string; // ISO date — hours & contacts change; admins re-verify
  status: PlaceStatus;
}

// --- Place Signals -----------------------------------------------------------

/**
 * Small seasonal / situational field notes from the cabin — crabbing season,
 * shellfish safety, burn bans, wood-stove season, blackberries, eagle/deer,
 * the cliff stairs, the dinghy, an occasional submarine. Calm and useful, not
 * alerts. Anything about harvesting or fire carries requiresOfficialCheck +
 * lastVerified and never states rules as truth.
 *
 * BACKEND NOTE: becomes an admin-editable `place_signals` table; `isActive`
 * (and later startDate/endDate vs. the real clock) decides what shows.
 */
export type SignalCategory =
  | "seasonal"
  | "tide"
  | "weather"
  | "fire"
  | "wood-stove"
  | "crabbing"
  | "shellfish"
  | "fishing"
  | "safety"
  | "wildlife"
  | "family"
  | "maintenance"
  | "beach-access"
  | "dinghy"
  | "local-event"
  | "quirky";

export type SignalSeverity = "note" | "reminder" | "important" | "safety";

export type SignalMotif =
  | "crab"
  | "geoduck"
  | "oyster"
  | "sanddollar"
  | "blackberry"
  | "cedar"
  | "woodstove"
  | "firewood"
  | "flame"
  | "eagle"
  | "deer"
  | "tide"
  | "moon"
  | "stairs"
  | "dinghy"
  | "submarine"
  | "lantern";

export interface PlaceSignal {
  id: string;
  title: string;
  shortLabel: string;
  message: string;
  category: SignalCategory;
  severity: SignalSeverity;
  season?: string;
  startDate?: string; // ISO
  endDate?: string; // ISO
  icon: SignalMotif;
  motif: SignalMotif;
  visibility: Visibility;
  linkText?: string;
  linkHref?: string;
  sourceType?: string; // e.g. "WDFW", "DOH", "local fire authority"
  sourceUrl?: string; // official-source placeholder
  lastVerified?: string; // ISO
  requiresOfficialCheck: boolean;
  isActive: boolean;
}

// --- Porch Notes (family message board) ---------------------------------------

/**
 * Simple family message thread — informal cabin conversation.
 * Not tied to a specific stay. Think of it as the cabin's porch whiteboard.
 * BACKEND NOTE: becomes a `porch_notes` table; visibility gates show/hide
 * messages appropriately. `stayId` optionally ties a note to a stay.
 */
export interface PorchNote {
  id: string;
  author: string;
  initials: string;
  message: string;
  postedAt: string; // ISO datetime
  visibility: Visibility;
  stayId?: string; // optional — if set, note belongs to a specific stay thread
}

// --- Fishing, crabbing & shellfish -------------------------------------------

/**
 * Harvest rules change by area, season, species, closures, and biotoxins.
 * This model deliberately stores NO rules as truth — only statuses to check,
 * pointers to official sources, and a last-verified date.
 */
export type HarvestStatus = "Open" | "Closed" | "Check Rules" | "Seasonal";

export interface OfficialLink {
  label: string;
  org: string;
  url: string;
  note?: string;
}

export interface HarvestResource {
  id: string;
  activity: string;
  status: HarvestStatus;
  seasonNote: string; // placeholder wording, never permanent truth
  licenseNote: string;
  safetyNote: string;
  familyNote?: string;
  links: OfficialLink[];
  lastVerified: string; // ISO date
}
