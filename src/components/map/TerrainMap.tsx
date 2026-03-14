"use client";

import { useEffect, useRef } from "react";

/**
 * TerrainMap
 *
 * Renders an interactive 3D globe using CesiumJS, centered on the ancient Near East.
 *
 * Controls:
 *   - Left-click + drag  → rotate / pan
 *   - Right-click + drag → zoom
 *   - Scroll wheel       → zoom
 *   - Middle-click drag  → tilt
 *
 * Terrain:
 *   - Default: Bing Maps satellite imagery with flat (ellipsoid) terrain
 *   - To enable real NASA SRTM elevation data, add a free Cesium ion token:
 *       1. Sign up at https://cesium.com/ion/ (free)
 *       2. Copy your default token from the dashboard
 *       3. Add NEXT_PUBLIC_CESIUM_ION_TOKEN=your_token_here to a .env.local file
 *
 * Next steps:
 *   - Add city marker pins from src/data/geography/cities.ts
 *   - Animate camera to focus on a chapter's region when selected in the reader
 *   - Draw movement arrows for journeys and military campaigns
 */
export default function TerrainMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guard: only runs in the browser, never on the server
    if (typeof window === "undefined" || !containerRef.current) return;

    let viewer: import("cesium").Viewer | null = null;

    (async () => {
      // Dynamically import CesiumJS so it only loads in the browser
      const Cesium = await import("cesium");

      // Use the Cesium ion token from environment variables if provided
      // Without a token, Cesium uses a basic offline base layer
      if (process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN) {
        Cesium.Ion.defaultAccessToken =
          process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
      }

      if (!containerRef.current) return;

      viewer = new Cesium.Viewer(containerRef.current, {
        // Terrain: use world terrain (real elevation) if a token exists,
        // otherwise fall back to a flat ellipsoid
        terrain: process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN
          ? Cesium.Terrain.fromWorldTerrain()
          : undefined,

        // Keep the scene in full 3D globe mode (not 2D map or Columbus view)
        sceneMode: Cesium.SceneMode.SCENE3D,

        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        // Keep the help button so users can see the mouse/touch controls
        navigationHelpButton: true,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        infoBox: false,
      });

      // Make tilting easier: allow tilt on left-click drag (not just middle-click)
      viewer.scene.screenSpaceCameraController.tiltEventTypes = [
        Cesium.CameraEventType.MIDDLE_DRAG,
        Cesium.CameraEventType.PINCH,
        {
          eventType: Cesium.CameraEventType.LEFT_DRAG,
          modifier: Cesium.KeyboardEventModifier.CTRL,
        },
        {
          eventType: Cesium.CameraEventType.RIGHT_DRAG,
          modifier: Cesium.KeyboardEventModifier.CTRL,
        },
      ];

      // Start the camera over the ancient Near East at a tilted angle
      // so the 3D terrain is immediately visible
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(35.5, 28.0, 500000),
        orientation: {
          heading: Cesium.Math.toRadians(0),   // North up
          pitch: Cesium.Math.toRadians(-45),   // 45° tilt down — shows terrain depth
          roll: 0,
        },
      });
    })();

    // Cleanup: destroy the Cesium viewer when the component unmounts
    return () => {
      viewer?.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    />
  );
}
