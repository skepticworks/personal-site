/**
 * Sky render quality tiers — one architecture, tunable parameters.
 */

export type SkyRenderQuality = "low" | "medium" | "high";

export type SkyRenderQualityPreference = SkyRenderQuality | "auto";

export interface SkyQualitySettings {
  quality: SkyRenderQuality;
  /** Clamped device pixel ratio. */
  dpr: number;
  starCount: number;
  antialias: boolean;
  maxOrdinaryLabels: number;
  showDevGrid: boolean;
}

const QUALITY_STAR_COUNTS: Record<SkyRenderQuality, number> = {
  low: 500,
  medium: 1400,
  high: 2800,
};

const QUALITY_DPR_CAPS: Record<SkyRenderQuality, number> = {
  low: 1,
  medium: 1.5,
  high: 2,
};

const QUALITY_LABEL_CAPS: Record<SkyRenderQuality, number> = {
  low: 2,
  medium: 4,
  high: 5,
};

export function clampDprForQuality(
  devicePixelRatio: number,
  quality: SkyRenderQuality,
): number {
  const cap = QUALITY_DPR_CAPS[quality];
  const dpr = Number.isFinite(devicePixelRatio) ? devicePixelRatio : 1;
  return Math.min(Math.max(1, dpr), cap);
}

export function getStarCountForQuality(quality: SkyRenderQuality): number {
  return QUALITY_STAR_COUNTS[quality];
}

/**
 * Conservative auto quality from coarse environment signals.
 * Not a GPU benchmark — prefers stability on phones / high-DPR laptops.
 */
export function selectAutoSkyQuality(signals: {
  width: number;
  height: number;
  devicePixelRatio: number;
  hardwareConcurrency?: number;
  maxTouchPoints?: number;
  pointerCoarse?: boolean;
}): SkyRenderQuality {
  const {
    width,
    height,
    devicePixelRatio,
    hardwareConcurrency = 4,
    maxTouchPoints = 0,
    pointerCoarse = false,
  } = signals;

  const pixels = width * height * Math.min(devicePixelRatio, 2);
  const mobileLike =
    pointerCoarse ||
    maxTouchPoints > 1 ||
    Math.min(width, height) < 768 ||
    devicePixelRatio >= 2.5;

  if (mobileLike || pixels > 3_500_000 || hardwareConcurrency <= 4) {
    if (pixels > 2_200_000 || devicePixelRatio >= 3) {
      return "low";
    }
    return "medium";
  }

  if (hardwareConcurrency >= 8 && pixels < 3_000_000) {
    return "high";
  }

  return "medium";
}

export function resolveSkyQualitySettings(
  preference: SkyRenderQualityPreference,
  signals: {
    width: number;
    height: number;
    devicePixelRatio: number;
    hardwareConcurrency?: number;
    maxTouchPoints?: number;
    pointerCoarse?: boolean;
  },
  options?: { allowDevGrid?: boolean },
): SkyQualitySettings {
  const quality =
    preference === "auto" ? selectAutoSkyQuality(signals) : preference;

  return {
    quality,
    dpr: clampDprForQuality(signals.devicePixelRatio, quality),
    starCount: getStarCountForQuality(quality),
    antialias: quality !== "low",
    maxOrdinaryLabels: QUALITY_LABEL_CAPS[quality],
    showDevGrid: Boolean(options?.allowDevGrid) && quality !== "low",
  };
}
