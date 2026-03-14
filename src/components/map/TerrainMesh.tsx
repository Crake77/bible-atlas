"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { PLANE_W, PLANE_H, MESH_COLS, MESH_ROWS, ELEVATION_SCALE } from "@/lib/terrain/constants";

type Props = {
  elevations: Float32Array;
};

/**
 * Returns an RGB triple (0–1 each) for a given elevation in meters.
 * Mimics ancient vegetation: greener lowlands, brown highlands, white peaks.
 */
function elevationColor(elev: number): [number, number, number] {
  // Deep ocean / Dead Sea
  if (elev < -10) return [0x1a / 255, 0x4a / 255, 0x8a / 255];
  // Shallow water / shoreline
  if (elev < 0) return [0x2d / 255, 0x6b / 255, 0x5a / 255];
  // Coastal lowland — olive green (add historical vegetation +0.03 on green)
  if (elev < 200) {
    const t = elev / 200;
    const r = (0x4a + t * (0x3d - 0x4a)) / 255;
    const g = Math.min(1, (0x6b + t * (0x5c - 0x6b)) / 255 + 0.03);
    const b = (0x2a + t * (0x1e - 0x2a)) / 255;
    return [r, g, b];
  }
  // Forest green highland
  if (elev < 600) {
    const t = (elev - 200) / 400;
    const r = (0x3d + t * (0x5c - 0x3d)) / 255;
    const g = Math.min(1, (0x5c + t * (0x4a - 0x5c)) / 255 + 0.03);
    const b = (0x1e + t * (0x1e - 0x1e)) / 255;
    return [r, g, b];
  }
  // Brown-green
  if (elev < 1200) {
    const t = (elev - 600) / 600;
    const r = (0x5c + t * (0x6b - 0x5c)) / 255;
    const g = (0x4a + t * (0x3a - 0x4a)) / 255;
    const b = (0x1e + t * (0x1a - 0x1e)) / 255;
    return [r, g, b];
  }
  // Brown
  if (elev < 2000) {
    const t = (elev - 1200) / 800;
    const r = (0x6b + t * (0x7a - 0x6b)) / 255;
    const g = (0x3a + t * (0x6a - 0x3a)) / 255;
    const b = (0x1a + t * (0x5a - 0x1a)) / 255;
    return [r, g, b];
  }
  // Grey-brown
  if (elev < 3000) {
    const t = (elev - 2000) / 1000;
    const r = (0x7a + t * (0xc8 - 0x7a)) / 255;
    const g = (0x6a + t * (0xc0 - 0x6a)) / 255;
    const b = (0x5a + t * (0xb0 - 0x5a)) / 255;
    return [r, g, b];
  }
  // Snow / peaks
  return [0xc8 / 255, 0xc0 / 255, 0xb0 / 255];
}

export default function TerrainMesh({ elevations }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { positions, colors, indices } = useMemo(() => {
    const cols = MESH_COLS;
    const rows = MESH_ROWS;
    const vertCount = cols * rows;

    const positions = new Float32Array(vertCount * 3);
    const colors = new Float32Array(vertCount * 3);

    // Build vertex positions and colors.
    // After rotating the plane -π/2 around X, the PlaneGeometry's Y becomes Z,
    // so we set Y (up) from elevation data.
    // Tile row 0 = top of image = north = -z in world space.
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const vi = row * cols + col;

        // World X: left (-PLANE_W/2) to right (+PLANE_W/2)
        const wx = (col / (cols - 1) - 0.5) * PLANE_W;
        // World Z: row 0 = north = -PLANE_H/2, row max = south = +PLANE_H/2
        const wz = (row / (rows - 1) - 0.5) * PLANE_H;
        // World Y (elevation)
        const elev = elevations[vi] ?? 0;
        const wy = elev * ELEVATION_SCALE;

        positions[vi * 3 + 0] = wx;
        positions[vi * 3 + 1] = wy;
        positions[vi * 3 + 2] = wz;

        const [cr, cg, cb] = elevationColor(elev);
        colors[vi * 3 + 0] = cr;
        colors[vi * 3 + 1] = cg;
        colors[vi * 3 + 2] = cb;
      }
    }

    // Build triangle indices
    const idxCount = (cols - 1) * (rows - 1) * 6;
    const indices = new Uint32Array(idxCount);
    let idx = 0;
    for (let row = 0; row < rows - 1; row++) {
      for (let col = 0; col < cols - 1; col++) {
        const a = row * cols + col;
        const b = row * cols + col + 1;
        const c = (row + 1) * cols + col;
        const d = (row + 1) * cols + col + 1;
        // Two triangles per quad
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
    <mesh ref={meshRef} geometry={geometry} receiveShadow>
      <meshLambertMaterial vertexColors side={THREE.DoubleSide} />
    </mesh>
  );
}
