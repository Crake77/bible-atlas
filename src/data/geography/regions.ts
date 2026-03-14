/**
 * regions.ts
 *
 * Ancient political/geographic region boundaries for the Deuteronomy period (~1406 BC).
 * Polygons are in GeoJSON [lng, lat] order with 15-30 points per region, tracing
 * actual river courses (Arnon, Jabbok, Yarmuk, Zered, Jordan) and ridgelines.
 *
 * Shared borders use matching coordinates so polygons butt up cleanly:
 *   Moab N / Gilead S   → Arnon River course
 *   Gilead N / Bashan S → Yarmuk River course
 *   Moab S / Edom N     → Brook Zered course
 *   Canaan E / Gilead W → Jordan River valley
 */

import type { Region } from "@/types";

// ── Shared border sequences (GeoJSON [lng, lat]) ──────────────────────────────

/** Arnon River — Moab/Gilead border — west (Dead Sea) → east */
const ARNON_W_TO_E: [number, number][] = [
  [35.52, 31.47], [35.62, 31.48], [35.75, 31.50],
  [35.92, 31.52], [36.10, 31.52], [36.25, 31.50],
  [36.42, 31.48], [36.58, 31.43],
];
const ARNON_E_TO_W = [...ARNON_W_TO_E].reverse();

/** Yarmuk River — Gilead/Bashan border — west (Jordan) → east */
const YARMUK_W_TO_E: [number, number][] = [
  [35.58, 32.70], [35.78, 32.69], [35.98, 32.68],
  [36.18, 32.67], [36.40, 32.65], [36.62, 32.62],
];
const YARMUK_E_TO_W = [...YARMUK_W_TO_E].reverse();

/** Brook Zered — Moab/Edom border — west (Dead Sea) → east */
const ZERED_W_TO_E: [number, number][] = [
  [35.52, 30.97], [35.68, 30.97], [35.85, 30.97],
  [36.05, 30.98], [36.25, 30.99], [36.45, 31.00],
];
const ZERED_E_TO_W = [...ZERED_W_TO_E].reverse();

/** Jordan Valley — west of Gilead/east of Canaan — south (Dead Sea) → north (Sea of Galilee) */
const JORDAN_S_TO_N: [number, number][] = [
  [35.55, 31.47], [35.56, 31.60], [35.56, 31.80],
  [35.55, 32.00], [35.56, 32.20], [35.57, 32.40],
  [35.58, 32.55], [35.58, 32.70],
];
const JORDAN_N_TO_S = [...JORDAN_S_TO_N].reverse();

// Dead Sea eastern shore (Moab's west edge), south to north
const DEAD_SEA_E_SHORE_S_TO_N: [number, number][] = [
  [35.52, 30.97], [35.56, 31.10], [35.58, 31.25],
  [35.59, 31.38], [35.57, 31.47],
];
const DEAD_SEA_E_SHORE_N_TO_S = [...DEAD_SEA_E_SHORE_S_TO_N].reverse();

export const regions: Region[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // BASHAN — Og's highland kingdom NE of Sea of Galilee; conquered Deut 3
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "bashan",
    name: "Bashan",
    tier: "local",
    defaultController: "amorites",
    controlOverrides: { "Deuteronomy-3": "israel" },
    labelPosition: [32.95, 36.20],
    description: "Fertile basalt plateau north of the Yarmuk. Ruled by Og, last of the Rephaim — 60 fortified cities.",
    boundary: [
      // South border: Yarmuk (W→E)
      ...YARMUK_W_TO_E,
      // East + NE desert edge
      [36.82, 32.60], [37.00, 32.80], [37.05, 33.05],
      [36.90, 33.25],
      // North border: Hermon foothills / Lebanon border
      [36.65, 33.42], [36.38, 33.52], [36.12, 33.48],
      [35.88, 33.38], [35.72, 33.22],
      // West border: Golan scarp / SE shore of Sea of Galilee
      [35.65, 33.05], [35.62, 32.92],
      [35.58, 32.70],
      // close back to Yarmuk start
      ...YARMUK_W_TO_E.slice(0, 1),
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // GILEAD — Transjordan highland between Arnon (S) and Yarmuk (N)
  // Sihon's kingdom; conquered Deut 2. Shared by Reuben, Gad, half-Manasseh.
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "gilead",
    name: "Gilead",
    tier: "local",
    defaultController: "amorites",
    controlOverrides: { "Deuteronomy-2": "israel" },
    labelPosition: [32.00, 36.10],
    description: "Forested highland east of the Jordan. 'Is there no balm in Gilead?' Divided among two and a half tribes.",
    boundary: [
      // South border: Arnon (W→E)
      ...ARNON_W_TO_E,
      // Eastern desert edge
      [36.72, 31.55], [36.85, 31.75],
      [36.85, 32.10], [36.78, 32.45],
      [36.65, 32.60],
      // North border: Yarmuk (E→W)
      ...YARMUK_E_TO_W,
      // West border: Jordan valley (N→S)
      ...JORDAN_N_TO_S,
      // close
      ...ARNON_W_TO_E.slice(0, 1),
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MOAB — east of Dead Sea, between Arnon (N) and Zered (S)
  // Given by God to Lot. Israel forbidden to take it (Deut 2).
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "moab",
    name: "Moab",
    tier: "local",
    defaultController: "moab",
    labelPosition: [31.25, 35.80],
    description: "Tableland east of the Dead Sea, given to Lot's descendants. Israel camped in the Plains of Moab before crossing the Jordan.",
    boundary: [
      // North border: Arnon (W→E) — shared with Gilead south
      ...ARNON_W_TO_E,
      // Eastern desert
      [36.72, 31.25], [36.80, 31.10],
      [36.68, 31.02],
      // South border: Zered (E→W) — shared with Edom north
      ...ZERED_E_TO_W,
      // West border: Dead Sea eastern shore (S→N)
      ...DEAD_SEA_E_SHORE_S_TO_N,
      // close
      ...ARNON_W_TO_E.slice(0, 1),
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // EDOM — Seir highlands south of Zered, east of Arabah to Gulf of Aqaba
  // Given by God to Esau. "Do not provoke them" (Deut 2:5).
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "edom",
    name: "Edom",
    tier: "local",
    defaultController: "edom",
    labelPosition: [30.25, 35.65],
    description: "Rugged highlands of Seir, given to Esau. God commanded Israel not to seize even a foothold of their land.",
    boundary: [
      // North border: Zered (W→E) — shared with Moab south
      ...ZERED_W_TO_E,
      // NE and east edge
      [36.60, 31.05], [36.80, 30.85],
      [36.90, 30.55], [36.80, 30.15],
      [36.55, 29.85], [36.20, 29.62],
      // South: Gulf of Aqaba
      [35.80, 29.52], [35.50, 29.52],
      // West: Arabah valley
      [35.00, 29.60], [34.90, 29.82],
      [34.95, 30.10], [35.05, 30.38],
      [35.15, 30.62], [35.30, 30.82],
      [35.45, 30.95], [35.52, 30.97],
      // close
      ...ZERED_W_TO_E.slice(0, 1),
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // AMMON — east of Jabbok, around Rabbah; Israel forbidden to attack (Deut 2)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "ammon",
    name: "Ammon",
    tier: "local",
    defaultController: "ammon",
    labelPosition: [32.00, 36.55],
    description: "Land of Lot's descendants east of Gilead. Og's iron bedstead displayed in Rabbah. Israel forbidden to harass.",
    boundary: [
      // SW corner near Arnon/Gilead east
      [36.58, 31.44], [36.72, 31.55],
      // South and west
      [37.05, 31.65], [37.30, 31.85],
      // East desert boundary
      [37.55, 32.05], [37.60, 32.30],
      [37.45, 32.62],
      // North
      [37.15, 32.75], [36.88, 32.72],
      [36.65, 32.60],
      // West: back south along Gilead eastern edge
      [36.50, 32.30], [36.40, 32.00],
      [36.38, 31.75], [36.38, 31.55],
      [36.58, 31.44],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // CANAAN — west of Jordan to Mediterranean; the promised land
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "canaan",
    name: "Canaan",
    tier: "local",
    defaultController: "canaan",
    labelPosition: [32.20, 35.00],
    description: "The land promised to Abraham. Seven Canaanite nations. 'A land flowing with milk and honey.'",
    boundary: [
      // Start NW — Mt Carmel headland
      [34.46, 32.87],
      // North coast toward Lebanon border
      [34.48, 33.05], [34.55, 33.25], [34.72, 33.42],
      [35.00, 33.55],
      // East: border with Phoenicia / Aram foothills
      [35.20, 33.40], [35.35, 33.20],
      [35.52, 33.05], [35.58, 32.90],
      // East: Jordan River valley (N→S) — shared with Gilead/Moab west
      ...JORDAN_N_TO_S,
      // SE: Dead Sea western shore south
      [35.48, 31.35], [35.42, 31.15],
      [35.36, 31.00], [35.28, 30.82],
      // South: Negev border / Beersheba latitude
      [35.10, 30.60], [34.85, 30.45],
      [34.55, 30.30],
      // SW coast
      [34.25, 30.65],
      // Mediterranean coast north
      [34.22, 31.00], [34.22, 31.30],
      [34.25, 31.55], [34.28, 31.80],
      [34.35, 32.05], [34.40, 32.30],
      [34.42, 32.55], [34.43, 32.72],
      [34.46, 32.87],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PHILISTIA — southwestern coastal plain (Gaza to Joppa)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "philistia",
    name: "Philistia",
    tier: "local",
    defaultController: "philistia",
    labelPosition: [31.65, 34.60],
    description: "The five Philistine city-states of the coastal plain: Gaza, Ashdod, Ashkelon, Gath, Ekron.",
    boundary: [
      // South: Gaza coast
      [34.25, 31.22], [34.22, 31.40],
      // West: Mediterranean coast
      [34.22, 31.60], [34.25, 31.80],
      [34.30, 32.00],
      // North border at Joppa latitude
      [34.40, 32.05], [34.52, 32.00],
      [34.60, 31.92],
      // East: Shephelah foothills
      [34.72, 31.75], [34.76, 31.55],
      [34.75, 31.35], [34.68, 31.20],
      [34.52, 31.10], [34.38, 31.10],
      [34.25, 31.22],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // NEGEV — southern steppe/desert; Kadesh Barnea region
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "negev",
    name: "Negev",
    tier: "local",
    defaultController: "unclaimed",
    labelPosition: [30.55, 34.65],
    description: "The southern drylands. Israel wandered here for 38 years. Kadesh Barnea is in the northern Negev.",
    boundary: [
      // North: southern edge of Canaan / Beersheba latitude
      [34.25, 30.65], [34.55, 30.30],
      [34.85, 30.45], [35.10, 30.60],
      [35.28, 30.82], [35.42, 30.97],
      // East: Arabah valley
      [35.30, 30.70], [35.15, 30.40],
      [35.05, 30.10], [34.98, 29.82],
      [34.90, 29.60],
      // South: Sinai border / Gulf of Aqaba
      [34.80, 29.52], [34.20, 29.52],
      // West
      [34.20, 29.80], [34.20, 30.20],
      [34.22, 30.50], [34.25, 30.65],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PHOENICIA — northern coastal city-states (Tyre, Sidon, Byblos)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "phoenicia",
    name: "Phoenicia",
    tier: "local",
    defaultController: "phoenicia",
    labelPosition: [33.45, 35.35],
    description: "Master seafarers occupying the Levantine coast — Tyre, Sidon, and Byblos. Expert cedar traders.",
    boundary: [
      // South: border with Canaan near Carmel / Acre
      [34.93, 32.92], [35.05, 33.05],
      [35.10, 33.20],
      // East: Lebanon mountain foothills
      [35.25, 33.38], [35.48, 33.58],
      [35.62, 33.75], [35.72, 33.90],
      [35.88, 34.02],
      // North: Byblos / Tripoli area border
      [35.95, 34.12], [35.75, 34.05],
      // West: sea coast (trace back south)
      [35.55, 33.95], [35.35, 33.82],
      [35.10, 33.65], [34.85, 33.45],
      [34.72, 33.25], [34.62, 33.05],
      [34.75, 32.92], [34.93, 32.92],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ARAM / SYRIA — Aramean kingdoms, centered at Damascus
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "aram",
    name: "Aram / Syria",
    tier: "local",
    defaultController: "aram",
    labelPosition: [33.65, 36.85],
    description: "Aramean city-states north and northeast of Israel. Damascus was the dominant center.",
    boundary: [
      // South: border with Bashan
      [35.72, 33.22], [35.88, 33.38], [36.12, 33.48],
      [36.38, 33.52], [36.65, 33.42],
      // East and NE
      [36.95, 33.38], [37.30, 33.50],
      [38.00, 33.55], [38.50, 33.20],
      [38.30, 32.90],
      // South border
      [37.80, 32.75], [37.30, 32.70],
      [37.05, 32.80], [36.90, 33.05],
      [36.72, 33.15], [36.50, 33.20],
      [36.25, 33.10], [36.00, 33.00],
      [35.88, 33.15], [35.72, 33.22],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // MIDIAN — NW Arabian peninsula, east of Gulf of Aqaba
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "midian",
    name: "Midian",
    tier: "local",
    defaultController: "midian",
    labelPosition: [28.85, 36.55],
    description: "Desert-dwelling descendants of Abraham by Keturah. Moses spent 40 years here. Jethro was a Midianite priest.",
    boundary: [
      [36.55, 29.50], [36.30, 29.00],
      [36.10, 28.60], [36.00, 28.20],
      [36.20, 27.80],
      [37.00, 27.50], [38.00, 27.80],
      [38.80, 28.20], [39.00, 28.80],
      [38.80, 29.40], [38.30, 29.60],
      [37.80, 29.80], [37.20, 30.00],
      [36.80, 29.90], [36.55, 29.50],
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  // SURROUNDING NATIONS (tier: "surrounding")
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "egypt",
    name: "Egypt",
    tier: "surrounding",
    defaultController: "egypt",
    labelPosition: [27.00, 30.50],
    description: "The great Nile civilization. Israel's 430 years of bondage ended with the Exodus under Moses.",
    boundary: [
      [28.00, 22.00], [28.00, 25.00], [28.50, 28.00],
      [29.50, 30.50], [31.00, 31.20], [32.50, 31.50],
      [33.50, 31.00], [34.20, 30.20],
      [35.00, 29.52], [35.50, 29.52],
      [35.00, 28.00], [33.00, 27.00],
      [30.00, 24.00], [28.00, 22.00],
    ],
  },
  {
    id: "assyria",
    name: "Assyria",
    tier: "surrounding",
    defaultController: "assyria",
    labelPosition: [37.00, 34.50],
    description: "The iron-fisted Mesopotamian empire that exiled the northern kingdom of Israel in 722 BC.",
    boundary: [
      [36.00, 33.00], [36.00, 34.00], [37.00, 35.50],
      [38.00, 37.00], [42.00, 37.50], [44.00, 37.00],
      [45.00, 35.50], [44.50, 34.00], [43.00, 33.00],
      [40.00, 32.50], [38.00, 32.80], [36.80, 32.80],
      [36.00, 33.00],
    ],
  },
  {
    id: "babylon",
    name: "Babylon",
    tier: "surrounding",
    defaultController: "babylon",
    labelPosition: [44.50, 32.50],
    description: "Nebuchadnezzar's empire that destroyed Jerusalem and the temple in 586 BC.",
    boundary: [
      [39.00, 30.00], [38.50, 32.50], [39.00, 34.00],
      [42.00, 35.00], [46.00, 34.50], [48.00, 31.00],
      [47.00, 29.00], [44.00, 29.00], [41.00, 29.50],
      [39.00, 30.00],
    ],
  },
];
