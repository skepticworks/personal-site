import type { CelestialObject } from "@/types/astronomy";

/**
 * Curated deep-sky navigation targets (J2000 / ICRS).
 *
 * Coordinates are standard published approximate positions for engine
 * validation — not a full Messier/NGC catalog. Replace or extend via the
 * same `CelestialObject` shape; do not hand-place in Three.js coordinates.
 *
 * Epoch: J2000. No precession / observer-frame transform is applied.
 */
export const deepSkyObjects: CelestialObject[] = [
  {
    id: "obj-m31",
    commonName: "Andromeda Galaxy",
    catalogIds: [
      { catalog: "M", id: "31" },
      { catalog: "NGC", id: "224" },
    ],
    objectType: "galaxy",
    coordinates: {
      rightAscensionHours: 0.7122,
      declinationDegrees: 41.2692,
    },
    coordinateEpoch: "J2000",
    constellation: "Andromeda",
    distanceLy: 2_500_000,
    magnitude: 3.4,
    angularSizeArcmin: 190,
    description: "Nearest major spiral galaxy to the Milky Way.",
  },
  {
    id: "obj-m42",
    commonName: "Orion Nebula",
    catalogIds: [
      { catalog: "M", id: "42" },
      { catalog: "NGC", id: "1976" },
    ],
    objectType: "nebula",
    coordinates: {
      rightAscensionHours: 5.5881,
      declinationDegrees: -5.3911,
    },
    coordinateEpoch: "J2000",
    constellation: "Orion",
    distanceLy: 1344,
    magnitude: 4.0,
    angularSizeArcmin: 65,
    description: "Bright diffuse nebula in Orion's sword.",
  },
  {
    id: "obj-m45",
    commonName: "Pleiades",
    catalogIds: [
      { catalog: "M", id: "45" },
    ],
    objectType: "open-cluster",
    coordinates: {
      rightAscensionHours: 3.7903,
      declinationDegrees: 24.1167,
    },
    coordinateEpoch: "J2000",
    constellation: "Taurus",
    distanceLy: 444,
    magnitude: 1.6,
    angularSizeArcmin: 110,
    description: "Bright open cluster also known as the Seven Sisters.",
  },
  {
    id: "obj-m57",
    commonName: "Ring Nebula",
    catalogIds: [
      { catalog: "M", id: "57" },
      { catalog: "NGC", id: "6720" },
    ],
    objectType: "planetary-nebula",
    coordinates: {
      rightAscensionHours: 18.8933,
      declinationDegrees: 33.0292,
    },
    coordinateEpoch: "J2000",
    constellation: "Lyra",
    distanceLy: 2567,
    magnitude: 8.8,
    angularSizeArcmin: 1.4,
    description: "Famous planetary nebula in Lyra.",
  },
  {
    id: "obj-m51",
    commonName: "Whirlpool Galaxy",
    catalogIds: [
      { catalog: "M", id: "51" },
      { catalog: "NGC", id: "5194" },
    ],
    objectType: "galaxy",
    coordinates: {
      rightAscensionHours: 13.4978,
      declinationDegrees: 47.1953,
    },
    coordinateEpoch: "J2000",
    constellation: "Canes Venatici",
    distanceLy: 23_000_000,
    magnitude: 8.4,
    angularSizeArcmin: 11,
    description: "Face-on spiral interacting with NGC 5195.",
  },
  {
    id: "obj-m13",
    commonName: "Hercules Globular Cluster",
    catalogIds: [
      { catalog: "M", id: "13" },
      { catalog: "NGC", id: "6205" },
    ],
    objectType: "globular-cluster",
    coordinates: {
      rightAscensionHours: 16.6949,
      declinationDegrees: 36.4603,
    },
    coordinateEpoch: "J2000",
    constellation: "Hercules",
    distanceLy: 22_200,
    magnitude: 5.8,
    angularSizeArcmin: 20,
    description: "Bright northern globular cluster.",
  },
  {
    id: "obj-m81",
    commonName: "Bode's Galaxy",
    catalogIds: [
      { catalog: "M", id: "81" },
      { catalog: "NGC", id: "3031" },
    ],
    objectType: "galaxy",
    coordinates: {
      rightAscensionHours: 9.9259,
      declinationDegrees: 69.0653,
    },
    coordinateEpoch: "J2000",
    constellation: "Ursa Major",
    distanceLy: 12_000_000,
    magnitude: 6.9,
    angularSizeArcmin: 27,
    description: "Grand-design spiral near M82.",
  },
  {
    id: "obj-m27",
    commonName: "Dumbbell Nebula",
    catalogIds: [
      { catalog: "M", id: "27" },
      { catalog: "NGC", id: "6853" },
    ],
    objectType: "planetary-nebula",
    coordinates: {
      rightAscensionHours: 19.9936,
      declinationDegrees: 22.7211,
    },
    coordinateEpoch: "J2000",
    constellation: "Vulpecula",
    distanceLy: 1360,
    magnitude: 7.5,
    angularSizeArcmin: 8,
    description: "Large bright planetary nebula.",
  },
];

export function getDeepSkyObjectById(
  id: string,
): CelestialObject | undefined {
  return deepSkyObjects.find((object) => object.id === id);
}

export function listDeepSkyObjects(): readonly CelestialObject[] {
  return deepSkyObjects;
}
