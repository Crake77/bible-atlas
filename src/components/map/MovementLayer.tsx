"use client";

/**
 * MovementLayer.tsx
 *
 * Renders chapter-specific people/army movements inside an R3F scene.
 * Stub implementation — returns empty group (no viewer prop needed).
 */

import { useAppState } from "@/lib/AppStateContext";

export default function MovementLayer() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { layerVisibility, currentBook, currentChapter } = useAppState();

  // Stub: wired up to context, but rendering not yet implemented for R3F
  return <group />;
}
