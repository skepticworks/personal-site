import { SKY_NAVIGATION } from "@/config/sky-navigation";
import { applySkyFov, skyRuntime } from "@/state/sky-runtime";

/**
 * Sky wheel ownership vs desktop transition.
 *
 * Policy:
 * - In sky mode, wheel zooms FOV first (scroll down → wider, scroll up → narrower).
 * - Return-to-desktop via wheel only when FOV is already at max (fully zoomed out)
 *   and the user continues scrolling toward the portfolio (deltaY < 0).
 * - Keyboard / "Return to desktop" always works regardless of FOV.
 */
export type SkyWheelResult = "zoom" | "exit-to-portfolio" | "none";

export function handleSkyWheelDelta(rawDeltaY: number): SkyWheelResult {
  if (!Number.isFinite(rawDeltaY) || rawDeltaY === 0) {
    return "none";
  }

  const atMax = skyRuntime.fov >= SKY_NAVIGATION.maxFov - 1e-3;

  // Scroll toward portfolio while fully zoomed out → exit
  if (rawDeltaY < 0 && atMax) {
    return "exit-to-portfolio";
  }

  const nextFov = skyRuntime.fov + rawDeltaY * SKY_NAVIGATION.zoomSensitivity;
  applySkyFov(nextFov);
  return "zoom";
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
