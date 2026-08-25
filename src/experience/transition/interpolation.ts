/** Clamp a number into `[min, max]`. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Hermite smoothstep from `edge0` → `edge1`.
 * Returns 0 below edge0, 1 above edge1, and a smooth S-curve between.
 */
export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge0 === edge1) {
    return x < edge0 ? 0 : 1;
  }
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Map progress through a smoothstep window then lerp endpoints. */
export function remapSmooth(
  progress: number,
  start: number,
  end: number,
  from: number,
  to: number,
): number {
  return lerp(from, to, smoothstep(start, end, progress));
}

/** True when `value` is within `epsilon` of `target`. */
export function near(value: number, target: number, epsilon = 1e-4): boolean {
  return Math.abs(value - target) <= epsilon;
}
