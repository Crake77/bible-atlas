// ── Terrain tile parameters ────────────────────────────────────────────────
//
// Zoom 6 (64 tiles across the globe) with SAMPLE=2 gives ~5km resolution
// per vertex — 4× sharper than the previous zoom 5 / SAMPLE=4 setup.
// The Jordan Valley rift, Dead Sea depression, Lebanon mountains, and
// Sinai ridges all become clearly readable at this resolution.
//
// Tile coverage at zoom 6:
//   X [30..42]: lng -11.25°E → 61.875°E  (Spain → Iran)
//   Y [23..28]: lat ~16.6°N → ~44.5°N    (Sudan → Turkey)
//   Total: 13 × 6 = 78 tiles

export const ZOOM = 6;
export const X_MIN = 30;
export const X_MAX = 42;
export const Y_MIN = 23;
export const Y_MAX = 28;
export const TILE_PX = 256;
export const GRID_W = (X_MAX - X_MIN + 1) * TILE_PX; // 3328
export const GRID_H = (Y_MAX - Y_MIN + 1) * TILE_PX; // 1536
export const SAMPLE = 2;
export const MESH_COLS = GRID_W / SAMPLE; // 1664
export const MESH_ROWS = GRID_H / SAMPLE; // 768

// World-space plane dimensions (units).
// PLANE_H must account for the fact that 1° of longitude is shorter than
// 1° of latitude at non-equatorial latitudes. At center lat ~30.85°N,
// cos(30.85°) ≈ 0.859, so longitude degrees are ~14% shorter than latitude
// degrees in physical km. Dividing by cos(center_lat) corrects the aspect ratio.
// Without this, the map is squished ~19% north-south.
export const PLANE_W = 1000;
const LAT_RANGE = 45.08 - 16.63;   // degrees
const LNG_RANGE = 61.875 + 11.25;  // degrees
const CENTER_LAT_RAD = ((45.08 + 16.63) / 2) * (Math.PI / 180);
export const PLANE_H = Math.round(PLANE_W * (LAT_RANGE / LNG_RANGE) / Math.cos(CENTER_LAT_RAD)); // ≈ 453

// World-units per meter of real elevation. 0.01 gives Mt Hermon (~2814m)
// about 28 units — visible as a clear peak at our default camera distance.
export const ELEVATION_SCALE = 0.0025;

// Geographic bounds derived from the tile grid edges (not approximated —
// these are the exact lat/lng at the tile boundaries the mesh will cover).
export const GEO = {
  minLat: 16.63,   // exact south edge of tile y=28 at zoom 6
  maxLat: 45.08,   // exact north edge of tile y=23 at zoom 6
  minLng: -11.25,  // exact west edge of tile x=30 at zoom 6
  maxLng: 61.875,  // exact east edge of tile x=42 at zoom 6
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
