"use client";

import { useEffect, useState } from "react";

import { getCameraForward } from "@/features/astronomy/coordinates/camera-orientation";
import { cartesianToEquatorial } from "@/features/astronomy/coordinates/conversions";
import { useExperienceStore } from "@/state/experience-store";
import { skyRuntime, subscribeSkyUi } from "@/state/sky-runtime";

/**
 * Development-only sky engine observability. Never rendered in production.
 * Samples at a low rate — does not push React state every animation frame.
 */
export function SkyDebugOverlay() {
  const enabled = process.env.NODE_ENV === "development";
  const selectedId = useExperienceStore(
    (state) => state.selectedCelestialObjectId,
  );
  const qualityPref = useExperienceStore(
    (state) => state.skyRenderQualityPreference,
  );
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const unsub = subscribeSkyUi(() => setTick((value) => value + 1));
    const id = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 250);
    return () => {
      unsub();
      window.clearInterval(id);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  void tick;
  const forward = getCameraForward(skyRuntime.orientation);
  let lookRa = "—";
  let lookDec = "—";
  try {
    const eq = cartesianToEquatorial(forward);
    lookRa = eq.rightAscensionHours.toFixed(3);
    lookDec = eq.declinationDegrees.toFixed(2);
  } catch {
    // ignore
  }

  return (
    <div className="sky-debug-overlay" aria-hidden="true">
      <div>sky cam: {skyRuntime.cameraMode}</div>
      <div>
        look RA {lookRa}h / Dec {lookDec}°
      </div>
      <div>FOV {skyRuntime.fov.toFixed(1)}°</div>
      <div>selected: {selectedId ?? "none"}</div>
      <div>hover: {skyRuntime.hoveredObjectId ?? "none"}</div>
      <div>
        quality: {skyRuntime.quality} ({qualityPref})
      </div>
      <div>labels: {skyRuntime.visibleLabelCount}</div>
    </div>
  );
}
