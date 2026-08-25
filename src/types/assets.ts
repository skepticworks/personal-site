/**
 * Optimized web image derivatives only.
 * Full-resolution originals are not hosted by this application.
 */
export interface WebImageAsset {
  /** Public URL path to the optimized image (e.g. under `/assets/...`). */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Optional blur placeholder data URL for Next.js Image. */
  blurDataURL?: string;
}
