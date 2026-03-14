"use client";

import dynamic from "next/dynamic";
import BibleReader from "@/components/reader/BibleReader";

// Load the 3D map only in the browser — CesiumJS requires browser APIs
const TerrainMap = dynamic(() => import("@/components/map/TerrainMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0d1b2a] flex items-center justify-center text-parchment/50">
      Loading map...
    </div>
  ),
});

/**
 * Main page — lays out the two primary panels side by side:
 *   Left:  3D Terrain Map (takes most of the screen)
 *   Right: Bible Reader (scrollable text panel)
 */
export default function HomePage() {
  return (
    <main className="flex h-screen w-screen overflow-hidden">
      {/* 3D Map — takes up 65% of the screen width */}
      <div className="flex-1">
        <TerrainMap />
      </div>

      {/* Bible Reader Panel — fixed width sidebar */}
      <div className="w-96 border-l border-stone/40 overflow-y-auto bg-ink/80">
        <BibleReader />
      </div>
    </main>
  );
}
