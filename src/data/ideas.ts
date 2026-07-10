/**
 * Mock ideas board.
 *
 * BACKEND NOTE: becomes an `ideas` table plus an `idea_comments` table.
 * `commentCount` is a placeholder until real comments exist.
 */
import type { Idea } from "@/lib/types";

export const ideas: Idea[] = [
  {
    id: "i-1",
    title: "Better outdoor lighting on the beach path",
    description:
      "Two or three warm, downward-facing path lights so night walks to the water don't need a flashlight. Solar would avoid trenching.",
    category: "Outdoor projects",
    addedBy: "Sam",
    priority: "high",
    estimatedCost: "$150–250",
    status: "Worth Discussing",
    commentCount: 3,
  },
  {
    id: "i-2",
    title: "Replace the loft mattresses",
    description:
      "The loft mattresses are original-ish. Everyone sleeps better; everyone visits more.",
    category: "Comfort upgrades",
    addedBy: "Maya",
    priority: "high",
    estimatedCost: "$600–900",
    status: "Approved",
    commentCount: 5,
  },
  {
    id: "i-3",
    title: "Build a covered firewood rack",
    description: "Simple cedar rack by the shed so wood stays dry through winter.",
    category: "Outdoor projects",
    addedBy: "Paul",
    priority: "normal",
    estimatedCost: "$80 in lumber",
    status: "In Progress",
    commentCount: 2,
  },
  {
    id: "i-4",
    title: "Printed cabin history book",
    description:
      "Collect photos, the story of Florine building the place, and family memories into a small printed book that lives on the coffee table.",
    category: "Family traditions",
    addedBy: "Linda",
    priority: "normal",
    estimatedCost: "$60 to print",
    status: "Idea",
    commentCount: 4,
  },
  {
    id: "i-5",
    title: "Labeled pantry bins",
    description: "Clear bins with labels so the pantry survives August.",
    category: "Improvements",
    addedBy: "Maya",
    priority: "low",
    estimatedCost: "$40",
    status: "Done",
    commentCount: 1,
  },
  {
    id: "i-6",
    title: "Keyless entry on the main door",
    description:
      "A simple code lock so nobody has to hide-a-key. Codes per family member; guests get a stay code.",
    category: "Improvements",
    addedBy: "Chris",
    priority: "high",
    estimatedCost: "$120–200",
    status: "Worth Discussing",
    commentCount: 6,
  },
  {
    id: "i-7",
    title: "Florine photo wall",
    description:
      "A small wall of photos of Florine and the cabin being built in the early '80s, in the hallway by the bedrooms.",
    category: "Decoration ideas",
    addedBy: "Linda",
    priority: "normal",
    estimatedCost: "$75 for frames",
    status: "Approved",
    commentCount: 7,
  },
  {
    id: "i-8",
    title: "Emergency flashlight station",
    description:
      "One spot by the door: lantern, two flashlights, batteries, and the emergency contact card.",
    category: "Improvements",
    addedBy: "Sam",
    priority: "normal",
    estimatedCost: "$50",
    status: "Approved",
    commentCount: 1,
  },
  {
    id: "i-9",
    title: "Grab bar and step light for the porch stairs",
    description:
      "So the porch stairs are easy in the dark and easy at every age. This place should welcome everyone for a long time.",
    category: "Accessibility ideas",
    addedBy: "Maya",
    priority: "high",
    estimatedCost: "$90",
    status: "Worth Discussing",
    commentCount: 2,
  },
  {
    id: "i-10",
    title: "Annual low-tide breakfast",
    description:
      "Pick the best minus tide of the summer and make it a standing family breakfast on the beach.",
    category: "Family traditions",
    addedBy: "Sam",
    priority: "low",
    estimatedCost: "Pancakes",
    status: "Idea",
    commentCount: 8,
  },
  {
    id: "i-11",
    title: "Bunk room someday",
    description:
      "If the family keeps growing, convert the storage room to a little bunk room with two built-ins.",
    category: "Future dreams",
    addedBy: "Chris",
    priority: "low",
    estimatedCost: "$3,000+",
    status: "Not Now",
    commentCount: 3,
  },
  {
    id: "i-12",
    title: "Re-caulk the shower",
    description: "Corner seam is starting to lift. Quick job, big difference.",
    category: "Repairs needed",
    addedBy: "Paul",
    priority: "normal",
    estimatedCost: "$15",
    status: "In Progress",
    commentCount: 0,
  },
];
