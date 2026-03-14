"use client";

/**
 * RiverLayer.tsx
 *
 * Renders river polylines as Three.js line objects inside an R3F scene.
 * River paths are [lat, lng] pairs; converted to world coords via geoToWorld.
 * Uses <primitive object={...}> to avoid the SVG <line> JSX type conflict.
 */

import { useMemo } from "react";
import * as THREE from "three";
import { useAppState } from "@/lib/AppStateContext";
import { rivers } from "@/data/geography/rivers";
import { geoToWorld } from "@/lib/terrain/constants";

// A small elevation offset so lines float above the terrain surface
const FLOAT_Y = 2;

export default function RiverLayer() {
  const { layerVisibility } = useAppState();
  const visible = layerVisibility["layer-rivers"];

  const lineObjects = useMemo(() => {
    if (!visible) return [];

    return rivers.map((river) => {
      const points = river.path.map(([lat, lng]) => {
        const [x, z] = geoToWorld(lat, lng);
        return new THREE.Vector3(x, FLOAT_Y, z);
      });

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: "#4a90d9",
        transparent: true,
        opacity: river.tier === "major" ? 0.85 : 0.6,
      });
      const line = new THREE.Line(geometry, material);

      return { id: river.id, line };
    });
  }, [visible]);

  if (!visible) return null;

  return (
    <group>
      {lineObjects.map(({ id, line }) => (
        <primitive key={id} object={line} />
      ))}
    </group>
  );
}
