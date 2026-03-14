import type { LayerConfig, LayerId, LayerVisibility } from "@/types";

export const layerConfigs: LayerConfig[] = [
  // Physical
  { id: "layer-rivers",     group: "physical",    label: "Rivers",               defaultVisible: true,  description: "Jordan, Arnon, Jabbok, Euphrates, Nile and more" },
  { id: "layer-seas",       group: "physical",    label: "Seas & Lakes",         defaultVisible: true,  description: "Mediterranean, Dead Sea, Sea of Galilee, Red Sea" },
  { id: "layer-mountains",  group: "physical",    label: "Mountain Peaks",       defaultVisible: false, description: "Hermon, Nebo, Carmel, Ebal, Gerizim, Sinai" },

  // Political
  { id: "layer-regions",              group: "political", label: "Political Regions",      defaultVisible: true,  description: "Colored overlays showing who controls each region — updates each chapter" },
  { id: "layer-surrounding-nations",  group: "political", label: "Surrounding Nations",    defaultVisible: false, description: "Larger empires: Egypt, Assyria, Babylon, Persia" },

  // Tribes
  { id: "layer-tribes", group: "tribes", label: "12 Tribe Territories", defaultVisible: false, description: "Tribal allotments from Joshua 13–21" },

  // Movements
  { id: "layer-trade-routes",    group: "movements", label: "Trade Routes",        defaultVisible: false, description: "Via Maris, King's Highway, Ridge Route — ancient highways" },
  { id: "layer-journey-routes",  group: "movements", label: "Journey Routes",      defaultVisible: true,  description: "Israel's journeys and pilgrimages — chapter-specific with arrows" },
  { id: "layer-military-routes", group: "movements", label: "Military Campaigns",  defaultVisible: true,  description: "Conquest routes and military movements — chapter-specific with arrows" },

  // Settlements
  { id: "layer-cities-major",          group: "settlements", label: "Major Cities",           defaultVisible: true,  description: "Capital-tier cities and major population centers" },
  { id: "layer-cities-minor",          group: "settlements", label: "Minor Cities",           defaultVisible: false, description: "Towns and villages" },
  { id: "layer-cities-archaeological", group: "settlements", label: "Archaeological Sites",   defaultVisible: false, description: "Tel / tell sites — modern excavation names shown" },

  // Events
  { id: "layer-special-sites-tabernacle", group: "events", label: "Tabernacle Locations", defaultVisible: true,  description: "Sites where the Tabernacle was pitched" },
  { id: "layer-special-sites-covenant",   group: "events", label: "Covenant Sites",       defaultVisible: true,  description: "Locations of God's covenant ceremonies with Israel" },
  { id: "layer-special-sites-battle",     group: "events", label: "Battle Sites",         defaultVisible: false, description: "Key battle locations with verse references" },
  { id: "layer-special-sites-other",      group: "events", label: "Theophanies & Visions",defaultVisible: false, description: "Divine appearances, visions, and altars" },

  // Labels
  { id: "layer-labels-regions", group: "labels", label: "Region Labels", defaultVisible: true,  description: "Text labels for political regions" },
  { id: "layer-labels-rivers",  group: "labels", label: "River Labels",  defaultVisible: true,  description: "Text labels for rivers and wadis" },
  { id: "layer-labels-cities",  group: "labels", label: "City Labels",   defaultVisible: true,  description: "Text labels for city markers" },
  { id: "layer-labels-tribes",  group: "labels", label: "Tribe Labels",  defaultVisible: false, description: "Text labels for tribal territories" },
];

/** Default visibility state derived from config — used to initialize AppStateContext */
export const defaultLayerVisibility: LayerVisibility = Object.fromEntries(
  layerConfigs.map((c) => [c.id, c.defaultVisible])
) as LayerVisibility;

/** All layer IDs grouped for use in the LayerPanel */
export const layerGroups: { group: string; label: string; layers: LayerConfig[] }[] = [
  { group: "physical",    label: "Physical Geography", layers: layerConfigs.filter((c) => c.group === "physical") },
  { group: "political",   label: "Political & National", layers: layerConfigs.filter((c) => c.group === "political") },
  { group: "tribes",      label: "12 Tribes",          layers: layerConfigs.filter((c) => c.group === "tribes") },
  { group: "movements",   label: "Movements & Routes", layers: layerConfigs.filter((c) => c.group === "movements") },
  { group: "settlements", label: "Settlements",        layers: layerConfigs.filter((c) => c.group === "settlements") },
  { group: "events",      label: "Events & Sites",     layers: layerConfigs.filter((c) => c.group === "events") },
  { group: "labels",      label: "Labels",             layers: layerConfigs.filter((c) => c.group === "labels") },
];
