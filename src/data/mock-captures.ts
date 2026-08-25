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
    slug: "orion-2024-broadband",
    targetObjectId: "obj-m42",
    title: "Orion Nebula — broadband placeholder",
    description:
      "PLACEHOLDER capture record demonstrating multi-night broadband metadata.",
    featured: true,
    captureStartDate: "2024-12-12",
    captureEndDate: "2024-12-14",
    location: {
      privacy: "region",
      region: "Example region (placeholder)",
      country: "United States",
    },
    equipment: {
      telescope: "Placeholder 80mm refractor",
      camera: "Placeholder cooled CMOS",
      mount: "Placeholder equatorial mount",
      filters: ["L", "R", "G", "B"],
      accessories: ["Placeholder field flattener"],
    },
    acquisition: {
      exposureGroups: [
        { filter: "L", exposureSeconds: 180, frameCount: 40 },
        { filter: "R", exposureSeconds: 180, frameCount: 20 },
        { filter: "G", exposureSeconds: 180, frameCount: 20 },
        { filter: "B", exposureSeconds: 180, frameCount: 20 },
      ],
      sensitivity: "Gain 100 (placeholder)",
    },
    processing: {
      software: ["PixInsight", "Photoshop"],
      notes: "PLACEHOLDER processing notes.",
    },
    images: {
      thumbnail: {
        src: "/assets/astrophotography/captures/cap-orion-2024/thumbnail.webp",
        width: 640,
        height: 427,
        alt: "Placeholder thumbnail of my broadband photograph of the Orion Nebula",
        bytes: 44,
      },
      preview: {
        src: "/assets/astrophotography/captures/cap-orion-2024/preview.webp",
        width: 1920,
        height: 1280,
        alt: "Placeholder preview of my broadband photograph of the Orion Nebula",
        bytes: 44,
      },
      highQualityPreview: {
        src: "/assets/astrophotography/captures/cap-orion-2024/preview-hq.webp",
        width: 3200,
        height: 2133,
        alt: "Placeholder high-quality web preview of my broadband photograph of the Orion Nebula",
        bytes: 44,
      },
    },
    notes:
      "PLACEHOLDER — replace with real acquisition/processing context when publishing.",
    celestialCoordinates: {
      rightAscensionHours: 5.588,
      declinationDegrees: -5.391,
    },
    relatedProjectIds: ["proj-personal-site"],
  },
  {
    id: "cap-orion-2025-nb",
    slug: "orion-2025-narrowband",
    targetObjectId: "obj-m42",
    title: "Orion Nebula — narrowband placeholder",
    description:
      "PLACEHOLDER second capture of the same target (narrowband workflow example).",
    captureStartDate: "2025-01-18",
    captureEndDate: "2025-01-20",
    location: {
      privacy: "hidden",
    },
    equipment: {
      telescope: "Placeholder 80mm refractor",
      camera: "Placeholder mono CMOS",
      mount: "Placeholder equatorial mount",
      filters: ["Ha", "OIII"],
    },
    acquisition: {
      exposureGroups: [
        { filter: "Ha", exposureSeconds: 300, frameCount: 30 },
        { filter: "OIII", exposureSeconds: 300, frameCount: 20 },
      ],
      sensitivity: "Gain 100 (placeholder)",
    },
    processing: {
      software: ["PixInsight"],
    },
    images: {
      thumbnail: {
        src: "/assets/astrophotography/captures/cap-orion-2025-nb/thumbnail.webp",
        width: 640,
        height: 427,
        alt: "Placeholder thumbnail of my narrowband photograph of the Orion Nebula",
        bytes: 44,
      },
      preview: {
        src: "/assets/astrophotography/captures/cap-orion-2025-nb/preview.webp",
        width: 1920,
        height: 1280,
        alt: "Placeholder preview of my narrowband photograph of the Orion Nebula",
        bytes: 44,
      },
    },
    notes: "PLACEHOLDER — demonstrates multiple captures per object without HQ preview.",
    celestialCoordinates: {
      rightAscensionHours: 5.588,
      declinationDegrees: -5.391,
    },
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
