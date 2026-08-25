import {
  getDeepSkyObjectById,
  getDeepSkyObjectBySlug,
  listDeepSkyObjects,
} from "@/features/astronomy/data/deep-sky-objects";
import type { CelestialObject } from "@/types/astronomy";

export function getObjectById(id: string): CelestialObject | undefined {
  return getDeepSkyObjectById(id);
}

export function getObjectBySlug(slug: string): CelestialObject | undefined {
  const trimmed = slug.trim().toLowerCase();
  if (!trimmed) {
    return undefined;
  }
  return getDeepSkyObjectBySlug(trimmed);
}

/** Resolve either a stable id (`obj-m31`) or a slug (`andromeda-galaxy`). */
export function resolveObjectRef(
  ref: string,
): CelestialObject | undefined {
  const trimmed = ref.trim();
  if (!trimmed) {
    return undefined;
  }
  return getObjectById(trimmed) ?? getObjectBySlug(trimmed);
}

export function listObjects(): readonly CelestialObject[] {
  return listDeepSkyObjects();
}

export function isValidObjectSlug(slug: string): boolean {
  return getObjectBySlug(slug) !== undefined;
}
