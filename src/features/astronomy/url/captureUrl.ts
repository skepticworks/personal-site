/**
 * Pure helpers for capture URL query parsing.
 * Router side effects live in `useSelectedObjectUrlSync`.
 */

import { getCaptureBySlug } from "@/features/captures/selectors/captureSelectors";
import type { AstrophotographyCapture } from "@/types/captures";

export const CAPTURE_URL_PARAM = "capture";

export function parseCaptureSlugParam(
  value: string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveCaptureFromSlugParam(
  value: string | null | undefined,
): AstrophotographyCapture | undefined {
  const slug = parseCaptureSlugParam(value);
  if (!slug) {
    return undefined;
  }
  return getCaptureBySlug(slug);
}
