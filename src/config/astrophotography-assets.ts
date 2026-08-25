/**
 * Central policy for published astrophotography web derivatives.
 *
 * The website never hosts originals, masters, or archival source files.
 * Limits are hard ceilings for validation — exporters should target the
 * recommended bands, not the maxima.
 */

export const ASTROPHOTOGRAPHY_ASSET_ROOT =
  "public/assets/astrophotography/captures";

/** Web formats accepted under the captures asset tree. */
export const ALLOWED_ASTRO_WEB_EXTENSIONS = [
  ".avif",
  ".webp",
] as const;

/**
 * Source / archival formats that must never enter website capture directories.
 * Scoped to astrophotography paths — not a global repository ban on TIFF/etc.
 */
export const PROHIBITED_ASTRO_SOURCE_EXTENSIONS = [
  ".fit",
  ".fits",
  ".fts",
  ".xisf",
  ".tif",
  ".tiff",
  ".raw",
  ".cr2",
  ".cr3",
  ".nef",
  ".arw",
  ".dng",
  ".orf",
  ".rw2",
  ".pef",
  ".psd",
  ".psb",
  ".xcf",
  ".kra",
] as const;

/** Expected derivative filenames (extension may be .avif or .webp). */
export const CAPTURE_DERIVATIVE_BASENAMES = {
  thumbnail: "thumbnail",
  preview: "preview",
  highQualityPreview: "preview-hq",
} as const;

export type CaptureDerivativeRole = keyof typeof CAPTURE_DERIVATIVE_BASENAMES;

export interface DerivativeSizePolicy {
  /** Recommended longest-edge range for exporters (guidance). */
  recommendedLongEdgeMin: number;
  recommendedLongEdgeMax: number;
  /** Hard ceiling for longest edge (validation). */
  maxLongEdge: number;
  /** Soft target file size for exporters (guidance). */
  recommendedMaxBytes: number;
  /** Hard ceiling for file size (validation). */
  maxBytes: number;
}

export const astrophotographyAssetPolicy = {
  thumbnail: {
    recommendedLongEdgeMin: 400,
    recommendedLongEdgeMax: 800,
    maxLongEdge: 960,
    recommendedMaxBytes: 80_000,
    maxBytes: 150_000,
  },
  preview: {
    recommendedLongEdgeMin: 1600,
    recommendedLongEdgeMax: 2400,
    maxLongEdge: 2560,
    recommendedMaxBytes: 450_000,
    maxBytes: 900_000,
  },
  highQualityPreview: {
    recommendedLongEdgeMin: 3000,
    recommendedLongEdgeMax: 4000,
    maxLongEdge: 4096,
    recommendedMaxBytes: 1_200_000,
    maxBytes: 2_500_000,
  },
} as const satisfies Record<CaptureDerivativeRole, DerivativeSizePolicy>;

export function captureAssetDirectory(captureId: string): string {
  return `${ASTROPHOTOGRAPHY_ASSET_ROOT}/${captureId}`;
}

export function isAllowedAstroWebExtension(ext: string): boolean {
  const normalized = ext.startsWith(".")
    ? ext.toLowerCase()
    : `.${ext.toLowerCase()}`;
  return (ALLOWED_ASTRO_WEB_EXTENSIONS as readonly string[]).includes(
    normalized,
  );
}

export function isProhibitedAstroSourceExtension(ext: string): boolean {
  const normalized = ext.startsWith(".")
    ? ext.toLowerCase()
    : `.${ext.toLowerCase()}`;
  return (PROHIBITED_ASTRO_SOURCE_EXTENSIONS as readonly string[]).includes(
    normalized,
  );
}
