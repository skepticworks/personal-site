import { getObjectById } from "@/features/astronomy/selectors/objectSelectors";
import {
  getCapturesForObject,
  getPreferredCaptureForObject,
} from "@/features/captures/selectors/captureSelectors";
import type { DeepSkyReferenceImage } from "@/types/astronomy";
import type { AstrophotographyCapture } from "@/types/captures";
import type { WebImageAsset } from "@/types/assets";

export type ObjectDisplayImage =
  | {
      kind: "personal";
      capture: AstrophotographyCapture;
      image: WebImageAsset;
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
 */
export function getPreferredDisplayImage(
  objectId: string,
): ObjectDisplayImage {
  const captures = getCapturesForObject(objectId);
  const preferred = getPreferredCaptureForObject(objectId);
  if (preferred) {
    return {
      kind: "personal",
      capture: preferred,
      image: preferred.preview,
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
