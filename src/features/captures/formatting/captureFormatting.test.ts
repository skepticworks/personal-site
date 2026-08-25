import { describe, expect, it } from "vitest";

import {
  formatAcquisitionSummary,
  formatCaptureDateRange,
  formatExposureGroup,
  formatIntegrationTime,
  formatLocationLabel,
  resolveIntegrationSeconds,
} from "./captureFormatting";
import type { CaptureAcquisition, CaptureLocation } from "@/types/captures";

describe("resolveIntegrationSeconds", () => {
  it("sums exposure groups", () => {
    const acquisition: CaptureAcquisition = {
      exposureGroups: [
        { filter: "Ha", exposureSeconds: 300, frameCount: 30 },
        { filter: "OIII", exposureSeconds: 300, frameCount: 20 },
      ],
    };
    expect(resolveIntegrationSeconds(acquisition)).toBe(15_000);
  });

  it("uses explicit total when groups are absent", () => {
    expect(
      resolveIntegrationSeconds({ integrationSeconds: 3600 }),
    ).toBe(3600);
  });

  it("derives from subframe fields when needed", () => {
    expect(
      resolveIntegrationSeconds({
        subframeCount: 40,
        subframeExposureSeconds: 180,
      }),
    ).toBe(7200);
  });

  it("rejects conflicting duplicated totals", () => {
    expect(() =>
      resolveIntegrationSeconds({
        exposureGroups: [{ exposureSeconds: 300, frameCount: 10 }],
        integrationSeconds: 999,
      }),
    ).toThrow(/Conflicting integration/);
  });
});

describe("formatIntegrationTime", () => {
  it("formats hours and minutes", () => {
    expect(formatIntegrationTime(15_000)).toBe("4h 10m");
  });

  it("formats minutes without raw seconds as primary", () => {
    expect(formatIntegrationTime(2700)).toBe("45m");
  });
});

describe("exposure formatting", () => {
  it("formats filter groups", () => {
    expect(
      formatExposureGroup({
        filter: "Ha",
        exposureSeconds: 300,
        frameCount: 24,
      }),
    ).toBe("Ha: 24 × 5m");
  });

  it("summarizes acquisition lines", () => {
    const lines = formatAcquisitionSummary({
      exposureGroups: [
        { filter: "Ha", exposureSeconds: 300, frameCount: 30 },
        { filter: "OIII", exposureSeconds: 300, frameCount: 20 },
      ],
      sensitivity: "Gain 100",
    });
    expect(lines).toEqual([
      "Ha: 30 × 5m",
      "OIII: 20 × 5m",
      "Gain 100",
    ]);
  });
});

describe("formatCaptureDateRange", () => {
  it("formats single nights", () => {
    expect(formatCaptureDateRange({ start: "2025-10-05" })).toBe(
      "Oct 5, 2025",
    );
  });

  it("formats multi-night ranges", () => {
    expect(
      formatCaptureDateRange({
        start: "2024-12-12",
        end: "2024-12-14",
      }),
    ).toBe("Dec 12, 2024 – Dec 14, 2024");
  });
});

describe("formatLocationLabel", () => {
  it("hides location when privacy is hidden", () => {
    const location: CaptureLocation = { privacy: "hidden" };
    expect(formatLocationLabel(location)).toBeUndefined();
  });

  it("shows region labels", () => {
    expect(
      formatLocationLabel({
        privacy: "region",
        region: "Catskills, New York",
      }),
    ).toBe("Catskills, New York");
  });

  it("labels approximate coordinates clearly", () => {
    expect(
      formatLocationLabel({
        privacy: "approximate",
        region: "Example region",
        approximateCoordinates: {
          latitudeDegrees: 42.0,
          longitudeDegrees: -74.0,
        },
      }),
    ).toBe("Example region (approximate)");
  });

  it("can show exact coordinates when intentionally public", () => {
    const label = formatLocationLabel({
      privacy: "exact",
      label: "Public overlook",
      exactCoordinates: {
        latitudeDegrees: 41.12345,
        longitudeDegrees: -74.98765,
      },
    });
    expect(label).toContain("Public overlook");
    expect(label).toMatch(/41\.1234°/);
  });
});
