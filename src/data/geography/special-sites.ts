/**
 * special-sites.ts
 *
 * Special biblical sites: tabernacle locations, covenant sites, theophanies,
 * battles, burials, and altars.
 */

import type { SpecialSite } from "@/types";

export const specialSites: SpecialSite[] = [
  // Tabernacle locations
  {
    id: "tabernacle_horeb",
    name: "Tabernacle at Horeb",
    type: "tabernacle",
    lat: 28.539, lng: 33.975,
    verseRef: "Exodus 40; Deuteronomy 1:6",
    description: "The Tabernacle was erected at the base of Sinai/Horeb. The covenant was made here and the Law given.",
  },
  {
    id: "tabernacle_kadesh",
    name: "Tabernacle at Kadesh Barnea",
    type: "tabernacle",
    lat: 30.63, lng: 34.42,
    verseRef: "Deuteronomy 1:19-21",
    description: "Israel camped many years at Kadesh with the Tabernacle. The spies were sent from here.",
  },
  {
    id: "tabernacle_plains_moab",
    name: "Tabernacle at the Plains of Moab",
    type: "tabernacle",
    lat: 31.84, lng: 35.56,
    verseRef: "Numbers 33:48-49; Deuteronomy 1:1",
    description: "Israel's final wilderness camp before entering Canaan. Setting for all of Moses' addresses in Deuteronomy.",
  },

  // Covenant sites
  {
    id: "covenant_horeb",
    name: "Covenant at Horeb",
    type: "covenant",
    lat: 28.539, lng: 33.975,
    verseRef: "Deuteronomy 5:2-3",
    description: "'Yahweh our God made a covenant with us at Horeb.' The Ten Commandments given here. The foundational covenant of Israel.",
  },
  {
    id: "covenant_moab",
    name: "Covenant in Moab",
    type: "covenant",
    lat: 31.82, lng: 35.65,
    verseRef: "Deuteronomy 29:1",
    description: "'These are the words of the covenant that Yahweh commanded Moses to make with the people of Israel in the land of Moab, besides the covenant that He had made with them at Horeb.'",
  },

  // Theophanies
  {
    id: "theophany_horeb",
    name: "God Speaks from the Fire",
    type: "theophany",
    lat: 28.539, lng: 33.975,
    verseRef: "Deuteronomy 4:12; 5:22-27",
    description: "'Then Yahweh spoke to you out of the midst of the fire. You heard the sound of words, but saw no form; there was only a voice.'",
  },

  // Battles
  {
    id: "battle_jahaz",
    name: "Battle of Jahaz",
    type: "battle",
    lat: 31.55, lng: 35.82,
    verseRef: "Deuteronomy 2:32-35",
    description: "Sihon came out against Israel at Jahaz. 'And Yahweh our God gave him over to us, and we defeated him and his sons and all his people.'",
    chapterRef: { book: "Deuteronomy", chapter: 2 },
  },
  {
    id: "battle_edrei",
    name: "Battle of Edrei",
    type: "battle",
    lat: 32.62, lng: 36.10,
    verseRef: "Deuteronomy 3:1-3",
    description: "'Do not fear him, for I have given him and all his people and his land into your hand.' Og and all 60 cities of Bashan were taken.",
    chapterRef: { book: "Deuteronomy", chapter: 3 },
  },
  {
    id: "battle_hormah",
    name: "Defeat at Hormah",
    type: "battle",
    lat: 31.25, lng: 34.94,
    verseRef: "Deuteronomy 1:41-46",
    description: "After Israel's presumptuous attack, the Amorites chased them 'as bees do' and defeated them as far as Hormah. God was not with them.",
    chapterRef: { book: "Deuteronomy", chapter: 1 },
  },

  // Burials
  {
    id: "burial_moses",
    name: "Burial of Moses",
    type: "burial",
    lat: 31.766, lng: 35.730,
    verseRef: "Deuteronomy 34:6",
    description: "'He buried him in the valley in the land of Moab opposite Beth-peor, but no one knows the place of his burial to this day.' Moses was 120 years old.",
    chapterRef: { book: "Deuteronomy", chapter: 34 },
  },

  // Altars
  {
    id: "altar_ebal",
    name: "Altar on Mount Ebal",
    type: "altar",
    lat: 32.228, lng: 35.278,
    verseRef: "Deuteronomy 27:4-8",
    description: "'When you have crossed over the Jordan, you shall set up these stones on Mount Ebal... and you shall build an altar to Yahweh your God, an altar of stones.' Not yet built during Deuteronomy — commanded in anticipation.",
  },
];
