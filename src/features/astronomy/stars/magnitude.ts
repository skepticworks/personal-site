/**
 * Apparent magnitude → star point rendering.
 * Visually reasonable, not physically perfect.
 */

const MIN_SIZE = 0.28;
const MAX_SIZE = 2.4;
const MIN_INTENSITY = 0.18;
const MAX_INTENSITY = 1;

/** Clamp magnitude into a displayable range. */
export function clampMagnitude(magnitude: number): number {
  if (!Number.isFinite(magnitude)) {
    return 6;
  }
  return Math.min(8, Math.max(-1.5, magnitude));
}

/**
 * Brighter (smaller magnitude) → larger point size.
 */
export function magnitudeToPointSize(magnitude: number): number {
  const m = clampMagnitude(magnitude);
  // Mag -1.5 → max, mag 8 → min (linear in magnitude space)
  const t = (8 - m) / (8 - -1.5);
  return MIN_SIZE + t * (MAX_SIZE - MIN_SIZE);
}

/**
 * Brighter → higher opacity / intensity multiplier [0, 1].
 */
export function magnitudeToIntensity(magnitude: number): number {
  const m = clampMagnitude(magnitude);
  const t = (8 - m) / (8 - -1.5);
  return MIN_INTENSITY + t * (MAX_INTENSITY - MIN_INTENSITY);
}

/**
 * Approximate B−V → RGB (muted; avoid neon saturation).
 */
export function colorIndexToRgb(colorIndex: number | undefined): {
  r: number;
  g: number;
  b: number;
} {
  const bv = Number.isFinite(colorIndex)
    ? Math.min(1.7, Math.max(-0.4, colorIndex as number))
    : 0.55;

  // Piecewise soft mapping toward white-blue / white / warm
  if (bv < 0) {
    const t = (bv + 0.4) / 0.4;
    return {
      r: 0.72 + t * 0.18,
      g: 0.8 + t * 0.12,
      b: 1,
    };
  }
  if (bv < 0.5) {
    const t = bv / 0.5;
    return {
      r: 0.9 + t * 0.08,
      g: 0.92 + t * 0.04,
      b: 1 - t * 0.08,
    };
  }
  if (bv < 1.0) {
    const t = (bv - 0.5) / 0.5;
    return {
      r: 1,
      g: 0.96 - t * 0.12,
      b: 0.92 - t * 0.28,
    };
  }
  const t = (bv - 1.0) / 0.7;
  return {
    r: 1,
    g: 0.84 - t * 0.18,
    b: 0.64 - t * 0.22,
  };
}
