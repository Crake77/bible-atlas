"use client";

/**
 * RiverLayer.tsx
 *
 * Renders river and wadi polylines on the Cesium globe.
 * All polylines clamp to ground because of the ×6 vertical exaggeration.
 */

import { useEffect, useRef } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { rivers } from "@/data/geography/rivers";

type Props = {
  viewer: import("cesium").Viewer;
};

export default function RiverLayer({ viewer }: Props) {
  const { layerVisibility } = useAppState();
  const entityRefs = useRef<import("cesium").Entity[]>([]);

  const visible = layerVisibility["layer-rivers"];

  useEffect(() => {
    // Clean up previously created entities
    entityRefs.current.forEach((e) => {
      try {
        viewer.entities.remove(e);
      } catch {}
    });
    entityRefs.current = [];

    if (!visible) return;

    (async () => {
      const Cesium = await import("cesium");

      for (const river of rivers) {
        // River paths are [lat, lng] pairs — swap to [lng, lat, lng, lat...] for Cesium
        const flat: number[] = [];
        for (const [lat, lng] of river.path) {
          flat.push(lng, lat);
        }

        const isMajor = river.tier === "major";
        const color = Cesium.Color.fromCssColorString("#4a90d9");
        const alpha = isMajor ? 0.85 : 0.6;
        const width = isMajor ? 2.5 : 1.5;

        const entity = viewer.entities.add({
          name: river.name,
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(flat),
            width,
            material: color.withAlpha(alpha),
            clampToGround: true,
          },
        });

        entityRefs.current.push(entity);
      }
    })();

    return () => {
      entityRefs.current.forEach((e) => {
        try {
          viewer.entities.remove(e);
        } catch {}
      });
      entityRefs.current = [];
    };
  }, [viewer, visible]);

  return null;
}
