/**
 * Celestial ↔ Three.js orientation conventions
 * ============================================
 *
 * Epoch: catalog coordinates are J2000 / ICRS. This engine maps static catalog
 * positions and does **not** apply precession, nutation, observer location,
 * sidereal time, or atmospheric refraction.
 *
 * Camera: sits at the world origin and looks outward at a large virtual sphere.
 * Objects are placed on that sphere (or represented as unit direction vectors).
 *
 * World axes (Three.js Y-up, right-handed):
 *   - Celestial north pole (Dec = +90°) → +Y
 *   - Celestial south pole (Dec = −90°) → −Y
 *   - RA = 0h, Dec = 0° → +Z
 *   - Increasing RA travels toward +X (eastward; counterclockwise about +Y
 *     when viewed from above the north pole)
 *
 * Unit direction from equatorial (RA hours, Dec degrees):
 *   ra  = RA in radians
 *   dec = Dec in radians
 *   x = cos(dec) * sin(ra)
 *   y = sin(dec)
 *   z = cos(dec) * cos(ra)
 *
 * Multiply by `radius` for sphere surface positions. Do not scatter alternate
 * transforms in components — always use these helpers.
 */

import type { EquatorialCoordinates } from "@/types/astronomy";

import {
  degreesToRadians,
  hoursToRadians,
  normalizeEquatorialCoordinates,
} from "./equatorial";

/** Plain XYZ triple — astronomy math stays Three.js-free. */
export interface Cartesian3 {
  x: number;
  y: number;
  z: number;
}

/**
 * Convert equatorial coordinates to a Cartesian direction or sphere position.
 *
 * @param coordinates - RA hours / Dec degrees (normalized on entry)
 * @param radius - Sphere radius; use `1` for a unit direction vector
 */
export function equatorialToCartesian(
  coordinates: EquatorialCoordinates,
  radius = 1,
): Cartesian3 {
  if (!Number.isFinite(radius) || radius <= 0) {
    throw new RangeError("radius must be a positive finite number");
  }

  const normalized = normalizeEquatorialCoordinates(coordinates);
  const ra = hoursToRadians(normalized.rightAscensionHours);
  const dec = degreesToRadians(normalized.declinationDegrees);
  const cosDec = Math.cos(dec);

  return {
    x: radius * cosDec * Math.sin(ra),
    y: radius * Math.sin(dec),
    z: radius * cosDec * Math.cos(ra),
  };
}

/** Unit direction vector for the given equatorial coordinates. */
export function equatorialToDirection(
  coordinates: EquatorialCoordinates,
): Cartesian3 {
  return equatorialToCartesian(coordinates, 1);
}

/**
 * Inverse of `equatorialToCartesian` for a non-zero direction vector.
 * Useful for debugging camera look direction → RA/Dec.
 */
export function cartesianToEquatorial(
  position: Cartesian3,
): EquatorialCoordinates {
  const { x, y, z } = position;
  const length = Math.hypot(x, y, z);
  if (!Number.isFinite(length) || length < 1e-12) {
    throw new RangeError("position must be a non-zero finite vector");
  }

  const nx = x / length;
  const ny = y / length;
  const nz = z / length;

  const decRad = Math.asin(Math.min(1, Math.max(-1, ny)));
  let raRad = Math.atan2(nx, nz);
  if (raRad < 0) {
    raRad += Math.PI * 2;
  }

  return {
    rightAscensionHours: (raRad * 12) / Math.PI,
    declinationDegrees: (decRad * 180) / Math.PI,
  };
}

export function length3(v: Cartesian3): number {
  return Math.hypot(v.x, v.y, v.z);
}

export function normalize3(v: Cartesian3): Cartesian3 {
  const len = length3(v);
  if (len < 1e-12) {
    throw new RangeError("cannot normalize a near-zero vector");
  }
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

export function dot3(a: Cartesian3, b: Cartesian3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function scale3(v: Cartesian3, scale: number): Cartesian3 {
  return { x: v.x * scale, y: v.y * scale, z: v.z * scale };
}
