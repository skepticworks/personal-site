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
  /** Catalog designation within `catalog` (e.g. `"31"` for M31). */
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
 * Third-party / public reference imagery for objects without a personal capture.
 * Personal photography lives on `AstrophotographyCapture`, not here.
 */
export interface DeepSkyReferenceImage {
  src: string;
  alt: string;
  credit?: string;
  sourceName?: string;
  sourceUrl?: string;
  width?: number;
  height?: number;
}

/**
 * Astronomical source of truth for deep-sky (and related) objects.
 * Captures should reference these via stable `id` (`targetObjectId`).
 *
 * Display, search, waypoints, and URL slugs all derive from this record —
 * do not maintain a parallel panel/search content database.
 */
export interface CelestialObject {
  id: string;
  /**
   * Stable URL-friendly identifier. Must not change with display formatting.
   * Used for `?object=` deep links — never array indices.
   */
  slug: string;
  commonName: string;
  /** Alternate common names / historical names for search discovery. */
  aliases?: string[];
  catalogIds: CatalogIdentifier[];
  objectType: CelestialObjectType;
  /** Optional finer classification (e.g. "Sb", "H II region"). */
  classificationSubtype?: string;
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
  /** Approximate physical diameter in light-years, when known. */
  physicalSizeLy?: number;
  /** Cosmological redshift z, when applicable. */
  redshift?: number;
  /** Surface brightness when published (mag/arcsec²). */
  surfaceBrightness?: number;
  /** Short discovery / historical note. */
  discovery?: string;
  /** Concise object summary for the inspection panel. */
  description?: string;
  /** Extra observational context (why notable, what you're seeing). */
  observationalNotes?: string;
  /** Optional licensed reference image when no personal capture exists. */
  referenceImage?: DeepSkyReferenceImage;
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
