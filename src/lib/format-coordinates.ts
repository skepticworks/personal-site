import type { EquatorialCoordinates } from "@/types/astronomy";
import {
  formatDeclination,
  formatRightAscension,
} from "@/features/astronomy/formatting/astronomyFormatting";

/**
 * Compact equatorial readout for debug / legacy HUD consumers.
 * Prefer `formatRightAscension` / `formatDeclination` in the object panel.
 */
export function formatEquatorialCoordinates(
  coordinates: EquatorialCoordinates,
): string {
  return `RA ${formatRightAscension(coordinates.rightAscensionHours)}, Dec ${formatDeclination(coordinates.declinationDegrees)}`;
}
