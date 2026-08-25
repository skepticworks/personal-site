import type { CelestialObject } from "@/types/astronomy";

/**
 * Curated deep-sky navigation targets (J2000 / ICRS).
 *
 * Coordinates and key physical values are standard published approximate
 * figures for engine validation and the object panel — not a full
 * Messier/NGC encyclopedia. Sources: commonly cited SIMBAD / NASA / ESA
 * public figures rounded for display. See docs/object-interface.md.
 *
 * Epoch: J2000. No precession / observer-frame transform is applied.
 *
 * Reference image paths under `/assets/images/reference/` are placeholders
 * for licensed web derivatives (see docs/reference-images.md). Missing
 * files resolve to the panel's intentional no-image state.
 */
export const deepSkyObjects: CelestialObject[] = [
  {
    id: "obj-m31",
    slug: "andromeda-galaxy",
    commonName: "Andromeda Galaxy",
    aliases: [
      "Great Andromeda Galaxy",
      "Andromeda",
      "Great Nebula in Andromeda",
    ],
    catalogIds: [
      { catalog: "M", id: "31" },
      { catalog: "NGC", id: "224" },
      { catalog: "UGC", id: "454" },
    ],
    objectType: "galaxy",
    classificationSubtype: "SA(s)b",
    coordinates: {
      rightAscensionHours: 0.7122,
      declinationDegrees: 41.2692,
    },
    coordinateEpoch: "J2000",
    constellation: "Andromeda",
    distanceLy: 2_500_000,
    magnitude: 3.44,
    angularSizeArcmin: 190,
    physicalSizeLy: 220_000,
    redshift: -0.001001,
    description:
      "The nearest major spiral galaxy to the Milky Way and the brightest Messier galaxy in northern skies.",
    observationalNotes:
      "Under dark skies the core is a naked-eye smudge; binoculars reveal the elongated disk. You are looking at a gravitationally bound neighbor on a collision course with the Milky Way in roughly 4–5 billion years.",
    discovery:
      "Recorded by Persian astronomer Abd al-Rahman al-Sufi (964). Messier catalogued it in 1764.",
    referenceImage: {
      src: "/assets/images/reference/m31-andromeda.webp",
      alt: "Reference image of the Andromeda Galaxy",
      credit: "NASA / ESA",
      sourceName: "Hubble Heritage",
      sourceUrl: "https://esahubble.org/",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "obj-m42",
    slug: "orion-nebula",
    commonName: "Orion Nebula",
    aliases: ["Great Orion Nebula", "Orion's Sword"],
    catalogIds: [
      { catalog: "M", id: "42" },
      { catalog: "NGC", id: "1976" },
    ],
    objectType: "nebula",
    classificationSubtype: "H II region",
    coordinates: {
      rightAscensionHours: 5.5881,
      declinationDegrees: -5.3911,
    },
    coordinateEpoch: "J2000",
    constellation: "Orion",
    distanceLy: 1344,
    magnitude: 4.0,
    angularSizeArcmin: 65,
    physicalSizeLy: 24,
    description:
      "A bright stellar nursery in Orion's sword — among the closest massive star-forming regions to Earth.",
    observationalNotes:
      "Visible to the naked eye as a fuzzy patch. Telescopes show the Trapezium cluster ionizing the surrounding gas. The greenish glow in visual observing is dominated by doubly ionized oxygen.",
    discovery:
      "Known since antiquity; first drawn in detail by Nicolas-Claude Fabri de Peiresc (1610).",
    referenceImage: {
      src: "/assets/images/reference/m42-orion.webp",
      alt: "Reference image of the Orion Nebula",
      credit: "NASA / ESA / M. Robberto",
      sourceName: "Hubble Space Telescope",
      sourceUrl: "https://esahubble.org/",
      width: 1200,
      height: 900,
    },
  },
  {
    id: "obj-m45",
    slug: "pleiades",
    commonName: "Pleiades",
    aliases: ["Seven Sisters", "Subaru", "Messier 45"],
    catalogIds: [
      { catalog: "M", id: "45" },
      { catalog: "Mel", id: "22" },
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
    physicalSizeLy: 14,
    description:
      "A young open cluster of hot B-type stars — one of the nearest and most famous star clusters.",
    observationalNotes:
      "Six or more stars are easy naked-eye under suburban skies; the surrounding reflection nebulosity shows best in photographs. The cluster is moving through a dust cloud, producing the blue reflection glow.",
    discovery: "Known since prehistoric times; Messier listed it in 1769.",
    referenceImage: {
      src: "/assets/images/reference/m45-pleiades.webp",
      alt: "Reference image of the Pleiades",
      credit: "NASA / ESA / AURA / Caltech",
      sourceName: "Public-domain astronomy archive",
      width: 1200,
      height: 800,
    },
  },
  {
    id: "obj-m57",
    slug: "ring-nebula",
    commonName: "Ring Nebula",
    aliases: ["Messier 57"],
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
    physicalSizeLy: 1.3,
    description:
      "A classic planetary nebula — the glowing shell of gas shed by a Sun-like star late in its life.",
    observationalNotes:
      "Appears as a small smoke-ring in modest telescopes. The central white dwarf is magnitude ~15 and needs larger apertures. Planetary nebulae are unrelated to planets; the name is historical.",
    discovery: "Discovered by Antoine Darquier de Pellepoix in 1779.",
    referenceImage: {
      src: "/assets/images/reference/m57-ring.webp",
      alt: "Reference image of the Ring Nebula",
      credit: "NASA / ESA / C. Robert O'Dell",
      sourceName: "Hubble Space Telescope",
      sourceUrl: "https://esahubble.org/",
      width: 900,
      height: 900,
    },
  },
  {
    id: "obj-m51",
    slug: "whirlpool-galaxy",
    commonName: "Whirlpool Galaxy",
    aliases: ["Messier 51", "Rosse's Galaxy"],
    catalogIds: [
      { catalog: "M", id: "51" },
      { catalog: "NGC", id: "5194" },
    ],
    objectType: "galaxy",
    classificationSubtype: "SA(s)bc pec",
    coordinates: {
      rightAscensionHours: 13.4978,
      declinationDegrees: 47.1953,
    },
    coordinateEpoch: "J2000",
    constellation: "Canes Venatici",
    distanceLy: 23_000_000,
    magnitude: 8.4,
    angularSizeArcmin: 11,
    physicalSizeLy: 76_000,
    redshift: 0.001544,
    description:
      "A face-on spiral interacting with the companion galaxy NGC 5195 — a textbook grand-design spiral.",
    observationalNotes:
      "Small telescopes show a round glow with a hint of spiral; photographs reveal the bridge of material to NGC 5195. The interaction has triggered elevated star formation.",
    discovery:
      "Discovered by Charles Messier in 1773; spiral structure noted by Lord Rosse in 1845.",
    referenceImage: {
      src: "/assets/images/reference/m51-whirlpool.webp",
      alt: "Reference image of the Whirlpool Galaxy",
      credit: "NASA / ESA / S. Beckwith / Hubble Heritage Team",
      sourceName: "Hubble Space Telescope",
      sourceUrl: "https://esahubble.org/",
      width: 1200,
      height: 1000,
    },
  },
  {
    id: "obj-m13",
    slug: "hercules-globular-cluster",
    commonName: "Hercules Globular Cluster",
    aliases: ["Great Hercules Cluster", "Messier 13"],
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
    physicalSizeLy: 145,
    description:
      "One of the brightest northern globular clusters — a spherical swarm of hundreds of thousands of ancient stars.",
    observationalNotes:
      "Visible in binoculars as a soft ball of light. Moderate telescopes begin to resolve outer stars. Globulars orbit the galactic halo and are typically 10+ billion years old.",
    discovery: "Discovered by Edmond Halley in 1714; Messier catalogued it in 1764.",
    referenceImage: {
      src: "/assets/images/reference/m13-hercules.webp",
      alt: "Reference image of the Hercules Globular Cluster",
      credit: "ESA / Hubble & NASA",
      sourceName: "Hubble Space Telescope",
      sourceUrl: "https://esahubble.org/",
      width: 1000,
      height: 1000,
    },
  },
  {
    id: "obj-m81",
    slug: "bodes-galaxy",
    commonName: "Bode's Galaxy",
    aliases: ["Messier 81", "Bode's Nebula"],
    catalogIds: [
      { catalog: "M", id: "81" },
      { catalog: "NGC", id: "3031" },
    ],
    objectType: "galaxy",
    classificationSubtype: "SA(s)ab",
    coordinates: {
      rightAscensionHours: 9.9259,
      declinationDegrees: 69.0653,
    },
    coordinateEpoch: "J2000",
    constellation: "Ursa Major",
    distanceLy: 12_000_000,
    magnitude: 6.9,
    angularSizeArcmin: 27,
    physicalSizeLy: 90_000,
    redshift: -0.000113,
    description:
      "A grand-design spiral and the dominant member of the M81 Group, near the irregular starburst galaxy M82.",
    observationalNotes:
      "Easily found with binoculars under dark skies near the Big Dipper. M81 and M82 form a popular wide-field imaging pair; gravitational interaction has disturbed both systems.",
    discovery: "Discovered by Johann Elert Bode in 1774.",
    referenceImage: {
      src: "/assets/images/reference/m81-bode.webp",
      alt: "Reference image of Bode's Galaxy",
      credit: "NASA / ESA / Hubble Heritage Team",
      sourceName: "Hubble Space Telescope",
      sourceUrl: "https://esahubble.org/",
      width: 1200,
      height: 900,
    },
  },
  {
    id: "obj-m27",
    slug: "dumbbell-nebula",
    commonName: "Dumbbell Nebula",
    aliases: ["Apple Core Nebula", "Messier 27"],
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
    physicalSizeLy: 2.5,
    description:
      "A large, bright planetary nebula with a distinctive bipolar shape — among the easiest of its class for small telescopes.",
    observationalNotes:
      "Appears as an apple-core or dumbbell glow in modest apertures. The bipolar lobes are denser ejecta from the dying central star; the fainter outer halo needs darker skies or imaging.",
    discovery: "Discovered by Charles Messier in 1764 — the first planetary nebula he catalogued.",
    referenceImage: {
      src: "/assets/images/reference/m27-dumbbell.webp",
      alt: "Reference image of the Dumbbell Nebula",
      credit: "NASA / ESA / J. Hester",
      sourceName: "Hubble Space Telescope",
      sourceUrl: "https://esahubble.org/",
      width: 1000,
      height: 1000,
    },
  },
];

const byId = new Map(deepSkyObjects.map((object) => [object.id, object]));
const bySlug = new Map(deepSkyObjects.map((object) => [object.slug, object]));

export function getDeepSkyObjectById(
  id: string,
): CelestialObject | undefined {
  return byId.get(id);
}

export function getDeepSkyObjectBySlug(
  slug: string,
): CelestialObject | undefined {
  return bySlug.get(slug);
}

export function listDeepSkyObjects(): readonly CelestialObject[] {
  return deepSkyObjects;
}
