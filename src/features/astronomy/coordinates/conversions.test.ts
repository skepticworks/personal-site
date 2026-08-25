import { describe, expect, it } from "vitest";

import {
  angularSeparationDegrees,
  equatorialAngularSeparationDegrees,
} from "./angular";
import {
  getCameraForward,
  getLookQuaternionForCelestialTarget,
  getLookQuaternionForDirection,
  quatAngularDistanceRadians,
  slerpQuat,
} from "./camera-orientation";
import {
  cartesianToEquatorial,
  equatorialToCartesian,
  equatorialToDirection,
} from "./conversions";
import {
  normalizeEquatorialCoordinates,
  normalizeRightAscensionHours,
  rightAscensionDegreesToHours,
  rightAscensionHoursToDegrees,
} from "./equatorial";

describe("normalizeRightAscensionHours", () => {
  it("keeps values in [0, 24)", () => {
    expect(normalizeRightAscensionHours(0)).toBe(0);
    expect(normalizeRightAscensionHours(12)).toBe(12);
    expect(normalizeRightAscensionHours(23.999)).toBeCloseTo(23.999, 10);
  });

  it("wraps at 24 and negative values", () => {
    expect(normalizeRightAscensionHours(24)).toBe(0);
    expect(normalizeRightAscensionHours(25.5)).toBeCloseTo(1.5, 10);
    expect(normalizeRightAscensionHours(-1)).toBeCloseTo(23, 10);
    expect(normalizeRightAscensionHours(-24)).toBe(0);
    expect(normalizeRightAscensionHours(-25)).toBeCloseTo(23, 10);
  });
});

describe("RA hour/degree conversion", () => {
  it("converts hours to degrees and back", () => {
    expect(rightAscensionHoursToDegrees(0)).toBe(0);
    expect(rightAscensionHoursToDegrees(6)).toBe(90);
    expect(rightAscensionHoursToDegrees(12)).toBe(180);
    expect(rightAscensionHoursToDegrees(18)).toBe(270);
    expect(rightAscensionDegreesToHours(90)).toBe(6);
    expect(rightAscensionDegreesToHours(360)).toBe(0);
  });
});

describe("normalizeEquatorialCoordinates", () => {
  it("normalizes RA and accepts valid Dec", () => {
    const result = normalizeEquatorialCoordinates({
      rightAscensionHours: 25,
      declinationDegrees: 45,
    });
    expect(result.rightAscensionHours).toBeCloseTo(1, 10);
    expect(result.declinationDegrees).toBe(45);
  });

  it("rejects invalid declination", () => {
    expect(() =>
      normalizeEquatorialCoordinates({
        rightAscensionHours: 1,
        declinationDegrees: 91,
      }),
    ).toThrow(/declinationDegrees/);
  });
});

describe("equatorialToCartesian conventions", () => {
  it("maps Dec +90° to +Y (celestial north pole)", () => {
    const v = equatorialToDirection({
      rightAscensionHours: 0,
      declinationDegrees: 90,
    });
    expect(v.x).toBeCloseTo(0, 10);
    expect(v.y).toBeCloseTo(1, 10);
    expect(v.z).toBeCloseTo(0, 10);
  });

  it("maps Dec −90° to −Y (celestial south pole)", () => {
    const v = equatorialToDirection({
      rightAscensionHours: 5,
      declinationDegrees: -90,
    });
    expect(v.x).toBeCloseTo(0, 10);
    expect(v.y).toBeCloseTo(-1, 10);
    expect(v.z).toBeCloseTo(0, 10);
  });

  it("places Dec 0 on the celestial equator (y ≈ 0)", () => {
    const v = equatorialToDirection({
      rightAscensionHours: 3,
      declinationDegrees: 0,
    });
    expect(v.y).toBeCloseTo(0, 10);
    expect(Math.hypot(v.x, v.y, v.z)).toBeCloseTo(1, 10);
  });

  it("places RA = 0h, Dec = 0° along +Z", () => {
    const v = equatorialToDirection({
      rightAscensionHours: 0,
      declinationDegrees: 0,
    });
    expect(v.x).toBeCloseTo(0, 10);
    expect(v.y).toBeCloseTo(0, 10);
    expect(v.z).toBeCloseTo(1, 10);
  });

  it("places RA = 6h, Dec = 0° along +X", () => {
    const v = equatorialToDirection({
      rightAscensionHours: 6,
      declinationDegrees: 0,
    });
    expect(v.x).toBeCloseTo(1, 10);
    expect(v.y).toBeCloseTo(0, 10);
    expect(v.z).toBeCloseTo(0, 10);
  });

  it("maps RA values 12h apart to opposite directions", () => {
    const a = equatorialToDirection({
      rightAscensionHours: 2,
      declinationDegrees: 20,
    });
    const b = equatorialToDirection({
      rightAscensionHours: 14,
      declinationDegrees: 20,
    });
    expect(a.x + b.x).toBeCloseTo(0, 10);
    expect(a.y).toBeCloseTo(b.y, 10);
    expect(a.z + b.z).toBeCloseTo(0, 10);
  });

  it("wraps RA 0 and 24 to the same direction", () => {
    const a = equatorialToDirection({
      rightAscensionHours: 0,
      declinationDegrees: 10,
    });
    const b = equatorialToDirection({
      rightAscensionHours: 24,
      declinationDegrees: 10,
    });
    expect(a.x).toBeCloseTo(b.x, 10);
    expect(a.y).toBeCloseTo(b.y, 10);
    expect(a.z).toBeCloseTo(b.z, 10);
  });

  it("scales by radius", () => {
    const v = equatorialToCartesian(
      { rightAscensionHours: 0, declinationDegrees: 0 },
      50,
    );
    expect(v.z).toBeCloseTo(50, 10);
  });

  it("round-trips through cartesianToEquatorial on the equator", () => {
    const original = {
      rightAscensionHours: 7.5,
      declinationDegrees: -12,
    };
    const cart = equatorialToDirection(original);
    const back = cartesianToEquatorial(cart);
    expect(back.rightAscensionHours).toBeCloseTo(original.rightAscensionHours, 8);
    expect(back.declinationDegrees).toBeCloseTo(original.declinationDegrees, 8);
  });
});

describe("angular separation", () => {
  it("is ~180° for opposite equatorial points", () => {
    const sep = equatorialAngularSeparationDegrees(
      { rightAscensionHours: 0, declinationDegrees: 0 },
      { rightAscensionHours: 12, declinationDegrees: 0 },
    );
    expect(sep).toBeCloseTo(180, 8);
  });

  it("is 0 for identical directions", () => {
    const d = equatorialToDirection({
      rightAscensionHours: 1,
      declinationDegrees: 2,
    });
    expect(angularSeparationDegrees(d, d)).toBeCloseTo(0, 4);
  });
});

describe("camera look quaternion", () => {
  it("aims camera forward at the celestial target direction", () => {
    const coords = { rightAscensionHours: 4, declinationDegrees: 25 };
    const direction = equatorialToDirection(coords);
    const q = getLookQuaternionForCelestialTarget(coords);
    const forward = getCameraForward(q);
    expect(forward.x).toBeCloseTo(direction.x, 6);
    expect(forward.y).toBeCloseTo(direction.y, 6);
    expect(forward.z).toBeCloseTo(direction.z, 6);
  });

  it("chooses a short slerp path across RA wrap", () => {
    const qA = getLookQuaternionForDirection(
      equatorialToDirection({
        rightAscensionHours: 23.5,
        declinationDegrees: 0,
      }),
    );
    const qB = getLookQuaternionForDirection(
      equatorialToDirection({
        rightAscensionHours: 0.5,
        declinationDegrees: 0,
      }),
    );
    const mid = slerpQuat(qA, qB, 0.5);
    const distDirect = quatAngularDistanceRadians(qA, qB);
    const distViaMid =
      quatAngularDistanceRadians(qA, mid) + quatAngularDistanceRadians(mid, qB);
    expect(distDirect).toBeLessThan(Math.PI / 2);
    expect(distViaMid).toBeCloseTo(distDirect, 5);
  });
});
