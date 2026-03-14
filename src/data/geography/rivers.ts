/**
 * rivers.ts
 *
 * River and water feature paths for the ancient Near East.
 * Coordinates from deuteronomy-atlas-data2.json research output.
 * Path points in [lat, lng] order.
 */

import type { River } from "@/types";

export const rivers: River[] = [
  {
    id: "jordan_river",
    name: "Jordan River",
    tier: "major",
    path: [
      [33.25,  35.65],  // Source area (Dan/Hermon)
      [32.87,  35.58],  // Enters Sea of Galilee
      [32.72,  35.57],  // Exits Sea of Galilee
      [32.18,  35.56],  // Jabbok confluence
      [31.87,  35.52],  // Opposite Jericho
      [31.76,  35.55],  // Enters Dead Sea
    ],
    labelPosition: [32.3, 35.54],
  },
  {
    id: "arnon",
    name: "Arnon",
    tier: "major",
    path: [
      [31.48,  36.10],  // Upper reaches (desert)
      [31.47,  35.80],  // Gorge/canyon
      [31.46,  35.56],  // Mouth at Dead Sea
    ],
    labelPosition: [31.47, 35.85],
  },
  {
    id: "jabbok",
    name: "Jabbok",
    tier: "major",
    path: [
      [32.05,  36.10],  // Source area near Ammon
      [32.15,  35.75],  // Mid-course
      [32.18,  35.56],  // Enters Jordan Valley
    ],
    labelPosition: [32.12, 35.80],
  },
  {
    id: "brook_zered",
    name: "Brook Zered",
    tier: "minor",
    path: [
      [30.85,  35.80],  // Upper reaches
      [31.05,  35.45],  // Mouth at Dead Sea
    ],
    labelPosition: [30.95, 35.65],
  },
  {
    id: "yarmuk",
    name: "Yarmuk River",
    tier: "major",
    path: [
      [32.65,  36.80],  // Source in Hauran highlands
      [32.60,  36.40],  // Mid-course
      [32.64,  35.92],  // Near Edrei region
      [32.68,  35.62],  // Approaches Jordan
      [32.67,  35.58],  // Enters Jordan south of Sea of Galilee
    ],
    labelPosition: [32.65, 36.2],
  },
  {
    id: "kishon",
    name: "Kishon River",
    tier: "minor",
    path: [
      [32.59,  35.37],  // Source in Jezreel Valley
      [32.70,  35.10],  // Through Jezreel
      [32.82,  35.05],  // Near Megiddo
      [32.82,  35.02],  // Mouth at Mediterranean near Mt. Carmel
    ],
    labelPosition: [32.72, 35.18],
  },
  {
    id: "nile",
    name: "Nile River",
    tier: "major",
    path: [
      [24.0,   32.9],   // Upper Egypt
      [26.0,   32.6],
      [28.0,   30.6],
      [30.0,   31.2],   // Cairo / Delta area
      [31.0,   31.5],   // Mediterranean delta
    ],
    labelPosition: [28.0, 31.0],
  },
  {
    id: "euphrates",
    name: "Euphrates River",
    tier: "major",
    path: [
      [36.83,  38.00],  // Near Carchemish
      [35.50,  39.50],  // Upper Mesopotamia
      [34.00,  42.00],  // Central Mesopotamia
      [33.00,  44.00],  // Lower Mesopotamia (Babylon area)
    ],
    labelPosition: [35.0, 40.5],
  },
  {
    id: "tigris",
    name: "Tigris River",
    tier: "major",
    path: [
      [37.50,  42.50],  // Source (Taurus region)
      [36.00,  43.00],
      [34.00,  43.80],  // Near Assur
      [33.00,  44.40],  // Confluence area
    ],
    labelPosition: [35.0, 43.0],
  },
];
