/**
 * cities.ts
 *
 * Biblical city coordinates for the ancient Near East.
 * Coordinates sourced from OpenBible.info geocoded data (public domain).
 *
 * This is a starter set focused on Deuteronomy-era locations.
 * The full dataset (~1,000 places) will be imported later.
 */

import type { City } from "@/types";

export const cities: City[] = [
  // --- Deuteronomy-era locations ---
  {
    id: "mount-nebo",
    name: "Mount Nebo",
    lat: 31.7658,
    lng: 35.7297,
    description:
      "Where Moses viewed the Promised Land and died (Deuteronomy 34).",
  },
  {
    id: "moab-plains",
    name: "Plains of Moab",
    lat: 31.867,
    lng: 35.567,
    description:
      "Where Israel camped east of the Jordan; setting for most of Deuteronomy.",
  },
  {
    id: "beth-peor",
    name: "Beth Peor",
    lat: 31.823,
    lng: 35.717,
    description:
      "Valley near where Israel camped while Moses gave his final speeches (Deut 3:29).",
  },
  {
    id: "edrei",
    name: "Edrei",
    altNames: ["Dar'a"],
    lat: 32.617,
    lng: 36.1,
    description: "Where Israel defeated Og king of Bashan (Deut 3:1–11).",
  },
  {
    id: "heshbon",
    name: "Heshbon",
    lat: 31.8,
    lng: 35.85,
    description:
      "Capital of Sihon king of the Amorites, defeated by Israel (Deut 2:24–37).",
  },
  {
    id: "kadesh-barnea",
    name: "Kadesh Barnea",
    lat: 30.633,
    lng: 34.4,
    description:
      "Where Israel camped at the edge of Canaan and refused to enter (Deut 1:19–46).",
  },
  {
    id: "mount-sinai",
    name: "Mount Horeb (Sinai)",
    altNames: ["Mount Sinai"],
    lat: 28.539,
    lng: 33.975,
    description:
      "Where the Law was given; referred to as Horeb in Deuteronomy.",
  },
  // --- Key landmarks for later books ---
  {
    id: "jerusalem",
    name: "Jerusalem",
    altNames: ["Jebus", "City of David", "Zion"],
    lat: 31.7683,
    lng: 35.2137,
    description: "The holy city; site of the Temple.",
  },
  {
    id: "jericho",
    name: "Jericho",
    lat: 31.8667,
    lng: 35.4444,
    description: "First city conquered after crossing the Jordan (Joshua 6).",
  },
  {
    id: "jordan-river-crossing",
    name: "Jordan River (Crossing point)",
    lat: 31.834,
    lng: 35.55,
    description: "Where Israel crossed into Canaan under Joshua.",
  },
];
