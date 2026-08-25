import { describe, expect, it } from "vitest";

import {
  catalogIdentifierToken,
  normalizeCatalogQuery,
  normalizeSearchQuery,
} from "./normalizeSearch";

describe("normalizeSearchQuery", () => {
  it("trims and lowercases", () => {
    expect(normalizeSearchQuery("  Andromeda  ")).toBe("andromeda");
  });
});

describe("normalizeCatalogQuery", () => {
  it("normalizes Messier spacing and case", () => {
    expect(normalizeCatalogQuery("M 31")).toBe("m31");
    expect(normalizeCatalogQuery("M31")).toBe("m31");
    expect(normalizeCatalogQuery("m31")).toBe("m31");
  });

  it("normalizes NGC spacing", () => {
    expect(normalizeCatalogQuery("NGC224")).toBe("ngc224");
    expect(normalizeCatalogQuery("NGC 224")).toBe("ngc224");
    expect(normalizeCatalogQuery("ngc 224")).toBe("ngc224");
  });

  it("rejects bare ambiguous numbers", () => {
    expect(normalizeCatalogQuery("31")).toBeNull();
  });
});

describe("catalogIdentifierToken", () => {
  it("matches query token space", () => {
    expect(catalogIdentifierToken("M", "31")).toBe("m31");
    expect(catalogIdentifierToken("NGC", "224")).toBe("ngc224");
  });
});
