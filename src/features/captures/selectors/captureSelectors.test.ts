import { describe, expect, it } from "vitest";

import {
  getCaptureById,
  getCaptureBySlug,
  getCaptureDisplayImage,
  getCapturesForObject,
  getFeaturedCaptureForObject,
  getViewerImageAsset,
  hasPersonalCapture,
} from "./captureSelectors";

describe("captureSelectors", () => {
  it("looks up by id and slug", () => {
    expect(getCaptureById("cap-orion-2024")?.slug).toBe(
      "orion-2024-broadband",
    );
    expect(getCaptureBySlug("orion-2025-narrowband")?.id).toBe(
      "cap-orion-2025-nb",
    );
  });

  it("supports multiple captures per target object", () => {
    const captures = getCapturesForObject("obj-m42");
    expect(captures.length).toBeGreaterThanOrEqual(2);
    expect(captures.every((c) => c.targetObjectId === "obj-m42")).toBe(true);
    expect(hasPersonalCapture("obj-m42")).toBe(true);
    expect(hasPersonalCapture("obj-m57")).toBe(false);
  });

  it("prefers featured capture when present", () => {
    const featured = getFeaturedCaptureForObject("obj-m42");
    expect(featured?.id).toBe("cap-orion-2024");
    expect(featured?.featured).toBe(true);
  });

  it("selects derivatives by context", () => {
    const capture = getCaptureById("cap-orion-2024");
    expect(capture).toBeTruthy();
    if (!capture) {
      return;
    }
    expect(getCaptureDisplayImage(capture, "thumbnail").src).toContain(
      "thumbnail.webp",
    );
    expect(getCaptureDisplayImage(capture, "panel").src).toContain(
      "preview.webp",
    );
    expect(getCaptureDisplayImage(capture, "viewer").src).toContain(
      "preview-hq.webp",
    );
  });

  it("falls back to preview when HQ is absent", () => {
    const capture = getCaptureById("cap-orion-2025-nb");
    expect(capture).toBeTruthy();
    if (!capture) {
      return;
    }
    expect(getViewerImageAsset(capture.images).src).toContain("preview.webp");
    expect(capture.images.highQualityPreview).toBeUndefined();
  });
});
