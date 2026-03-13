"use client";

import TerrainMap from "@/components/map/TerrainMap";
import BibleReader from "@/components/reader/BibleReader";

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
