import { getDeepSkyObjectById } from "@/features/astronomy/data/deep-sky-objects";
import type { CelestialObject } from "@/types/astronomy";

/**
 * @deprecated Prefer `deepSkyObjects` / `getDeepSkyObjectById`.
 * Kept so older imports and capture scaffolding keep resolving the same IDs.
 */
export const mockCelestialObjects: CelestialObject[] = [
  getDeepSkyObjectById("obj-m42")!,
  getDeepSkyObjectById("obj-m31")!,
];

export function getCelestialObjectById(
  id: string,
): CelestialObject | undefined {
  return getDeepSkyObjectById(id);
}
