/**
 * Celestial coordinate conventions
 *
 * - Right ascension (`rightAscensionHours`): hours in [0, 24).
 *   Convert to degrees with hours * 15.
 * - Declination (`declinationDegrees`): degrees in [-90, 90].
 *
 * Both refer to the ICRS / J2000 equatorial frame unless noted otherwise.
 */

export type CelestialObjectType =
  | "star"
  | "galaxy"
  | "nebula"
  | "cluster"
  | "planet"
  | "moon"
  | "other";

/** Catalog designations such as Messier, NGC, IC, HD, etc. */
export interface CatalogIdentifier {
  catalog: string;
  id: string;
}

export interface EquatorialCoordinates {
  /** Right ascension in hours [0, 24). */
  rightAscensionHours: number;
  /** Declination in degrees [-90, 90]. */
  declinationDegrees: number;
}

export interface CelestialObject {
  id: string;
  commonName: string;
  catalogIds: CatalogIdentifier[];
  objectType: CelestialObjectType;
  coordinates: EquatorialCoordinates;
  constellation?: string;
  /** Distance in light-years, when known. */
  distanceLy?: number;
  /** Apparent magnitude, when known. */
  magnitude?: number;
}
