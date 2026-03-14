"use client";

/**
 * RouteLayer.tsx
 *
 * Renders historical routes — trade roads, military campaigns, journeys,
 * migrations, and pilgrimage paths — as polylines on the Cesium globe.
 * Directed routes get a point marker at the final waypoint as an arrowhead.
 */

import { useEffect, useRef } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { routes } from "@/data/geography/routes";
import type { Route } from "@/types";

type Props = {
  viewer: import("cesium").Viewer;
};

/** Default colors per route type */
const TYPE_COLORS: Record<Route["type"], string> = {
  trade:       "#6d4c41",
  military:    "#e53935",
  journey:     "#1565c0",
  migration:   "#f57f17",
  pilgrimage:  "#7b1fa2",
};

/** Map route type to layer toggle id */
function layerIdForType(type: Route["type"]): string {
  switch (type) {
    case "trade":      return "layer-trade-routes";
    case "military":   return "layer-military-routes";
    case "journey":
    case "migration":
    case "pilgrimage": return "layer-journey-routes";
  }
}

export default function RouteLayer({ viewer }: Props) {
  const { layerVisibility, currentBook, currentChapter } = useAppState();

  const showTrade    = layerVisibility["layer-trade-routes"];
  const showMilitary = layerVisibility["layer-military-routes"];
  const showJourney  = layerVisibility["layer-journey-routes"];

  const entityRefs = useRef<import("cesium").Entity[]>([]);

  useEffect(() => {
    // Clean up previously created entities
    entityRefs.current.forEach((e) => {
      try {
        viewer.entities.remove(e);
      } catch {}
    });
    entityRefs.current = [];

    const anyVisible = showTrade || showMilitary || showJourney;
    if (!anyVisible) return;

    (async () => {
      const Cesium = await import("cesium");

      for (const route of routes) {
        const typeLayerId = layerIdForType(route.type);
        const typeVisible = layerVisibility[typeLayerId as import("@/types").LayerId] ?? false;
        if (!typeVisible) continue;

        // If route is chapter-specific, only show on that chapter
        if (route.chapterRef) {
          if (
            route.chapterRef.book !== currentBook ||
            route.chapterRef.chapter !== currentChapter
          ) {
            continue;
          }
        }

        const hex = route.color ?? TYPE_COLORS[route.type];
        const color = Cesium.Color.fromCssColorString(hex);

        // Waypoints are { lat, lng } objects — swap to [lng, lat] for Cesium
        const flat: number[] = [];
        for (const wp of route.waypoints) {
          flat.push(wp.lng, wp.lat);
        }

        const polyEntity = viewer.entities.add({
          name: route.name,
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(flat),
            width: 3,
            material: color.withAlpha(0.85),
            clampToGround: true,
          },
        });
        entityRefs.current.push(polyEntity);

        // Directed routes: add an arrowhead marker at the last waypoint
        if (route.directed && route.waypoints.length > 0) {
          const last = route.waypoints[route.waypoints.length - 1];

          const arrowEntity = viewer.entities.add({
            name: route.name + " (end)",
            position: Cesium.Cartesian3.fromDegrees(last.lng, last.lat),
            point: {
              pixelSize: 12,
              color: color.withAlpha(0.95),
              outlineColor: Cesium.Color.WHITE.withAlpha(0.8),
              outlineWidth: 2,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
          });
          entityRefs.current.push(arrowEntity);
        }
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
  }, [viewer, showTrade, showMilitary, showJourney, currentBook, currentChapter, layerVisibility]);

  return null;
}
