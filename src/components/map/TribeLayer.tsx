"use client";

/**
 * TribeLayer.tsx
 *
 * Renders tribal allotment polygons on the Cesium globe.
 * Each tribe gets a distinct color at low alpha so the underlying
 * terrain and city markers remain visible through the overlay.
 */

import { useEffect, useRef } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { tribes } from "@/data/geography/tribes";

type Props = {
  viewer: import("cesium").Viewer;
};

/** Distinct color per tribe id */
const TRIBE_COLORS: Record<string, string> = {
  reuben:        "#e74c3c",
  gad:           "#e67e22",
  manasseh_east: "#f1c40f",
  manasseh_west: "#2ecc71",
  ephraim:       "#1abc9c",
  benjamin:      "#3498db",
  judah:         "#9b59b6",
  simeon:        "#8e44ad",
  dan:           "#e91e63",
  issachar:      "#00bcd4",
  zebulun:       "#4caf50",
  naphtali:      "#ff5722",
  asher:         "#607d8b",
};

const FALLBACK_TRIBE_COLOR = "#aaaaaa";

export default function TribeLayer({ viewer }: Props) {
  const { layerVisibility } = useAppState();
  const entityRefs = useRef<import("cesium").Entity[]>([]);

  const visible = layerVisibility["layer-tribes"];

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

      for (const tribe of tribes) {
        const hex = TRIBE_COLORS[tribe.id] ?? FALLBACK_TRIBE_COLOR;
        const color = Cesium.Color.fromCssColorString(hex);

        // Boundary is already in [lng, lat] pairs — flatten directly
        const flat: number[] = [];
        for (const [lng, lat] of tribe.boundary) {
          flat.push(lng, lat);
        }

        const entity = viewer.entities.add({
          name: tribe.name,
          polygon: {
            hierarchy: new Cesium.PolygonHierarchy(
              Cesium.Cartesian3.fromDegreesArray(flat)
            ),
            material: color.withAlpha(0.25),
            outline: true,
            outlineColor: color.withAlpha(0.55),
            outlineWidth: 1.5,
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
  }, [viewer, visible]);

  return null;
}
