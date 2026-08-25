import type { EquatorialCoordinates } from "@/types/astronomy";

/** Degrees of right ascension per hour of RA. */
export const RA_DEGREES_PER_HOUR = 15;

/** Full circle in hours of right ascension. */
export const RA_HOURS_PER_CIRCLE = 24;

/**
 * Normalize right ascension into the half-open interval [0, 24).
 * Negative and ≥24 values wrap correctly (including large magnitudes).
 */
export function normalizeRightAscensionHours(hours: number): number {
  if (!Number.isFinite(hours)) {
    throw new RangeError("rightAscensionHours must be a finite number");
  }
  const wrapped = ((hours % RA_HOURS_PER_CIRCLE) + RA_HOURS_PER_CIRCLE) %
    RA_HOURS_PER_CIRCLE;
  // Avoid returning -0 from IEEE remainder edge cases
  return wrapped === 0 ? 0 : wrapped;
}

/**
 * Validate declination is finite and within [-90, 90] degrees.
 */
export function assertValidDeclinationDegrees(degrees: number): void {
  if (!Number.isFinite(degrees)) {
    throw new RangeError("declinationDegrees must be a finite number");
  }
  if (degrees < -90 || degrees > 90) {
    throw new RangeError(
      `declinationDegrees must be in [-90, 90], received ${degrees}`,
    );
  }
}

/**
 * Validate and normalize equatorial coordinates to the canonical internal form:
 * RA hours in [0, 24), Dec degrees in [-90, 90].
 */
export function normalizeEquatorialCoordinates(
  coordinates: EquatorialCoordinates,
): EquatorialCoordinates {
  assertValidDeclinationDegrees(coordinates.declinationDegrees);
  return {
    rightAscensionHours: normalizeRightAscensionHours(
      coordinates.rightAscensionHours,
    ),
    declinationDegrees: coordinates.declinationDegrees,
  };
}

/** Convert RA hours to degrees [0, 360). */
export function rightAscensionHoursToDegrees(hours: number): number {
  return normalizeRightAscensionHours(hours) * RA_DEGREES_PER_HOUR;
}

/** Convert RA degrees to hours [0, 24). */
export function rightAscensionDegreesToHours(degrees: number): number {
  if (!Number.isFinite(degrees)) {
    throw new RangeError("RA degrees must be a finite number");
  }
  return normalizeRightAscensionHours(degrees / RA_DEGREES_PER_HOUR);
}

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function hoursToRadians(hours: number): number {
  return degreesToRadians(rightAscensionHoursToDegrees(hours));
}
