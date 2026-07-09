/**
 * Cabin guide content — structured topics, not one text blob.
 *
 * PRIMARY SOURCE: "Hood Canal Beach House Welcome Letter and Instructions,
 * May 2020." The letter's instructions are preserved but reworded for
 * Florine's Place. Anything that may have changed since 2020 carries
 * `needsVerification: true` and a 2020-era lastVerified date.
 *
 * PRIVACY: the cabin address lives only in `emergencyInfo`
 * (visibility: approved_guest). The letter's personal phone numbers and
 * email addresses are NOT reproduced here — contacts are masked placeholders
 * until real auth protects them (see FamilyContact in types.ts).
 *
 * BACKEND NOTE: becomes admin-editable `guide_topics`, `emergency_info`, and
 * `family_contacts` tables with row-level security per `visibility`.
 */
import type { EmergencyInfo, FamilyContact, GuideTopic } from "@/lib/types";

const SOURCE_2020 = "From the May 2020 welcome letter.";

export const guidePrinciple =
  "Things happen. What matters is communication. If something breaks, spills, stops working, or needs attention, please let the family know right away.";

export const guideTopics: GuideTopic[] = [
  // --- Arrival -----------------------------------------------------------------
  {
    id: "arrival",
    title: "Arrival",
    category: "Getting settled",
    icon: "lantern",
    visibility: "approved_guest",
    summary: "First fifteen minutes: water on, water heater on, heat if you need it.",
    steps: [
      {
        label: "Try the kitchen faucet.",
        detail:
          "Depending on the season, the water may be shut off. If nothing comes out, follow the Water System steps below — it takes about ten minutes.",
      },
      {
        label: "Turn on the water heater.",
        detail:
          "Its breaker is on the electrical panel on the east wall of the basement laundry room. It's left off when the house is closed down.",
      },
      {
        label: "Warm the place up if needed.",
        detail:
          "Electric wall heaters in the bedrooms and main bathroom for quick heat; the wood stove for real heat. See Heating below.",
      },
      {
        label: "Sort out drinking water.",
        detail:
          "The well water is fine for cooking, cleaning, bathing, and laundry, but it tastes a bit sulfuric — bottled water is nicer for drinking. The family habit is to grab a couple of gallons at the grocery on the way in.",
      },
    ],
    notes: [
      "The cabin's street address is on the private Emergency Info card at the bottom of this page — worth reading once when you arrive.",
    ],
    lastVerified: "2020-05-01",
    needsVerification: true,
    sourceNote: SOURCE_2020,
  },

  // --- Water system ---------------------------------------------------------------
  {
    id: "water",
    title: "Water System",
    category: "Systems",
    icon: "water",
    visibility: "approved_guest",
    summary:
      "The house runs on its own well. In cold months the water is shut off in two places — the pump house and the basement — so it can't freeze.",
    steps: [
      {
        label: "Check the kitchen faucet first.",
        detail: "If you have water, skip to the water heater step. If not, keep going.",
      },
      {
        label: "Pump house: turn the pump breaker on.",
        detail:
          "The pump house is partway up the driveway, on the spur to the south (it's not locked). Inside, on the left, is an electrical box — find the breaker for the water pump and flip it on if it's off.",
      },
      {
        label: "Basement laundry room: open the main valve.",
        detail:
          "Behind the dryer in the southeast corner, with directions posted next to it. Turn it to fully open — past the point of initial resistance. If the laundry sink tap doesn't run, you haven't turned it far enough.",
      },
      {
        label: "Turn on the water heater breaker.",
        detail:
          "Electrical panel, east wall of the laundry room. The solar assist means you may have warm water even with it off, but you need the breaker on for continuous hot water.",
      },
    ],
    checklistGroups: [
      {
        title: "When you leave",
        items: [
          "Turn off the water heater — every time, every season",
          "Shut off the water at the laundry-room valve (skip only in midsummer, or if the next guests arrive soon)",
          "November through March: also turn off the pump breaker at the pump house",
        ],
      },
    ],
    notes: [
      "Well water: fine for everything except drinking taste — keep bottled water for that.",
      "The dishwasher won't run once the water is off — plan your last cycle accordingly (see Cleaning).",
    ],
    photoPlaceholders: [
      "Pump house and driveway spur",
      "Pump breaker box (left wall)",
      "Basement valve behind the dryer",
      "Water heater breaker on the east panel",
    ],
    lastVerified: "2020-05-01",
    needsVerification: true,
    sourceNote: SOURCE_2020,
  },

  // --- Heating / wood stove ---------------------------------------------------------
  {
    id: "heating",
    title: "Heating & the Wood Stoves",
    category: "Systems",
    icon: "flame",
    visibility: "approved_guest",
    summary:
      "Electric wall heaters for the bedrooms and main bath; the wood stoves are the real heart of the heat — main floor and basement.",
    body: [
      "Most of the time a fire in the main-floor stove is all the house needs — it warms the place in about an hour. In deep winter you may want the basement stove going too.",
      "Wood, kindling, newspaper, and matches live next to each stove. More firewood is outside the basement door, and there's an axe by the basement door if you need to split kindling.",
    ],
    steps: [
      {
        label: "Starting a fire",
        detail:
          "Set the damper handle (upper front left of the stove) fully open — all the way to the left. Once the house is warm, ease it to the right so the wood burns slower.",
      },
      {
        label: "Overnight",
        detail:
          "A large log or two with the handle all the way right will usually burn gently until morning.",
      },
      {
        label: "Wood sizes",
        detail: "The upstairs stove takes pieces up to 20″; the basement stove only up to 14″.",
      },
    ],
    checklist: [
      "Keep the stove door closed whenever a fire is burning",
      "Run the air purifier (next to the bookcase) on 1–2 while using the stove",
      "Before leaving: replenish wood and kindling by every stove you used",
      "Before leaving: turn off any electric heaters you used",
    ],
    notes: [
      "When you leave, you don't need to put a burning fire out — it's fine to let it burn down in the closed stove, even as you come and go.",
      "Safety first: nothing on or against the stove, and keep kids and towels at a respectful distance.",
    ],
    lastVerified: "2020-05-01",
    sourceNote: SOURCE_2020,
  },

  // --- Bedding ---------------------------------------------------------------------
  {
    id: "bedding",
    title: "Bedding",
    category: "Getting settled",
    icon: "bed",
    visibility: "approved_guest",
    summary: "You arrive to clean sheets; the next family does too.",
    checklist: [
      "On arrival: every bed should be made up with clean sheets — tell the family if one isn't",
      "Morning of departure: strip and wash any bedding you used",
      "Dry it, and remake the beds before you go",
      "Start the first load early — washer first, coffee second",
    ],
    lastVerified: "2020-05-01",
    sourceNote: SOURCE_2020,
  },

  // --- Internet / TV / Bluetooth ------------------------------------------------------
  {
    id: "internet",
    title: "Internet, TV & Music",
    category: "Getting settled",
    icon: "signal",
    visibility: "approved_guest",
    summary: "As of 2020 the cabin had no internet service of its own — this whole section needs a fresh look.",
    body: [
      "The 2020 letter's options: the neighbors' wireless (“Ater Guest” — historical info; ask the family whether that's still current and welcome before relying on it), or use your phone as a hotspot.",
      "A Fire Stick is attached to the TV — you're welcome to use it. The speaker under the TV is Bluetooth, good for streaming music.",
    ],
    notes: [
      "An admin should verify: is there cabin internet now? Is the neighbor arrangement still current? Fire Stick logins?",
    ],
    lastVerified: "2020-05-01",
    needsVerification: true,
    sourceNote: SOURCE_2020,
  },

  // --- Barbecue ---------------------------------------------------------------------
  {
    id: "barbecue",
    title: "Barbecue",
    category: "Around the cabin",
    icon: "grill",
    visibility: "approved_guest",
    summary: "Charcoal barbecue on the deck outside the basement door.",
    steps: [
      { label: "Find everything", detail: "Charcoal is next to the bathroom door in the basement. The electric charcoal starter hangs against the house on the north side of the basement, along with an extension cord." },
      { label: "After cooking", detail: "Unplug the starter right away. Once it's fully cool, hang it back where you found it." },
    ],
    notes: [
      "Charcoal stays outside, always. Let ash cool completely — a day is better than an hour — before it goes anywhere near a bag.",
    ],
    lastVerified: "2020-05-01",
    sourceNote: SOURCE_2020,
  },

  // --- Cleaning checklist ---------------------------------------------------------------
  {
    id: "cleaning",
    title: "Cleaning Checklist",
    category: "Cleaning & leaving",
    icon: "broom",
    visibility: "approved_guest",
    summary:
      "Everyone cleans before leaving — with a group effort it's about an hour, and it's what makes arriving here feel the way it does.",
    body: [
      "The cleaning fee covers the deeper resets between stays; this checklist is each stay's part of the bargain. Supplies live under the kitchen sink (Bon Ami, cooktop cleaner, glass cleaner, rags). The vacuum is at the bottom of the basement stairs; a hand-vac for spot pickups is on the floor of the right-hand pantry behind the sliding doors.",
    ],
    checklistGroups: [
      {
        title: "Main floor",
        items: [
          "Wipe kitchen counters, the island, and the table",
          "Dust — especially if the wood stove was used; it makes the house dusty",
          "Vacuum and sweep all floors, then empty the vacuum's dirt container",
          "Spot-wash floors with a damp rag around cooking areas and the wood stove",
          "Clean the sink (Bon Ami, under the sink) and wipe the faucet",
          "Clean the cooktop (cleaner is under the sink)",
          "Clear all perishables from the fridge; wipe the glass shelves if needed",
          "Run the dishwasher — start it at least an hour before the water gets shut off; empty it if it finishes",
          "Hand-wash and put away anything that didn't make the cycle",
          "Used rags and dish towels go by the washer; hang a clean dish towel (cabinet north of the dining table)",
          "Empty all trash cans — trash and recycling leave with you",
        ],
      },
      {
        title: "Bathrooms",
        items: [
          "Clean the tub/shower if used (Bon Ami)",
          "Sweep or vacuum floors; shake the rugs outside",
          "Clean sinks and wipe faucets",
          "Clean toilets (brush and cleaner sit next to each one); wipe the floor around them as needed",
          "Clean mirrors (glass cleaner under the kitchen sink)",
          "Only clean hand towels out on the racks — wash, dry, fold, and put away the rest",
        ],
      },
      {
        title: "Basement",
        items: [
          "Run the vacuum over the rug",
          "Clean the basement toilet and vanity if used",
        ],
      },
    ],
    lastVerified: "2020-05-01",
    sourceNote: SOURCE_2020,
  },

  // --- Departure checklist ---------------------------------------------------------------
  {
    id: "departure",
    title: "Departure Checklist",
    category: "Cleaning & leaving",
    icon: "shore",
    visibility: "approved_guest",
    summary: "The last kindness of every stay: leaving the cabin the way you hoped to find it.",
    checklist: [
      "Wash, dry, and remake any used bedding",
      "Work through the cleaning checklist above",
      "Dishwasher started in time; emptied if it finished — nothing wet left in the washer (the dryer may finish after you leave)",
      "Perishables out of the fridge",
      "All trash and recycling packed to leave with you",
      "Deck furniture and cushions onto the porch, under cover",
      "Remotes back on the cabinet under the TV",
      "Wood and kindling replenished by the stove(s) you used",
      "Electric heaters off",
      "Water heater off — every time",
      "Water shut off at the laundry-room valve (except midsummer or when guests arrive soon)",
      "November–March: pump breaker off at the pump house",
      "Windows locked, blinds down in every room",
      "Lights off — except the outside light at the driveway entry (its switch is behind the fridge, marked with tape)",
      "Lock doors with the deadbolts only, not the knob locks — main door: press the rectangular button at the top of the keypad, then turn the deadbolt clockwise",
      "Update the Supplies page in the app before you pull out of the driveway",
    ],
    lastVerified: "2020-05-01",
    sourceNote: SOURCE_2020,
  },

  // --- Trash / recycling ---------------------------------------------------------------
  {
    id: "trash",
    title: "Trash, Recycling & the Dump",
    category: "Cleaning & leaving",
    icon: "trash",
    visibility: "approved_guest",
    summary: "There is no garbage service at the cabin — everything leaves with you.",
    body: [
      "Empty all the cans before you go and take trash and recycling home, or run them to the dump on your way out.",
      "Per the 2020 letter: the dump is just off the Hansville road, on the right before you reach the casino heading back toward Kingston. It was open Thursday–Monday, 9–4; recycling free, trash about $6 a bag. Hours and prices need re-verifying — check before you count on it.",
    ],
    notes: [
      "The dump is also listed under Nearby Essentials on the Tides, Weather & Nearby page.",
    ],
    lastVerified: "2020-05-01",
    needsVerification: true,
    sourceNote: SOURCE_2020,
  },

  // --- Supplies / restock ---------------------------------------------------------------
  {
    id: "restock",
    title: "Supplies & Restocking",
    category: "Cleaning & leaving",
    icon: "supplies",
    visibility: "approved_guest",
    summary: "The 2020 letter said to email a list of what ran out. The app replaces the email.",
    body: [
      "Instead of emailing a list, please update the Supplies page before you leave so the next person knows what is low, out, or worth bringing.",
    ],
    notes: [
      "Worth a glance before you go: staples, paper products, bottled water, cleaning supplies, dish towels and rags, firewood and kindling, charcoal, toiletries, trash bags, laundry supplies, and anything you noticed in the fridge or pantry.",
    ],
    lastVerified: "2026-07-09",
    sourceNote: "Workflow modernized from the May 2020 letter (which used email).",
  },

  // --- Kept family-placeholder topics (not from the 2020 letter) ---------------------
  {
    id: "parking",
    title: "Parking",
    category: "Around the cabin",
    icon: "shore",
    visibility: "public",
    body: [
      "Two cars fit in the gravel pull-in; a third can go along the fence. Please keep the neighbors' driveway completely clear.",
    ],
    needsVerification: true,
    sourceNote: "Family placeholder — not from the 2020 letter; confirm details.",
  },
  {
    id: "neighbors",
    title: "Neighbors & Noise",
    category: "Around the cabin",
    icon: "shore",
    visibility: "public",
    body: [
      "The water carries sound like a telephone — voices on the beach at night travel further than you think. Please keep evenings gentle after 10.",
      "The neighbors have watched the place for the family for years. Wave at them.",
    ],
    sourceNote: "Family placeholder — not from the 2020 letter.",
  },
  {
    id: "pets",
    title: "Pets",
    category: "Around the cabin",
    icon: "shore",
    visibility: "public",
    body: [
      "Approved pets are welcome. Keep dogs off beds and furniture, rinse the beach off them before they come in, and mention pets in your stay request.",
    ],
    sourceNote: "Family placeholder — not from the 2020 letter.",
  },
  {
    id: "breaks",
    title: "If Something Breaks",
    category: "Around the cabin",
    icon: "lantern",
    visibility: "public",
    body: [
      "Don't worry, and don't quietly fix-and-hide it — tell the family right away, in the app or by text. Broken things are normal; surprises later are the only thing that causes hurt feelings.",
      "Water, power, and heat shutoffs are all in the Water System and Emergency sections.",
    ],
    sourceNote: "Family placeholder — not from the 2020 letter.",
  },
];

// --- Emergency info (private) ----------------------------------------------------

export const emergencyInfo: EmergencyInfo = {
  visibility: "approved_guest",
  address: "36411 Hood Canal Drive NE, Hansville, WA 98340",
  responderNote:
    "In an emergency call 911 first and give responders this address. Then call the family — any of them, any hour.",
  items: [
    { label: "Water shutoff", value: "Valve behind the dryer, SE corner of the basement laundry room" },
    { label: "Pump shutoff", value: "Breaker box on the left wall of the pump house, up the driveway spur" },
    { label: "Electrical panel", value: "East wall of the basement laundry room" },
    { label: "Fire extinguisher", value: "Location placeholder — an admin should confirm and photograph", needsVerification: true },
    { label: "First aid kit", value: "Above the fridge (placeholder — confirm)", needsVerification: true },
    { label: "Nearest urgent care", value: "Placeholder — see Nearby Essentials; verify current hours", needsVerification: true },
    { label: "Nearest hospital", value: "St. Michael Medical Center, Bremerton (placeholder — verify drive time from Hansville)", needsVerification: true },
  ],
  lastVerified: "2020-05-01",
  sourceNote: "Address from the May 2020 letter. Shutoffs from its water/heating instructions.",
};

// --- Family contacts (family/admin only, masked) -----------------------------------

export const familyContacts: FamilyContact[] = [
  {
    id: "fc-1",
    name: "Greg",
    role: "Cabin lead · supplies & upkeep",
    phone: "(206) •••-•••• — placeholder",
    email: "g•••••@gmail.com — placeholder",
    visibility: "family",
    lastVerified: "2020-05-01",
  },
  {
    id: "fc-2",
    name: "Tom",
    role: "Family owner",
    phone: "(206) •••-•••• — placeholder",
    email: "— placeholder",
    visibility: "family",
    lastVerified: "2020-05-01",
  },
  {
    id: "fc-3",
    name: "Kate",
    role: "Family owner",
    phone: "(206) •••-•••• — placeholder",
    email: "— placeholder",
    visibility: "family",
    lastVerified: "2020-05-01",
  },
  {
    id: "fc-4",
    name: "Peggy",
    role: "Family owner",
    phone: "(206) •••-•••• — placeholder",
    email: "— placeholder",
    visibility: "family",
    lastVerified: "2020-05-01",
  },
];

export const contactsPrivacyNote =
  "Real numbers and emails are in the 2020 letter and in family phones. They stay out of the app until real logins protect them — then admins fill these in.";
