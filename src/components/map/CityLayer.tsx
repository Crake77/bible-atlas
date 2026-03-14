"use client";

/**
 * CityLayer.tsx
 *
 * Renders biblical city markers using Cesium PinBuilder.
 * Pin size and color vary by city tier (major / minor / archaeological).
 */

import { useEffect, useRef } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { cities } from "@/data/geography/cities";
import { getEntityColor } from "@/data/political-entities";

type Props = {
  viewer: import("cesium").Viewer;
};

export default function CityLayer({ viewer }: Props) {
  const { layerVisibility } = useAppState();

  const showMajor          = layerVisibility["layer-cities-major"];
  const showMinor          = layerVisibility["layer-cities-minor"];
  const showArchaeological = layerVisibility["layer-cities-archaeological"];

  const entityRefs = useRef<import("cesium").Entity[]>([]);

  useEffect(() => {
    // Clean up previously created entities
    entityRefs.current.forEach((e) => {
      try {
        viewer.entities.remove(e);
      } catch {}
    });
    entityRefs.current = [];

    const anyVisible = showMajor || showMinor || showArchaeological;
    if (!anyVisible) return;

    (async () => {
      const Cesium = await import("cesium");
      const pinBuilder = new Cesium.PinBuilder();

      for (const city of cities) {
        const tier = city.tier ?? "minor";

        // Check visibility for this tier
        if (tier === "major" && !showMajor) continue;
        if (tier === "minor" && !showMinor) continue;
        if (tier === "archaeological" && !showArchaeological) continue;

        // Determine pin image
        let pinCanvas: HTMLCanvasElement;
        if (tier === "major") {
          const entityColor = city.associatedEntity
            ? getEntityColor(city.associatedEntity)
            : "#4a90d9";
          pinCanvas = pinBuilder.fromColor(
            Cesium.Color.fromCssColorString(entityColor),
            32
          ) as HTMLCanvasElement;
        } else if (tier === "minor") {
          pinCanvas = pinBuilder.fromColor(
            Cesium.Color.fromCssColorString("#c8b89a"),
            24
          ) as HTMLCanvasElement;
        } else {
          // archaeological
          pinCanvas = pinBuilder.fromColor(
            Cesium.Color.fromCssColorString("#888888"),
            20
          ) as HTMLCanvasElement;
        }

        const entity = viewer.entities.add({
          name: city.name,
          position: Cesium.Cartesian3.fromDegrees(city.lng, city.lat),
          billboard: {
            image: pinCanvas,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
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
  }, [viewer, showMajor, showMinor, showArchaeological]);

  return null;
}
