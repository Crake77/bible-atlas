"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { Viewer } from "cesium";

/**
 * TerrainMap
 *
 * Renders an interactive 3D globe using CesiumJS, centered on the ancient Near East.
 * - Vertical exaggeration ×6 so terrain is dramatic
 * - Natural Earth II base imagery (no modern roads or borders)
 * - All data layer components mounted when viewer is ready
 */
export default function TerrainMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [viewerReady, setViewerReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    (async () => {
      const Cesium = await import("cesium");

      if (process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN) {
        Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
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

      // ── Vertical exaggeration ×6 ───────────────────────────────────────────
      // This scales all terrain heights 6× while lat/lng stays accurate.
      // Dead Sea depression becomes visually striking; Mt. Hermon towers.
      viewer.scene.verticalExaggeration = 6.0;

      // ── Swap imagery: remove satellite, add historical base layer ──────────
      // Preferred: Natural Earth II via Cesium ion (asset 3845) — clean artistic
      // base with no modern roads, labels, or political borders.
      // Fallback: ArcGIS World Physical Map — also has no roads/borders, free, no token needed.
      viewer.imageryLayers.removeAll();
      let imageryLoaded = false;
      if (process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN) {
        try {
          const naturalEarth = await Cesium.IonImageryProvider.fromAssetId(3845);
          viewer.imageryLayers.addImageryProvider(naturalEarth);
          imageryLoaded = true;
        } catch {
          // fall through to ArcGIS fallback
        }
      }
      if (!imageryLoaded) {
        try {
          const physicalMap = await Cesium.ArcGisMapServerImageryProvider.fromUrl(
            "https://services.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer"
          );
          viewer.imageryLayers.addImageryProvider(physicalMap);
        } catch {
          // Last resort: keep Cesium's default blue ocean rather than crashing
        }
      }

      viewerRef.current = viewer;

      // Start over the ancient Near East at a 45° tilt so terrain drama is visible immediately
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(35.5, 30.0, 600000),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-40),
          roll: 0,
        },
      });

      setViewerReady(true);
    })();

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
      setViewerReady(false);
    };
  }, []);

  // --- Button handlers ---
  const getZoomAmount = useCallback(() => {
    const height = viewerRef.current?.camera.positionCartographic.height ?? 500000;
    return height * 0.25;
  }, []);

  const zoomIn      = useCallback(() => viewerRef.current?.camera.zoomIn(getZoomAmount()),   [getZoomAmount]);
  const zoomOut     = useCallback(() => viewerRef.current?.camera.zoomOut(getZoomAmount()),  [getZoomAmount]);
  const tiltUp      = useCallback(() => viewerRef.current?.camera.lookUp(0.08),    []);
  const tiltDown    = useCallback(() => viewerRef.current?.camera.lookDown(0.08),  []);
  const rotateLeft  = useCallback(() => viewerRef.current?.camera.rotateLeft(0.08),  []);
  const rotateRight = useCallback(() => viewerRef.current?.camera.rotateRight(0.08), []);

  const resetView = useCallback(async () => {
    const Cesium = await import("cesium");
    viewerRef.current?.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(35.5, 30.0, 600000),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-40),
        roll: 0,
      },
      duration: 1.5,
    });
  }, []);

  const btn =
    "w-9 h-9 flex items-center justify-center rounded bg-black/60 hover:bg-black/80 " +
    "text-white text-base leading-none select-none transition-colors active:bg-white/20";

  // Lazily import layer components to keep the initial bundle small
  const RiverLayer       = viewerReady ? require("@/components/map/RiverLayer").default       : null;
  const RegionLayer      = viewerReady ? require("@/components/map/RegionLayer").default      : null;
  const TribeLayer       = viewerReady ? require("@/components/map/TribeLayer").default       : null;
  const RouteLayer       = viewerReady ? require("@/components/map/RouteLayer").default       : null;
  const CityLayer        = viewerReady ? require("@/components/map/CityLayer").default        : null;
  const SpecialSiteLayer = viewerReady ? require("@/components/map/SpecialSiteLayer").default : null;
  const MovementLayer    = viewerReady ? require("@/components/map/MovementLayer").default    : null;
  const LabelLayer       = viewerReady ? require("@/components/map/LabelLayer").default       : null;
  const LayerPanel       = viewerReady ? require("@/components/ui/LayerPanel").default        : null;

  const viewer = viewerRef.current;

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Cesium canvas */}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Data layers — mounted after viewer initialises */}
      {viewerReady && viewer && (
        <>
          <RiverLayer       viewer={viewer} />
          <RegionLayer      viewer={viewer} />
          <TribeLayer       viewer={viewer} />
          <RouteLayer       viewer={viewer} />
          <CityLayer        viewer={viewer} />
          <SpecialSiteLayer viewer={viewer} />
          <MovementLayer    viewer={viewer} />
          <LabelLayer       viewer={viewer} />
          <LayerPanel />
        </>
      )}

      {/* On-screen camera controls — bottom-right corner */}
      <div className="absolute bottom-8 right-3 flex flex-col gap-2 z-10">
        <div className="flex flex-col items-center gap-1">
          <button className={btn} onClick={zoomIn}  title="Zoom in">＋</button>
          <button className={btn} onClick={zoomOut} title="Zoom out">－</button>
        </div>
        <div className="h-px bg-white/20 mx-1" />
        <div className="flex flex-col items-center gap-1">
          <button className={btn} onClick={tiltUp}     title="Tilt up">▲</button>
          <div className="flex gap-1">
            <button className={btn} onClick={rotateLeft}  title="Rotate left">◀</button>
            <button className={btn} onClick={rotateRight} title="Rotate right">▶</button>
          </div>
          <button className={btn} onClick={tiltDown}   title="Tilt down">▼</button>
        </div>
        <div className="h-px bg-white/20 mx-1" />
        <button className={btn} onClick={resetView} title="Reset view">⌂</button>
      </div>
    </div>
  );
}
