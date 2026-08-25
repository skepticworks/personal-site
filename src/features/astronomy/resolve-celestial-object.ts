import { getCelestialObjectById } from "@/data/mock-celestial-objects";
import type { CelestialObject } from "@/types/astronomy";

/** Resolve a celestial object by id within the astronomy feature. */
export function resolveCelestialObject(
  id: string,
): CelestialObject | undefined {
  return getCelestialObjectById(id);
}
