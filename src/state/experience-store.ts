"use client";

import { create } from "zustand";

import type { ExperienceMode } from "@/types/experience";

interface ExperienceState {
  mode: ExperienceMode;
  isAstronomySceneActive: boolean;
  selectedCelestialObjectId: string | null;
  setMode: (mode: ExperienceMode) => void;
  enterSky: () => void;
  enterPortfolio: () => void;
  selectCelestialObject: (objectId: string | null) => void;
}

function isAstronomyActive(mode: ExperienceMode): boolean {
  return mode === "sky" || mode === "transition-to-sky";
}

/**
 * Experience orchestration state (mode, selection, transitions).
 *
 * Do NOT put per-frame camera orientation, pointer deltas, or other
 * high-frequency WebGL values here — those should live in mutable refs or
 * module-level objects beside the R3F canvas to avoid React rerenders.
 */
export const useExperienceStore = create<ExperienceState>((set) => ({
  mode: "portfolio",
  isAstronomySceneActive: false,
  selectedCelestialObjectId: null,
  setMode: (mode) =>
    set({
      mode,
      isAstronomySceneActive: isAstronomyActive(mode),
    }),
  enterSky: () =>
    set({
      mode: "sky",
      isAstronomySceneActive: true,
    }),
  enterPortfolio: () =>
    set({
      mode: "portfolio",
      isAstronomySceneActive: false,
      selectedCelestialObjectId: null,
    }),
  selectCelestialObject: (objectId) =>
    set({ selectedCelestialObjectId: objectId }),
}));
