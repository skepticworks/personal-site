import type { AstrophotographyCapture } from "@/types/captures";

/**
 * Representative capture records for architecture and UI development.
 *
 * PLACEHOLDER — equipment, locations, dates, and integration values below are
 * structural examples only. They are not real personal observing data and
 * should be replaced when publishing actual captures.
 *
 * Image files under `public/assets/astrophotography/captures/<id>/` are tiny
 * web-derivative stubs that satisfy the publishing contract (not real photos).
 */
export const mockCaptures: AstrophotographyCapture[] = [
  {
    id: "cap-orion-2024",
    slug: "orion-nebula-widefield",
    targetObjectId: "obj-m42",
    title: "Orion Nebula",
    description:
      "Wide-field personal photograph of the Orion Nebula. Acquisition metadata still TBD.",
    featured: true,
    location: {
      privacy: "hidden",
    },
    equipment: {
      camera: "Details TBD",
    },
    acquisition: {},
    images: {
      thumbnail: {
        src: "/assets/astrophotography/captures/cap-orion-2024/thumbnail.webp",
        width: 640,
        height: 442,
        alt: "My wide-field photograph of the Orion Nebula",
        bytes: 4190,
      },
      preview: {
        src: "/assets/astrophotography/captures/cap-orion-2024/preview.webp",
        width: 1024,
        height: 707,
        alt: "My wide-field photograph of the Orion Nebula showing pink and white nebulosity in Orion’s Sword",
        bytes: 9816,
      },
    },
    celestialCoordinates: {
      rightAscensionHours: 5.588,
      declinationDegrees: -5.391,
    },
    relatedProjectIds: ["proj-personal-site"],
  },
  {
    id: "cap-andromeda-2025",
    slug: "andromeda-2025",
    targetObjectId: "obj-m31",
    title: "Andromeda Galaxy — placeholder",
    description:
      "PLACEHOLDER single-night wide-field capture record for M31.",
    featured: true,
    capturedAt: "2025-10-05",
    captureStartDate: "2025-10-05",
    location: {
      privacy: "approximate",
      region: "Example region (placeholder)",
      country: "United States",
      approximateCoordinates: {
        latitudeDegrees: 42.0,
        longitudeDegrees: -74.0,
      },
    },
    equipment: {
      lens: "Placeholder 135mm f/2",
      camera: "Placeholder full-frame CMOS",
      mount: "Placeholder star tracker",
      filters: ["UV/IR cut"],
    },
    acquisition: {
      subframeCount: 72,
      subframeExposureSeconds: 120,
      integrationSeconds: 8640,
      sensitivity: "ISO 800 (placeholder)",
    },
    processing: {
      software: ["Siril", "GIMP"],
    },
    images: {
      thumbnail: {
        src: "/assets/astrophotography/captures/cap-andromeda-2025/thumbnail.webp",
        width: 640,
        height: 360,
        alt: "Placeholder thumbnail of my photograph of the Andromeda Galaxy",
        bytes: 44,
      },
      preview: {
        src: "/assets/astrophotography/captures/cap-andromeda-2025/preview.webp",
        width: 1920,
        height: 1080,
        alt: "Placeholder preview of my photograph of the Andromeda Galaxy",
        bytes: 44,
      },
    },
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
