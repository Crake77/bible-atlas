"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { geoToWorld } from "@/lib/terrain/constants";
import { DEAD_SEA_RGB, GALILEE_RGB } from "@/data/geography/historicalBiomes";

// Flat polygon meshes for Sea of Galilee and Dead Sea.
// Placed at y=0.01 so they sit just above the water plane (y=0).
// Using MeshBasicMaterial (unlit) so the lake color is consistent regardless
// of light direction — lakes should read as flat colored surfaces.

function buildLakeMesh(
  coords: [number, number][],
  color: [number, number, number],
  y: number
): THREE.Mesh {
  const shape = new THREE.Shape();

  const [firstX, firstZ] = geoToWorld(coords[0][0], coords[0][1]);
  shape.moveTo(firstX, firstZ);

  for (let i = 1; i < coords.length; i++) {
    const [wx, wz] = geoToWorld(coords[i][0], coords[i][1]);
    shape.lineTo(wx, wz);
  }
  shape.closePath();

  // ShapeGeometry is in XY plane — we rotate -90° around X to lay it flat in XZ
  const geo = new THREE.ShapeGeometry(shape);

  // Rotate vertices from XY → XZ plane
  geo.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

  // Translate to the correct Y height
  geo.applyMatrix4(new THREE.Matrix4().makeTranslation(0, y, 0));

  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(color[0], color[1], color[2]),
    side: THREE.DoubleSide,
  });

  return new THREE.Mesh(geo, mat);
}

// Sea of Galilee — harp/teardrop shape, 8 points
const GALILEE_COORDS: [number, number][] = [
  [32.925, 35.572],
  [32.895, 35.665],
  [32.810, 35.673],
  [32.737, 35.631],
  [32.703, 35.585],
  [32.733, 35.509],
  [32.820, 35.497],
  [32.890, 35.512],
];

// Dead Sea — funnel shape with Lisan Peninsula indentation, 12 points
const DEAD_SEA_COORDS: [number, number][] = [
  [31.773, 35.395],
  [31.773, 35.535],
  [31.500, 35.545],
  [31.420, 35.495],
  [31.180, 35.470],
  [31.073, 35.430],
  [31.073, 35.390],
  [31.180, 35.385],
  [31.420, 35.370],
  [31.500, 35.355],
  [31.773, 35.355],
];

export default function LakesLayer() {
  const galileeMesh = useMemo(
    () => buildLakeMesh(GALILEE_COORDS, GALILEE_RGB, 0.01),
    []
  );
  const deadSeaMesh = useMemo(
    () => buildLakeMesh(DEAD_SEA_COORDS, DEAD_SEA_RGB, 0.01),
    []
  );

  return (
    <group>
      <primitive object={galileeMesh} />
      <primitive object={deadSeaMesh} />
    </group>
  );
}
