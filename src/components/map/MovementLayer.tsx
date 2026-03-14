"use client";

/**
 * MovementLayer.tsx
 *
 * Renders chapter-specific people/army movements from the deuteronomyEvents dataset.
 * Each movement draws a polyline from source to destination and a point marker at
 * the destination as a simple arrowhead indicator.
 *
 * Resolves locations first from explicit lat/lng on the movement, then falls back
 * to looking up the place name in the cities array.
 */

import { useEffect, useRef } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { deuteronomyEvents } from "@/data/events/deuteronomy";
import { cities } from "@/data/geography/cities";
import type { GeographicEvent } from "@/types";

type Props = {
  viewer: import("cesium").Viewer;
};

type Coord = [number, number]; // [lat, lng]

/** Try to resolve a location name to coordinates */
function resolveLocation(
  name: string,
  explicitLatLng: Coord | undefined,
  eventLocations: GeographicEvent["locations"]
): Coord | undefined {
  if (explicitLatLng) return explicitLatLng;

  // Check the event's own location list first (most specific)
  const evLoc = eventLocations.find(
    (l) => l.name.toLowerCase() === name.toLowerCase()
  );
  if (evLoc) return [evLoc.lat, evLoc.lng];

  // Fall back to the global cities dataset
  const city = cities.find(
    (c) =>
      c.name.toLowerCase() === name.toLowerCase() ||
      (c.altNames ?? []).some((a) => a.toLowerCase() === name.toLowerCase())
  );
  if (city) return [city.lat, city.lng];

  return undefined;
}

/** Layer id for a movement type */
function layerIdForMovement(type: "military" | "journey" | "migration"): string {
  return type === "military" ? "layer-military-routes" : "layer-journey-routes";
}

/** Color per movement type */
const MOVEMENT_COLORS: Record<string, string> = {
  military:  "#d0021b",
  journey:   "#1565c0",
  migration: "#f5a623",
};

export default function MovementLayer({ viewer }: Props) {
  const { layerVisibility, currentBook, currentChapter } = useAppState();

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

    if (!showMilitary && !showJourney) return;

    // Only process events for the currently active book and chapter
    const chapterEvents = deuteronomyEvents.filter(
      (e) => e.book === currentBook && e.chapter === currentChapter
    );

    if (chapterEvents.length === 0) return;

    (async () => {
      const Cesium = await import("cesium");

      for (const event of chapterEvents) {
        if (!event.movements) continue;

        for (const movement of event.movements) {
          const layerId = layerIdForMovement(movement.type);
          if (!layerVisibility[layerId as import("@/types").LayerId]) continue;

          const fromLatLng = resolveLocation(
            movement.from,
            movement.fromLatLng,
            event.locations
          );
          const toLatLng = resolveLocation(
            movement.to,
            movement.toLatLng,
            event.locations
          );

          if (!fromLatLng || !toLatLng) continue;

          const hex = MOVEMENT_COLORS[movement.type] ?? "#888888";
          const color = Cesium.Color.fromCssColorString(hex);

          // Polyline from→to
          const lineEntity = viewer.entities.add({
            name: movement.description,
            polyline: {
              positions: Cesium.Cartesian3.fromDegreesArray([
                fromLatLng[1], fromLatLng[0],
                toLatLng[1],   toLatLng[0],
              ]),
              width: 4,
              material: color.withAlpha(0.9),
              clampToGround: true,
            },
          });
          entityRefs.current.push(lineEntity);

          // Arrowhead point at destination
          const arrowEntity = viewer.entities.add({
            name: movement.description + " (destination)",
            position: Cesium.Cartesian3.fromDegrees(toLatLng[1], toLatLng[0]),
            point: {
              pixelSize: 10,
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
  }, [viewer, showMilitary, showJourney, currentBook, currentChapter, layerVisibility]);

  return null;
}
