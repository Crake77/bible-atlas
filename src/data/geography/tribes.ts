/**
 * tribes.ts
 *
 * Approximate territorial boundaries for the 12 tribes of Israel
 * based on Joshua 13-21 allotments. These are placeholder polygons —
 * replace boundary arrays with precise data when available.
 *
 * Polygon rings are in GeoJSON [lng, lat] order.
 */

import type { Tribe } from "@/types";

export const tribes: Tribe[] = [
  {
    id: "reuben",
    name: "Reuben",
    labelPosition: [31.55, 35.90],
    notes: "East of Dead Sea, north of Moab proper. Aroer on the Arnon to south of Heshbon.",
    boundary: [
      [35.50, 31.47], [35.80, 31.47], [36.20, 31.47],
      [36.20, 31.80], [35.90, 32.00], [35.60, 31.90],
      [35.50, 31.80], [35.50, 31.47],
    ],
  },
  {
    id: "gad",
    name: "Gad",
    labelPosition: [32.00, 35.90],
    notes: "Central Transjordan — south Gilead, Jabbok region.",
    boundary: [
      [35.60, 31.80], [35.90, 32.00], [36.20, 31.80],
      [36.20, 32.00], [36.00, 32.20], [35.70, 32.20],
      [35.60, 32.00], [35.60, 31.80],
    ],
  },
  {
    id: "manasseh_east",
    name: "East Manasseh",
    labelPosition: [32.70, 36.40],
    notes: "Northern Transjordan — Bashan, north Gilead.",
    boundary: [
      [35.57, 32.18], [35.80, 32.20], [36.00, 32.20],
      [36.80, 32.50], [36.80, 33.00], [36.00, 33.00],
      [35.70, 32.80], [35.57, 32.50], [35.57, 32.18],
    ],
  },
  {
    id: "manasseh_west",
    name: "West Manasseh",
    labelPosition: [32.40, 35.10],
    notes: "Northern central highlands west of Jordan — Dothan, Sharon plain area.",
    boundary: [
      [34.90, 32.20], [35.00, 32.20], [35.20, 32.00],
      [35.55, 32.20], [35.55, 32.60], [35.20, 32.80],
      [34.90, 32.70], [34.80, 32.50], [34.90, 32.20],
    ],
  },
  {
    id: "ephraim",
    name: "Ephraim",
    labelPosition: [32.00, 35.10],
    notes: "Central highlands — Bethel to Shechem region.",
    boundary: [
      [34.90, 31.90], [35.20, 31.90], [35.55, 32.00],
      [35.55, 32.20], [35.20, 32.20], [34.90, 32.20],
      [34.90, 31.90],
    ],
  },
  {
    id: "benjamin",
    name: "Benjamin",
    labelPosition: [31.85, 35.22],
    notes: "Small territory between Ephraim and Judah — Jerusalem area.",
    boundary: [
      [34.90, 31.70], [35.20, 31.70], [35.50, 31.80],
      [35.55, 31.90], [35.20, 31.90], [34.90, 31.90],
      [34.80, 31.80], [34.90, 31.70],
    ],
  },
  {
    id: "judah",
    name: "Judah",
    labelPosition: [31.30, 34.90],
    notes: "Southern highlands from Jerusalem south to Beersheba plus the Shephelah.",
    boundary: [
      [34.30, 30.80], [34.30, 31.70], [34.90, 31.70],
      [35.20, 31.70], [35.50, 31.60], [35.55, 31.30],
      [35.20, 30.80], [34.30, 30.80],
    ],
  },
  {
    id: "simeon",
    name: "Simeon",
    labelPosition: [31.00, 34.70],
    notes: "Within Judah's territory, southern Negev. No clear borders — surrounded by Judah.",
    boundary: [
      [34.30, 30.60], [34.30, 31.00], [34.80, 31.00],
      [35.00, 30.80], [34.80, 30.50], [34.30, 30.60],
    ],
  },
  {
    id: "dan",
    name: "Dan",
    labelPosition: [31.75, 34.80],
    notes: "Originally coastal plain north of Philistia. Later migrated to north near Laish/Dan.",
    boundary: [
      [34.55, 31.70], [34.55, 32.10], [34.90, 32.10],
      [34.90, 31.90], [34.90, 31.70], [34.55, 31.70],
    ],
  },
  {
    id: "issachar",
    name: "Issachar",
    labelPosition: [32.60, 35.35],
    notes: "Jezreel Valley — fertile agricultural plain between Mt. Carmel/Gilboa and Galilee.",
    boundary: [
      [35.10, 32.40], [35.55, 32.40], [35.65, 32.60],
      [35.35, 32.80], [35.10, 32.80], [34.90, 32.60],
      [35.10, 32.40],
    ],
  },
  {
    id: "zebulun",
    name: "Zebulun",
    labelPosition: [32.80, 35.20],
    notes: "Lower Galilee — between Jezreel Valley and Sea of Galilee.",
    boundary: [
      [34.90, 32.70], [35.20, 32.80], [35.50, 32.80],
      [35.50, 33.10], [35.20, 33.10], [34.90, 32.90],
      [34.90, 32.70],
    ],
  },
  {
    id: "naphtali",
    name: "Naphtali",
    labelPosition: [33.00, 35.60],
    notes: "Upper Galilee and western shore of Sea of Galilee.",
    boundary: [
      [35.50, 32.70], [35.65, 32.70], [35.70, 33.00],
      [35.60, 33.30], [35.20, 33.50], [35.10, 33.20],
      [35.20, 32.90], [35.50, 32.80], [35.50, 32.70],
    ],
  },
  {
    id: "asher",
    name: "Asher",
    labelPosition: [32.90, 35.00],
    notes: "Northern coastal strip from Carmel to Tyre — Phoenician border.",
    boundary: [
      [34.80, 32.70], [34.90, 32.70], [35.20, 32.90],
      [35.20, 33.10], [35.00, 33.60], [34.80, 33.60],
      [34.80, 32.70],
    ],
  },
];
