import { getObjectById } from "@/features/astronomy/selectors/objectSelectors";
import {
  getCaptureDisplayImage,
  getCapturesForObject,
  getFeaturedCaptureForObject,
} from "@/features/captures/selectors/captureSelectors";
import type { DeepSkyReferenceImage } from "@/types/astronomy";
import type { AstrophotographyCapture } from "@/types/captures";
import type { CaptureImageAsset } from "@/types/assets";

export type ObjectDisplayImage =
  | {
      kind: "personal";
      capture: AstrophotographyCapture;
      image: CaptureImageAsset;
      captureCount: number;
    }
  | {
      kind: "reference";
      image: DeepSkyReferenceImage;
    }
  | { kind: "none" };

/**
 * Image source precedence for the object panel:
 * personal photograph → reference image → no-image fallback.
 *
 * When `selectedCaptureId` is provided and belongs to the object, that capture
 * is shown; otherwise the featured / preferred capture is used.
 */
export function getPreferredDisplayImage(
  objectId: string,
  selectedCaptureId?: string | null,
): ObjectDisplayImage {
  const captures = getCapturesForObject(objectId);
  const selected =
    selectedCaptureId &&
    captures.find((capture) => capture.id === selectedCaptureId);
  const preferred = selected ?? getFeaturedCaptureForObject(objectId);

  if (preferred) {
    return {
      kind: "personal",
      capture: preferred,
      image: getCaptureDisplayImage(preferred, "panel"),
      captureCount: captures.length,
    };
  }

  const object = getObjectById(objectId);
  if (object?.referenceImage) {
    return {
      kind: "reference",
      image: object.referenceImage,
    };
  }

  return { kind: "none" };
}
