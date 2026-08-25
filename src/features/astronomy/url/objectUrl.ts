/**
 * Pure helpers for deep-sky object URL query parsing.
 * Router side effects live in `useSelectedObjectUrlSync`.
 */

import { getObjectBySlug } from "@/features/astronomy/selectors/objectSelectors";
import type { CelestialObject } from "@/types/astronomy";

export const OBJECT_URL_PARAM = "object";

export function parseObjectSlugParam(
  value: string | null | undefined,
): string | null {
  if (!value) {
    return null;
  }
  const trimmed = value.trim().toLowerCase();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveObjectFromSlugParam(
  value: string | null | undefined,
): CelestialObject | undefined {
  const slug = parseObjectSlugParam(value);
  if (!slug) {
    return undefined;
  }
  return getObjectBySlug(slug);
}
