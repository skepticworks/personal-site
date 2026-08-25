import { SKY_NAVIGATION } from "@/config/sky-navigation";
import { applySkyFov, skyRuntime } from "@/state/sky-runtime";

/**
 * Sky wheel ownership vs desktop transition.
 *
 * Policy:
 * - Wheel always adjusts FOV when the zoom can still move.
 * - Scroll down → wider FOV (zoom out); scroll up → narrower FOV (zoom in).
 * - Return-to-desktop via wheel is intentional overscroll only:
 *   FOV must already be at max, the user must keep scrolling in the zoom-out
 *   direction (down), after a brief settle, past an accumulated threshold.
 * - Zooming back in from max FOV is never treated as an exit.
 * - Keyboard / "Return to desktop" always works regardless of FOV.
 */

export type SkyWheelResult = "zoom" | "exit-to-portfolio" | "none";

/** Extra zoom-out delta (normalized px) required at max FOV before exiting. */
export const SKY_EXIT_OVERSCROLL_THRESHOLD = 140;

/** Ignore exit attempts for this long after first hitting max FOV. */
export const SKY_EXIT_EDGE_SETTLE_MS = 320;

interface SkyWheelExitState {
  /** Accumulated zoom-out overscroll while pinned at max FOV. */
  overscroll: number;
  /** Timestamp when FOV last arrived at / was confirmed at max. */
  maxEdgeSinceMs: number | null;
}

const exitState: SkyWheelExitState = {
  overscroll: 0,
  maxEdgeSinceMs: null,
};

/** Test helper — clears intentional-exit accumulators. */
export function resetSkyWheelExitState(): void {
  exitState.overscroll = 0;
  exitState.maxEdgeSinceMs = null;
}

export function handleSkyWheelDelta(
  rawDeltaY: number,
  nowMs: number = typeof performance !== "undefined" ? performance.now() : 0,
): SkyWheelResult {
  if (!Number.isFinite(rawDeltaY) || rawDeltaY === 0) {
    return "none";
  }

  const fov = skyRuntime.fov;
  const proposed = fov + rawDeltaY * SKY_NAVIGATION.zoomSensitivity;
  const next = Math.min(
    SKY_NAVIGATION.maxFov,
    Math.max(SKY_NAVIGATION.minFov, proposed),
  );

  // Prefer real zoom whenever FOV can still move (fixes zoom-in-from-max).
  if (Math.abs(next - fov) > 1e-4) {
    applySkyFov(next);
    exitState.overscroll = 0;
    if (next >= SKY_NAVIGATION.maxFov - 1e-3) {
      exitState.maxEdgeSinceMs = nowMs;
    } else {
      exitState.maxEdgeSinceMs = null;
    }
    return "zoom";
  }

  const atMax = fov >= SKY_NAVIGATION.maxFov - 1e-3;
  const atMin = fov <= SKY_NAVIGATION.minFov + 1e-3;

  // Pinned at max and still pushing zoom-out → intentional exit overscroll.
  if (atMax && rawDeltaY > 0) {
    if (exitState.maxEdgeSinceMs == null) {
      exitState.maxEdgeSinceMs = nowMs;
    }
    const settled =
      nowMs - exitState.maxEdgeSinceMs >= SKY_EXIT_EDGE_SETTLE_MS;
    if (!settled) {
      return "none";
    }
    exitState.overscroll += rawDeltaY;
    if (exitState.overscroll >= SKY_EXIT_OVERSCROLL_THRESHOLD) {
      exitState.overscroll = 0;
      exitState.maxEdgeSinceMs = null;
      return "exit-to-portfolio";
    }
    return "none";
  }

  // Pinned at min and pushing further zoom-in — nowhere to go.
  if (atMin && rawDeltaY < 0) {
    return "none";
  }

  // Any other pinned-edge input (including scroll-up at max) clears exit intent.
  exitState.overscroll = 0;
  return "none";
}

/** Normalize wheel deltaY similarly to transition (pixel-ish). */
export function normalizeSkyWheelDeltaY(event: WheelEvent): number {
  let delta = event.deltaY;
  if (event.deltaMode === 1) {
    delta *= 16;
  } else if (event.deltaMode === 2) {
    delta *= typeof window !== "undefined" ? window.innerHeight : 800;
  }
  return delta;
}
