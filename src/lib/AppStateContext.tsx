"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { LayerId, LayerGroup, LayerVisibility } from "@/types";
import { defaultLayerVisibility } from "@/data/layers/layer-config";

const BOOK_CHAPTERS: Record<string, number> = {
  Genesis: 50,
  Exodus: 40,
  Leviticus: 27,
  Numbers: 36,
  Deuteronomy: 34,
  Joshua: 24,
  Judges: 21,
  Ruth: 4,
  "1 Samuel": 31,
  "2 Samuel": 24,
  "1 Kings": 22,
  "2 Kings": 25,
};

type AppStateContextValue = {
  currentBook: string;
  currentChapter: number;
  totalChapters: number;
  layerVisibility: LayerVisibility;
  selectedEventIndex: number | null;
  // Actions
  setChapter: (book: string, chapter: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;
  toggleLayer: (id: LayerId) => void;
  setLayerVisibility: (id: LayerId, visible: boolean) => void;
  setAllLayersInGroup: (group: LayerGroup, visible: boolean) => void;
  setSelectedEvent: (index: number | null) => void;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [currentBook, setCurrentBook] = useState("Deuteronomy");
  const [currentChapter, setCurrentChapter] = useState(1);
  const [layerVisibility, setLayerVisibilityState] = useState<LayerVisibility>(
    defaultLayerVisibility
  );
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);

  const totalChapters = BOOK_CHAPTERS[currentBook] ?? 1;

  const setChapter = useCallback((book: string, chapter: number) => {
    setCurrentBook(book);
    setCurrentChapter(Math.max(1, Math.min(chapter, BOOK_CHAPTERS[book] ?? 1)));
  }, []);

  const nextChapter = useCallback(() => {
    setCurrentChapter((c) => Math.min(c + 1, totalChapters));
  }, [totalChapters]);

  const prevChapter = useCallback(() => {
    setCurrentChapter((c) => Math.max(c - 1, 1));
  }, []);

  const toggleLayer = useCallback((id: LayerId) => {
    setLayerVisibilityState((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const setLayerVisibility = useCallback((id: LayerId, visible: boolean) => {
    setLayerVisibilityState((prev) => ({ ...prev, [id]: visible }));
  }, []);

  const setAllLayersInGroup = useCallback((group: LayerGroup, visible: boolean) => {
    setLayerVisibilityState((prev) => {
      const next = { ...prev };
      groupLayerIds[group]?.forEach((id) => {
        next[id] = visible;
      });
      return next;
    });
  }, []);

  const setSelectedEvent = useCallback((index: number | null) => {
    setSelectedEventIndex(index);
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        currentBook,
        currentChapter,
        totalChapters,
        layerVisibility,
        selectedEventIndex,
        setChapter,
        nextChapter,
        prevChapter,
        toggleLayer,
        setLayerVisibility,
        setAllLayersInGroup,
        setSelectedEvent,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppStateContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}

// Static group → layer ID map (avoids async import in setAllLayersInGroup)
import { layerConfigs } from "@/data/layers/layer-config";
const groupLayerIds: Partial<Record<LayerGroup, LayerId[]>> = {};
layerConfigs.forEach((c) => {
  if (!groupLayerIds[c.group]) groupLayerIds[c.group] = [];
  groupLayerIds[c.group]!.push(c.id);
});
