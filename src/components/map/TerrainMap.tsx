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
// Grid of [lng, lat] positions covering the Near East at 150km altitude.
// The pre-load tour visits each one and waits for all tiles to finish
// loading before moving on — so the entire region is resident in the
// tile cache before the user can interact with the map.
const PRELOAD_GRID: [number, number][] = [
  [35.5, 33.8],  // Galilee / Lebanon / Hermon
  [36.5, 32.5],  // Bashan / Gilead north
  [35.8, 32.0],  // Samaria / Jordan Valley
  [35.2, 31.8],  // Jerusalem / Jericho / Dead Sea
  [36.2, 31.2],  // Moab / Ammon
  [35.0, 30.5],  // Judah / Negev north
  [34.8, 29.5],  // Negev south / Sinai
  [37.5, 29.0],  // Edom / Midian
  [34.5, 31.5],  // Philistia / Mediterranean coast
  [32.5, 31.0],  // Egypt / Nile Delta
  [38.5, 33.5],  // Aram / Damascus / Hauran
  [41.0, 34.0],  // Upper Euphrates / Assyria approach
  [44.5, 33.0],  // Babylon / Lower Mesopotamia
];

export default function TerrainMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [tilesReady, setTilesReady] = useState(false);

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
      // maximumScreenSpaceError 0.5 forces high-detail tiles to load from much
      // farther away than default (2.0) or our previous value (1.0). This means
      // tiles are already loaded at full detail before you zoom into them —
      // the primary fix for visible pop-in with ×12 vertical exaggeration.
      viewer.scene.globe.maximumScreenSpaceError = 0.5;
      viewer.scene.globe.enableLighting = true;
      viewer.scene.globe.dynamicAtmosphereLighting = true;
      viewer.scene.globe.dynamicAtmosphereLightingFromSun = true;

      // ── Lock LOD — no quality drops during camera movement ────────────────
      // dynamicScreenSpaceError=true (Cesium default) reduces tile quality when
      // the camera is moving fast to maintain frame rate, then snaps back when
      // you stop — that snap IS the pop-in. Disabling it keeps consistent quality.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (viewer.scene.globe as any).dynamicScreenSpaceError = false;

      // ── Keep Near East tiles in memory — pre-load tour fills this cache ──────
      // 5000 tiles holds the entire pre-loaded Near East region without eviction.
      // preloadSiblings/preloadAncestors fetch adjacent + parent tiles before
      // the camera reaches them for any newly-visited areas.
      viewer.scene.globe.tileCacheSize = 5000;
      viewer.scene.globe.preloadSiblings = true;
      viewer.scene.globe.preloadAncestors = true;
      viewer.scene.globe.loadingDescendantLimit = 32;  // load more tiles in parallel

      // ── Disable fog — prevents atmospheric fade-in/fade-out during zoom ───
      // Fog causes terrain and tiles to visually appear/disappear as you move,
      // compounding the perception of pop-in.
      viewer.scene.fog.enabled = false;
      viewer.scene.globe.showGroundAtmosphere = false;

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

      // ── Historical vegetation post-process shader ─────────────────────────
      // Ancient Near East (~1400 BC) was dramatically greener than today:
      // - Central highlands: dense cedar/oak/terebinth forest (not scrub)
      // - Jordan Valley: subtropical thicket, papyrus, lions
      // - Negev: savanna/steppe, not desert (deforestation happened over millennia)
      // - Lebanon/Bashan: so forested they named the trees
      //
      // This shader pulls ALL sandy/tan/earthy tones aggressively toward
      // forest green + olive, warms the highlights (golden afternoon sun),
      // cools the shadows (fantasy depth), and adds vignette focus.
      // Only bare-rock grey and elevation peaks stay unshifted.
      viewer.scene.postProcessStages.add(
        new Cesium.PostProcessStage({
          fragmentShader: `
            uniform sampler2D colorTexture;
            in vec2 v_textureCoordinates;

            vec3 rgb2hsv(vec3 c) {
              vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
              vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
              vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
              float d = q.x - min(q.w, q.y);
              return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 1e-10)),
                          d / (q.x + 1e-10), q.x);
            }

            vec3 hsv2rgb(vec3 c) {
              vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
              vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
              return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
            }

            void main() {
              vec4 orig = texture(colorTexture, v_textureCoordinates);

              // Pass through sky / transparent pixels unchanged
              float brightness = dot(orig.rgb, vec3(0.333));
              if (brightness > 0.90 || orig.a < 0.05) {
                out_FragColor = orig;
                return;
              }

              vec3 hsv = rgb2hsv(orig.rgb);
              float h = hsv.x;
              float s = hsv.y;
              float v = hsv.z;

              // ── Detect warm earthy/sandy/tan tones (modern arid landscape) ──
              // Hue 0.04–0.20 = orange-yellow territory (sand, dirt, dry grass)
              // Must have some saturation to distinguish from grey bare rock
              float isEarthy = smoothstep(0.03, 0.07, h)
                             * (1.0 - smoothstep(0.19, 0.24, h))
                             * smoothstep(0.08, 0.22, s);

              // ── Shift earthy tones hard toward olive / forest green ──────────
              // Target hue 0.28–0.32 = rich olive/forest green
              h = mix(h, 0.30, isEarthy * 0.75);
              // Boost saturation so the green is rich, not pale
              s = mix(s, min(s * 2.4, 0.88), isEarthy * 0.80);
              // Forests are darker than sand — pull value down slightly
              v = mix(v, v * 0.82, isEarthy * 0.50);

              // ── Amplify greens that already exist ─────────────────────────
              float isGreen = smoothstep(0.22, 0.30, h)
                            * (1.0 - smoothstep(0.44, 0.52, h));
              s = mix(s, min(s * 1.6, 0.95), isGreen * 0.55);
              v = mix(v, min(v * 1.08, 1.0), isGreen * 0.30);

              // ── Pull pale grey/tan (limestone hills) toward sage green ─────
              float isGrey = (1.0 - smoothstep(0.0, 0.12, s)) * smoothstep(0.3, 0.7, v);
              s = mix(s, 0.22, isGrey * 0.45);
              h = mix(h, 0.28, isGrey * 0.35);

              vec3 color = hsv2rgb(vec3(h, s, v));

              // ── Warm highlights / cool shadows (fantasy RPG tone) ──────────
              float lum = dot(color, vec3(0.299, 0.587, 0.114));
              // Warm golden sunlight on bright surfaces
              color.r += lum * lum * 0.10;
              color.g += lum * lum * 0.05;
              // Cool blue-violet in deep shadows (valley depth)
              color.b += (1.0 - lum) * (1.0 - lum) * 0.08;
              color.r -= (1.0 - lum) * (1.0 - lum) * 0.03;

              // ── Contrast boost (makes ridges and valleys pop) ─────────────
              color = clamp((color - 0.5) * 1.20 + 0.5, 0.0, 1.0);

              // ── Vignette — darken globe edges, focus on Near East ─────────
              vec2 uv = v_textureCoordinates - 0.5;
              float vig = 1.0 - dot(uv * 1.5, uv * 1.5);
              vig = pow(max(vig, 0.0), 0.45);
              color *= vig;

              out_FragColor = vec4(clamp(color, 0.0, 1.0), orig.a);
            }
          `,
        })
      );

      viewerRef.current = viewer;

      // ── Camera altitude band — locks terrain to a single LOD tier ───────────
      //
      // MAX: 1200km — beyond this the Near East is just 4 low-res tiles.
      //
      // MIN: 80km — this is the critical lock. CesiumJS streams finer-resolution
      // terrain tiles as you zoom in. Each new LOD tier loads visible geometry
      // changes that look jarring with ×12 vertical exaggeration. By preventing
      // zoom below 80km, the camera can never reach the zoom level that would
      // trigger the next tile tier — terrain geometry is effectively frozen.
      // At 80km altitude with a 40° pitch you see ~200km × 150km, which covers
      // the whole Galilee-to-Negev span with dramatic ridge silhouettes.
      const MAX_CAMERA_HEIGHT = 1_200_000; // metres
      const MIN_CAMERA_HEIGHT =    80_000; // metres — LOD lock floor
      viewer.scene.postRender.addEventListener(() => {
        if (!viewerRef.current) return;
        const cart = viewerRef.current.camera.positionCartographic;
        if (cart.height > MAX_CAMERA_HEIGHT) {
          viewerRef.current.camera.zoomIn(cart.height - MAX_CAMERA_HEIGHT);
        } else if (cart.height < MIN_CAMERA_HEIGHT) {
          viewerRef.current.camera.zoomOut(MIN_CAMERA_HEIGHT - cart.height);
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

      // ── Pre-load tour — visit every sub-region, wait for tiles ───────────
      // CesiumJS only loads tiles that are currently in view. Without this tour,
      // tiles load on-demand as the user navigates — causing pop-in. We visit
      // each grid position at 150km altitude (just above the 80km zoom floor),
      // wait until Globe.tilesLoaded=true (all tiles for that view are resident),
      // then move on. After the tour, the entire Near East is in the 5000-tile
      // cache and won't need to load again during the session.
      for (const [lng, lat] of PRELOAD_GRID) {
        if (!viewerRef.current) break;
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(lng, lat, 150_000),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-50),
            roll: 0,
          },
        });
        // Wait for this view's tiles to finish loading (10s max per position)
        await new Promise<void>(resolve => {
          const deadline = setTimeout(resolve, 10_000);
          const poll = setInterval(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((viewer.scene.globe as any).tilesLoaded) {
              clearInterval(poll);
              clearTimeout(deadline);
              resolve();
            }
          }, 150);
        });
      }

      // Return to the default overview
      if (viewerRef.current) {
        viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(35.5, 30.0, 600_000),
          orientation: {
            heading: Cesium.Math.toRadians(0),
            pitch: Cesium.Math.toRadians(-40),
            roll: 0,
          },
        });
      }

      setTilesReady(true);
      setViewerReady(true);
    })();

    return () => {
      viewerRef.current?.destroy();
      viewerRef.current = null;
      setViewerReady(false);
      setTilesReady(false);
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
      {/* Cesium canvas — always mounted so tiles can load during the pre-load tour */}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* Loading overlay — covers the tile-tour camera jumping, shows progress */}
      {!tilesReady && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center z-30">
          <p className="text-amber-200/80 text-xl font-serif tracking-wide mb-3">
            Loading terrain…
          </p>
          <p className="text-white/40 text-sm font-sans">
            Pre-loading the ancient Near East
          </p>
        </div>
      )}

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
