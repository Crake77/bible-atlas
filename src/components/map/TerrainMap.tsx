"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * TerrainMap
 *
 * Renders an interactive 3D globe using CesiumJS, centered on the ancient Near East.
 * On-screen buttons handle tilt, rotate, and zoom for trackpad/mouse users.
 *
 * Next steps:
 *   - Add city marker pins from src/data/geography/cities.ts
 *   - Animate camera to focus on a chapter's region when selected in the reader
 *   - Draw movement arrows for journeys and military campaigns
 */
export default function TerrainMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  // viewerRef lets the button handlers access the Cesium camera after setup
  const viewerRef = useRef<import("cesium").Viewer | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    (async () => {
      const Cesium = await import("cesium");

      if (process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN) {
        Cesium.Ion.defaultAccessToken =
          process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
      }

      if (!containerRef.current) return;

      const viewer = new Cesium.Viewer(containerRef.current, {
        terrain: process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN
          ? Cesium.Terrain.fromWorldTerrain()
          : undefined,
        sceneMode: Cesium.SceneMode.SCENE3D,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        infoBox: false,
      });

      viewerRef.current = viewer;

      // Start over the ancient Near East at a 45° tilt so terrain is visible
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(35.5, 28.0, 500000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0,
        },
      });
    })();

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
    };
  }, []);

  // --- Button handlers ---
  // Zoom amount scales with current altitude so steps feel consistent
  const getZoomAmount = useCallback(() => {
    const height = viewerRef.current?.camera.positionCartographic.height ?? 500000;
    return height * 0.25;
  }, []);

  const zoomIn     = useCallback(() => viewerRef.current?.camera.zoomIn(getZoomAmount()),  [getZoomAmount]);
  const zoomOut    = useCallback(() => viewerRef.current?.camera.zoomOut(getZoomAmount()), [getZoomAmount]);
  const tiltUp     = useCallback(() => viewerRef.current?.camera.lookUp(0.08),    []);
  const tiltDown   = useCallback(() => viewerRef.current?.camera.lookDown(0.08),  []);
  const rotateLeft = useCallback(() => viewerRef.current?.camera.rotateLeft(0.08), []);
  const rotateRight= useCallback(() => viewerRef.current?.camera.rotateRight(0.08),[]);

  const resetView  = useCallback(async () => {
    const Cesium = await import("cesium");
    viewerRef.current?.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(35.5, 28.0, 500000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0,
      },
      duration: 1.5,
    });
  }, []);

  // Shared button style
  const btn =
    "w-9 h-9 flex items-center justify-center rounded bg-black/60 hover:bg-black/80 " +
    "text-white text-base leading-none select-none transition-colors active:bg-white/20";

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Cesium canvas */}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* On-screen camera controls — bottom-right corner */}
      <div className="absolute bottom-8 right-3 flex flex-col gap-2 z-10">

        {/* Zoom */}
        <div className="flex flex-col items-center gap-1">
          <button className={btn} onClick={zoomIn}  title="Zoom in">＋</button>
          <button className={btn} onClick={zoomOut} title="Zoom out">－</button>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/20 mx-1" />

        {/* Tilt (up/down) and Rotate (left/right) — D-pad layout */}
        <div className="flex flex-col items-center gap-1">
          <button className={btn} onClick={tiltUp}     title="Tilt up">▲</button>
          <div className="flex gap-1">
            <button className={btn} onClick={rotateLeft}  title="Rotate left">◀</button>
            <button className={btn} onClick={rotateRight} title="Rotate right">▶</button>
          </div>
          <button className={btn} onClick={tiltDown}   title="Tilt down">▼</button>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/20 mx-1" />

        {/* Reset view */}
        <button className={btn} onClick={resetView} title="Reset view">⌂</button>
      </div>
    </div>
  );
}
