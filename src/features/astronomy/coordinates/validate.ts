import type { EquatorialCoordinates } from "@/types/astronomy";

/**
 * Reject non-finite / out-of-range coordinates so NaN never reaches the camera
 * or sphere placement.
 */
export function isValidEquatorialCoordinates(
  coordinates: EquatorialCoordinates | null | undefined,
): coordinates is EquatorialCoordinates {
  if (!coordinates) {
    return false;
  }
  const { rightAscensionHours: ra, declinationDegrees: dec } = coordinates;
  return (
    Number.isFinite(ra) &&
    Number.isFinite(dec) &&
    ra >= 0 &&
    ra < 24 &&
    dec >= -90 &&
    dec <= 90
  );
}
