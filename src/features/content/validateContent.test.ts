import { describe, expect, it } from "vitest";

import { validateContent } from "@/features/content/validateContent";
import type { AstrophotographyCapture } from "@/types/captures";
import type { CelestialObject } from "@/types/astronomy";
import type { PortfolioProject } from "@/types/portfolio";

const baseObject: CelestialObject = {
  id: "obj-test",
  slug: "test-object",
  commonName: "Test Object",
  catalogIds: [{ catalog: "M", id: "1" }],
  objectType: "galaxy",
  coordinates: {
    rightAscensionHours: 1,
    declinationDegrees: 2,
  },
};

const baseProject: PortfolioProject = {
  id: "proj-test",
  slug: "test-project",
  title: "Test",
  summary: "Summary",
  description: "Description",
  highlights: [],
  category: "web",
  status: "active",
  technologies: [],
  links: {},
  images: [],
  featured: false,
  startedAt: "2026-01-01",
};

const baseCapture: AstrophotographyCapture = {
  id: "cap-test",
  slug: "test-capture",
  targetObjectId: "obj-test",
  title: "Test capture",
  equipment: { camera: "Test" },
  acquisition: {},
  images: {
    thumbnail: {
      src: "/assets/astrophotography/captures/cap-test/thumbnail.webp",
      width: 100,
      height: 100,
      alt: "Thumbnail",
    },
    preview: {
      src: "/assets/astrophotography/captures/cap-test/preview.webp",
      width: 200,
      height: 200,
      alt: "Preview",
    },
  },
  celestialCoordinates: {
    rightAscensionHours: 1,
    declinationDegrees: 2,
  },
};

describe("validateContent", () => {
  it("accepts consistent project/object/capture sets", () => {
    const result = validateContent({
      projects: [baseProject],
      objects: [baseObject],
      captures: [baseCapture],
    });
    expect(result.ok).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it("reports unknown capture→object references clearly", () => {
    const result = validateContent({
      projects: [],
      objects: [baseObject],
      captures: [
        {
          ...baseCapture,
          targetObjectId: "obj-missing",
        },
      ],
    });
    expect(result.ok).toBe(false);
    expect(result.violations[0]?.message).toContain(
      'references unknown object "obj-missing"',
    );
  });

  it("reports unknown project→capture references", () => {
    const result = validateContent({
      projects: [
        {
          ...baseProject,
          relatedCaptureIds: ["cap-missing"],
        },
      ],
      objects: [baseObject],
      captures: [baseCapture],
    });
    expect(result.ok).toBe(false);
    expect(
      result.violations.some((v) =>
        v.message.includes('unknown capture "cap-missing"'),
      ),
    ).toBe(true);
  });

  it("rejects duplicate object ids", () => {
    const result = validateContent({
      projects: [],
      objects: [baseObject, { ...baseObject, slug: "other-slug" }],
      captures: [],
    });
    expect(result.ok).toBe(false);
    expect(result.violations[0]?.message).toContain("Duplicate object id");
  });
});
