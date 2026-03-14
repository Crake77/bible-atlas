export const ZOOM = 5;
export const X_MIN = 15;
export const X_MAX = 21;
export const Y_MIN = 11;
export const Y_MAX = 14;
export const TILE_PX = 256;
export const GRID_W = (X_MAX - X_MIN + 1) * TILE_PX; // 1792
export const GRID_H = (Y_MAX - Y_MIN + 1) * TILE_PX; // 1024
export const SAMPLE = 4;
export const MESH_COLS = GRID_W / SAMPLE; // 448
export const MESH_ROWS = GRID_H / SAMPLE; // 256
export const PLANE_W = 1000;
export const PLANE_H = 478;
export const ELEVATION_SCALE = 0.01;
export const GEO = {
  minLat: 11.2,
  maxLat: 48.8,
  minLng: -11.25,
  maxLng: 67.5,
};

/**
 * Convert geographic [lat, lng] to world [x, z] coordinates.
 * North is in the -Z direction; camera looks toward +Z (south).
 */
export function geoToWorld(lat: number, lng: number): [number, number] {
  const x = ((lng - GEO.minLng) / (GEO.maxLng - GEO.minLng) - 0.5) * PLANE_W;
  const z = -((lat - GEO.minLat) / (GEO.maxLat - GEO.minLat) - 0.5) * PLANE_H;
  return [x, z];
}
