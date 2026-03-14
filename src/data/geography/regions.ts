/**
 * regions.ts
 *
 * Ancient political/geographic region boundaries as approximate polygons.
 * Boundaries are scholarly-reasonable approximations for the Deuteronomy period (~1406 BC).
 * controlOverrides keys: "BookName-chapterNumber" (e.g. "Deuteronomy-2")
 *
 * Polygon rings are in GeoJSON [lng, lat] order.
 * When real boundary research data arrives, replace the boundary arrays only.
 */

import type { Region } from "@/types";

export const regions: Region[] = [
  // ---------------------------------------------------------------------------
  // Bashan — Og's kingdom, NE of Sea of Galilee, conquered Deut 3
  // From Jabbok/Yarmuk (south) to Hermon (north), east to Salcah
  // ---------------------------------------------------------------------------
  {
    id: "bashan",
    name: "Bashan",
    tier: "local",
    defaultController: "amorites",
    controlOverrides: {
      "Deuteronomy-3": "israel",
    },
    labelPosition: [32.95, 36.20],
    description: "Fertile highland plateau north of Gilead. Ruled by Og, last of the Rephaim. 60 fortified cities.",
    boundary: [
      [35.57, 32.72],
      [35.70, 32.72],
      [36.00, 32.80],
      [36.30, 32.80],
      [36.71, 32.49],
      [36.80, 32.70],
      [36.80, 33.00],
      [36.50, 33.20],
      [36.20, 33.30],
      [35.86, 33.42],
      [35.70, 33.10],
      [35.57, 32.90],
      [35.57, 32.72],
    ],
  },

  // ---------------------------------------------------------------------------
  // Gilead — Transjordan central, between Arnon and Yarmuk
  // Sihon's territory (south half); conquered Deut 2
  // ---------------------------------------------------------------------------
  {
    id: "gilead",
    name: "Gilead",
    tier: "local",
    defaultController: "amorites",
    controlOverrides: {
      "Deuteronomy-2": "israel",
    },
    labelPosition: [31.90, 36.10],
    description: "Forested highland region east of the Jordan. Divided among Reuben, Gad, and half-Manasseh.",
    boundary: [
      [35.56, 31.47],
      [35.80, 31.47],
      [36.10, 31.47],
      [36.80, 31.80],
      [36.80, 32.20],
      [36.30, 32.30],
      [35.80, 32.20],
      [35.57, 32.18],
      [35.56, 31.47],
    ],
  },

  // ---------------------------------------------------------------------------
  // Moab — east of Dead Sea, south of Arnon; Israel forbidden to take it
  // ---------------------------------------------------------------------------
  {
    id: "moab",
    name: "Moab",
    tier: "local",
    defaultController: "moab",
    labelPosition: [31.20, 35.75],
    description: "Land given by God to Lot's descendants. Israel camped in the formerly-Moabite Plains north of the Arnon.",
    boundary: [
      [35.48, 31.08],
      [35.48, 31.47],
      [36.10, 31.47],
      [36.40, 31.20],
      [36.30, 30.95],
      [35.80, 30.85],
      [35.50, 31.00],
      [35.48, 31.08],
    ],
  },

  // ---------------------------------------------------------------------------
  // Edom — south of Dead Sea/Zered, east of Arabah to Gulf of Aqaba
  // ---------------------------------------------------------------------------
  {
    id: "edom",
    name: "Edom",
    tier: "local",
    defaultController: "edom",
    labelPosition: [30.20, 35.60],
    description: "Land given by God to Esau's descendants. Israel skirted Edom — 'Do not provoke them, they are your brothers.'",
    boundary: [
      [35.00, 30.70],
      [35.50, 31.05],
      [36.00, 30.80],
      [36.50, 30.30],
      [37.00, 29.80],
      [36.50, 29.50],
      [35.20, 29.50],
      [34.90, 29.80],
      [35.00, 30.70],
    ],
  },

  // ---------------------------------------------------------------------------
  // Ammon — east of Gilead, around Rabbah; Israel forbidden to attack
  // ---------------------------------------------------------------------------
  {
    id: "ammon",
    name: "Ammon",
    tier: "local",
    defaultController: "ammon",
    labelPosition: [31.95, 36.50],
    description: "Land given by God to Lot's descendants. Og's iron bed displayed in Rabbah. Israel forbidden to harass.",
    boundary: [
      [35.80, 31.50],
      [36.00, 31.50],
      [37.00, 31.50],
      [37.50, 32.00],
      [37.00, 32.50],
      [36.50, 32.50],
      [36.00, 32.20],
      [35.80, 32.00],
      [35.80, 31.50],
    ],
  },

  // ---------------------------------------------------------------------------
  // Canaan proper — west of Jordan to Mediterranean, Negev to Lebanon
  // ---------------------------------------------------------------------------
  {
    id: "canaan",
    name: "Canaan",
    tier: "local",
    defaultController: "canaan",
    labelPosition: [32.20, 34.90],
    description: "The land promised to Abraham, Isaac, and Jacob. Inhabited by seven nations. 'Flowing with milk and honey.'",
    boundary: [
      [34.30, 30.50],
      [34.20, 31.50],
      [34.20, 32.50],
      [34.80, 33.20],
      [35.20, 33.50],
      [35.70, 33.30],
      [35.65, 32.70],
      [35.60, 32.00],
      [35.55, 31.20],
      [35.50, 30.50],
      [34.30, 30.50],
    ],
  },

  // ---------------------------------------------------------------------------
  // Philistia — southern coastal plain
  // ---------------------------------------------------------------------------
  {
    id: "philistia",
    name: "Philistia",
    tier: "local",
    defaultController: "philistia",
    labelPosition: [31.60, 34.60],
    description: "Sea Peoples who settled the southwestern coastal plain. Major adversaries of Israel during the judges period.",
    boundary: [
      [34.20, 31.20],
      [34.20, 31.90],
      [34.55, 31.90],
      [34.75, 31.60],
      [34.80, 31.20],
      [34.20, 31.20],
    ],
  },

  // ---------------------------------------------------------------------------
  // Negev — southern desert
  // ---------------------------------------------------------------------------
  {
    id: "negev",
    name: "Negev",
    tier: "local",
    defaultController: "unclaimed",
    labelPosition: [30.50, 34.60],
    description: "Southern desert region. Israel spent years here around Kadesh Barnea. Part of the promised inheritance.",
    boundary: [
      [34.20, 30.00],
      [34.20, 31.20],
      [35.50, 31.20],
      [36.00, 31.00],
      [35.80, 30.00],
      [34.20, 30.00],
    ],
  },

  // ---------------------------------------------------------------------------
  // Phoenicia — northern coastal cities
  // ---------------------------------------------------------------------------
  {
    id: "phoenicia",
    name: "Phoenicia",
    tier: "local",
    defaultController: "phoenicia",
    labelPosition: [33.40, 35.40],
    description: "Maritime traders occupying the northern coastal cities of Tyre, Sidon, and Byblos.",
    boundary: [
      [34.80, 32.90],
      [34.80, 33.90],
      [35.50, 34.00],
      [36.00, 33.80],
      [35.80, 33.00],
      [35.20, 32.90],
      [34.80, 32.90],
    ],
  },

  // ---------------------------------------------------------------------------
  // Aram/Syria — Damascus region, north of Bashan
  // ---------------------------------------------------------------------------
  {
    id: "aram",
    name: "Aram / Syria",
    tier: "local",
    defaultController: "aram",
    labelPosition: [33.70, 36.80],
    description: "Aramean kingdoms north and northeast of Israel, centered at Damascus.",
    boundary: [
      [35.70, 33.20],
      [36.00, 33.50],
      [37.00, 33.80],
      [38.00, 33.50],
      [38.00, 33.00],
      [37.50, 32.80],
      [36.80, 32.80],
      [36.00, 33.00],
      [35.70, 33.20],
    ],
  },

  // ---------------------------------------------------------------------------
  // Midian — northwestern Arabian peninsula, east of Gulf of Aqaba
  // ---------------------------------------------------------------------------
  {
    id: "midian",
    name: "Midian",
    tier: "local",
    defaultController: "midian",
    labelPosition: [28.80, 36.50],
    description: "Desert-dwelling descendants of Abraham by Keturah. Moses lived among them before the Exodus.",
    boundary: [
      [35.50, 28.00],
      [35.50, 29.50],
      [37.00, 30.00],
      [38.50, 29.50],
      [38.50, 28.00],
      [37.00, 27.50],
      [35.50, 28.00],
    ],
  },

  // ---------------------------------------------------------------------------
  // Surrounding nations (tier: "surrounding") — show only when that layer is on
  // ---------------------------------------------------------------------------
  {
    id: "egypt",
    name: "Egypt",
    tier: "surrounding",
    defaultController: "egypt",
    labelPosition: [27.00, 30.50],
    description: "The great power to the southwest. Israel's place of bondage and exodus.",
    boundary: [
      [28.00, 22.00],
      [28.00, 31.50],
      [32.50, 31.50],
      [34.00, 30.00],
      [35.00, 29.50],
      [35.00, 22.00],
      [28.00, 22.00],
    ],
  },
  {
    id: "assyria",
    name: "Assyria",
    tier: "surrounding",
    defaultController: "assyria",
    labelPosition: [36.00, 34.50],
    description: "The great Mesopotamian empire that conquered the northern kingdom of Israel in 722 BC.",
    boundary: [
      [36.00, 33.00],
      [36.00, 37.00],
      [44.00, 37.00],
      [45.00, 35.00],
      [44.00, 33.00],
      [36.00, 33.00],
    ],
  },
  {
    id: "babylon",
    name: "Babylon",
    tier: "surrounding",
    defaultController: "babylon",
    labelPosition: [44.50, 32.50],
    description: "The great Mesopotamian empire that conquered Judah and destroyed Jerusalem in 586 BC.",
    boundary: [
      [39.00, 30.00],
      [39.00, 34.00],
      [46.00, 34.00],
      [48.00, 30.00],
      [45.00, 29.00],
      [39.00, 30.00],
    ],
  },
];
