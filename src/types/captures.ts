import type { EquatorialCoordinates } from "@/types/astronomy";
import type { CaptureImageSet } from "@/types/assets";

/**
 * How precisely a capture location may be published.
 *
 * Privacy is enforced by data minimization: only the fields appropriate to
 * the chosen level should exist in client-shipped capture data.
 */
export type LocationPrivacy =
  | "hidden"
  | "region"
  | "approximate"
  | "exact";

export interface GeographicCoordinates {
  /** Latitude in decimal degrees [-90, 90]. */
  latitudeDegrees: number;
  /** Longitude in decimal degrees [-180, 180]. */
  longitudeDegrees: number;
}

/**
 * Published location for a capture. Default to `hidden` or `region`.
 * Do not ship `exactCoordinates` unless privacy is explicitly `"exact"`.
 */
export interface CaptureLocation {
  privacy: LocationPrivacy;
  /** Short public label when privacy allows (e.g. site nickname). */
  label?: string;
  /** Broad region (e.g. "Catskills, New York"). */
  region?: string;
  country?: string;
  /**
   * Deliberately coarse coordinates for `"approximate"` privacy only.
   * Never treat these as survey-grade.
   */
  approximateCoordinates?: GeographicCoordinates;
  /**
   * Precise coordinates — only when `privacy === "exact"` and intentionally public.
   */
  exactCoordinates?: GeographicCoordinates;
}

export interface CaptureEquipment {
  telescope?: string;
  /** Lens-based imaging (may replace or coexist with telescope). */
  lens?: string;
  camera: string;
  mount?: string;
  filters?: string[];
  reducer?: string;
  guideScope?: string;
  guideCamera?: string;
  focuser?: string;
  accessories?: string[];
}

/** One filter (or broadband) exposure group within an acquisition. */
export interface CaptureExposureGroup {
  /** Filter name (Ha, OIII, L, dual-band label, etc.) or omit for broadband. */
  filter?: string;
  exposureSeconds: number;
  frameCount: number;
  /** ISO or gain for this group when it differs from the capture-level value. */
  sensitivity?: string;
  binning?: string;
}

export interface CaptureAcquisition {
  /**
   * Structured exposure groups. When present and complete, total integration
   * is derived from these groups rather than a duplicated total.
   */
  exposureGroups?: CaptureExposureGroup[];
  /**
   * Total integration in seconds when groups are not supplied.
   * Must not conflict with a total derived from `exposureGroups`.
   */
  integrationSeconds?: number;
  /** Shared subframe length when groups are not used. */
  subframeExposureSeconds?: number;
  /** Shared frame count when groups are not used. */
  subframeCount?: number;
  /** Capture-level gain / ISO display string (e.g. "Gain 100"). */
  sensitivity?: string;
  binning?: string;
  notes?: string;
}

export interface CaptureDateRange {
  /** ISO 8601 date or datetime for the start of acquisition. */
  start: string;
  /** ISO 8601 date or datetime for the end of acquisition, if multi-night. */
  end?: string;
}

export interface CaptureProcessing {
  software?: string[];
  notes?: string;
}

/**
 * An astrophotography capture represented by web-optimized derivatives only.
 * Original / full-resolution masters live outside this repository.
 */
export interface AstrophotographyCapture {
  id: string;
  slug: string;
  /** ID of the target in the celestial object catalog. */
  targetObjectId: string;

  title: string;
  description?: string;

  /**
   * Preferred capture for an object when multiple exist.
   * At most one featured capture should be marked per target in practice.
   */
  featured?: boolean;

  /** Convenience single-night date; prefer `captureStartDate` / `captureEndDate`. */
  capturedAt?: string;
  captureStartDate?: string;
  captureEndDate?: string;

  location?: CaptureLocation;

  equipment: CaptureEquipment;
  acquisition: CaptureAcquisition;
  processing?: CaptureProcessing;

  images: CaptureImageSet;

  notes?: string;

  /**
   * Sky position used for placement in the astronomy experience.
   * Usually mirrors the target object's coordinates; may be refined per capture.
   */
  celestialCoordinates: EquatorialCoordinates;
  /** Optional links to portfolio project IDs. */
  relatedProjectIds?: string[];
}
