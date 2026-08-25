import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  formatAstroAssetViolations,
  validateAstroAssets,
  wouldRejectAstroFilename,
} from "./validateAstroAssets";
import type { AstrophotographyCapture } from "@/types/captures";

describe("astro asset filename policy", () => {
  it("rejects prohibited source formats", () => {
    expect(wouldRejectAstroFilename("master.fit")).toBe(true);
    expect(wouldRejectAstroFilename("stacked.tiff")).toBe(true);
    expect(wouldRejectAstroFilename("lights_001.cr3")).toBe(true);
    expect(wouldRejectAstroFilename("project.xisf")).toBe(true);
  });

  it("accepts intended web derivatives", () => {
    expect(wouldRejectAstroFilename("thumbnail.avif")).toBe(false);
    expect(wouldRejectAstroFilename("preview.webp")).toBe(false);
    expect(wouldRejectAstroFilename("preview-hq.avif")).toBe(false);
  });

  it("rejects unexpected web filenames", () => {
    expect(wouldRejectAstroFilename("original.webp")).toBe(true);
    expect(wouldRejectAstroFilename("master.webp")).toBe(true);
  });
});

describe("validateAstroAssets", () => {
  it("passes for the repository capture catalog", () => {
    const result = validateAstroAssets({ rootDir: process.cwd() });
    if (!result.ok) {
      // Surface clear diagnostics in test output.
      console.error(formatAstroAssetViolations(result.violations));
    }
    expect(result.ok).toBe(true);
  });

  it("detects prohibited files in a fixture tree", () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "astro-assets-"));
    const captureDir = path.join(
      root,
      "public",
      "assets",
      "astrophotography",
      "captures",
      "cap-fixture",
    );
    fs.mkdirSync(captureDir, { recursive: true });
    fs.writeFileSync(path.join(captureDir, "master.fit"), "not-a-real-fit");
    fs.writeFileSync(path.join(captureDir, "thumbnail.webp"), "x");
    fs.writeFileSync(path.join(captureDir, "preview.webp"), "x");

    const capture: AstrophotographyCapture = {
      id: "cap-fixture",
      slug: "fixture",
      targetObjectId: "obj-m42",
      title: "Fixture",
      equipment: { camera: "test" },
      acquisition: {},
      images: {
        thumbnail: {
          src: "/assets/astrophotography/captures/cap-fixture/thumbnail.webp",
          width: 640,
          height: 400,
          alt: "Fixture thumbnail",
        },
        preview: {
          src: "/assets/astrophotography/captures/cap-fixture/preview.webp",
          width: 1600,
          height: 1000,
          alt: "Fixture preview",
        },
      },
      celestialCoordinates: {
        rightAscensionHours: 0,
        declinationDegrees: 0,
      },
    };

    const result = validateAstroAssets({
      rootDir: root,
      captures: [capture],
    });

    expect(result.ok).toBe(false);
    expect(
      result.violations.some((v) => v.file.includes("master.fit")),
    ).toBe(true);

    fs.rmSync(root, { recursive: true, force: true });
  });

  it("detects unknown targetObjectId without filesystem", () => {
    const capture: AstrophotographyCapture = {
      id: "cap-orphan",
      slug: "orphan",
      targetObjectId: "obj-does-not-exist",
      title: "Orphan",
      equipment: { camera: "test" },
      acquisition: {},
      images: {
        thumbnail: {
          src: "/assets/astrophotography/captures/cap-orphan/thumbnail.webp",
          width: 640,
          height: 400,
          alt: "Orphan thumbnail",
        },
        preview: {
          src: "/assets/astrophotography/captures/cap-orphan/preview.webp",
          width: 1600,
          height: 1000,
          alt: "Orphan preview",
        },
      },
      celestialCoordinates: {
        rightAscensionHours: 0,
        declinationDegrees: 0,
      },
    };

    const result = validateAstroAssets({
      captures: [capture],
      checkFilesystem: false,
    });
    expect(result.ok).toBe(false);
    expect(
      result.violations.some((v) =>
        v.violation.includes("Unknown targetObjectId"),
      ),
    ).toBe(true);
  });
});
