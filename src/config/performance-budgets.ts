/**
 * Explicit performance budgets for the portfolio + astronomy experience.
 *
 * Thresholds are intentionally strict enough to catch accidental regressions
 * (shipping masters, bundling Three.js into the first paint, oversized thumbs)
 * while remaining realistic for a visual personal site.
 *
 * Measured against production builds / network transfer where noted.
 * Soft guidance for authors; hard ceilings for asset validation live in
 * `astrophotography-assets.ts`.
 */

export const PERFORMANCE_BUDGETS = {
  /**
   * Initial JS transferred before the astronomy experience is opened.
   * Excludes the dynamically imported sky / Three.js chunk.
   */
  initialJsBeforeSkyKb: 280,

  /** Dynamically loaded astronomy + Three.js related JS (gzipped estimate). */
  astronomyJsChunkKb: 450,

  /** Critical above-the-fold image payload on first portfolio paint. */
  initialImagePayloadKb: 120,

  /** Typical capture thumbnail (soft target; hard max in asset policy). */
  thumbnailKb: 80,

  /** Standard panel / sheet preview. */
  previewKb: 450,

  /** Optional full-screen higher-quality preview. */
  previewHqKb: 1200,

  /** Rough ceiling for critical requests before first interaction. */
  criticalRequestCount: 18,

  /** Cap for Three.js renderer DPR even on high-density displays. */
  maxRendererDpr: 2,

  /** Soft FPS floor that may trigger a quality step-down in auto mode. */
  adaptiveQualityFpsFloor: 28,
} as const;

export type PerformanceBudgetKey = keyof typeof PERFORMANCE_BUDGETS;
