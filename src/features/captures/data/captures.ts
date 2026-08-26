import type { AstrophotographyCapture } from "@/types/captures";

/**
 * Published astrophotography captures (web derivatives only).
 *
 * Image files live under `public/assets/astrophotography/captures/<id>/`.
 * See docs/content.md for authoring steps.
 */
export const publishedCaptures: AstrophotographyCapture[] = [
  {
    id: "cap-orion-2024",
    slug: "orion-nebula-widefield",
    targetObjectId: "obj-m42",
    title: "Orion Nebula",
    description:
      "Wide-field personal photograph of the Orion Nebula. Acquisition metadata still TBD.",
    featured: true,
    sortOrder: 10,
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
    slug: "andromeda-galaxy",
    targetObjectId: "obj-m31",
    title: "Andromeda Galaxy",
    description:
      "Wide-field personal photograph of the Andromeda Galaxy (M31), with companions M32 and M110 visible near the bright core.",
    featured: true,
    sortOrder: 20,
    location: {
      privacy: "region",
      region: "South Florida",
      country: "United States",
    },
    equipment: {
      camera: "Details TBD",
    },
    acquisition: {},
    images: {
      thumbnail: {
        src: "/assets/astrophotography/captures/cap-andromeda-2025/thumbnail.webp",
        width: 640,
        height: 479,
        alt: "My photograph of the Andromeda Galaxy showing the bright core and extended disk",
        bytes: 51554,
      },
      preview: {
        src: "/assets/astrophotography/captures/cap-andromeda-2025/preview.webp",
        width: 1024,
        height: 767,
        alt: "My photograph of the Andromeda Galaxy (M31) with companion galaxies M32 and M110 against a dense star field",
        bytes: 208616,
      },
    },
    celestialCoordinates: {
      rightAscensionHours: 0.712,
      declinationDegrees: 41.269,
    },
    relatedProjectIds: ["proj-personal-site"],
  },
];

/** @deprecated Prefer `publishedCaptures` — kept for transitional imports. */
export const mockCaptures = publishedCaptures;
