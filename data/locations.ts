/**
 * locations.ts
 *
 * Geographic coordinates for important Bible places.
 * Coordinates are real-world [longitude, latitude] from the ancient Near East.
 *
 * These will be converted to 3D positions on the terrain map.
 */

export type Location = {
  id: string;
  name: string;
  /** Real-world longitude (east-west) */
  longitude: number;
  /** Real-world latitude (north-south) */
  latitude: number;
  description: string;
};

export const locations: Location[] = [
  {
    id: "jerusalem",
    name: "Jerusalem",
    longitude: 35.2137,
    latitude: 31.7683,
    description: "The holy city; site of the Temple and many key events.",
  },
  {
    id: "bethlehem",
    name: "Bethlehem",
    longitude: 35.2,
    latitude: 31.7054,
    description: "Birthplace of David and Jesus.",
  },
  {
    id: "nazareth",
    name: "Nazareth",
    longitude: 35.3035,
    latitude: 32.7021,
    description: "Hometown of Jesus during his childhood.",
  },
  {
    id: "capernaum",
    name: "Capernaum",
    longitude: 35.5748,
    latitude: 32.8813,
    description: "A fishing village on the Sea of Galilee; Jesus' ministry base.",
  },
  {
    id: "jericho",
    name: "Jericho",
    longitude: 35.4444,
    latitude: 31.8667,
    description: "One of the oldest cities in the world; walls fell before Joshua.",
  },
  {
    id: "sinai",
    name: "Mount Sinai",
    longitude: 33.9758,
    latitude: 28.5392,
    description: "Where Moses received the Ten Commandments.",
  },
  {
    id: "jordan-river",
    name: "Jordan River",
    longitude: 35.5498,
    latitude: 31.8346,
    description: "Where Jesus was baptized by John.",
  },
];
