"use client";

import { useState } from "react";
import { useAppState } from "@/lib/AppStateContext";
import { layerGroups } from "@/data/layers/layer-config";
import type { LayerId, LayerGroup } from "@/types";

/**
 * LayerPanel
 *
 * Collapsible floating panel (top-left of map) for toggling map layers.
 * Grouped by category with group-level and individual toggles.
 */
export default function LayerPanel() {
  const [open, setOpen] = useState(false);
  const { layerVisibility, toggleLayer, setAllLayersInGroup } = useAppState();

  return (
    <div className="absolute top-4 left-4 z-20">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/70 hover:bg-black/85 text-parchment/90 text-sm font-medium transition-colors backdrop-blur-sm border border-white/10"
      >
        <span className="text-base leading-none">☰</span>
        <span>Layers</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="mt-2 w-64 max-h-[75vh] overflow-y-auto rounded-lg bg-black/80 backdrop-blur-sm border border-white/10 text-parchment shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <h2 className="text-sm font-semibold text-parchment">Map Layers</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-parchment/50 hover:text-parchment text-lg leading-none"
            >
              ×
            </button>
          </div>

          <div className="py-2">
            {layerGroups.map((group) => {
              const allOn = group.layers.every((l) => layerVisibility[l.id]);
              const someOn = group.layers.some((l) => layerVisibility[l.id]);

              return (
                <div key={group.group} className="mb-1">
                  {/* Group header with toggle-all */}
                  <div className="flex items-center justify-between px-4 py-2 hover:bg-white/5">
                    <span className="text-xs uppercase tracking-widest text-sand/70 font-semibold">
                      {group.label}
                    </span>
                    <button
                      onClick={() =>
                        setAllLayersInGroup(group.group as LayerGroup, !allOn)
                      }
                      className={`w-8 h-4 rounded-full transition-colors relative ${
                        allOn
                          ? "bg-sand"
                          : someOn
                          ? "bg-sand/40"
                          : "bg-white/20"
                      }`}
                      title={allOn ? "Hide all" : "Show all"}
                    >
                      <span
                        className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                          allOn ? "right-0.5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Individual layer rows */}
                  {group.layers.map((layer) => (
                    <div
                      key={layer.id}
                      className="flex items-center justify-between px-5 py-1.5 hover:bg-white/5 cursor-pointer"
                      onClick={() => toggleLayer(layer.id as LayerId)}
                    >
                      <span
                        className={`text-xs transition-colors ${
                          layerVisibility[layer.id]
                            ? "text-parchment/90"
                            : "text-parchment/35"
                        }`}
                      >
                        {layer.label}
                      </span>
                      {/* Toggle switch */}
                      <div
                        className={`w-7 h-3.5 rounded-full transition-colors relative flex-shrink-0 ${
                          layerVisibility[layer.id] ? "bg-sand" : "bg-white/20"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all ${
                            layerVisibility[layer.id] ? "right-0.5" : "left-0.5"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
