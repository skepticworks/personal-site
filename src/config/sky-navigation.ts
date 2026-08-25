/**
 * Centralized sky navigation / rendering tuning.
 * Keep magic numbers out of R3F components.
 */

export const SKY_NAVIGATION = {
  /** Virtual celestial sphere radius (camera at origin). */
  celestialSphereRadius: 80,

  /** Default / entry FOV when sky navigation takes ownership (degrees). */
  defaultFov: 68,
  minFov: 18,
  maxFov: 90,

  /** Pointer drag → radians per CSS pixel. */
  dragSensitivity: 0.0024,
  /** Touch drag multiplier relative to dragSensitivity. */
  touchDragSensitivityScale: 1.15,

  /** Wheel → FOV degrees (after delta normalization). */
  zoomSensitivity: 0.045,
  /** Pinch → FOV degrees per pixel of distance change. */
  pinchZoomSensitivity: 0.08,

  /** Movement threshold before a pointer gesture counts as drag (not tap). */
  pointerDragThresholdPx: 6,

  /** Raycast / hit radius for waypoints (world units on the sphere). */
  waypointHitRadius: 1.35,
  /** Larger hit radius on coarse pointers. */
  waypointHitRadiusTouch: 2.1,

  /** Screen-space-ish waypoint base scale (world units). */
  waypointBaseScale: 0.85,
  waypointHoverScale: 1.15,
  waypointSelectedScale: 1.25,

  /** Targeting: exponential-ish slerp rate (higher = snappier). */
  targetingSlerpRate: 4.2,
  /** Reduced-motion: near-immediate settle. */
  targetingSlerpRateReducedMotion: 28,
  /** Stop targeting when within this angular distance (radians). */
  targetingCompleteRadians: 0.012,

  /** Optional FOV used while focused on a target. */
  targetingFov: 48,

  /**
   * Labels: show ordinary labels within this angle of view center (degrees).
   * Narrower FOV → effective cone feels tighter via FOV scaling in policy.
   */
  labelCenterConeDegrees: 28,
  /** Max ordinary (non selected/hover) labels on screen. */
  maxOrdinaryLabels: 4,
  /** Max ordinary labels on low quality / mobile. */
  maxOrdinaryLabelsLow: 2,

  /** Cursor styles */
  cursorGrab: "grab",
  cursorGrabbing: "grabbing",
  cursorPointer: "pointer",
} as const;

export type SkyCameraMode = "free" | "targeting" | "focused";
