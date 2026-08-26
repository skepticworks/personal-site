import { listCaptures } from "@/features/captures/list-captures";
import type {
  CaptureImageDisplayContext,
  CaptureImageAsset,
  CaptureImageSet,
} from "@/types/assets";
import type { AstrophotographyCapture } from "@/types/captures";

/** All personal captures that target a deep-sky object by stable ID. */
export function getCapturesForObject(
  objectId: string,
): AstrophotographyCapture[] {
  return listCaptures().filter(
    (capture) => capture.targetObjectId === objectId,
  );
}

export function getCaptureById(
  id: string,
): AstrophotographyCapture | undefined {
  return listCaptures().find((capture) => capture.id === id);
}

export function getCaptureBySlug(
  slug: string,
): AstrophotographyCapture | undefined {
  const normalized = slug.trim().toLowerCase();
  return listCaptures().find(
    (capture) => capture.slug.toLowerCase() === normalized,
  );
}

/**
 * Featured capture for an object, falling back to most recent start date.
 * Capture records remain the source of imagery — never copy URLs onto objects.
 */
export function getFeaturedCaptureForObject(
  objectId: string,
): AstrophotographyCapture | undefined {
  const captures = getCapturesForObject(objectId);
  if (captures.length === 0) {
    return undefined;
  }
  const featured = captures.find((capture) => capture.featured);
  if (featured) {
    return featured;
  }
  return sortCapturesByRecency(captures)[0];
}

/** @deprecated Prefer `getFeaturedCaptureForObject`. */
export function getPreferredCaptureForObject(
  objectId: string,
): AstrophotographyCapture | undefined {
  return getFeaturedCaptureForObject(objectId);
}

export function hasPersonalCapture(objectId: string): boolean {
  return getCapturesForObject(objectId).length > 0;
}

/** Objects that have at least one published personal capture. */
export function getObjectsWithPersonalCaptures(): string[] {
  const ids = new Set<string>();
  for (const capture of listCaptures()) {
    ids.add(capture.targetObjectId);
  }
  return [...ids];
}

/** Capture count for a deep-sky object (0 when none). */
export function getCaptureCountForObject(objectId: string): number {
  return getCapturesForObject(objectId).length;
}

export function sortCapturesByRecency(
  captures: AstrophotographyCapture[],
): AstrophotographyCapture[] {
  return [...captures].sort((a, b) =>
    getCaptureSortDate(b).localeCompare(getCaptureSortDate(a)),
  );
}

function getCaptureSortDate(capture: AstrophotographyCapture): string {
  return (
    capture.captureStartDate ??
    capture.capturedAt ??
    capture.captureEndDate ??
    ""
  );
}

/**
 * Select the appropriate derivative for a UI context.
 * Viewer prefers highQualityPreview when present; otherwise preview.
 */
export function getCaptureDisplayImage(
  capture: AstrophotographyCapture,
  context: CaptureImageDisplayContext,
): CaptureImageAsset {
  const { images } = capture;
  switch (context) {
    case "thumbnail":
      return images.thumbnail;
    case "viewer":
      return images.highQualityPreview ?? images.preview;
    case "panel":
    case "sheet":
    default:
      return images.preview;
  }
}

/** Asset used when opening the full-screen viewer (HQ if present). */
export function getViewerImageAsset(
  images: CaptureImageSet,
): CaptureImageAsset {
  return images.highQualityPreview ?? images.preview;
}

/** Whether an HQ web preview exists (still a derivative, never an original). */
export function hasHighQualityPreview(capture: AstrophotographyCapture): boolean {
  return Boolean(capture.images.highQualityPreview);
}
