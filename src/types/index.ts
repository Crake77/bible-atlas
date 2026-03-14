/**
 * types/index.ts
 *
 * All shared TypeScript types for the Bible Atlas app.
 * Import from here rather than defining types inline in component files.
 */

// ---------------------------------------------------------------------------
// Coordinate primitives
// ---------------------------------------------------------------------------

/** [lat, lng] — used in our data files */
export type LatLng = [number, number];

/** GeoJSON polygon ring — [lng, lat] pairs (GeoJSON is lng-first) */
export type PolygonRing = [number, number][];

// ---------------------------------------------------------------------------
// Political Entities
// ---------------------------------------------------------------------------

export type PoliticalEntityId =
  | "israel"
  | "judah"
  | "israel-north"
  | "moab"
  | "edom"
  | "ammon"
  | "philistia"
  | "amorites"
  | "bashan"
  | "canaan"
  | "egypt"
  | "assyria"
  | "babylon"
  | "aram"
  | "persia"
  | "phoenicia"
  | "midian"
  | "unclaimed";

export type PoliticalEntity = {
  id: PoliticalEntityId;
  name: string;
  /** CSS hex color, e.g. "#4a7c59" */
  color: string;
  description: string;
};

// ---------------------------------------------------------------------------
// Geography: Regions
// ---------------------------------------------------------------------------

export type RegionTier = "local" | "surrounding";

export type Region = {
  id: string;
  name: string;
  tier: RegionTier;
  /** GeoJSON polygon exterior ring as [lng, lat] pairs */
  boundary: PolygonRing;
  /** Which entity controlled this region at the start of the dataset */
  defaultController: PoliticalEntityId;
  /**
   * Override control for specific book-chapter combinations.
   * Key format: "Deuteronomy-3"
   * The override applies from that chapter onward until another override.
   */
  controlOverrides?: Record<string, PoliticalEntityId>;
  /** Where to place the region label [lat, lng] */
  labelPosition: LatLng;
  description?: string;
};

// ---------------------------------------------------------------------------
// Geography: Tribes
// ---------------------------------------------------------------------------

export type Tribe = {
  id: string;
  name: string;
  boundary: PolygonRing;
  /** Where to place the tribe label [lat, lng] */
  labelPosition: LatLng;
  notes?: string;
};

// ---------------------------------------------------------------------------
// Geography: Rivers
// ---------------------------------------------------------------------------

export type RiverTier = "major" | "minor" | "wadi";

export type River = {
  id: string;
  name: string;
  tier: RiverTier;
  /** Ordered [lat, lng] waypoints from source to mouth */
  path: LatLng[];
  labelPosition?: LatLng;
};

// ---------------------------------------------------------------------------
// Geography: Routes
// ---------------------------------------------------------------------------

export type RouteType =
  | "trade"
  | "military"
  | "journey"
  | "migration"
  | "pilgrimage";

export type RouteWaypoint = {
  lat: number;
  lng: number;
  label?: string;
};

export type Route = {
  id: string;
  name: string;
  type: RouteType;
  waypoints: RouteWaypoint[];
  /** Whether to draw a directional arrowhead at the destination */
  directed: boolean;
  /** Undefined = always visible when layer is on; set = only show at this chapter */
  chapterRef?: { book: string; chapter: number };
  /** Override color; if absent, RouteType default color is used */
  color?: string;
  description?: string;
};

// ---------------------------------------------------------------------------
// Special Sites
// ---------------------------------------------------------------------------

export type SpecialSiteType =
  | "tabernacle"
  | "covenant"
  | "theophany"
  | "battle"
  | "burial"
  | "altar"
  | "vision"
  | "city-of-refuge"
  | "levitical-city"
  | "high-place";

export type SpecialSite = {
  id: string;
  name: string;
  type: SpecialSiteType;
  lat: number;
  lng: number;
  verseRef: string;
  description: string;
  /** If set, only show this site when reader is at this chapter */
  chapterRef?: { book: string; chapter: number };
};

// ---------------------------------------------------------------------------
// Cities (expanded)
// ---------------------------------------------------------------------------

export type CityTier = "major" | "minor" | "archaeological";

export type City = {
  id: string;
  name: string;
  altNames?: string[];
  lat: number;
  lng: number;
  tier: CityTier;
  description: string;
  associatedEntity?: PoliticalEntityId;
};

// ---------------------------------------------------------------------------
// Layer System
// ---------------------------------------------------------------------------

export type LayerGroup =
  | "physical"
  | "political"
  | "tribes"
  | "movements"
  | "settlements"
  | "events"
  | "labels";

export type LayerId =
  // physical
  | "layer-rivers"
  | "layer-seas"
  | "layer-mountains"
  // political
  | "layer-regions"
  | "layer-surrounding-nations"
  // tribes
  | "layer-tribes"
  // movements
  | "layer-trade-routes"
  | "layer-journey-routes"
  | "layer-military-routes"
  // settlements
  | "layer-cities-major"
  | "layer-cities-minor"
  | "layer-cities-archaeological"
  // events
  | "layer-special-sites-tabernacle"
  | "layer-special-sites-covenant"
  | "layer-special-sites-battle"
  | "layer-special-sites-other"
  // labels
  | "layer-labels-regions"
  | "layer-labels-rivers"
  | "layer-labels-cities"
  | "layer-labels-tribes";

export type LayerConfig = {
  id: LayerId;
  label: string;
  group: LayerGroup;
  defaultVisible: boolean;
  description?: string;
};

export type LayerVisibility = Record<LayerId, boolean>;

// ---------------------------------------------------------------------------
// Geographic Events (core data model — expanded)
// ---------------------------------------------------------------------------

export type GeographicEvent = {
  book: string;
  chapter: number;
  verseRange: [number, number];
  summary: string;
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
    /** Explicit coords for arrow rendering — falls back to city lookup if absent */
    fromLatLng?: [number, number];
    toLatLng?: [number, number];
  }[];
  regionChanges?: {
    region: string;
    previousController: string;
    newController: string;
    cityRenames?: { old: string; new: string }[];
  }[];
  /** IDs of SpecialSites that become active at this chapter */
  specialSites?: string[];
  /** Tribe relocations (Joshua/Judges era) */
  tribeMovements?: {
    tribe: string;
    from: string;
    to: string;
    description: string;
  }[];
  crossReferences?: string[];
};

// ---------------------------------------------------------------------------
// App State
// ---------------------------------------------------------------------------

export type ReaderPosition = {
  book: string;
  chapter: number;
};

export type AppState = {
  readerPosition: ReaderPosition;
  layerVisibility: LayerVisibility;
  selectedEventIndex: number | null;
};
