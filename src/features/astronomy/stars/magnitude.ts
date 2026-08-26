/**
 * Apparent magnitude → star point rendering.
 *
 * Uses a soft power-law so bright stars stand out without huge sprites or
 * exaggerated bloom. Color from B−V stays deliberately muted.
 */

const MIN_SIZE = 1.05;
const MAX_SIZE = 3.85;
const MIN_INTENSITY = 0.16;
const MAX_INTENSITY = 1;

/** Clamp magnitude into a displayable range. */
export function clampMagnitude(magnitude: number): number {
  if (!Number.isFinite(magnitude)) {
    return 6;
  }
  return Math.min(8, Math.max(-1.5, magnitude));
}

/**
 * Normalized brightness weight in [0, 1] from apparent magnitude.
 * Power curve approximates flux perception better than a linear mag ramp.
 */
export function magnitudeToBrightness(magnitude: number): number {
  const m = clampMagnitude(magnitude);
  const linear = (8 - m) / (8 - -1.5);
  // γ ≈ 1.65 emphasizes bright stars without crushing faint field stars.
  return Math.pow(Math.min(1, Math.max(0, linear)), 1.65);
}

/**
 * Brighter (smaller magnitude) → larger point size (capped for DPR/perf).
 */
export function magnitudeToPointSize(magnitude: number): number {
  const t = magnitudeToBrightness(magnitude);
  return MIN_SIZE + t * (MAX_SIZE - MIN_SIZE);
}

/**
 * Brighter → higher opacity / intensity multiplier [0, 1].
 */
export function magnitudeToIntensity(magnitude: number): number {
  const t = magnitudeToBrightness(magnitude);
  return MIN_INTENSITY + t * (MAX_INTENSITY - MIN_INTENSITY);
}

/**
 * Approximate B−V → RGB (muted; avoid neon saturation).
 * Most stars stay near white with only a soft cool/warm bias.
 */
export function colorIndexToRgb(colorIndex: number | undefined): {
  r: number;
  g: number;
  b: number;
} {
  const bv = Number.isFinite(colorIndex)
    ? Math.min(1.7, Math.max(-0.4, colorIndex as number))
    : 0.55;

  // Desaturate toward white so tint remains subtle on real displays.
  const mute = (c: { r: number; g: number; b: number }) => ({
    r: 0.78 + c.r * 0.22,
    g: 0.78 + c.g * 0.22,
    b: 0.78 + c.b * 0.22,
  });

  if (bv < 0) {
    const t = (bv + 0.4) / 0.4;
    return mute({
      r: 0.55 + t * 0.25,
      g: 0.7 + t * 0.18,
      b: 1,
    });
  }
  if (bv < 0.5) {
    const t = bv / 0.5;
    return mute({
      r: 0.82 + t * 0.12,
      g: 0.88 + t * 0.08,
      b: 1 - t * 0.06,
    });
  }
  if (bv < 1.0) {
    const t = (bv - 0.5) / 0.5;
    return mute({
      r: 1,
      g: 0.94 - t * 0.1,
      b: 0.88 - t * 0.22,
    });
  }
  const t = (bv - 1.0) / 0.7;
  return mute({
    r: 1,
    g: 0.84 - t * 0.16,
    b: 0.66 - t * 0.2,
  });
}
