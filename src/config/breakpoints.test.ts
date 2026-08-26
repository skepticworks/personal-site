import { describe, expect, it } from "vitest";

import {
  resolveInteractionPresentation,
  resolveViewportClass,
} from "@/config/breakpoints";
import { PERFORMANCE_BUDGETS } from "@/config/performance-budgets";
import { isValidEquatorialCoordinates } from "@/features/astronomy/coordinates/validate";
import { buildCaptureSrcSet } from "@/lib/responsive-image";
import { describeWebGlFailure } from "@/lib/webgl-support";
import type { CaptureImageSet } from "@/types/assets";

describe("resolveViewportClass", () => {
  it("classifies phone, tablet, laptop, and large desktop by width", () => {
    expect(resolveViewportClass(390, 844)).toBe("phone");
    expect(resolveViewportClass(820, 1180)).toBe("tablet");
    expect(resolveViewportClass(1280, 800)).toBe("laptop");
    expect(resolveViewportClass(1600, 900)).toBe("large-desktop");
  });

  it("marks unusually short viewports", () => {
    expect(resolveViewportClass(1024, 480)).toBe("short");
  });
});

describe("resolveInteractionPresentation", () => {
  it("uses mobile sheets on compact widths", () => {
    expect(
      resolveInteractionPresentation({
        width: 390,
        height: 844,
        coarsePointer: true,
        canHover: false,
      }),
    ).toBe("mobile-sheets");
  });

  it("keeps floating windows on fine-pointer desktops", () => {
    expect(
      resolveInteractionPresentation({
        width: 1440,
        height: 900,
        coarsePointer: false,
        canHover: true,
      }),
    ).toBe("desktop-windows");
  });

  it("prefers tablet panels for mid-width coarse pointers", () => {
    expect(
      resolveInteractionPresentation({
        width: 900,
        height: 700,
        coarsePointer: true,
        canHover: false,
      }),
    ).toBe("tablet-panels");
  });
});

describe("isValidEquatorialCoordinates", () => {
  it("accepts catalog-range coordinates", () => {
    expect(
      isValidEquatorialCoordinates({
        rightAscensionHours: 5.5,
        declinationDegrees: -5.4,
      }),
    ).toBe(true);
  });

  it("rejects NaN and out-of-range values", () => {
    expect(
      isValidEquatorialCoordinates({
        rightAscensionHours: Number.NaN,
        declinationDegrees: 0,
      }),
    ).toBe(false);
    expect(
      isValidEquatorialCoordinates({
        rightAscensionHours: 12,
        declinationDegrees: 95,
      }),
    ).toBe(false);
  });
});

describe("buildCaptureSrcSet", () => {
  const images: CaptureImageSet = {
    thumbnail: {
      src: "/t.webp",
      width: 640,
      height: 400,
      alt: "thumb",
    },
    preview: {
      src: "/p.webp",
      width: 1600,
      height: 1000,
      alt: "preview",
    },
    highQualityPreview: {
      src: "/hq.webp",
      width: 3200,
      height: 2000,
      alt: "hq",
    },
  };

  it("builds multi-width srcset for preview and viewer roles", () => {
    expect(buildCaptureSrcSet(images, "preview")).toContain("640w");
    expect(buildCaptureSrcSet(images, "preview")).toContain("1600w");
    expect(buildCaptureSrcSet(images, "viewer")).toContain("3200w");
  });
});

describe("performance budgets", () => {
  it("defines required soft ceilings", () => {
    expect(PERFORMANCE_BUDGETS.initialJsBeforeSkyKb).toBeGreaterThan(0);
    expect(PERFORMANCE_BUDGETS.astronomyJsChunkKb).toBeGreaterThan(
      PERFORMANCE_BUDGETS.initialJsBeforeSkyKb,
    );
    expect(PERFORMANCE_BUDGETS.maxRendererDpr).toBeLessThanOrEqual(2);
  });
});

describe("webgl failure copy", () => {
  it("returns user-readable messages", () => {
    expect(describeWebGlFailure("unsupported")).toMatch(/WebGL/i);
    expect(describeWebGlFailure("context-failed")).toMatch(/unavailable|failed/i);
  });
});
