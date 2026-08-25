/**
 * Optimized web image derivatives only.
 * Full-resolution originals / masters are not hosted by this application.
 */
export interface WebImageAsset {
  /** Public URL path to the optimized image (e.g. under `/assets/...`). */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Optional byte size recorded at publish time (not probed at runtime). */
  bytes?: number;
  /** Optional blur placeholder data URL for Next.js Image. */
  blurDataURL?: string;
}

/**
 * Derivative-only image set for a published personal capture.
 * There is intentionally no original / master / RAW field.
 */
export type CaptureImageAsset = WebImageAsset;

export interface CaptureImageSet {
  /** Aggressive small derivative for lists and compact UI. */
  thumbnail: CaptureImageAsset;
  /** Default larger inline / panel preview. */
  preview: CaptureImageAsset;
  /**
   * Optional higher-quality web preview for full-screen inspection only.
   * Still a compressed web derivative — never an original or master.
   */
  highQualityPreview?: CaptureImageAsset;
}

/** Contexts that select which derivative to display. */
export type CaptureImageDisplayContext =
  | "thumbnail"
  | "panel"
  | "sheet"
  | "viewer";
