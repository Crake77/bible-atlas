"use client";

import * as THREE from "three";
import { PLANE_W, PLANE_H } from "@/lib/terrain/constants";

/**
 * A flat semi-reflective water surface at y = -0.002 (fractionally below true
 * sea level). This is the key height choice:
 *   - y = 0.000 → shoreline terrain at elev=0 z-fights with the plane
 *   - y = -0.050 → Mediterranean shelf (< 20m deep) sits ABOVE the plane
 *                   and renders as ghostly terrain patches
 *   - y = -0.002 → only vertices shallower than ~0.8m real elevation sit above;
 *                   in practice that's beach sand, which correctly reads as land
 *
 * The plane is made 4× wider and taller than the terrain mesh so its edges
 * never appear in view at any camera angle or zoom level.
 */
export default function WaterPlane() {
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[PLANE_W * 4, PLANE_H * 4]} />
      <meshStandardMaterial
        color="#1a3a6a"
        roughness={0.08}
        metalness={0.35}
        side={THREE.DoubleSide}
        polygonOffset
        polygonOffsetFactor={1}
        polygonOffsetUnits={1}
      />
    </mesh>
  );
}
