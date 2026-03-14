/**
 * types/index.ts
 *
 * All shared TypeScript types for the Bible Atlas app.
 * Import from here rather than defining types inline in component files.
 */

// ---------------------------------------------------------------------------
// Geography
// ---------------------------------------------------------------------------

/** A single biblical city or place with real-world coordinates */
export type City = {
  id: string;
  name: string;
  /** Alternate historical names (e.g. "Kirjath-arba" for Hebron) */
  altNames?: string[];
  lat: number;
  lng: number;
  description: string;
};

// ---------------------------------------------------------------------------
// Geographic Events (the core data model — see CLAUDE.md for full spec)
// ---------------------------------------------------------------------------

export type GeographicEvent = {
  book: string;               // e.g. "Deuteronomy"
  chapter: number;            // e.g. 3
  verseRange: [number, number]; // e.g. [1, 11]
  summary: string;            // Short description of what happened
  locations: {
    name: string;
    lat: number;
    lng: number;
    role: "battle" | "origin" | "destination" | "mentioned";
    notes?: string;
  }[];
  movements?: {
    from: string;
    to: string;
    type: "military" | "journey" | "migration";
    description: string;
  }[];
  regionChanges?: {
    region: string;
    previousController: string;
    newController: string;
    cityRenames?: { old: string; new: string }[];
  }[];
  crossReferences?: string[]; // e.g. ["Numbers 21:33-35"]
};

// ---------------------------------------------------------------------------
// App UI State
// ---------------------------------------------------------------------------

/** Which book/chapter the reader panel is showing */
export type ReaderPosition = {
  book: string;
  chapter: number;
};

/** Global state shared between the map and reader */
export type AppState = {
  readerPosition: ReaderPosition;
  selectedEventIndex: number | null;
};
