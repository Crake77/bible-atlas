"use client";

/**
 * RegionLayer.tsx
 *
 * Renders political/geographic region polygons as flat Three.js meshes
 * inside an R3F scene. Uses ShapeGeometry to build filled polygons.
 * Color reflects the current controller at the active chapter.
 */

import { useMemo } from "react";
import * as THREE from "three";
import { useAppState } from "@/lib/AppStateContext";
import { regions } from "@/data/geography/regions";
import { getEntityColor } from "@/data/political-entities";
import { geoToWorld } from "@/lib/terrain/constants";
import type { PoliticalEntityId } from "@/types";

// Region polygon floats slightly above terrain to avoid z-fighting
const REGION_Y = 1;
const BORDER_Y = 1.2;

export default function RegionLayer() {
  const { layerVisibility, currentBook, currentChapter } = useAppState();

  const showLocal = layerVisibility["layer-regions"];
  const showSurrounding = layerVisibility["layer-surrounding-nations"];

  const regionMeshes = useMemo(() => {
    return regions.map((region) => {
      // Determine if this region should be visible
      const isVisible =
        (region.tier === "local" && showLocal) ||
        (region.tier === "surrounding" && showSurrounding);

      // Resolve effective controller at the current chapter
      let controllerId: PoliticalEntityId = region.defaultController;
      if (region.controlOverrides) {
        const overrideEntries = Object.keys(region.controlOverrides)
          .filter((k) => k.startsWith(currentBook + "-"))
          .map((k) => ({
            chapter: parseInt(k.split("-").pop()!, 10),
            id: region.controlOverrides![k] as PoliticalEntityId,
          }))
          .filter((entry) => entry.chapter <= currentChapter)
          .sort((a, b) => b.chapter - a.chapter);

        if (overrideEntries.length > 0) {
          controllerId = overrideEntries[0].id;
        }
      }

      const color = getEntityColor(controllerId);
      const colorObj = new THREE.Color(color);

      // region.boundary is [lng, lat] pairs (GeoJSON order)
      const worldPoints = region.boundary.map(([lng, lat]) => geoToWorld(lat, lng));

      // Build a THREE.Shape from world [x, z] coordinates.
      // We use x for shape.x and z for shape.y (shape is in XY plane; rotated later).
      const shape = new THREE.Shape();
      if (worldPoints.length > 0) {
        shape.moveTo(worldPoints[0][0], worldPoints[0][1]);
        for (let i = 1; i < worldPoints.length; i++) {
          shape.lineTo(worldPoints[i][0], worldPoints[i][1]);
        }
        shape.closePath();
      }

      const shapeGeo = new THREE.ShapeGeometry(shape);

      // Border: build a THREE.Line object directly to avoid JSX <line> vs SVG conflict
      const borderPoints = [
        ...worldPoints,
        worldPoints[0], // close the loop
      ].map(([x, z]) => new THREE.Vector3(x, 0, z));
      const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPoints);
      const borderMat = new THREE.LineBasicMaterial({
        color: colorObj,
        transparent: true,
        opacity: 0.7,
      });
      const borderLine = new THREE.Line(borderGeo, borderMat);
      borderLine.position.y = BORDER_Y;

      return {
        id: region.id,
        isVisible,
        colorObj,
        shapeGeo,
        borderLine,
      };
    });
  }, [showLocal, showSurrounding, currentBook, currentChapter]);

  const anyVisible = showLocal || showSurrounding;
  if (!anyVisible) return null;

  return (
    <group>
      {regionMeshes.map(({ id, isVisible, colorObj, shapeGeo, borderLine }) => {
        if (!isVisible) return null;
        return (
          <group key={id}>
            {/* Filled polygon — rotated -π/2 around X to lie in XZ plane */}
            <mesh
              geometry={shapeGeo}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, REGION_Y, 0]}
            >
              <meshBasicMaterial
                color={colorObj}
                transparent
                opacity={0.35}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            {/* Border outline — use primitive to avoid SVG <line> JSX conflict */}
            <primitive object={borderLine} />
          </group>
        );
      })}
    </group>
  );
}
