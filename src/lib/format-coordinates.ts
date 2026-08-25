import type { EquatorialCoordinates } from "@/types/astronomy";

/** Format equatorial coordinates for DOM display. */
export function formatEquatorialCoordinates(
  coordinates: EquatorialCoordinates,
  fractionDigits = 3,
): string {
  const ra = coordinates.rightAscensionHours.toFixed(fractionDigits);
  const dec = coordinates.declinationDegrees.toFixed(fractionDigits);
  return `RA ${ra} h, Dec ${dec}°`;
}
