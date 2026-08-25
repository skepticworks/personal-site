import type { StarRecord } from "@/types/astronomy";

/**
 * Curated bright stars (approximate J2000).
 * Source values are standard published coordinates rounded for scaffolding.
 */
const CATALOG_STARS: Omit<StarRecord, "source">[] = [
  {
    id: "star-sirius",
    name: "Sirius",
    coordinates: { rightAscensionHours: 6.7525, declinationDegrees: -16.7161 },
    magnitude: -1.46,
    colorIndex: 0.0,
  },
  {
    id: "star-canopus",
    name: "Canopus",
    coordinates: { rightAscensionHours: 6.3992, declinationDegrees: -52.6957 },
    magnitude: -0.74,
    colorIndex: 0.15,
  },
  {
    id: "star-arcturus",
    name: "Arcturus",
    coordinates: { rightAscensionHours: 14.261, declinationDegrees: 19.1824 },
    magnitude: -0.05,
    colorIndex: 1.23,
  },
  {
    id: "star-vega",
    name: "Vega",
    coordinates: { rightAscensionHours: 18.6156, declinationDegrees: 38.7837 },
    magnitude: 0.03,
    colorIndex: 0.0,
  },
  {
    id: "star-capella",
    name: "Capella",
    coordinates: { rightAscensionHours: 5.2782, declinationDegrees: 45.998 },
    magnitude: 0.08,
    colorIndex: 0.8,
  },
  {
    id: "star-rigel",
    name: "Rigel",
    coordinates: { rightAscensionHours: 5.2423, declinationDegrees: -8.2016 },
    magnitude: 0.13,
    colorIndex: -0.03,
  },
  {
    id: "star-procyon",
    name: "Procyon",
    coordinates: { rightAscensionHours: 7.655, declinationDegrees: 5.225 },
    magnitude: 0.34,
    colorIndex: 0.42,
  },
  {
    id: "star-betelgeuse",
    name: "Betelgeuse",
    coordinates: { rightAscensionHours: 5.9195, declinationDegrees: 7.4071 },
    magnitude: 0.42,
    colorIndex: 1.5,
  },
  {
    id: "star-altair",
    name: "Altair",
    coordinates: { rightAscensionHours: 19.8464, declinationDegrees: 8.8683 },
    magnitude: 0.77,
    colorIndex: 0.22,
  },
  {
    id: "star-aldebaran",
    name: "Aldebaran",
    coordinates: { rightAscensionHours: 4.5987, declinationDegrees: 16.5093 },
    magnitude: 0.87,
    colorIndex: 1.54,
  },
  {
    id: "star-antares",
    name: "Antares",
    coordinates: { rightAscensionHours: 16.4901, declinationDegrees: -26.4319 },
    magnitude: 1.06,
    colorIndex: 1.83,
  },
  {
    id: "star-spica",
    name: "Spica",
    coordinates: { rightAscensionHours: 13.4199, declinationDegrees: -11.1613 },
    magnitude: 0.98,
    colorIndex: -0.23,
  },
  {
    id: "star-pollux",
    name: "Pollux",
    coordinates: { rightAscensionHours: 7.7553, declinationDegrees: 28.0262 },
    magnitude: 1.14,
    colorIndex: 1.0,
  },
  {
    id: "star-fomalhaut",
    name: "Fomalhaut",
    coordinates: { rightAscensionHours: 22.9608, declinationDegrees: -29.6222 },
    magnitude: 1.16,
    colorIndex: 0.09,
  },
  {
    id: "star-deneb",
    name: "Deneb",
    coordinates: { rightAscensionHours: 20.6905, declinationDegrees: 45.2803 },
    magnitude: 1.25,
    colorIndex: 0.09,
  },
  {
    id: "star-regulus",
    name: "Regulus",
    coordinates: { rightAscensionHours: 10.1395, declinationDegrees: 11.9672 },
    magnitude: 1.35,
    colorIndex: -0.11,
  },
  {
    id: "star-castor",
    name: "Castor",
    coordinates: { rightAscensionHours: 7.5766, declinationDegrees: 31.8883 },
    magnitude: 1.58,
    colorIndex: 0.03,
  },
  {
    id: "star-bellatrix",
    name: "Bellatrix",
    coordinates: { rightAscensionHours: 5.4189, declinationDegrees: 6.3497 },
    magnitude: 1.64,
    colorIndex: -0.22,
  },
  {
    id: "star-elnath",
    name: "Elnath",
    coordinates: { rightAscensionHours: 5.4382, declinationDegrees: 28.6075 },
    magnitude: 1.65,
    colorIndex: -0.13,
  },
  {
    id: "star-alnilam",
    name: "Alnilam",
    coordinates: { rightAscensionHours: 5.6036, declinationDegrees: -1.2019 },
    magnitude: 1.69,
    colorIndex: -0.18,
  },
  {
    id: "star-alnitak",
    name: "Alnitak",
    coordinates: { rightAscensionHours: 5.6793, declinationDegrees: -1.9426 },
    magnitude: 1.77,
    colorIndex: -0.2,
  },
  {
    id: "star-mintaka",
    name: "Mintaka",
    coordinates: { rightAscensionHours: 5.5334, declinationDegrees: -0.2991 },
    magnitude: 2.23,
    colorIndex: -0.22,
  },
  {
    id: "star-polaris",
    name: "Polaris",
    coordinates: { rightAscensionHours: 2.5303, declinationDegrees: 89.2641 },
    magnitude: 1.98,
    colorIndex: 0.6,
  },
  {
    id: "star-achernar",
    name: "Achernar",
    coordinates: { rightAscensionHours: 1.6286, declinationDegrees: -57.2368 },
    magnitude: 0.46,
    colorIndex: -0.19,
  },
];

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Synthetic density stars placed via equatorial coordinates (not arbitrary XYZ).
 * Clearly separated from curated catalog stars via `source: "synthetic"`.
 */
function createSyntheticStars(count: number): StarRecord[] {
  const next = mulberry32(0x5c957a2);
  const stars: StarRecord[] = [];

  for (let i = 0; i < count; i += 1) {
    // Uniform on sphere via Dec = asin(2u - 1)
    const u = next();
    const declinationDegrees = (Math.asin(2 * u - 1) * 180) / Math.PI;
    const rightAscensionHours = next() * 24;
    // Bias toward fainter stars
    const magnitude = 2.8 + next() * 5.2;
    const colorIndex = -0.2 + next() * 1.4;

    stars.push({
      id: `synth-star-${i}`,
      coordinates: { rightAscensionHours, declinationDegrees },
      magnitude,
      colorIndex,
      source: "synthetic",
    });
  }

  return stars;
}

const SYNTHETIC_POOL = createSyntheticStars(3200);

const CATALOG_WITH_SOURCE: StarRecord[] = CATALOG_STARS.map((star) => ({
  ...star,
  source: "catalog" as const,
}));

/**
 * Stars for rendering up to `limit`, catalog first then synthetic fillers.
 * All records use equatorial coordinates and the shared conversion pipeline.
 */
export function getStarsForRender(limit: number): StarRecord[] {
  const capped = Math.max(0, Math.floor(limit));
  if (capped <= CATALOG_WITH_SOURCE.length) {
    return CATALOG_WITH_SOURCE.slice(0, capped);
  }
  return [
    ...CATALOG_WITH_SOURCE,
    ...SYNTHETIC_POOL.slice(0, capped - CATALOG_WITH_SOURCE.length),
  ];
}

export const brightCatalogStars: readonly StarRecord[] = CATALOG_WITH_SOURCE;
