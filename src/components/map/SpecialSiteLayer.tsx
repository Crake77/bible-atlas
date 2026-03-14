"use client";

/**
 * SpecialSiteLayer.tsx
 *
 * Renders sacred and historically significant sites inside an R3F scene.
 * Stub implementation — returns empty group (no viewer prop needed).
 */

import { useAppState } from "@/lib/AppStateContext";

export default function SpecialSiteLayer() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { layerVisibility } = useAppState();

  // Stub: visible toggle wired up, but rendering not yet implemented for R3F
  return <group />;
}
