"use client";

/**
 * SpecialSiteLayer.tsx
 *
 * Renders sacred and historically significant sites as colored point markers.
 * Sites with a chapterRef are only displayed when that book+chapter is active.
 */

import { useEffect, useRef } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { specialSites } from "@/data/geography/special-sites";
import type { SpecialSite } from "@/types";

type Props = {
  viewer: import("cesium").Viewer;
};

/** CSS color per site type */
const TYPE_COLORS: Partial<Record<SpecialSite["type"], string>> = {
  tabernacle:      "#ffd700",  // gold
  covenant:        "#9b59b6",  // purple
  battle:          "#e74c3c",  // red
  theophany:       "#ffffff",  // white
  burial:          "#888888",  // grey
  altar:           "#f39c12",  // orange
  vision:          "#aed6f1",  // light blue
  "city-of-refuge": "#82e0aa",  // soft green
  "levitical-city": "#a9cce3",  // soft blue
  "high-place":    "#f5e6c8",  // parchment
};

/** Map site type to layer toggle id */
function layerIdForType(type: SpecialSite["type"]): string {
  switch (type) {
    case "tabernacle": return "layer-special-sites-tabernacle";
    case "covenant":   return "layer-special-sites-covenant";
    case "battle":     return "layer-special-sites-battle";
    default:           return "layer-special-sites-other";
  }
}

export default function SpecialSiteLayer({ viewer }: Props) {
  const { layerVisibility, currentBook, currentChapter } = useAppState();

  const showTabernacle = layerVisibility["layer-special-sites-tabernacle"];
  const showCovenant   = layerVisibility["layer-special-sites-covenant"];
  const showBattle     = layerVisibility["layer-special-sites-battle"];
  const showOther      = layerVisibility["layer-special-sites-other"];

  const entityRefs = useRef<import("cesium").Entity[]>([]);

  useEffect(() => {
    // Clean up previously created entities
    entityRefs.current.forEach((e) => {
      try {
        viewer.entities.remove(e);
      } catch {}
    });
    entityRefs.current = [];

    const anyVisible = showTabernacle || showCovenant || showBattle || showOther;
    if (!anyVisible) return;

    (async () => {
      const Cesium = await import("cesium");

      for (const site of specialSites) {
        const layerId = layerIdForType(site.type);
        if (!layerVisibility[layerId as import("@/types").LayerId]) continue;

        // If chapter-specific, only show on the matching chapter
        if (site.chapterRef) {
          if (
            site.chapterRef.book !== currentBook ||
            site.chapterRef.chapter !== currentChapter
          ) {
            continue;
          }
        }

        const hex = TYPE_COLORS[site.type] ?? "#f5e6c8";
        const color = Cesium.Color.fromCssColorString(hex);

        const entity = viewer.entities.add({
          name: site.name,
          position: Cesium.Cartesian3.fromDegrees(site.lng, site.lat),
          point: {
            pixelSize: 14,
            color,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
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
  }, [viewer, showTabernacle, showCovenant, showBattle, showOther, currentBook, currentChapter, layerVisibility]);

  return null;
}
