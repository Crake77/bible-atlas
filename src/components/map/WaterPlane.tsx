"use client";

import * as THREE from "three";
import { PLANE_W, PLANE_H } from "@/lib/terrain/constants";

/**
 * A flat semi-reflective water surface at y = -0.05 (just below sea level).
 * The terrain mesh renders on top wherever elevation > 0, naturally masking
 * this plane over land. Sub-sea-level areas (Mediterranean, Dead Sea, etc.)
 * show through as open water.
 */
export default function WaterPlane() {
  return (
    <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[PLANE_W, PLANE_H]} />
      <meshStandardMaterial
        color="#1a3a6a"
        transparent
        opacity={0.88}
        roughness={0.1}
        metalness={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
