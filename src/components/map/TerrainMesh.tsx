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

/**
 * Look up the biome-based vertex color for a given lat/lng/elevation.
 * Uses historically-researched biome zones for the ancient Near East c.1000 BC.
 */
function getBiomeColor(lat: number, lng: number, elev: number): RGB {
  // Elevation overrides (regardless of biome polygon)
  if (elev < 0) return OCEAN_RGB;
  if (elev > 2800) return SNOW_RGB;
  if (elev > 1800) return ALPINE_RGB;

  // First-match biome lookup (sorted by priority descending)
  let baseRGB: RGB = STEPPE_RGB; // semi-arid steppe fallback
  outer: for (const biome of BIOMES_SORTED) {
    for (const [minLat, maxLat, minLng, maxLng] of biome.rects) {
      if (lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng) {
        baseRGB = biome.rgb;
        break outer;
      }
    }
  }

  // Elevation modulation: ±12% luminance for ridge/valley contrast
  // 0 m → 0.88× (slightly darker valley floors)
  // 750 m → 1.00× (base color)
  // 1500 m → 1.12× (slightly brighter ridges)
  const elevFrac = Math.min(1, Math.max(0, elev / 1500));
  const factor = 0.88 + elevFrac * 0.24;

  return [
    Math.min(1, baseRGB[0] * factor),
    Math.min(1, baseRGB[1] * factor),
    Math.min(1, baseRGB[2] * factor),
  ];
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
        const wx = (col / (cols - 1) - 0.5) * PLANE_W;
        const wz = (row / (rows - 1) - 0.5) * PLANE_H;
        const elev = elevations[vi] ?? 0;
        // Allow sub-zero elevations to go below y=0 so the WaterPlane shows through
        const wy = elev * ELEVATION_SCALE;

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
