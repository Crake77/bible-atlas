"use client";

/**
 * RegionLayer.tsx
 *
 * Renders political/geographic region polygons on the Cesium globe.
 * Color reflects the current controller at the active chapter.
 * Polygons clamp to ground because of the ×6 vertical exaggeration.
 */

import { useEffect, useRef } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { regions } from "@/data/geography/regions";
import { getEntityColor } from "@/data/political-entities";
import type { PoliticalEntityId } from "@/types";

type Props = {
  viewer: import("cesium").Viewer;
};

export default function RegionLayer({ viewer }: Props) {
  const { layerVisibility, currentBook, currentChapter } = useAppState();

  const showLocal = layerVisibility["layer-regions"];
  const showSurrounding = layerVisibility["layer-surrounding-nations"];

  const entityRefs = useRef<import("cesium").Entity[]>([]);

  useEffect(() => {
    // Clean up previously created entities
    entityRefs.current.forEach((e) => {
      try {
        viewer.entities.remove(e);
      } catch {}
    });
    entityRefs.current = [];

    const anyVisible = showLocal || showSurrounding;
    if (!anyVisible) return;

    (async () => {
      const Cesium = await import("cesium");

      for (const region of regions) {
        // Decide whether this region's layer is toggled on
        if (region.tier === "surrounding" && !showSurrounding) continue;
        if (region.tier === "local" && !showLocal) continue;

        // Resolve effective controller at the current chapter
        let controllerId: PoliticalEntityId = region.defaultController;
        if (region.controlOverrides) {
          const overrideEntries = Object.keys(region.controlOverrides)
            .filter((k) => k.startsWith(currentBook + "-"))
            .map((k) => ({
              chapter: parseInt(k.split("-").pop()!, 10),
              id: region.controlOverrides![k],
            }))
            .filter((entry) => entry.chapter <= currentChapter)
            .sort((a, b) => b.chapter - a.chapter);

          if (overrideEntries.length > 0) {
            controllerId = overrideEntries[0].id;
          }
        }

        const color = Cesium.Color.fromCssColorString(getEntityColor(controllerId));

        // Boundary is already in [lng, lat] pairs — flatten directly
        const flat: number[] = [];
        for (const [lng, lat] of region.boundary) {
          flat.push(lng, lat);
        }

        const entity = viewer.entities.add({
          name: region.name,
          polygon: {
            hierarchy: new Cesium.PolygonHierarchy(
              Cesium.Cartesian3.fromDegreesArray(flat)
            ),
            material: color.withAlpha(0.38),
            outline: true,
            outlineColor: color.withAlpha(0.7),
            outlineWidth: 2,
            // height:0 + heightReference CLAMP_TO_GROUND keeps polygon on terrain
            height: 0,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            classificationType: Cesium.ClassificationType.TERRAIN,
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
  }, [viewer, showLocal, showSurrounding, currentBook, currentChapter]);

  return null;
}
