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
          ? Cesium.Terrain.fromWorldTerrain({ requestVertexNormals: true })
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

      // ── Vertical exaggeration ×12 ─────────────────────────────────────────
      // Doubles terrain drama: Dead Sea depression ~-430m becomes -5160m visually,
      // Mt. Hermon ~2814m becomes 33768m — Skyrim-scale ridge silhouettes.
      viewer.scene.verticalExaggeration = 12.0;

      // ── Terrain quality & lighting ────────────────────────────────────────
      viewer.scene.globe.maximumScreenSpaceError = 1.0;   // high detail tiles
      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.dynamicAtmosphereLighting = true;
      viewer.scene.globe.dynamicAtmosphereLightingFromSun = true;

      // ── Keep Near East tiles in memory — prevents LOD popping ─────────────
      // tileCacheSize holds 800 tiles in RAM. The Near East at max detail is
      // ~200-300 tiles, so once loaded they stay loaded across zoom changes.
      // preloadSiblings fetches adjacent tiles before the camera reaches them.
      viewer.scene.globe.tileCacheSize = 800;
      viewer.scene.globe.preloadSiblings = true;

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

      // ── Camera altitude cap — keeps LOD consistent ────────────────────────
      // At >1200km the Near East drops to ~4 low-res tiles and looks terrible.
      // We clamp to 1200km so users can see the whole region + Egypt/Babylon
      // context but can't zoom to full-globe view where terrain quality breaks.
      const MAX_CAMERA_HEIGHT = 1_200_000; // metres
      viewer.scene.postRender.addEventListener(() => {
        if (!viewerRef.current) return;
        const cart = viewerRef.current.camera.positionCartographic;
        if (cart.height > MAX_CAMERA_HEIGHT) {
          viewerRef.current.camera.zoomIn(cart.height - MAX_CAMERA_HEIGHT);
        }
      });

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
