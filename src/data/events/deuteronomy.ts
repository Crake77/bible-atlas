/**
 * deuteronomy.ts
 *
 * Geographic events for the book of Deuteronomy, chapter by chapter.
 * Each entry maps a passage to the places it mentions, movements it describes,
 * and any political/regional changes that occur.
 *
 * STATUS: Placeholder data — a deep research pass is in progress to fill
 * in all 34 chapters with accurate coordinates and cross-references.
 * (See PROJECT_STATUS.md for details.)
 *
 * Data format defined in src/types/index.ts (GeographicEvent).
 */

import type { GeographicEvent } from "@/types";

export const deuteronomyEvents: GeographicEvent[] = [
  {
    book: "Deuteronomy",
    chapter: 1,
    verseRange: [1, 8],
    summary: "Moses reminds Israel of their journey from Horeb",
    locations: [
      {
        name: "Mount Horeb",
        lat: 28.539,
        lng: 33.975,
        role: "origin",
        notes: "Where the Law was given; starting point of the journey recap",
      },
      {
        name: "Kadesh Barnea",
        lat: 30.633,
        lng: 34.4,
        role: "mentioned",
        notes: "Southern boundary of the land promised to Israel",
      },
    ],
    crossReferences: ["Exodus 19:1-2", "Numbers 10:11-12"],
  },
  {
    book: "Deuteronomy",
    chapter: 2,
    verseRange: [24, 37],
    summary: "Defeat of Sihon king of the Amorites",
    locations: [
      {
        name: "Arnon River",
        lat: 31.5,
        lng: 35.617,
        role: "origin",
        notes: "Israel crossed the Arnon to begin the campaign",
      },
      {
        name: "Heshbon",
        lat: 31.8,
        lng: 35.85,
        role: "battle",
        notes: "Capital of Sihon; taken by Israel",
      },
    ],
    movements: [
      {
        from: "Arnon River",
        to: "Heshbon",
        type: "military",
        description: "Israel advances north to engage Sihon",
      },
    ],
    regionChanges: [
      {
        region: "Amorite kingdom of Heshbon",
        previousController: "Sihon (Amorite)",
        newController: "Israel",
      },
    ],
    crossReferences: ["Numbers 21:21-31"],
  },
  {
    book: "Deuteronomy",
    chapter: 3,
    verseRange: [1, 11],
    summary: "Defeat of Og king of Bashan",
    locations: [
      {
        name: "Edrei",
        lat: 32.617,
        lng: 36.1,
        role: "battle",
        notes: "Where Og came out to fight and was defeated",
      },
    ],
    movements: [
      {
        from: "Heshbon",
        to: "Edrei",
        type: "military",
        description: "Israel turns north to face Og of Bashan",
      },
    ],
    regionChanges: [
      {
        region: "Bashan",
        previousController: "Og (Rephaite king)",
        newController: "Israel (tribe of Manasseh)",
      },
    ],
    crossReferences: ["Numbers 21:33-35", "Joshua 12:4"],
  },
  {
    book: "Deuteronomy",
    chapter: 34,
    verseRange: [1, 12],
    summary: "Death of Moses on Mount Nebo",
    locations: [
      {
        name: "Mount Nebo",
        lat: 31.7658,
        lng: 35.7297,
        role: "destination",
        notes: "Moses views the Promised Land and dies here",
      },
      {
        name: "Plains of Moab",
        lat: 31.867,
        lng: 35.567,
        role: "origin",
        notes: "Where Israel camped while Moses ascended",
      },
    ],
    movements: [
      {
        from: "Plains of Moab",
        to: "Mount Nebo",
        type: "journey",
        description: "Moses ascends alone to view Canaan before his death",
      },
    ],
    crossReferences: ["Numbers 27:12-14", "Joshua 1:1-2"],
  },
];

// Convenience: flat list of all events (useful for the sidebar)
export const bibleEvents = deuteronomyEvents.map((e) => ({
  id: `${e.book}-${e.chapter}-${e.verseRange[0]}`,
  name: e.summary,
  reference: `${e.book} ${e.chapter}:${e.verseRange[0]}–${e.verseRange[1]}`,
  description: e.locations.map((l) => l.notes).filter(Boolean).join(" "),
  locationId: e.locations[0]?.name ?? "",
}));
