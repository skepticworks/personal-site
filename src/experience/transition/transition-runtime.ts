import { TRANSITION_CONFIG } from "@/experience/transition/transition-config";
import type { CameraOwner, TransitionDirection } from "@/types/experience";

/**
 * High-frequency transition values.
 *
 * Updated from input handlers and the animation frame loop. Never mirror these
 * into Zustand every frame — React only sees discrete logical mode changes.
 */
export interface TransitionVisualSnapshot {
  progress: number;
  desktopRotateXDeg: number;
  desktopTranslateYPx: number;
  desktopScale: number;
  desktopOpacity: number;
  desktopPerspectivePx: number;
  skyOpacity: number;
  starsOpacity: number;
  environmentDarken: number;
  hintOpacity: number;
  cameraPitch: number;
  cameraYaw: number;
  cameraFov: number;
  cameraY: number;
}

export interface TransitionRuntimeState {
  targetProgress: number;
  renderedProgress: number;
  direction: TransitionDirection | null;
  cameraOwner: CameraOwner;
  reduceMotion: boolean;
  isMobile: boolean;
  /** Subscribers notified when rendered progress advances (no React). */
  listeners: Set<(snapshot: TransitionVisualSnapshot) => void>;
  visual: TransitionVisualSnapshot;
}

function createInitialVisual(): TransitionVisualSnapshot {
  return {
    progress: 0,
    desktopRotateXDeg: 0,
    desktopTranslateYPx: 0,
    desktopScale: 1,
    desktopOpacity: 1,
    desktopPerspectivePx: TRANSITION_CONFIG.desktopPerspectivePx,
    skyOpacity: 0,
    starsOpacity: 0,
    environmentDarken: 0,
    hintOpacity: 1,
    cameraPitch: TRANSITION_CONFIG.cameraStartPitch,
    cameraYaw: TRANSITION_CONFIG.cameraStartYaw,
    cameraFov: TRANSITION_CONFIG.cameraStartFov,
    cameraY: TRANSITION_CONFIG.cameraStartY,
  };
}

export const transitionRuntime: TransitionRuntimeState = {
  targetProgress: 0,
  renderedProgress: 0,
  direction: null,
  cameraOwner: "none",
  reduceMotion: false,
  isMobile: false,
  listeners: new Set(),
  visual: createInitialVisual(),
};

export function subscribeTransitionVisual(
  listener: (snapshot: TransitionVisualSnapshot) => void,
): () => void {
  transitionRuntime.listeners.add(listener);
  listener(transitionRuntime.visual);
  return () => {
    transitionRuntime.listeners.delete(listener);
  };
}

export function notifyTransitionVisualListeners(): void {
  const snapshot = transitionRuntime.visual;
  for (const listener of transitionRuntime.listeners) {
    listener(snapshot);
  }
}
