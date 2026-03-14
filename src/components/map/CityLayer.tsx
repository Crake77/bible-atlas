"use client";

/**
 * CityLayer.tsx
 *
 * Renders city markers as small spheres inside an R3F scene.
 * Major cities: gold. Minor: white. Archaeological: grey.
 */

import { useAppState } from "@/lib/AppStateContext";
import { cities } from "@/data/geography/cities";
import { geoToWorld } from "@/lib/terrain/constants";

const TIER_COLORS: Record<string, string> = {
  major: "#ffd700",
  minor: "#ffffff",
  archaeological: "#aaaaaa",
};

const TIER_RADIUS: Record<string, number> = {
  major: 1.5,
  minor: 0.8,
  archaeological: 0.6,
};

// Cities float above terrain surface
const CITY_Y = 5;

export default function CityLayer() {
  const { layerVisibility } = useAppState();

  const showMajor = layerVisibility["layer-cities-major"];
  const showMinor = layerVisibility["layer-cities-minor"];
  const showArchaeological = layerVisibility["layer-cities-archaeological"];

  const anyVisible = showMajor || showMinor || showArchaeological;
  if (!anyVisible) return null;

  return (
    <group>
      {cities.map((city) => {
        if (city.tier === "major" && !showMajor) return null;
        if (city.tier === "minor" && !showMinor) return null;
        if (city.tier === "archaeological" && !showArchaeological) return null;

        const [x, z] = geoToWorld(city.lat, city.lng);
        const radius = TIER_RADIUS[city.tier] ?? 0.8;
        const color = TIER_COLORS[city.tier] ?? "#ffffff";

        return (
          <mesh key={city.id} position={[x, CITY_Y, z]}>
            <sphereGeometry args={[radius, 8, 8]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
}
