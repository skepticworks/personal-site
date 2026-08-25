import { describe, expect, it } from "vitest";

import {
  CAPTURE_URL_PARAM,
  parseCaptureSlugParam,
  resolveCaptureFromSlugParam,
} from "./captureUrl";

describe("captureUrl", () => {
  it("parses capture slugs", () => {
    expect(parseCaptureSlugParam(" Orion-2025-Narrowband ")).toBe(
      "orion-2025-narrowband",
    );
    expect(parseCaptureSlugParam("")).toBeNull();
    expect(CAPTURE_URL_PARAM).toBe("capture");
  });

  it("resolves known capture slugs", () => {
    expect(resolveCaptureFromSlugParam("orion-nebula-widefield")?.id).toBe(
      "cap-orion-2024",
    );
    expect(resolveCaptureFromSlugParam("missing-capture")).toBeUndefined();
  });
});
