import { listCaptures } from "@/features/captures/list-captures";
import type { AstrophotographyCapture } from "@/types/captures";

/** All personal captures that target a deep-sky object by stable ID. */
export function getCapturesForObject(
  objectId: string,
): AstrophotographyCapture[] {
  return listCaptures().filter(
    (capture) => capture.targetObjectId === objectId,
  );
}

/**
 * Preferred capture for panel preview: most recent by `capturedAt.start`.
 * Capture records remain the source of imagery — never copy URLs onto objects.
 */
export function getPreferredCaptureForObject(
  objectId: string,
): AstrophotographyCapture | undefined {
  const captures = getCapturesForObject(objectId);
  if (captures.length === 0) {
    return undefined;
  }
  return [...captures].sort((a, b) =>
    b.capturedAt.start.localeCompare(a.capturedAt.start),
  )[0];
}

export function hasPersonalCapture(objectId: string): boolean {
  return getCapturesForObject(objectId).length > 0;
}
