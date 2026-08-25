import type { CelestialObject } from "@/types/astronomy";

/**
 * Minimal celestial object samples. Not a star catalog.
 * Coordinates are approximate J2000 equatorial values for scaffolding.
 */
export const mockCelestialObjects: CelestialObject[] = [
  {
    id: "obj-m42",
    commonName: "Orion Nebula",
    catalogIds: [
      { catalog: "M", id: "42" },
      { catalog: "NGC", id: "1976" },
    ],
    objectType: "nebula",
    coordinates: {
      rightAscensionHours: 5.588,
      declinationDegrees: -5.391,
    },
    constellation: "Orion",
    distanceLy: 1344,
    magnitude: 4.0,
  },
  {
    id: "obj-m31",
    commonName: "Andromeda Galaxy",
    catalogIds: [
      { catalog: "M", id: "31" },
      { catalog: "NGC", id: "224" },
    ],
    objectType: "galaxy",
    coordinates: {
      rightAscensionHours: 0.712,
      declinationDegrees: 41.269,
    },
    constellation: "Andromeda",
    distanceLy: 2_500_000,
    magnitude: 3.4,
  },
];

export function getCelestialObjectById(
  id: string,
): CelestialObject | undefined {
  return mockCelestialObjects.find((object) => object.id === id);
}
