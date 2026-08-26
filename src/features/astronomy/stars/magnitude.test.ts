import { describe, expect, it } from "vitest";

import {
  colorIndexToRgb,
  magnitudeToBrightness,
  magnitudeToIntensity,
  magnitudeToPointSize,
} from "@/features/astronomy/stars/magnitude";

describe("magnitude rendering", () => {
  it("maps brighter magnitudes to larger sizes and intensity", () => {
    expect(magnitudeToPointSize(-1)).toBeGreaterThan(magnitudeToPointSize(6));
    expect(magnitudeToIntensity(-1)).toBeGreaterThan(magnitudeToIntensity(6));
    expect(magnitudeToBrightness(-1)).toBeGreaterThan(magnitudeToBrightness(6));
  });

  it("keeps faint stars visible but subdued", () => {
    expect(magnitudeToIntensity(7)).toBeGreaterThan(0.1);
    expect(magnitudeToIntensity(7)).toBeLessThan(0.45);
  });

  it("returns muted color tints from B−V", () => {
    const cool = colorIndexToRgb(-0.2);
    const warm = colorIndexToRgb(1.4);
    expect(cool.b).toBeGreaterThan(cool.r);
    expect(warm.r).toBeGreaterThan(warm.b);
    // Stay near white — avoid neon saturation.
    expect(cool.r).toBeGreaterThan(0.75);
    expect(warm.g).toBeGreaterThan(0.75);
  });
});
