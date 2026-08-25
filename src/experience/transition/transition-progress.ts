import { clamp, near } from "@/experience/transition/interpolation";
import { deriveTransitionVisual } from "@/experience/transition/derive-transition-visual";
import { TRANSITION_CONFIG } from "@/experience/transition/transition-config";
import {
  notifyTransitionVisualListeners,
  transitionRuntime,
} from "@/experience/transition/transition-runtime";
import type {
  CameraOwner,
  ExperienceMode,
  TransitionDirection,
} from "@/types/experience";

export interface TransitionLogicalSnapshot {
  mode: ExperienceMode;
  direction: TransitionDirection | null;
  canInteractWithDesktop: boolean;
  canInteractWithSky: boolean;
  cameraOwner: CameraOwner;
  interactionOwner: "desktop" | "transition" | "sky";
  progress: number;
  targetProgress: number;
}

type LogicalListener = (snapshot: TransitionLogicalSnapshot) => void;

const logicalListeners = new Set<LogicalListener>();

let lastLogicalKey = "";

export function subscribeTransitionLogical(
  listener: LogicalListener,
): () => void {
  logicalListeners.add(listener);
  listener(readLogicalSnapshot());
  return () => {
    logicalListeners.delete(listener);
  };
}

export function readLogicalSnapshot(): TransitionLogicalSnapshot {
  const progress = transitionRuntime.renderedProgress;
  const target = transitionRuntime.targetProgress;
  const direction = transitionRuntime.direction;
  const { endpointEpsilon, desktopInteractMax, skyInteractMin } =
    TRANSITION_CONFIG;

  const atDesktop = near(progress, 0, endpointEpsilon);
  const atSky = near(progress, 1, endpointEpsilon);

  let mode: ExperienceMode;
  if (atDesktop) {
    mode = "portfolio";
  } else if (atSky) {
    mode = "sky";
  } else if (direction === "to-portfolio") {
    mode = "transition-to-portfolio";
  } else {
    mode = "transition-to-sky";
  }

  const canInteractWithDesktop = progress <= desktopInteractMax;
  const canInteractWithSky = progress >= skyInteractMin;

  let cameraOwner: CameraOwner;
  if (atDesktop) {
    cameraOwner = "none";
  } else if (atSky) {
    cameraOwner = "sky";
  } else {
    cameraOwner = "transition";
  }

  let interactionOwner: "desktop" | "transition" | "sky";
  if (canInteractWithDesktop) {
    interactionOwner = "desktop";
  } else if (canInteractWithSky) {
    interactionOwner = "sky";
  } else {
    interactionOwner = "transition";
  }

  return {
    mode,
    direction,
    canInteractWithDesktop,
    canInteractWithSky,
    cameraOwner,
    interactionOwner,
    progress,
    targetProgress: target,
  };
}

function emitLogicalIfChanged(): void {
  const snapshot = readLogicalSnapshot();
  const key = [
    snapshot.mode,
    snapshot.direction ?? "none",
    snapshot.canInteractWithDesktop ? "1" : "0",
    snapshot.canInteractWithSky ? "1" : "0",
    snapshot.cameraOwner,
    snapshot.interactionOwner,
  ].join("|");

  if (key === lastLogicalKey) {
    return;
  }
  lastLogicalKey = key;
  transitionRuntime.cameraOwner = snapshot.cameraOwner;
  for (const listener of logicalListeners) {
    listener(snapshot);
  }
}

/**
 * Apply a delta to target progress. Direction flips immediately on sign change.
 * Reduced-motion uses a threshold toggle toward the opposite endpoint.
 */
export function applyProgressDelta(rawDelta: number): void {
  if (rawDelta === 0 || !Number.isFinite(rawDelta)) {
    return;
  }

  if (transitionRuntime.reduceMotion) {
    applyReducedMotionDelta(rawDelta);
    return;
  }

  const next = clamp(transitionRuntime.targetProgress + rawDelta, 0, 1);
  if (next === transitionRuntime.targetProgress) {
    return;
  }

  transitionRuntime.direction =
    next > transitionRuntime.targetProgress ? "to-sky" : "to-portfolio";
  transitionRuntime.targetProgress = next;
}

function applyReducedMotionDelta(rawDelta: number): void {
  const threshold = TRANSITION_CONFIG.reducedMotionToggleThreshold;
  const current = transitionRuntime.targetProgress;

  if (current < 0.5) {
    if (rawDelta >= threshold) {
      transitionRuntime.direction = "to-sky";
      transitionRuntime.targetProgress = 1;
    }
  } else if (rawDelta <= -threshold) {
    transitionRuntime.direction = "to-portfolio";
    transitionRuntime.targetProgress = 0;
  }
}

/** Jump target (and optionally rendered) progress — used by a11y controls. */
export function setTargetProgress(
  value: number,
  options?: { snapRendered?: boolean; direction?: TransitionDirection },
): void {
  const next = clamp(value, 0, 1);
  const prev = transitionRuntime.targetProgress;
  transitionRuntime.targetProgress = next;
  transitionRuntime.direction =
    options?.direction ??
    (next > prev ? "to-sky" : next < prev ? "to-portfolio" : transitionRuntime.direction);

  if (options?.snapRendered) {
    transitionRuntime.renderedProgress = next;
    commitRenderedProgress(next);
  }
}

export function commitRenderedProgress(progress: number): void {
  const clamped = clamp(progress, 0, 1);
  transitionRuntime.renderedProgress = clamped;
  transitionRuntime.visual = deriveTransitionVisual(clamped, {
    reduceMotion: transitionRuntime.reduceMotion,
    isMobile: transitionRuntime.isMobile,
  });
  notifyTransitionVisualListeners();
  emitLogicalIfChanged();
}

/**
 * Advance rendered progress toward target. Call once per animation frame.
 * Returns true while still settling.
 */
export function tickTransitionProgress(deltaSeconds: number): boolean {
  const rate = transitionRuntime.reduceMotion
    ? TRANSITION_CONFIG.reducedMotionSmoothing
    : TRANSITION_CONFIG.progressSmoothing;

  const target = transitionRuntime.targetProgress;
  let rendered = transitionRuntime.renderedProgress;
  const alpha = 1 - Math.exp(-rate * Math.max(deltaSeconds, 0));
  rendered = rendered + (target - rendered) * alpha;

  if (near(rendered, target, TRANSITION_CONFIG.endpointEpsilon * 0.5)) {
    rendered = target;
  }

  // Snap exact endpoints so mode never sticks at 0.999999
  if (near(rendered, 0, TRANSITION_CONFIG.endpointEpsilon)) {
    rendered = 0;
  } else if (near(rendered, 1, TRANSITION_CONFIG.endpointEpsilon)) {
    rendered = 1;
  }

  commitRenderedProgress(rendered);
  return rendered !== target;
}

export function normalizeWheelDelta(event: WheelEvent): number {
  let delta = event.deltaY;
  if (event.deltaMode === 1) {
    delta *= 16;
  } else if (event.deltaMode === 2) {
    delta *= window.innerHeight;
  }

  const mobileScale = transitionRuntime.isMobile
    ? TRANSITION_CONFIG.mobile.wheelSensitivityScale
    : 1;
  let step = delta * TRANSITION_CONFIG.wheelSensitivity * mobileScale;
  step = clamp(
    step,
    -TRANSITION_CONFIG.wheelMaxStep,
    TRANSITION_CONFIG.wheelMaxStep,
  );
  return step;
}

export function normalizeTouchDelta(deltaYPx: number): number {
  const mobileScale = transitionRuntime.isMobile
    ? TRANSITION_CONFIG.mobile.touchSensitivityScale
    : 1;
  return (
    deltaYPx * TRANSITION_CONFIG.touchSensitivity * mobileScale
  );
}
