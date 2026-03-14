"use client";

import dynamic from "next/dynamic";

/**
 * TerrainMap
 *
 * Shell component that lazily loads the full R3F terrain scene (no SSR).
 * Replaces the old CesiumJS-based renderer with a static Three.js mesh
 * built from AWS Terrarium elevation tiles fetched once at startup.
 */
const TerrainScene = dynamic(() => import("./TerrainScene"), { ssr: false });

export default function TerrainMap() {
  return <TerrainScene />;
}
