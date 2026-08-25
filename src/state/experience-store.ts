"use client";

import { create } from "zustand";

import type { SkyRenderQualityPreference } from "@/config/sky-quality";
import type {
  CameraOwner,
  ExperienceMode,
  TransitionDirection,
} from "@/types/experience";

interface ExperienceState {
  mode: ExperienceMode;
  transitionDirection: TransitionDirection | null;
  /** Discrete progress snapshot for UI (not per-frame). */
  transitionProgress: number;
  canInteractWithDesktop: boolean;
  canInteractWithSky: boolean;
  cameraOwner: CameraOwner;
  interactionOwner: "desktop" | "transition" | "sky";
  selectedCelestialObjectId: string | null;
  /**
   * Capture selected within the current object inspection UI.
   * Cleared when the celestial object selection changes.
   */
  selectedCaptureId: string | null;
  /**
   * Full-screen capture preview viewer. When open, sky pointer/keyboard
   * navigation yields to the viewer without changing astronomical selection.
   */
  isCaptureViewerOpen: boolean;
  isAstronomySceneActive: boolean;
  reduceMotion: boolean;
  /** User/developer sky quality preference (`auto` picks from device signals). */
  skyRenderQualityPreference: SkyRenderQualityPreference;
  setMode: (mode: ExperienceMode) => void;
  applyLogicalSnapshot: (snapshot: {
    mode: ExperienceMode;
    direction: TransitionDirection | null;
    canInteractWithDesktop: boolean;
    canInteractWithSky: boolean;
    cameraOwner: CameraOwner;
    interactionOwner: "desktop" | "transition" | "sky";
    progress: number;
  }) => void;
  setReduceMotion: (value: boolean) => void;
  setSkyRenderQualityPreference: (value: SkyRenderQualityPreference) => void;
  /** Request sky via a11y / programmatic control (sets target progress). */
  requestEnterSky: () => void;
  /** Request portfolio via a11y / programmatic control. */
  requestEnterPortfolio: () => void;
  selectCelestialObject: (objectId: string | null) => void;
  selectCapture: (captureId: string | null) => void;
  setCaptureViewerOpen: (open: boolean) => void;
}

function isAstronomyActive(mode: ExperienceMode): boolean {
  return (
    mode === "sky" ||
    mode === "transition-to-sky" ||
    mode === "transition-to-portfolio"
  );
}

const enterSkyRequestHandlers = new Set<() => void>();
const enterPortfolioRequestHandlers = new Set<() => void>();

export function registerExperienceNavigationHandlers(handlers: {
  enterSky: () => void;
  enterPortfolio: () => void;
}): () => void {
  enterSkyRequestHandlers.add(handlers.enterSky);
  enterPortfolioRequestHandlers.add(handlers.enterPortfolio);
  return () => {
    enterSkyRequestHandlers.delete(handlers.enterSky);
    enterPortfolioRequestHandlers.delete(handlers.enterPortfolio);
  };
}

/**
 * Experience orchestration state (mode, selection, interaction ownership).
 *
 * Do NOT put per-frame camera orientation, pointer deltas, or rendered
 * transition transforms here — those live in `transition-runtime` / Three refs.
 *
 * Selection policy: celestial selection is preserved when returning to the
 * portfolio so future sky ↔ desk deep-links remain intact.
 */
export const useExperienceStore = create<ExperienceState>((set) => ({
  mode: "portfolio",
  transitionDirection: null,
  transitionProgress: 0,
  canInteractWithDesktop: true,
  canInteractWithSky: false,
  cameraOwner: "none",
  interactionOwner: "desktop",
  selectedCelestialObjectId: null,
  selectedCaptureId: null,
  isCaptureViewerOpen: false,
  isAstronomySceneActive: false,
  reduceMotion: false,
  skyRenderQualityPreference: "auto",
  setMode: (mode) =>
    set({
      mode,
      isAstronomySceneActive: isAstronomyActive(mode),
    }),
  applyLogicalSnapshot: (snapshot) =>
    set({
      mode: snapshot.mode,
      transitionDirection: snapshot.direction,
      transitionProgress: snapshot.progress,
      canInteractWithDesktop: snapshot.canInteractWithDesktop,
      canInteractWithSky: snapshot.canInteractWithSky,
      cameraOwner: snapshot.cameraOwner,
      interactionOwner: snapshot.interactionOwner,
      isAstronomySceneActive: isAstronomyActive(snapshot.mode),
    }),
  setReduceMotion: (value) => set({ reduceMotion: value }),
  setSkyRenderQualityPreference: (value) =>
    set({ skyRenderQualityPreference: value }),
  requestEnterSky: () => {
    enterSkyRequestHandlers.forEach((handler) => handler());
  },
  requestEnterPortfolio: () => {
    enterPortfolioRequestHandlers.forEach((handler) => handler());
  },
  selectCelestialObject: (objectId) =>
    set({
      selectedCelestialObjectId: objectId,
      selectedCaptureId: null,
      isCaptureViewerOpen: false,
    }),
  selectCapture: (captureId) => set({ selectedCaptureId: captureId }),
  setCaptureViewerOpen: (open) => set({ isCaptureViewerOpen: open }),
}));
