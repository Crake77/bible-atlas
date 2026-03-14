import type { PoliticalEntity } from "@/types";

export const politicalEntities: PoliticalEntity[] = [
  {
    id: "israel",
    name: "Israel",
    color: "#4a7c59",
    description: "The united Israelite nation under Moses, Joshua, and later the united monarchy.",
  },
  {
    id: "judah",
    name: "Judah",
    color: "#5a8a3c",
    description: "The southern kingdom after the division of Israel under Rehoboam.",
  },
  {
    id: "israel-north",
    name: "Israel (North)",
    color: "#3d6b7a",
    description: "The northern kingdom after the division, from Jeroboam onward.",
  },
  {
    id: "moab",
    name: "Moab",
    color: "#c47a3a",
    description: "Descendants of Lot. Occupied the plateau east of the Dead Sea. Israel was forbidden to dispossess them.",
  },
  {
    id: "edom",
    name: "Edom",
    color: "#8b3a2a",
    description: "Descendants of Esau. Occupied the highlands south of the Dead Sea and east of the Arabah.",
  },
  {
    id: "ammon",
    name: "Ammon",
    color: "#a06b2a",
    description: "Descendants of Lot. Occupied the region east of Gilead. Israel was forbidden to attack them.",
  },
  {
    id: "philistia",
    name: "Philistia",
    color: "#5c6bc0",
    description: "Sea Peoples who settled the southwestern coastal plain. Major adversaries during the judges and early monarchy period.",
  },
  {
    id: "amorites",
    name: "Amorites",
    color: "#7a5c2a",
    description: "Pre-Israelite highland peoples. Sihon king of Heshbon and Og king of Bashan were Amorite rulers.",
  },
  {
    id: "bashan",
    name: "Bashan",
    color: "#4a6b4a",
    description: "Fertile plateau northeast of the Sea of Galilee, ruled by Og. Conquered by Israel under Moses.",
  },
  {
    id: "canaan",
    name: "Canaan",
    color: "#c8a84b",
    description: "The land promised to Israel, occupied by various Canaanite peoples prior to the conquest.",
  },
  {
    id: "egypt",
    name: "Egypt",
    color: "#c4a033",
    description: "The great power to the southwest. Israel's place of bondage and exodus.",
  },
  {
    id: "assyria",
    name: "Assyria",
    color: "#6b3a6b",
    description: "The great Mesopotamian empire that conquered the northern kingdom of Israel in 722 BC.",
  },
  {
    id: "babylon",
    name: "Babylon",
    color: "#8b4513",
    description: "The great Mesopotamian empire that conquered Judah and destroyed Jerusalem in 586 BC.",
  },
  {
    id: "aram",
    name: "Aram / Syria",
    color: "#2e7d88",
    description: "The Aramean kingdoms north and northeast of Israel, centered at Damascus.",
  },
  {
    id: "persia",
    name: "Persia",
    color: "#7b5ea7",
    description: "The Persian Empire that conquered Babylon and allowed the Jewish exiles to return.",
  },
  {
    id: "phoenicia",
    name: "Phoenicia",
    color: "#1a6b8a",
    description: "Maritime traders occupying the northern coastal cities of Tyre, Sidon, and Byblos.",
  },
  {
    id: "midian",
    name: "Midian",
    color: "#b8860b",
    description: "Desert-dwelling descendants of Abraham by Keturah, in the northwestern Arabian peninsula.",
  },
  {
    id: "unclaimed",
    name: "Wilderness / Unclaimed",
    color: "#9e9e7a",
    description: "Desert, wilderness, or unclaimed territory.",
  },
];

/** Quick lookup by entity id */
export function getEntityColor(id: string): string {
  return politicalEntities.find((e) => e.id === id)?.color ?? "#9e9e7a";
}
