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
              font: "bold 15pt Georgia",
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              fillColor: Cesium.Color.fromCssColorString("#fff8e8"),
              outlineColor: Cesium.Color.fromCssColorString("#1a0a00"),
              outlineWidth: 5,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
              eyeOffset: new Cesium.Cartesian3(0, 0, -5000),
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
              font: "italic 12pt Georgia",
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              fillColor: Cesium.Color.fromCssColorString("#c8e8ff"),
              outlineColor: Cesium.Color.fromCssColorString("#0a1a2a"),
              outlineWidth: 4,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
              eyeOffset: new Cesium.Cartesian3(0, 0, -5000),
            },
          });
          entityRefs.current.push(entity);
        }

        // ── Static sea / lake labels (always shown with river labels) ───────
        const waterBodies = [
          { name: "Dead Sea",         lng: 35.50, lat: 31.40 },
          { name: "Sea of Galilee",   lng: 35.60, lat: 32.83 },
          { name: "Mediterranean Sea",lng: 33.80, lat: 32.30 },
          { name: "Red Sea",          lng: 32.80, lat: 27.50 },
          { name: "Gulf of Aqaba",    lng: 34.92, lat: 29.30 },
        ];
        for (const wb of waterBodies) {
          const entity = viewer.entities.add({
            name: wb.name + " (label)",
            position: Cesium.Cartesian3.fromDegrees(wb.lng, wb.lat),
            label: {
              text: wb.name,
              font: "italic bold 13pt Georgia",
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              fillColor: Cesium.Color.fromCssColorString("#a8d8f0"),
              outlineColor: Cesium.Color.fromCssColorString("#08162a"),
              outlineWidth: 5,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
              eyeOffset: new Cesium.Cartesian3(0, 0, -5000),
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
              fillColor: Cesium.Color.fromCssColorString("#fff8e8"),
              outlineColor: Cesium.Color.fromCssColorString("#1a0a00"),
              outlineWidth: 4,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.TOP,
              pixelOffset: new Cesium.Cartesian2(0, 10),
              eyeOffset: new Cesium.Cartesian3(0, 0, -5000),
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
              fillColor: Cesium.Color.fromCssColorString("#f0ffe8"),
              outlineColor: Cesium.Color.fromCssColorString("#0a1a00"),
              outlineWidth: 4,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              disableDepthTestDistance: Number.POSITIVE_INFINITY,
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.CENTER,
              eyeOffset: new Cesium.Cartesian3(0, 0, -5000),
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
