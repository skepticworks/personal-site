/**
 * Centralized desktop ↔ sky transition tuning.
 *
 * Visual properties derive from a single normalized progress `[0, 1]`:
 *   0 = fully in portfolio (desktop)
 *   1 = fully in sky
 *
 * Thresholds below are intentionally documented so astronomy milestones can
 * retune without hunting through components.
 */

export interface TransitionConfig {
  /** Wheel → progress scale (after delta normalization). */
  wheelSensitivity: number;
  /** Max progress change from a single wheel event. */
  wheelMaxStep: number;
  /** Touch / pointer vertical swipe → progress scale (per CSS pixel). */
  touchSensitivity: number;
  /** Minimum vertical movement before a touch counts as a transition gesture. */
  touchGestureThresholdPx: number;
  /** Reduced-motion: progress delta to flip between endpoints. */
  reducedMotionToggleThreshold: number;
  /** Exponential smoothing rate toward targetProgress (higher = snappier). */
  progressSmoothing: number;
  /** Reduced-motion smoothing (faster settle, less cinematic lag). */
  reducedMotionSmoothing: number;
  /** Endpoint snap epsilon for mode / ownership decisions. */
  endpointEpsilon: number;
  /** Desktop interaction allowed at or below this progress. */
  desktopInteractMax: number;
  /** Sky interaction allowed at or above this progress. */
  skyInteractMin: number;
  /** Camera pitch (radians): desktop-facing → sky-facing. */
  cameraStartPitch: number;
  cameraEndPitch: number;
  cameraStartYaw: number;
  cameraEndYaw: number;
  cameraStartFov: number;
  cameraEndFov: number;
  cameraStartY: number;
  cameraEndY: number;
  /** Desktop exit CSS transform extents. */
  desktopExitRotateXDeg: number;
  desktopExitTranslateYPx: number;
  desktopExitScale: number;
  desktopPerspectivePx: number;
  /** Progress windows for visual phases (illustrative, tuned for feel). */
  phases: {
    desktopStableEnd: number;
    desktopExitStart: number;
    desktopExitEnd: number;
    cameraPanStart: number;
    cameraPanEnd: number;
    starsStart: number;
    starsEnd: number;
    skySettleStart: number;
  };
  /** Mobile sensitivity multipliers. */
  mobile: {
    wheelSensitivityScale: number;
    touchSensitivityScale: number;
    desktopExitRotateXDeg: number;
  };
}

export const TRANSITION_CONFIG: TransitionConfig = {
  wheelSensitivity: 0.00135,
  wheelMaxStep: 0.085,
  touchSensitivity: 0.0011,
  touchGestureThresholdPx: 18,
  reducedMotionToggleThreshold: 0.12,
  progressSmoothing: 14,
  reducedMotionSmoothing: 22,
  endpointEpsilon: 0.002,
  desktopInteractMax: 0.002,
  skyInteractMin: 0.998,
  cameraStartPitch: -0.08,
  cameraEndPitch: 1.12,
  cameraStartYaw: 0,
  cameraEndYaw: 0.05,
  cameraStartFov: 58,
  cameraEndFov: 68,
  cameraStartY: 0,
  cameraEndY: 0.35,
  desktopExitRotateXDeg: -62,
  desktopExitTranslateYPx: 120,
  desktopExitScale: 0.9,
  desktopPerspectivePx: 1400,
  phases: {
    desktopStableEnd: 0.1,
    desktopExitStart: 0.08,
    desktopExitEnd: 0.62,
    cameraPanStart: 0.12,
    cameraPanEnd: 0.82,
    starsStart: 0.22,
    starsEnd: 0.95,
    skySettleStart: 0.78,
  },
  mobile: {
    wheelSensitivityScale: 1.15,
    touchSensitivityScale: 1.25,
    desktopExitRotateXDeg: -58,
  },
};

export { MOBILE_MEDIA_QUERY } from "@/config/breakpoints";
