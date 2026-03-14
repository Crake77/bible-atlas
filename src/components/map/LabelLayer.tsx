"use client";

/**
 * LabelLayer.tsx
 *
 * Renders text labels for regions, rivers, cities, and tribes using
 * @react-three/drei Html component (DOM overlay inside R3F scene).
 */

import { Html } from "@react-three/drei";
import { useAppState } from "@/lib/AppStateContext";
import { regions } from "@/data/geography/regions";
import { rivers } from "@/data/geography/rivers";
import { cities } from "@/data/geography/cities";
import { tribes } from "@/data/geography/tribes";
import { geoToWorld } from "@/lib/terrain/constants";

const LABEL_STYLE: React.CSSProperties = {
  color: "#fff8e8",
  textShadow: "0 0 4px #000, 0 0 8px #000",
  fontFamily: "Georgia, serif",
  fontSize: "14px",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  userSelect: "none",
};

const RIVER_LABEL_STYLE: React.CSSProperties = {
  ...LABEL_STYLE,
  color: "#c8e8ff",
  fontStyle: "italic",
  fontSize: "12px",
};

const TRIBE_LABEL_STYLE: React.CSSProperties = {
  ...LABEL_STYLE,
  color: "#f0ffe8",
  fontStyle: "italic",
  fontWeight: "bold",
  fontSize: "13px",
};

const LABEL_Y = 8;

// Static water body labels shown with river labels
const WATER_BODIES = [
  { name: "Dead Sea",          lat: 31.40, lng: 35.50 },
  { name: "Sea of Galilee",    lat: 32.83, lng: 35.60 },
  { name: "Mediterranean Sea", lat: 32.30, lng: 33.80 },
  { name: "Red Sea",           lat: 27.50, lng: 32.80 },
  { name: "Gulf of Aqaba",     lat: 29.30, lng: 34.92 },
];

export default function LabelLayer() {
  const { layerVisibility } = useAppState();

  const showRegionLabels = layerVisibility["layer-labels-regions"];
  const showRiverLabels  = layerVisibility["layer-labels-rivers"];
  const showCityLabels   = layerVisibility["layer-labels-cities"];
  const showTribeLabels  = layerVisibility["layer-labels-tribes"];

  const showMajorCities          = layerVisibility["layer-cities-major"];
  const showMinorCities          = layerVisibility["layer-cities-minor"];
  const showArchaeologicalCities = layerVisibility["layer-cities-archaeological"];

  const anyVisible = showRegionLabels || showRiverLabels || showCityLabels || showTribeLabels;
  if (!anyVisible) return null;

  return (
    <group>
      {/* Region labels */}
      {showRegionLabels &&
        regions
          .filter((r) => r.tier === "local" && r.labelPosition)
          .map((region) => {
            const [lat, lng] = region.labelPosition;
            const [x, z] = geoToWorld(lat, lng);
            return (
              <Html key={region.id} position={[x, LABEL_Y, z]} center distanceFactor={200}>
                <span style={LABEL_STYLE}>{region.name}</span>
              </Html>
            );
          })}

      {/* River labels */}
      {showRiverLabels && (
        <>
          {rivers
            .filter((r) => r.labelPosition)
            .map((river) => {
              const [lat, lng] = river.labelPosition!;
              const [x, z] = geoToWorld(lat, lng);
              return (
                <Html key={river.id} position={[x, LABEL_Y, z]} center distanceFactor={200}>
                  <span style={RIVER_LABEL_STYLE}>{river.name}</span>
                </Html>
              );
            })}
          {/* Water body labels */}
          {WATER_BODIES.map((wb) => {
            const [x, z] = geoToWorld(wb.lat, wb.lng);
            return (
              <Html key={wb.name} position={[x, LABEL_Y, z]} center distanceFactor={200}>
                <span style={{ ...RIVER_LABEL_STYLE, fontWeight: "bold", fontSize: "13px" }}>
                  {wb.name}
                </span>
              </Html>
            );
          })}
        </>
      )}

      {/* City labels */}
      {showCityLabels &&
        cities.map((city) => {
          if (city.tier === "major" && !showMajorCities) return null;
          if (city.tier === "minor" && !showMinorCities) return null;
          if (city.tier === "archaeological" && !showArchaeologicalCities) return null;

          const [x, z] = geoToWorld(city.lat, city.lng);
          return (
            <Html key={city.id} position={[x, LABEL_Y + 2, z]} center distanceFactor={200}>
              <span style={{ ...LABEL_STYLE, fontSize: "11px" }}>{city.name}</span>
            </Html>
          );
        })}

      {/* Tribe labels */}
      {showTribeLabels &&
        tribes
          .filter((t) => t.labelPosition)
          .map((tribe) => {
            const [lat, lng] = tribe.labelPosition;
            const [x, z] = geoToWorld(lat, lng);
            return (
              <Html key={tribe.id} position={[x, LABEL_Y, z]} center distanceFactor={200}>
                <span style={TRIBE_LABEL_STYLE}>{tribe.name}</span>
              </Html>
            );
          })}
    </group>
  );
}
