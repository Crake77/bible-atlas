"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { geoToWorld } from "@/lib/terrain/constants";
import { DEAD_SEA_RGB, GALILEE_RGB } from "@/data/geography/historicalBiomes";

/**
 * Build a flat polygon mesh lying in the XZ plane at height y.
 * Vertices are set directly from world [x, z] — no rotation needed.
 * THREE.ShapeUtils.triangulateShape handles concave polygons (Lisan indentation).
 */
function buildLakeMesh(
  coords: [number, number][],
  rgb: [number, number, number],
  y: number
): THREE.Mesh {
  const worldVerts = coords.map(([lat, lng]) => geoToWorld(lat, lng));

  // Triangulate in 2D (XZ), handling concavities
  const verts2D = worldVerts.map(([x, z]) => new THREE.Vector2(x, z));
  const triangles = THREE.ShapeUtils.triangulateShape(verts2D, []);

  // Positions directly in XZ plane — no matrix transforms needed
  const positions = new Float32Array(worldVerts.length * 3);
  worldVerts.forEach(([x, z], i) => {
    positions[i * 3 + 0] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  });

  const indexArr = new Uint16Array(triangles.length * 3);
  triangles.forEach(([a, b, c], i) => {
    indexArr[i * 3 + 0] = a;
    indexArr[i * 3 + 1] = b;
    indexArr[i * 3 + 2] = c;
  });

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setIndex(new THREE.BufferAttribute(indexArr, 1));

  const mat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(rgb[0], rgb[1], rgb[2]),
    side: THREE.DoubleSide,
  });

  return new THREE.Mesh(geo, mat);
}

// Sea of Galilee — harp/teardrop shape, 8 points clockwise from N
const GALILEE_COORDS: [number, number][] = [
  [32.925, 35.572], // N tip
  [32.895, 35.665], // NE
  [32.810, 35.673], // E
  [32.737, 35.631], // SE
  [32.703, 35.585], // S tip
  [32.733, 35.509], // SW
  [32.820, 35.497], // W
  [32.890, 35.512], // NW
];

// Dead Sea — northern basin + Lisan Peninsula constriction + southern finger
// Lisan Peninsula juts from the east at ~31.28–31.46°N, narrowing the lake to ~6km
const DEAD_SEA_COORDS: [number, number][] = [
  [31.773, 35.395], // NW
  [31.773, 35.545], // NE
  [31.510, 35.550], // E (northern basin)
  [31.440, 35.490], // Lisan E (lake narrows ~6km at constriction)
  [31.320, 35.465], // SE inner
  [31.180, 35.455], // SE outer
  [31.073, 35.430], // S tip E
  [31.073, 35.390], // S tip W
  [31.180, 35.390], // SW outer
  [31.320, 35.385], // SW inner
  [31.440, 35.360], // Lisan W
  [31.510, 35.350], // W (northern basin)
  [31.773, 35.350], // NW return
];

export default function LakesLayer() {
  const galileeMesh = useMemo(
    () => buildLakeMesh(GALILEE_COORDS, GALILEE_RGB, 0.05),
    []
  );
  const deadSeaMesh = useMemo(
    () => buildLakeMesh(DEAD_SEA_COORDS, DEAD_SEA_RGB, 0.05),
    []
  );

  return (
    <group>
      <primitive object={galileeMesh} />
      <primitive object={deadSeaMesh} />
    </group>
  );
}
