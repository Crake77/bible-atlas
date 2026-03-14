"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { buildHeightmap } from "@/lib/terrain/buildHeightmap";
import { geoToWorld } from "@/lib/terrain/constants";
import TerrainMesh from "./TerrainMesh";
import WaterPlane from "./WaterPlane";
import RiverLayer from "./RiverLayer";
import RegionLayer from "./RegionLayer";
import CityLayer from "./CityLayer";
import LabelLayer from "./LabelLayer";
import TribeLayer from "./TribeLayer";
import RouteLayer from "./RouteLayer";
import SpecialSiteLayer from "./SpecialSiteLayer";
import MovementLayer from "./MovementLayer";
import LakesLayer from "./LakesLayer";
import LayerPanel from "@/components/ui/LayerPanel";

// Camera target: center over Israel [lat=31.5, lng=35.5]
const [centerX, centerZ] = geoToWorld(31.5, 35.5);

const INIT_CAMERA_POS: [number, number, number] = [centerX, 160, centerZ + 80];

const btn =
  "w-9 h-9 flex items-center justify-center rounded bg-black/60 hover:bg-black/80 " +
  "text-white text-base leading-none select-none transition-colors active:bg-white/20";

export default function TerrainScene() {
  const [heightmap, setHeightmap] = useState<Float32Array | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  useEffect(() => {
    buildHeightmap()
      .then(setHeightmap)
      .catch((e: unknown) => {
        setLoadError(e instanceof Error ? e.message : "Unknown error loading terrain");
      });
  }, []);

  const zoomIn = useCallback(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current as OrbitControlsImpl & {
      dollyIn?: (scale: number) => void;
      dollyOut?: (scale: number) => void;
    };
    controls.dollyIn?.(1.25);
    controls.update();
  }, []);

  const zoomOut = useCallback(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current as OrbitControlsImpl & {
      dollyIn?: (scale: number) => void;
      dollyOut?: (scale: number) => void;
    };
    controls.dollyOut?.(1.25);
    controls.update();
  }, []);

  const tiltUp = useCallback(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const spherical = new THREE.Spherical().setFromVector3(
      controls.object.position.clone().sub(controls.target)
    );
    spherical.phi = Math.max(0.1, spherical.phi - 0.08);
    const newPos = new THREE.Vector3()
      .setFromSpherical(spherical)
      .add(controls.target);
    controls.object.position.copy(newPos);
    controls.update();
  }, []);

  const tiltDown = useCallback(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const spherical = new THREE.Spherical().setFromVector3(
      controls.object.position.clone().sub(controls.target)
    );
    spherical.phi = Math.min(Math.PI * 0.45, spherical.phi + 0.08);
    const newPos = new THREE.Vector3()
      .setFromSpherical(spherical)
      .add(controls.target);
    controls.object.position.copy(newPos);
    controls.update();
  }, []);

  const rotateLeft = useCallback(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const spherical = new THREE.Spherical().setFromVector3(
      controls.object.position.clone().sub(controls.target)
    );
    spherical.theta -= 0.08;
    const newPos = new THREE.Vector3()
      .setFromSpherical(spherical)
      .add(controls.target);
    controls.object.position.copy(newPos);
    controls.update();
  }, []);

  const rotateRight = useCallback(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const spherical = new THREE.Spherical().setFromVector3(
      controls.object.position.clone().sub(controls.target)
    );
    spherical.theta += 0.08;
    const newPos = new THREE.Vector3()
      .setFromSpherical(spherical)
      .add(controls.target);
    controls.object.position.copy(newPos);
    controls.update();
  }, []);

  const resetView = useCallback(() => {
    if (!controlsRef.current) return;
    controlsRef.current.object.position.set(...INIT_CAMERA_POS);
    controlsRef.current.target.set(centerX, 0, centerZ);
    controlsRef.current.update();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Loading / error overlay */}
      {!heightmap && !loadError && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center z-30">
          <p className="text-amber-200/80 text-xl font-serif tracking-wide mb-3">
            Loading terrain…
          </p>
          <p className="text-white/40 text-sm font-sans">
            Fetching elevation tiles
          </p>
        </div>
      )}
      {loadError && (
        <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center z-30">
          <p className="text-red-400 text-lg font-serif mb-2">Terrain load failed</p>
          <p className="text-white/50 text-sm font-sans">{loadError}</p>
        </div>
      )}

      {/* R3F Canvas — always mounted so it initialises */}
      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{
          position: INIT_CAMERA_POS,
          fov: 45,
          near: 0.1,
          far: 5000,
        }}
        shadows
      >
        {/* Warm parchment fog — foreground crisp, distant regions haze into antiquity */}
        <fogExp2 attach="fog" args={["#c8b090", 0.0008]} />

        {/* 3-light rig: golden-hour feel with classic cartographic shadow direction */}
        {/* Warm sky hemisphere — sets overall warm ancient-world tone */}
        <hemisphereLight args={["#c8a870", "#5a4a30", 0.7]} />
        {/* Primary directional — upper-left per cartographic convention */}
        <directionalLight
          position={[-200, 350, -100]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[4096, 4096]}
        />
        {/* Subtle warm fill from below — softens harsh valley shadows */}
        <directionalLight position={[100, -100, 50]} intensity={0.15} color="#c8a060" />

        {/* Water plane renders first; terrain occludes it above sea level */}
        <WaterPlane />
        {heightmap && <TerrainMesh elevations={heightmap} />}
        {/* Lake polygon overlays — explicit vector shapes sit above water plane */}
        <LakesLayer />

        {/* Data layers */}
        <RiverLayer />
        <RegionLayer />
        <TribeLayer />
        <RouteLayer />
        <CityLayer />
        <SpecialSiteLayer />
        <MovementLayer />
        <LabelLayer />

        <OrbitControls
          ref={controlsRef}
          minDistance={15}
          maxDistance={800}
          maxPolarAngle={Math.PI * 0.45}
          minPolarAngle={0.1}
          enableDamping
          dampingFactor={0.05}
          target={[centerX, 0, centerZ]}
        />

        {/* Post-processing: bloom on bright peaks, vignette, ACES filmic tone */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.4} intensity={0.35} />
          <Vignette offset={0.3} darkness={0.7} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      </Canvas>

      {/* Layer panel overlay (outside Canvas — pure DOM) */}
      {heightmap && <LayerPanel />}

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
