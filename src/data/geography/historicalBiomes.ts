/**
 * Historical biome zones for the ancient Near East, c. 1000 BC.
 * Colors reflect vegetation cover at that era — far more forested than today.
 * Each zone is defined as axis-aligned rectangles [minLat, maxLat, minLng, maxLng]
 * for fast O(1) point-in-bbox tests at vertex-build time.
 */

type RGB = [number, number, number]; // 0–1 each

export interface BiomeZone {
  id: string;
  rgb: RGB;
  priority: number; // higher = checked first, wins on overlap
  rects: [number, number, number, number][]; // [minLat, maxLat, minLng, maxLng]
}

function hex(h: string): RGB {
  return [
    parseInt(h.slice(1, 3), 16) / 255,
    parseInt(h.slice(3, 5), 16) / 255,
    parseInt(h.slice(5, 7), 16) / 255,
  ];
}

// Non-polygon elevation overrides
export const OCEAN_RGB: RGB  = hex("#1a3a6a");  // deep navy (Mediterranean / Red Sea)
export const ALPINE_RGB: RGB = hex("#788090");  // grey rock
export const SNOW_RGB: RGB   = hex("#e0d8c0");  // warm snow
export const STEPPE_RGB: RGB = hex("#9a8a50");  // semi-arid fallback

// Inland lake colours — historically distinct water bodies in the Jordan Rift
// Dead Sea (Yam HaMelach / Sea of Salt): hypersaline, deep aquamarine-grey
// Sea of Galilee (Kinneret): freshwater, bright blue-green
export const DEAD_SEA_RGB: RGB = hex("#1f4a5c");
export const GALILEE_RGB: RGB  = hex("#1a5a78");

export const HISTORICAL_BIOMES: BiomeZone[] = [
  {
    // Lebanon mountain spine: Cedars of Lebanon (1 Kgs 5:6, Isa 2:13)
    // Covered thousands of sq mi; Solomon's Temple used Lebanese cedar
    id: "cedar-forest",
    rgb: hex("#2a4a1a"),
    priority: 10,
    rects: [
      [33.9, 34.9, 35.4, 36.6], // Lebanon range (north–south ridge)
      [33.1, 34.0, 35.8, 37.2], // Anti-Lebanon / Mt. Hermon area
    ],
  },
  {
    // Jordan Rift Valley — Gen 13:10 "well-watered like the garden of the LORD"
    // 2 Kgs 6:1 describes woodland; subtropical riparian forest
    id: "jordan-valley",
    rgb: hex("#3a6228"),
    priority: 9,
    rects: [
      [32.5, 33.2, 35.30, 35.80], // Sea of Galilee + upper Jordan
      [31.2, 32.5, 35.35, 35.78], // Main Jordan Valley floor
      [30.4, 31.2, 35.15, 35.70], // Dead Sea basin / Arabah
    ],
  },
  {
    // Galilee hills, Bashan (Isa 2:13, Ezek 27:6), Gilead (balm of Gilead)
    id: "oak-woodland",
    rgb: hex("#3a5a28"),
    priority: 8,
    rects: [
      [32.5, 33.2, 34.8, 35.50], // Lower Galilee hills
      [32.5, 33.5, 35.5, 36.80], // Bashan / Golan Heights
      [31.5, 32.5, 35.6, 37.00], // Gilead highland forests
    ],
  },
  {
    // Samaria + Judean highlands — natural Aleppo pine & evergreen oak
    // More forested in antiquity than today
    id: "mediterranean-forest",
    rgb: hex("#4a6230"),
    priority: 7,
    rects: [
      [32.0, 32.8, 34.8, 35.50], // Samaria hills
      [31.0, 32.0, 34.8, 35.45], // Judean highlands
    ],
  },
  {
    // Nile Delta (Goshen) — papyrus swamps, richest farmland in the ancient world
    id: "nile-delta",
    rgb: hex("#4a7030"),
    priority: 6,
    rects: [
      [29.8, 31.5, 30.5, 32.5], // Nile Delta + eastern delta (Goshen)
    ],
  },
  {
    // Palestinian coastal strip Gaza→Carmel; grain, olives, vines
    // Phoenician coast; Syrian coastal plain
    id: "coastal-plain",
    rgb: hex("#7a8248"),
    priority: 5,
    rects: [
      [29.5, 32.5, 34.15, 34.85], // Philistine / Palestinian coast
      [32.5, 34.0, 34.50, 35.40], // Phoenician coast (north of Carmel)
      [34.0, 36.5, 35.40, 36.30], // Syrian coastal plain
    ],
  },
  {
    // Mixed olive/grain agricultural landscape between coast and highlands
    id: "shephelah",
    rgb: hex("#6a7a38"),
    priority: 4,
    rects: [
      [31.2, 31.9, 34.70, 35.00], // Shephelah foothills
    ],
  },
  {
    // Syria, Tigris-Euphrates; cereals cultivated since ~9000 BC
    id: "fertile-crescent",
    rgb: hex("#607a38"),
    priority: 3,
    rects: [
      [33.0, 37.5, 36.00, 43.00], // Syria interior
      [33.0, 38.5, 38.00, 48.50], // Upper Mesopotamia
      [29.5, 33.0, 44.00, 50.00], // Lower Mesopotamia (Babylon / Ur)
    ],
  },
  {
    // Western + Eastern Egyptian desert (ochre, rocky, mineral-rich)
    id: "egyptian-desert",
    rgb: hex("#a87848"),
    priority: 2,
    rects: [
      [22.0, 30.0, 24.0, 33.0], // Egypt (excluding Delta, handled above)
    ],
  },
  {
    // Sinai; northern Arabia — true desert, warm gold/sand
    id: "desert",
    rgb: hex("#c2a248"),
    priority: 1,
    rects: [
      [27.5, 31.3, 32.0, 34.9], // Sinai Peninsula (extended to cover full peninsula)
      [22.0, 32.0, 36.0, 55.0], // Arabian desert
    ],
  },
  // semi-arid-steppe is the fallback — no rects; see STEPPE_RGB
];

// Pre-sorted highest→lowest priority for fast first-match lookup
export const BIOMES_SORTED: BiomeZone[] = [...HISTORICAL_BIOMES].sort(
  (a, b) => b.priority - a.priority,
);
