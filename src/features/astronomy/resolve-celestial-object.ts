import { getDeepSkyObjectById } from "@/features/astronomy/data/deep-sky-objects";
import type { CelestialObject } from "@/types/astronomy";

/** Resolve a celestial object by id within the astronomy feature. */
export function resolveCelestialObject(
  id: string,
): CelestialObject | undefined {
  return getDeepSkyObjectById(id);
}
