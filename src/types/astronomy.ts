/**
 * Celestial coordinate conventions
 *
 * - Right ascension (`rightAscensionHours`): hours in [0, 24).
 *   Convert to degrees with hours * 15.
 * - Declination (`declinationDegrees`): degrees in [-90, 90].
 *
 * Both refer to the ICRS / J2000 equatorial frame unless noted otherwise.
 *
 * The interactive sky engine maps these static catalog coordinates onto a
 * celestial sphere and does not yet apply precession, nutation, observer
 * location, sidereal time, or refraction. See docs/sky-engine.md.
 */

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

/**
 * Navigable / catalog celestial object classification.
 * Prefer specific cluster/nebula subtypes when known.
 */
export type CelestialObjectType =
  | "star"
  | "galaxy"
  | "nebula"
  | "planetary-nebula"
  | "open-cluster"
  | "globular-cluster"
  | "supernova-remnant"
  | "cluster"
  | "planet"
  | "moon"
  | "other";

/**
 * Astronomical source of truth for deep-sky (and related) objects.
 * Captures should reference these via stable `id` (`targetObjectId`).
 */
export interface CelestialObject {
  id: string;
  commonName: string;
  catalogIds: CatalogIdentifier[];
  objectType: CelestialObjectType;
  coordinates: EquatorialCoordinates;
  /** Coordinate epoch for `coordinates` (engine assumes J2000). */
  coordinateEpoch?: "J2000";
  constellation?: string;
  /** Distance in light-years, when known. */
  distanceLy?: number;
  /** Apparent magnitude, when known. */
  magnitude?: number;
  /** Approximate angular size in arcminutes. */
  angularSizeArcmin?: number;
  description?: string;
}

/**
 * Renderable star catalog record. Distinct from navigable deep-sky objects.
 */
export interface StarRecord {
  id: string;
  coordinates: EquatorialCoordinates;
  /** Apparent visual magnitude (smaller = brighter). */
  magnitude: number;
  /**
   * Optional B−V color index for modest tinting.
   * Typical range roughly −0.4 (blue) to +1.7 (red).
   */
  colorIndex?: number;
  /** Optional Bayer / common name for debugging. */
  name?: string;
  /** Marks procedural density fillers vs curated catalog stars. */
  source: "catalog" | "synthetic";
}

/** Coordinate epoch used by bundled catalogs. */
export const CATALOG_COORDINATE_EPOCH = "J2000" as const;
