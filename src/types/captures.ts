import type { EquatorialCoordinates } from "@/types/astronomy";
import type { WebImageAsset } from "@/types/assets";

export interface GeographicCoordinates {
  /** Latitude in decimal degrees [-90, 90]. */
  latitudeDegrees: number;
  /** Longitude in decimal degrees [-180, 180]. */
  longitudeDegrees: number;
  /** Elevation above sea level in meters, when known. */
  elevationMeters?: number;
}

export interface CaptureLocation {
  name: string;
  region?: string;
  country?: string;
  coordinates?: GeographicCoordinates;
}

export interface CaptureEquipment {
  telescope?: string;
  camera?: string;
  mount?: string;
  filters?: string[];
  accessories?: string[];
}

export interface AcquisitionDetails {
  /** Total integration time in seconds. */
  integrationSeconds?: number;
  /** Number of light frames / subexposures. */
  subframeCount?: number;
  /** Individual subframe exposure length in seconds. */
  subframeExposureSeconds?: number;
  /** ISO or gain value as a display string (e.g. "Gain 100", "ISO 800"). */
  sensitivity?: string;
  notes?: string;
}

export interface CaptureDateRange {
  /** ISO 8601 date or datetime for the start of acquisition. */
  start: string;
  /** ISO 8601 date or datetime for the end of acquisition, if multi-night. */
  end?: string;
}

/**
 * An astrophotography capture represented by web-optimized derivatives only.
 * Original / full-resolution masters live outside this repository.
 */
export interface AstrophotographyCapture {
  id: string;
  title: string;
  slug: string;
  description: string;
  /** ID of the target in the celestial object catalog. */
  targetObjectId: string;
  preview: WebImageAsset;
  thumbnail: WebImageAsset;
  capturedAt: CaptureDateRange;
  location: CaptureLocation;
  equipment: CaptureEquipment;
  acquisition: AcquisitionDetails;
  processingSoftware?: string[];
  notes?: string;
  /**
   * Sky position used for placement in the astronomy experience.
   * Usually mirrors the target object's coordinates; may be refined per capture.
   */
  celestialCoordinates: EquatorialCoordinates;
  /** Optional links to portfolio project IDs. */
  relatedProjectIds?: string[];
}
