import { afterEach, describe, expect, it } from "vitest";

import { SKY_NAVIGATION } from "@/config/sky-navigation";
import { applySkyFov, skyRuntime } from "@/state/sky-runtime";
import {
  handleSkyWheelDelta,
  resetSkyWheelExitState,
  SKY_EXIT_EDGE_SETTLE_MS,
  SKY_EXIT_OVERSCROLL_THRESHOLD,
} from "./sky-wheel-policy";

afterEach(() => {
  resetSkyWheelExitState();
  applySkyFov(SKY_NAVIGATION.defaultFov);
});

describe("handleSkyWheelDelta", () => {
  it("zooms in from max FOV instead of exiting", () => {
    applySkyFov(SKY_NAVIGATION.maxFov);
    const result = handleSkyWheelDelta(-80, 1_000);
    expect(result).toBe("zoom");
    expect(skyRuntime.fov).toBeLessThan(SKY_NAVIGATION.maxFov);
  });

  it("does not exit immediately when hitting max FOV", () => {
    applySkyFov(SKY_NAVIGATION.maxFov - 0.01);
    // Push to max
    handleSkyWheelDelta(80, 1_000);
    expect(skyRuntime.fov).toBeCloseTo(SKY_NAVIGATION.maxFov, 5);
    // Immediate further zoom-out should settle, not exit
    expect(handleSkyWheelDelta(80, 1_010)).toBe("none");
  });

  it("exits only after settle + overscroll threshold at max FOV", () => {
    applySkyFov(SKY_NAVIGATION.maxFov);
    const t0 = 5_000;
    expect(handleSkyWheelDelta(80, t0)).toBe("none");

    const settled = t0 + SKY_EXIT_EDGE_SETTLE_MS + 1;
    let total = 0;
    let result = "none";
    while (total < SKY_EXIT_OVERSCROLL_THRESHOLD + 40) {
      result = handleSkyWheelDelta(40, settled);
      total += 40;
      if (result === "exit-to-portfolio") {
        break;
      }
    }
    expect(result).toBe("exit-to-portfolio");
  });

  it("clears exit intent when zooming back in", () => {
    applySkyFov(SKY_NAVIGATION.maxFov);
    const t0 = 8_000;
    handleSkyWheelDelta(80, t0 + SKY_EXIT_EDGE_SETTLE_MS + 1);
    handleSkyWheelDelta(80, t0 + SKY_EXIT_EDGE_SETTLE_MS + 2);
    // Zoom in
    expect(handleSkyWheelDelta(-60, t0 + SKY_EXIT_EDGE_SETTLE_MS + 3)).toBe(
      "zoom",
    );
    // Return to max — should need a fresh settle, not instant exit
    applySkyFov(SKY_NAVIGATION.maxFov);
    resetSkyWheelExitState();
    applySkyFov(SKY_NAVIGATION.maxFov);
    const t1 = 20_000;
    expect(handleSkyWheelDelta(200, t1)).toBe("none");
  });
});
