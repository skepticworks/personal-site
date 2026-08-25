import { describe, expect, it } from "vitest";

import {
  formatAngularSizeArcmin,
  formatCatalogIdentifier,
  formatDeclination,
  formatDistanceLy,
  formatMagnitude,
  formatObjectType,
  formatRightAscension,
} from "./astronomyFormatting";

describe("formatRightAscension", () => {
  it("formats hours as hh mm ss", () => {
    // 5.5881 h ≈ 05h 35m 17s
    expect(formatRightAscension(5.5881)).toBe("05h 35m 17s");
  });

  it("wraps at 24h", () => {
    expect(formatRightAscension(24)).toBe("00h 00m 00s");
  });
});

describe("formatDeclination", () => {
  it("formats positive and negative degrees", () => {
    expect(formatDeclination(-5.3911)).toBe("−05° 23′ 28″");
    expect(formatDeclination(41.2692)).toBe("+41° 16′ 09″");
  });
});

describe("formatDistanceLy", () => {
  it("uses light-years for nearby objects", () => {
    expect(formatDistanceLy(1344)).toBe("1,344 light-years");
  });

  it("scales to millions", () => {
    expect(formatDistanceLy(2_500_000)).toBe("2.5 million light-years");
    expect(formatDistanceLy(23_000_000)).toBe("23 million light-years");
  });
});

describe("formatMagnitude", () => {
  it("keeps concise decimals", () => {
    expect(formatMagnitude(3.44)).toBe("3.44");
    expect(formatMagnitude(4)).toBe("4");
  });
});

describe("formatAngularSizeArcmin", () => {
  it("chooses degree / arcmin / arcsec units", () => {
    expect(formatAngularSizeArcmin(190)).toBe("3.17°");
    expect(formatAngularSizeArcmin(65)).toMatch(/1\.0[0-9]?°/);
    expect(formatAngularSizeArcmin(20)).toBe("20′");
    expect(formatAngularSizeArcmin(1.4)).toBe("1.4′");
    expect(formatAngularSizeArcmin(0.5)).toBe("30″");
  });
});

describe("formatCatalogIdentifier", () => {
  it("formats Messier without a space", () => {
    expect(formatCatalogIdentifier({ catalog: "M", id: "31" })).toBe("M31");
  });

  it("formats NGC with a space", () => {
    expect(formatCatalogIdentifier({ catalog: "NGC", id: "224" })).toBe(
      "NGC 224",
    );
  });
});

describe("formatObjectType", () => {
  it("maps slugs to readable labels", () => {
    expect(formatObjectType("open-cluster")).toBe("Open Cluster");
    expect(formatObjectType("planetary-nebula")).toBe("Planetary Nebula");
    expect(formatObjectType("supernova-remnant")).toBe("Supernova Remnant");
  });
});
