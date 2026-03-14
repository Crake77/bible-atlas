"use client";

/**
 * LabelLayer.tsx
 *
 * Renders text labels for regions, rivers, cities, and tribes.
 * Labels use disableDepthTestDistance so they remain visible through terrain,
 * which is essential when vertical exaggeration is active.
 */

import { useEffect, useRef } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { regions } from "@/data/geography/regions";
import { rivers } from "@/data/geography/rivers";
import { cities } from "@/data/geography/cities";
import { tribes } from "@/data/geography/tribes";

type Props = {
  viewer: import("cesium").Viewer;
};

export default function LabelLayer({ viewer }: Props) {
  const { layerVisibility } = useAppState();

  const showRegionLabels = layerVisibility["layer-labels-regions"];
  const showRiverLabels  = layerVisibility["layer-labels-rivers"];
  const showCityLabels   = layerVisibility["layer-labels-cities"];
  const showTribeLabels  = layerVisibility["layer-labels-tribes"];

  const showMajorCities          = layerVisibility["layer-cities-major"];
  const showMinorCities          = layerVisibility["layer-cities-minor"];
  const showArchaeologicalCities = layerVisibility["layer-cities-archaeological"];

  const entityRefs = useRef<import("cesium").Entity[]>([]);

  useEffect(() => {
    // Clean up previously created entities
    entityRefs.current.forEach((e) => {
      try {
        viewer.entities.remove(e);
      } catch {}
    });
    entityRefs.current = [];

    const anyVisible =
      showRegionLabels || showRiverLabels || showCityLabels || showTribeLabels;
    if (!anyVisible) return;

    (async () => {
      const Cesium = await import("cesium");

      // -----------------------------------------------------------------------
      // Region labels — only local tier
      // -----------------------------------------------------------------------
      if (showRegionLabels) {
        for (const region of regions) {
          if (region.tier !== "local") continue;
          if (!region.labelPosition) continue;

          const entity = viewer.entities.add({
            name: region.name + " (label)",
            position: Cesium.Cartesian3.fromDegrees(
              region.labelPosition[1],
              region.labelPosition[0]
            ),
            label: {
              text: region.name,
              font: "bold 14pt Georgia",
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              fillColor: Cesium.Color.fromCssColorString("#f5e6c8").withAlpha(0.9),
              outlineColor: Cesium.Color.BLACK.withAlpha(0.8),
              outlineWidth: 2,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
            },
          });
          entityRefs.current.push(entity);
        }
      }

      // -----------------------------------------------------------------------
      // River labels
      // -----------------------------------------------------------------------
      if (showRiverLabels) {
        for (const river of rivers) {
          if (!river.labelPosition) continue;

          const entity = viewer.entities.add({
            name: river.name + " (label)",
            position: Cesium.Cartesian3.fromDegrees(
              river.labelPosition[1],
              river.labelPosition[0]
            ),
            label: {
              text: river.name,
              font: "12pt Georgia",
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              fillColor: Cesium.Color.fromCssColorString("#aad4f5").withAlpha(0.85),
              outlineColor: Cesium.Color.BLACK.withAlpha(0.7),
              outlineWidth: 2,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
            },
          });
          entityRefs.current.push(entity);
        }
      }

      // -----------------------------------------------------------------------
      // City labels — only for tiers whose pin layer is also visible
      // -----------------------------------------------------------------------
      if (showCityLabels) {
        for (const city of cities) {
          const tier = city.tier ?? "minor";

          if (tier === "major" && !showMajorCities) continue;
          if (tier === "minor" && !showMinorCities) continue;
          if (tier === "archaeological" && !showArchaeologicalCities) continue;

          const entity = viewer.entities.add({
            name: city.name + " (label)",
            position: Cesium.Cartesian3.fromDegrees(city.lng, city.lat),
            label: {
              text: city.name,
              font: "11pt Georgia",
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              fillColor: Cesium.Color.fromCssColorString("#f5e6c8").withAlpha(0.9),
              outlineColor: Cesium.Color.BLACK.withAlpha(0.8),
              outlineWidth: 2,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.TOP,
              pixelOffset: new Cesium.Cartesian2(0, 10),
            },
          });
          entityRefs.current.push(entity);
        }
      }

      // -----------------------------------------------------------------------
      // Tribe labels
      // -----------------------------------------------------------------------
      if (showTribeLabels) {
        for (const tribe of tribes) {
          if (!tribe.labelPosition) continue;

          const entity = viewer.entities.add({
            name: tribe.name + " (label)",
            position: Cesium.Cartesian3.fromDegrees(
              tribe.labelPosition[1],
              tribe.labelPosition[0]
            ),
            label: {
              text: tribe.name,
              font: "italic bold 13pt Georgia",
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              fillColor: Cesium.Color.WHITE.withAlpha(0.75),
              outlineColor: Cesium.Color.BLACK.withAlpha(0.65),
              outlineWidth: 2,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
            },
          });
          entityRefs.current.push(entity);
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
  }, [
    viewer,
    showRegionLabels,
    showRiverLabels,
    showCityLabels,
    showTribeLabels,
    showMajorCities,
    showMinorCities,
    showArchaeologicalCities,
  ]);

  return null;
}
