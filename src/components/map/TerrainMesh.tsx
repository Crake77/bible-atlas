"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import {
  PLANE_W,
  PLANE_H,
  MESH_COLS,
  MESH_ROWS,
  ELEVATION_SCALE,
  GEO,
} from "@/lib/terrain/constants";
import {
  BIOMES_SORTED,
  OCEAN_RGB,
  ALPINE_RGB,
  SNOW_RGB,
  STEPPE_RGB,
} from "@/data/geography/historicalBiomes";

type RGB = [number, number, number];

// ── Utility ───────────────────────────────────────────────────────────────────

function clamp(v: number, lo = 0, hi = 1): number {
  return v < lo ? lo : v > hi ? hi : v;
}

// ── Noise ─────────────────────────────────────────────────────────────────────
// hash2 gives a deterministic 0–1 value per integer grid cell.
// smoothNoise bilinearly interpolates between grid corners with a smoothstep
// curve — this is what prevents polka-dot artifacts. Raw hash noise at high
// frequencies makes every vertex independent; smooth noise makes neighbouring
// vertices correlated so you get organic blobs, not speckle.

function hash2(x: number, y: number): number {
  const v = Math.sin(x * 78.233 + y * 127.1) * 43758.5453;
  return v - Math.floor(v); // 0–1
}

function smoothNoise(lat: number, lng: number, freq: number): number {
  const x = lat * freq, y = lng * freq;
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi,        yf = y - yi;
  // Smoothstep: removes derivative discontinuity at cell boundaries
  const ux = xf * xf * (3 - 2 * xf);
  const uy = yf * yf * (3 - 2 * yf);
  // Bilinear interpolation across 4 corners
  return (
    hash2(xi,     yi    ) * (1 - ux) * (1 - uy) +
    hash2(xi + 1, yi    ) * ux       * (1 - uy) +
    hash2(xi,     yi + 1) * (1 - ux) * uy       +
    hash2(xi + 1, yi + 1) * ux       * uy
  );
}

// 3-octave smooth noise — broad painterly sweeps, no fine speckle.
// Coarse octave dominates so the result reads as large colour patches.
function fieldNoise(lat: number, lng: number): number {
  return (
    smoothNoise(lat, lng, 0.55) * 0.55 + // ~180km broad sweeps
    smoothNoise(lat, lng, 1.7)  * 0.30 + // ~60km mid blobs
    smoothNoise(lat, lng, 4.0)  * 0.15   // ~25km fine variation
  );
}

// ── HSL ↔ RGB ──────────────────────────────────────────────────────────────────
// HSL-space modulation keeps hue locked (greens stay green, sands stay golden)
// while independently varying brightness + saturation for artistic effect.

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6 :
    max === g ? ((b - r) / d + 2) / 6 :
                ((r - g) / d + 4) / 6;
  return [h, s, l];
}

function hue2rgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number): RGB {
  if (s === 0) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)];
}

// ── Soft biome blending with domain warping ───────────────────────────────────
// Two techniques eliminate visible rectangle edges:
//
// 1. Large blend zone (0.9° ≈ 100km): biomes overlap significantly so colour
//    always transitions through a wide gradient, never a sharp line.
//
// 2. Domain warping: before the bbox distance test we displace the query
//    coordinates by a low-frequency noise field. This bends every boundary
//    into a wiggly organic curve — even a perfectly straight bbox edge becomes
//    an undulating coastline-like shape. Warp strength 0.8° means boundaries
//    can shift up to ±90km from their "true" position.

const BLEND_SQ  = 0.7 * 0.7; // ~78km blend zone (squared, no sqrt in hot loop)
const WARP_STR  = 0.5;        // degrees of boundary warp (~55km displacement)

function biomeWeight(lat: number, lng: number, rect: [number, number, number, number]): number {
  // Domain warp: displace query coords with a slow noise field
  const wLat = lat + (smoothNoise(lat * 0.9, lng * 1.1, 1.2) - 0.5) * WARP_STR;
  const wLng = lng + (smoothNoise(lat * 1.2, lng * 0.8, 1.0) - 0.5) * WARP_STR;

  const [minLat, maxLat, minLng, maxLng] = rect;
  if (wLat >= minLat && wLat <= maxLat && wLng >= minLng && wLng <= maxLng) return 1;
  const dLat = Math.max(minLat - wLat, 0, wLat - maxLat);
  const dLng = Math.max(minLng - wLng, 0, wLng - maxLng);
  const dSq = dLat * dLat + dLng * dLng;
  if (dSq >= BLEND_SQ) return 0;
  const t = 1 - dSq / BLEND_SQ;
  return t * t; // quadratic falloff — solid core, feathered edges
}

// ── Below-sea-level geography helpers ────────────────────────────────────────
//
// The Jordan Rift Valley is the lowest terrestrial region on Earth. Large
// swaths of it are below sea level but are DRY LAND, not ocean. Without
// this distinction the entire rift looks like one giant connected lake.
//
// Sea of Galilee (Kinneret): freshwater lake at -213 m, ~21×11 km
// Dead Sea (Yam HaMelach):   hypersaline lake at -430 m, ~50×15 km
// Jordan Valley between:     below sea-level LAND — river only ~50 m wide,
//                             invisible at our 5 km resolution, shown as terrain
//
// The Nile Delta is also at/below sea level in places; flagged as land to
// prevent z-fighting between the low terrain mesh and the water plane.

function isDeadSea(lat: number, lng: number): boolean {
  // Dead Sea has two distinct basins separated by the Lisan Peninsula (~31.28–31.46°N).
  // Northern basin (deep, wide): ~31.46–31.78°N, ~17km wide
  if (lat >= 31.46 && lat <= 31.78 && lng >= 35.35 && lng <= 35.55) return true;
  // Southern basin (shallow, narrow finger): ~31.07–31.46°N, ~8–10km wide
  if (lat >= 31.07 && lat <= 31.46 && lng >= 35.39 && lng <= 35.48) return true;
  return false;
}
function isSeaOfGalilee(lat: number, lng: number): boolean {
  // Sea of Galilee (Kinneret): harp-shaped, -213m.
  // True extents: 32.700–32.924°N, 35.497–35.672°E
  return lat >= 32.70 && lat <= 32.92 && lng >= 35.50 && lng <= 35.67;
}
/**
 * Below-sea-level areas that are LAND, not ocean — geometry clamped above
 * the water plane so they render as terrain, not underwater.
 * The Nile Delta check only fires for very shallow negative elevations
 * (elev > -5m) — deeper values in that bbox are the actual Mediterranean.
 */
function isBelowSeaLevelLand(lat: number, lng: number, elev: number): boolean {
  // Jordan Rift Valley — split into two sub-rects to avoid catching the
  // Lebanese / Israeli Mediterranean coast (shore is at lng ~34.85–35.25).
  // Southern section (Arabah + Dead Sea + lower Jordan): can reach lng 35.0
  // since the coast at lat<32.5 is west of our mesh resolution.
  // Jordan Rift Valley — single rect covering the full rift corridor.
  // The western boundary is set to 35.55 (east of the entire Israeli/Lebanese
  // coast which runs from lng ~34.85 in the south to ~35.40 in the north).
  // This eliminates the L-shaped step that appeared when two rects with
  // different western edges met at lat 32.5.
  if (lat >= 30.2 && lat <= 33.3 && lng >= 35.55 && lng <= 36.3) return true;
  // Nile Delta: only catch true delta lowlands; Mediterranean shelf is > 5m deep
  if (elev > -5 && lat >= 29.8 && lat <= 31.0 && lng >= 30.5 && lng <= 32.0) return true;

  // ── Additional below-sea-level DRY LAND basins ──────────────────────────
  // Qattara Depression (Egypt): ~19,600 km², lowest -133m. Dry desert basin,
  // no permanent water. SRTM codes large swaths as negative → must flag as land.
  if (lat >= 28.5 && lat <= 30.5 && lng >= 26.0 && lng <= 29.5) return true;
  // Siwa Oasis depression (Egypt): small basin reaching -60m, west of Qattara
  if (lat >= 29.0 && lat <= 29.4 && lng >= 25.0 && lng <= 26.0) return true;
  // Sabkhat Ghuzayyil (Libya): Libya's lowest point at -47m
  if (lat >= 29.5 && lat <= 30.1 && lng >= 19.0 && lng <= 20.2) return true;
  // Chott Melrhir (Algeria): -40m, largest depression in North Africa west of Egypt
  if (lat >= 33.5 && lat <= 35.0 && lng >= 5.5 && lng <= 8.0) return true;
  // Karagiye / Batyr depression (Kazakhstan): -132m dry basin near Caspian
  if (lat >= 43.2 && lat <= 44.2 && lng >= 51.0 && lng <= 52.5) return true;

  return false;
}

// ── Master color function ──────────────────────────────────────────────────────

function getBiomeColor(lat: number, lng: number, elev: number): RGB {
  // Lakes are rendered as polygon overlays in LakesLayer.tsx — no bbox coloring
  // here, which was causing rectangular patches. Terrain vertices under the lakes
  // are below the water plane and hidden, so their color doesn't matter.

  // ── Below-sea-level LAND — Jordan Rift and Nile Delta ──
  // These areas are genuinely terrestrial; fall through to biome coloring.
  // (Their geometry is clamped above y=0 in the vertex loop below so the
  //  water plane doesn't bleed through them.)
  if (elev <= 0 && isBelowSeaLevelLand(lat, lng, elev)) {
    // treat elevation as 0 for biome purposes — still picks up jordan-valley biome
  } else if (elev <= 0) {
    // elev=0 catches SRTM pixels where open sea is coded as 0m elevation
    return OCEAN_RGB;
  }

  if (elev > 2800) {
    // Textured snow — noise so peaks feel geological, not plastic-white
    const n = fieldNoise(lat * 2, lng * 2);
    const [h, s, l] = rgbToHsl(...SNOW_RGB);
    return hslToRgb(h, s, clamp(l * (0.88 + n * 0.18)));
  }

  if (elev > 1800) {
    // Alpine grey → snow with noise-driven transitions
    const t = (elev - 1800) / 1000;
    const n = fieldNoise(lat * 2, lng * 2);
    return [
      clamp(ALPINE_RGB[0] + t * (SNOW_RGB[0] - ALPINE_RGB[0]) + (n - 0.5) * 0.12),
      clamp(ALPINE_RGB[1] + t * (SNOW_RGB[1] - ALPINE_RGB[1]) + (n - 0.5) * 0.10),
      clamp(ALPINE_RGB[2] + t * (SNOW_RGB[2] - ALPINE_RGB[2]) + (n - 0.5) * 0.08),
    ];
  }

  // Weighted blend of all biomes that reach this vertex
  let rAcc = 0, gAcc = 0, bAcc = 0, wTotal = 0;
  for (const biome of BIOMES_SORTED) {
    let w = 0;
    for (const rect of biome.rects) {
      const ww = biomeWeight(lat, lng, rect);
      if (ww > w) w = ww;
    }
    if (w > 0) {
      rAcc += biome.rgb[0] * w;
      gAcc += biome.rgb[1] * w;
      bAcc += biome.rgb[2] * w;
      wTotal += w;
    }
  }
  // Steppe fallback for unclassified land
  const sw = Math.max(0, 1 - wTotal);
  if (sw > 0) {
    rAcc += STEPPE_RGB[0] * sw;
    gAcc += STEPPE_RGB[1] * sw;
    bAcc += STEPPE_RGB[2] * sw;
    wTotal += sw;
  }
  const base: RGB = [rAcc / wTotal, gAcc / wTotal, bAcc / wTotal];

  // HSL-space artistic modulation
  const [h, s, l] = rgbToHsl(base[0], base[1], base[2]);
  const n        = fieldNoise(lat, lng);       // 0–1 organic noise
  const elevFrac = clamp(elev / 900);

  return hslToRgb(
    h,
    clamp(s + 0.10 - elevFrac * 0.18, 0, 0.95),          // valleys richer, ridges muted
    clamp(l + (n - 0.5) * 0.30 + elevFrac * 0.14, 0.10, 0.90), // ±15% smooth noise + ridge lift
  );
}

type Props = {
  elevations: Float32Array;
};

export default function TerrainMesh({ elevations }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { positions, colors, indices } = useMemo(() => {
    const cols = MESH_COLS;
    const rows = MESH_ROWS;
    const vertCount = cols * rows;

    const positions = new Float32Array(vertCount * 3);
    const colors = new Float32Array(vertCount * 3);

    const latRange = GEO.maxLat - GEO.minLat;
    const lngRange = GEO.maxLng - GEO.minLng;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const vi = row * cols + col;

        // Geographic coordinates for this vertex
        const lat = GEO.maxLat - (row / (rows - 1)) * latRange;
        const lng = GEO.minLng + (col / (cols - 1)) * lngRange;

        // World-space position
        const wx   = (col / (cols - 1) - 0.5) * PLANE_W;
        const wz   = (row / (rows - 1) - 0.5) * PLANE_H;
        const elev = elevations[vi] ?? 0;

        // Lakes are now rendered as explicit polygon overlays (LakesLayer).
        // Terrain vertices inside the lake bboxes remain at their SRTM elevation
        // (negative → below water plane) so the water plane shows through them.
        // Rift valley land (non-lake) is clamped just above the water plane.
        const isLake = isDeadSea(lat, lng) || isSeaOfGalilee(lat, lng);
        const wy = isLake
          ? Math.min(elev, -10) * ELEVATION_SCALE  // keep below water plane
          : (elev <= 0 && isBelowSeaLevelLand(lat, lng, elev))
            ? 0.02
            : elev * ELEVATION_SCALE;

        positions[vi * 3 + 0] = wx;
        positions[vi * 3 + 1] = wy;
        positions[vi * 3 + 2] = wz;

        const [cr, cg, cb] = getBiomeColor(lat, lng, elev);
        colors[vi * 3 + 0] = cr;
        colors[vi * 3 + 1] = cg;
        colors[vi * 3 + 2] = cb;
      }
    }

    // Triangle indices
    const idxCount = (cols - 1) * (rows - 1) * 6;
    const indices = new Uint32Array(idxCount);
    let idx = 0;
    for (let row = 0; row < rows - 1; row++) {
      for (let col = 0; col < cols - 1; col++) {
        const a = row * cols + col;
        const b = row * cols + col + 1;
        const c = (row + 1) * cols + col;
        const d = (row + 1) * cols + col + 1;
        indices[idx++] = a;
        indices[idx++] = c;
        indices[idx++] = b;
        indices[idx++] = b;
        indices[idx++] = c;
        indices[idx++] = d;
      }
    }

    return { positions, colors, indices };
  }, [elevations]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    geo.computeVertexNormals();
    return geo;
  }, [positions, colors, indices]);

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial
        vertexColors
        side={THREE.DoubleSide}
        roughness={0.85}
        metalness={0.0}
      />
    </mesh>
  );
}
