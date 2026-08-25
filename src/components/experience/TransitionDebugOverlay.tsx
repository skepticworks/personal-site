"use client";

import { useEffect, useState } from "react";

import {
  readLogicalSnapshot,
  subscribeTransitionLogical,
} from "@/experience/transition/transition-progress";
import { transitionRuntime } from "@/experience/transition/transition-runtime";
import { useExperienceStore } from "@/state/experience-store";

/**
 * Development-only transition observability. Never rendered in production builds.
 */
export function TransitionDebugOverlay() {
  const enabled = process.env.NODE_ENV === "development";
  const reduceMotion = useExperienceStore((state) => state.reduceMotion);
  const [logic, setLogic] = useState(readLogicalSnapshot);
  const [rendered, setRendered] = useState(0);
  const [target, setTarget] = useState(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }
    const unsub = subscribeTransitionLogical(setLogic);
    let frame = 0;
    const tick = () => {
      setRendered(transitionRuntime.renderedProgress);
      setTarget(transitionRuntime.targetProgress);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => {
      unsub();
      window.cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="transition-debug-overlay" aria-hidden="true">
      <div>mode: {logic.mode}</div>
      <div>progress: {rendered.toFixed(3)}</div>
      <div>target: {target.toFixed(3)}</div>
      <div>owner: {logic.interactionOwner}</div>
      <div>camera: {logic.cameraOwner}</div>
      <div>reduced: {reduceMotion ? "yes" : "no"}</div>
    </div>
  );
}
