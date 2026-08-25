import { describe, expect, it } from "vitest";

import {
  getObjectById,
  getObjectBySlug,
  isValidObjectSlug,
  resolveObjectRef,
} from "./objectSelectors";
import { getPreferredDisplayImage } from "./displayImage";
import {
  getCapturesForObject,
  hasPersonalCapture,
} from "@/features/captures/selectors/captureSelectors";

describe("objectSelectors", () => {
  it("looks up by id and slug", () => {
    expect(getObjectById("obj-m31")?.commonName).toBe("Andromeda Galaxy");
    expect(getObjectBySlug("andromeda-galaxy")?.id).toBe("obj-m31");
    expect(resolveObjectRef("orion-nebula")?.id).toBe("obj-m42");
  });

  it("rejects invalid slugs", () => {
    expect(getObjectBySlug("not-a-real-object")).toBeUndefined();
    expect(isValidObjectSlug("nope")).toBe(false);
    expect(isValidObjectSlug("andromeda-galaxy")).toBe(true);
  });
});

describe("capture relationships", () => {
  it("joins captures by targetObjectId, not name", () => {
    const captures = getCapturesForObject("obj-m42");
    expect(captures.length).toBeGreaterThanOrEqual(2);
    expect(captures.every((c) => c.targetObjectId === "obj-m42")).toBe(true);
    expect(hasPersonalCapture("obj-m42")).toBe(true);
    expect(hasPersonalCapture("obj-m57")).toBe(false);
  });
});

describe("getPreferredDisplayImage", () => {
  it("prefers personal photography over reference imagery", () => {
    const display = getPreferredDisplayImage("obj-m31");
    expect(display.kind).toBe("personal");
    if (display.kind === "personal") {
      expect(display.capture.targetObjectId).toBe("obj-m31");
      expect(display.image.src).toContain("preview");
    }
  });

  it("honors an explicit selected capture", () => {
    const display = getPreferredDisplayImage("obj-m42", "cap-orion-2025-nb");
    expect(display.kind).toBe("personal");
    if (display.kind === "personal") {
      expect(display.capture.id).toBe("cap-orion-2025-nb");
      expect(display.captureCount).toBeGreaterThanOrEqual(2);
    }
  });

  it("uses reference imagery when no personal capture exists", () => {
    const display = getPreferredDisplayImage("obj-m57");
    expect(display.kind).toBe("reference");
    if (display.kind === "reference") {
      expect(display.image.credit).toBeTruthy();
    }
  });
});
