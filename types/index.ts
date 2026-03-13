/**
 * types/index.ts
 *
 * Shared TypeScript types used across the app.
 * Specific types for locations and events live in data/locations.ts and data/events.ts.
 */

/** A 3D position on the terrain [x, y, z] */
export type Position3D = [number, number, number];

/** State shared between the map and the reader (which event is selected) */
export type AppState = {
  selectedEventId: string | null;
  selectedLocationId: string | null;
};
