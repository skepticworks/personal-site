/**
 * Shared motion durations and easings for DOM + experience transitions.
 * Prefer these over ad-hoc millisecond values in components/CSS.
 *
 * CSS mirrors the same values as custom properties in `desktop.css`
 * (`--motion-*`). Keep both in sync when tuning.
 */

export const MOTION = {
  /** Instant feedback (hover press, focus flash). */
  instantMs: 80,
  /** Short UI micro-interactions (buttons, chips, icon tiles). */
  fastMs: 140,
  /** Default panel / window / sheet state changes. */
  normalMs: 180,
  /** Deliberate spatial moves (desktop↔sky settle, image viewer). */
  deliberateMs: 260,
  /** Rare longer reveals — avoid for routine interactions. */
  slowMs: 360,

  easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeInOut: "cubic-bezier(0.45, 0, 0.55, 1)",
  easeStandard: "ease-out",

  /** Selection pulse period when motion is allowed (sky waypoint). */
  selectionPulseMs: 2200,
} as const;

export type MotionToken = typeof MOTION;
