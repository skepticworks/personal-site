import type { EquatorialCoordinates } from "@/types/astronomy";

import {
  type Cartesian3,
  dot3,
  equatorialToDirection,
  normalize3,
} from "./conversions";
import { radiansToDegrees } from "./equatorial";

/**
 * Angular separation between two unit (or non-zero) direction vectors, radians.
 */
export function angularSeparationRadians(
  a: Cartesian3,
  b: Cartesian3,
): number {
  const na = normalize3(a);
  const nb = normalize3(b);
  const cosAngle = Math.min(1, Math.max(-1, dot3(na, nb)));
  return Math.acos(cosAngle);
}

/** Angular separation in degrees. */
export function angularSeparationDegrees(
  a: Cartesian3,
  b: Cartesian3,
): number {
  return radiansToDegrees(angularSeparationRadians(a, b));
}

/** Angular separation between two equatorial positions, degrees. */
export function equatorialAngularSeparationDegrees(
  a: EquatorialCoordinates,
  b: EquatorialCoordinates,
): number {
  return angularSeparationDegrees(
    equatorialToDirection(a),
    equatorialToDirection(b),
  );
}
