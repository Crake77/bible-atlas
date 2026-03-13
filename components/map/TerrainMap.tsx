"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";

/**
 * TerrainMap
 *
 * This is the main 3D scene. Right now it shows a placeholder grey plane
 * so you can see the 3D canvas is working.
 *
 * Next steps:
 *   - Load a heightmap texture for the actual terrain mesh
 *   - Add location markers (pins) from data/locations.ts
 *   - Show event labels when hovering over a location
 */
export default function TerrainMap() {
  return (
    <div className="w-full h-full bg-[#0d1b2a]">
      <Canvas
        camera={{
          position: [0, 8, 12], // Start looking down at the terrain
          fov: 45,
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        {/* Placeholder terrain — a flat plane for now */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20, 64, 64]} />
          <meshStandardMaterial color="#5c7a5c" wireframe={false} />
        </mesh>

        {/* Reference grid overlay */}
        <Grid
          args={[20, 20]}
          cellColor="#ffffff"
          sectionColor="#aaaaaa"
          fadeDistance={30}
          position={[0, 0.01, 0]}
        />

        {/* Orbit controls: rotate with left click, zoom with scroll, pan with right click */}
        <OrbitControls
          maxPolarAngle={Math.PI / 2.2} // Prevent going below the terrain
          minDistance={3}
          maxDistance={25}
        />
      </Canvas>
    </div>
  );
}
