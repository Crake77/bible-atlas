/**
 * routes.ts
 *
 * Ancient travel routes, trade roads, and military campaigns.
 * Chapter-specific routes only show when the reader is at that chapter.
 * Coordinates from deuteronomy-atlas-data2.json research output.
 */

import type { Route } from "@/types";

export const routes: Route[] = [
  // -------------------------------------------------------------------------
  // Static trade routes (always visible when layer-trade-routes is on)
  // -------------------------------------------------------------------------
  {
    id: "kings_highway",
    name: "King's Highway",
    type: "trade",
    directed: false,
    description: "The major north-south trade route through Transjordan. Israel asked to travel this road through Edom and Sihon's territory.",
    waypoints: [
      { lat: 29.55,  lng: 35.00, label: "Gulf of Aqaba" },
      { lat: 30.73,  lng: 35.62, label: "Bozrah (Edom)" },
      { lat: 31.18,  lng: 35.70, label: "Kir-hareseth (Moab)" },
      { lat: 31.46,  lng: 35.87, label: "Aroer (Arnon)" },
      { lat: 31.802, lng: 35.808, label: "Heshbon" },
      { lat: 31.95,  lng: 35.93, label: "Rabbah (Ammon)" },
      { lat: 32.33,  lng: 36.00, label: "Ramoth-gilead" },
      { lat: 32.62,  lng: 36.10, label: "Edrei" },
      { lat: 32.75,  lng: 36.00, label: "Ashtaroth" },
      { lat: 33.50,  lng: 36.30, label: "Damascus" },
    ],
  },
  {
    id: "via_maris",
    name: "Via Maris",
    type: "trade",
    directed: false,
    description: "The Way of the Sea — the major coastal trade route from Egypt to Mesopotamia.",
    waypoints: [
      { lat: 31.00,  lng: 32.10, label: "Egypt (Goshen)" },
      { lat: 31.50,  lng: 34.47, label: "Gaza" },
      { lat: 31.67,  lng: 34.57, label: "Ashkelon" },
      { lat: 32.05,  lng: 34.75, label: "Joppa" },
      { lat: 32.58,  lng: 35.18, label: "Megiddo" },
      { lat: 33.02,  lng: 35.57, label: "Hazor" },
      { lat: 33.50,  lng: 36.30, label: "Damascus" },
    ],
  },
  {
    id: "ridge_route",
    name: "Ridge Route",
    type: "trade",
    directed: false,
    description: "The central highlands route along the mountain spine of Canaan.",
    waypoints: [
      { lat: 31.245, lng: 34.791, label: "Beersheba" },
      { lat: 31.529, lng: 35.095, label: "Hebron" },
      { lat: 31.777, lng: 35.234, label: "Jerusalem" },
      { lat: 31.930, lng: 35.220, label: "Bethel" },
      { lat: 32.213, lng: 35.282, label: "Shechem" },
      { lat: 32.660, lng: 35.330, label: "Jezreel" },
    ],
  },
  {
    id: "way_of_arabah",
    name: "Way of the Arabah",
    type: "trade",
    directed: false,
    description: "Route through the Arabah rift valley from Elath northward.",
    waypoints: [
      { lat: 29.559, lng: 34.948, label: "Elath" },
      { lat: 30.5,   lng: 35.15, label: "Arabah valley" },
      { lat: 31.5,   lng: 35.45, label: "Plains of Moab" },
    ],
  },

  // -------------------------------------------------------------------------
  // Chapter-specific journey routes (with directional arrows)
  // -------------------------------------------------------------------------
  {
    id: "horeb_to_kadesh",
    name: "Horeb to Kadesh Barnea",
    type: "journey",
    directed: true,
    chapterRef: { book: "Deuteronomy", chapter: 1 },
    description: "'It is eleven days' journey from Horeb by the way of Mount Seir to Kadesh-barnea.' (Deut 1:2)",
    color: "#4a90d9",
    waypoints: [
      { lat: 28.539, lng: 33.975, label: "Horeb (Sinai)" },
      { lat: 30.63,  lng: 34.42,  label: "Kadesh Barnea" },
    ],
  },
  {
    id: "kadesh_to_transjordan",
    name: "Wilderness Wandering Route",
    type: "migration",
    directed: true,
    chapterRef: { book: "Deuteronomy", chapter: 2 },
    description: "38 years of wandering: south to Aqaba, around Edom and Moab, then north to the Plains of Moab.",
    color: "#f5a623",
    waypoints: [
      { lat: 30.63,  lng: 34.42,  label: "Kadesh Barnea" },
      { lat: 29.50,  lng: 34.95,  label: "Way of the Red Sea" },
      { lat: 29.55,  lng: 34.96,  label: "Ezion-geber / Elath" },
      { lat: 30.50,  lng: 35.60,  label: "Skirting Edom" },
      { lat: 30.90,  lng: 35.60,  label: "Brook Zered crossing" },
      { lat: 31.30,  lng: 35.90,  label: "Skirting Moab" },
      { lat: 31.47,  lng: 35.80,  label: "Arnon crossing" },
      { lat: 31.84,  lng: 35.56,  label: "Plains of Moab" },
    ],
  },
  {
    id: "sihon_campaign",
    name: "Campaign Against Sihon",
    type: "military",
    directed: true,
    chapterRef: { book: "Deuteronomy", chapter: 2 },
    description: "Israel defeats Sihon at Jahaz and captures all cities from the Arnon to the Jabbok.",
    color: "#d0021b",
    waypoints: [
      { lat: 31.47,  lng: 35.80,  label: "Arnon (approach)" },
      { lat: 31.55,  lng: 35.82,  label: "Jahaz (battle)" },
      { lat: 31.802, lng: 35.808, label: "Heshbon (captured)" },
    ],
  },
  {
    id: "og_campaign",
    name: "Campaign Against Og of Bashan",
    type: "military",
    directed: true,
    chapterRef: { book: "Deuteronomy", chapter: 3 },
    description: "Israel turns north from Heshbon and marches against Og at Edrei. All 60 cities of Bashan captured.",
    color: "#d0021b",
    waypoints: [
      { lat: 31.802, lng: 35.808, label: "Heshbon" },
      { lat: 32.62,  lng: 36.10,  label: "Edrei (battle)" },
      { lat: 32.487, lng: 36.711, label: "Salcah (easternmost)" },
    ],
  },
  {
    id: "moses_to_nebo",
    name: "Moses Ascends Mount Nebo",
    type: "pilgrimage",
    directed: true,
    chapterRef: { book: "Deuteronomy", chapter: 34 },
    description: "Moses goes up from the Plains of Moab to the top of Pisgah to view the Promised Land and die.",
    color: "#7b68ee",
    waypoints: [
      { lat: 31.84,  lng: 35.56,  label: "Abel-shittim (Plains of Moab)" },
      { lat: 31.767, lng: 35.726, label: "Mount Nebo (Pisgah)" },
    ],
  },
  {
    id: "presumptuous_attack",
    name: "Presumptuous Attack — Routed to Hormah",
    type: "military",
    directed: true,
    chapterRef: { book: "Deuteronomy", chapter: 1 },
    description: "After the spy failure, Israel tried to go up without God's blessing. The Amorites chased them as far as Hormah.",
    color: "#8b0000",
    waypoints: [
      { lat: 30.63,  lng: 34.42,  label: "Kadesh Barnea" },
      { lat: 31.25,  lng: 34.94,  label: "Hormah (defeated here)" },
    ],
  },
];
