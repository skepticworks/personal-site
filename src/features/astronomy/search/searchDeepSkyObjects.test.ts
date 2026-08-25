import { beforeEach, describe, expect, it } from "vitest";

import {
  resetDeepSkySearchIndex,
  searchDeepSkyObjects,
} from "./searchDeepSkyObjects";

describe("searchDeepSkyObjects", () => {
  beforeEach(() => {
    resetDeepSkySearchIndex();
  });

  it("finds objects by common name", () => {
    const hits = searchDeepSkyObjects("Andromeda");
    expect(hits[0]?.object.id).toBe("obj-m31");
  });

  it("finds exact Messier identifiers", () => {
    const hits = searchDeepSkyObjects("M31");
    expect(hits[0]?.object.id).toBe("obj-m31");
  });

  it("finds NGC identifiers with spacing variants", () => {
    const a = searchDeepSkyObjects("NGC 224");
    const b = searchDeepSkyObjects("ngc224");
    expect(a[0]?.object.id).toBe("obj-m31");
    expect(b[0]?.object.id).toBe("obj-m31");
  });

  it("ranks exact catalog matches highly", () => {
    const hits = searchDeepSkyObjects("M42");
    expect(hits[0]?.object.commonName).toBe("Orion Nebula");
  });

  it("matches aliases", () => {
    const hits = searchDeepSkyObjects("Seven Sisters");
    expect(hits[0]?.object.id).toBe("obj-m45");
  });

  it("returns empty for blank queries", () => {
    expect(searchDeepSkyObjects("")).toEqual([]);
    expect(searchDeepSkyObjects("   ")).toEqual([]);
  });

  it("limits result count", () => {
    const hits = searchDeepSkyObjects("m", { limit: 3 });
    expect(hits.length).toBeLessThanOrEqual(3);
  });
});
