import type { AstrophotographyCapture } from "@/types/captures";

/**
 * Mock captures using placeholder web-derivative paths.
 * Image files are not committed; paths document the intended asset layout.
 */
export const mockCaptures: AstrophotographyCapture[] = [
  {
    id: "cap-orion-nebula",
    title: "Orion Nebula (M42)",
    slug: "orion-nebula-m42",
    description:
      "Wide-field capture of the Orion Nebula. Display assets are web-optimized previews only.",
    targetObjectId: "obj-m42",
    preview: {
      src: "/assets/astrophotography/previews/orion-nebula.webp",
      width: 1600,
      height: 1067,
      alt: "My photograph of the Orion Nebula",
    },
    thumbnail: {
      src: "/assets/astrophotography/thumbnails/orion-nebula.webp",
      width: 480,
      height: 320,
      alt: "Thumbnail of my photograph of the Orion Nebula",
    },
    capturedAt: {
      start: "2025-12-12",
      end: "2025-12-13",
    },
    location: {
      name: "Dark-sky site",
      region: "Southwest",
      country: "United States",
      coordinates: {
        latitudeDegrees: 35.0,
        longitudeDegrees: -111.5,
        elevationMeters: 2100,
      },
    },
    equipment: {
      telescope: "80mm f/6 refractor",
      camera: "Cooled CMOS (web-display derivative only)",
      mount: "Equatorial mount",
      filters: ["L", "R", "G", "B"],
    },
    acquisition: {
      integrationSeconds: 14_400,
      subframeCount: 48,
      subframeExposureSeconds: 300,
      sensitivity: "Gain 100",
    },
    processingSoftware: ["PixInsight", "Photoshop"],
    notes: "Placeholder metadata for architecture scaffolding.",
    celestialCoordinates: {
      rightAscensionHours: 5.588,
      declinationDegrees: -5.391,
    },
    relatedProjectIds: ["proj-personal-site"],
  },
  {
    id: "cap-andromeda",
    title: "Andromeda Galaxy (M31)",
    slug: "andromeda-galaxy-m31",
    description:
      "Multi-panel mosaic preview of M31. Original masters are stored offline.",
    targetObjectId: "obj-m31",
    preview: {
      src: "/assets/astrophotography/previews/andromeda.webp",
      width: 1600,
      height: 900,
      alt: "My photograph of the Andromeda Galaxy",
    },
    thumbnail: {
      src: "/assets/astrophotography/thumbnails/andromeda.webp",
      width: 480,
      height: 270,
      alt: "Thumbnail of my photograph of the Andromeda Galaxy",
    },
    capturedAt: {
      start: "2025-10-05",
    },
    location: {
      name: "Backyard observatory",
      country: "United States",
    },
    equipment: {
      telescope: "200mm Newtonian",
      camera: "DSL R / CMOS",
      mount: "Equatorial mount",
      filters: ["UV/IR cut"],
    },
    acquisition: {
      integrationSeconds: 21_600,
      subframeCount: 72,
      subframeExposureSeconds: 300,
    },
    processingSoftware: ["Siril", "GIMP"],
    celestialCoordinates: {
      rightAscensionHours: 0.712,
      declinationDegrees: 41.269,
    },
  },
];

export function getCaptureById(
  id: string,
): AstrophotographyCapture | undefined {
  return mockCaptures.find((capture) => capture.id === id);
}
