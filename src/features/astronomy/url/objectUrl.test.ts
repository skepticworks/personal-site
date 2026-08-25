import { describe, expect, it } from "vitest";

import {
  parseObjectSlugParam,
  resolveObjectFromSlugParam,
} from "./objectUrl";

describe("objectUrl", () => {
  it("parses valid slugs", () => {
    expect(parseObjectSlugParam("andromeda-galaxy")).toBe("andromeda-galaxy");
    expect(resolveObjectFromSlugParam("andromeda-galaxy")?.id).toBe("obj-m31");
  });

  it("handles invalid and empty slugs", () => {
    expect(parseObjectSlugParam("")).toBeNull();
    expect(parseObjectSlugParam("   ")).toBeNull();
    expect(parseObjectSlugParam(null)).toBeNull();
    expect(resolveObjectFromSlugParam("not-real")).toBeUndefined();
  });
});
