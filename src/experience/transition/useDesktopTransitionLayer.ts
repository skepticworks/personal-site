"use client";

import { useEffect, useRef, type RefObject } from "react";

import {
  subscribeTransitionVisual,
  transitionRuntime,
  type TransitionVisualSnapshot,
} from "@/experience/transition/transition-runtime";
import { useExperienceStore } from "@/state/experience-store";

/**
 * Applies desktop spatial exit transforms from transition progress via refs
 * (no React rerender per frame).
 */
export function useDesktopTransitionLayer(
  layerRef: RefObject<HTMLElement | null>,
): void {
  const canInteract = useExperienceStore((state) => state.canInteractWithDesktop);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) {
      return;
    }

    const apply = (snapshot: TransitionVisualSnapshot) => {
      const transform =
        `perspective(${snapshot.desktopPerspectivePx}px) ` +
        `rotateX(${snapshot.desktopRotateXDeg}deg) ` +
        `translate3d(0, ${snapshot.desktopTranslateYPx}px, 0) ` +
        `scale(${snapshot.desktopScale})`;

      el.style.transform = transform;
      el.style.opacity = String(snapshot.desktopOpacity);
      el.style.transformOrigin = "50% 85%";
      el.style.willChange =
        snapshot.progress > 0 && snapshot.progress < 1
          ? "transform, opacity"
          : "auto";

      if (snapshot.desktopOpacity < 0.02) {
        el.style.visibility = "hidden";
        el.setAttribute("aria-hidden", "true");
      } else {
        el.style.visibility = "visible";
        el.removeAttribute("aria-hidden");
      }
    };

    apply(transitionRuntime.visual);
    return subscribeTransitionVisual(apply);
  }, [layerRef]);

  useEffect(() => {
    const el = layerRef.current;
    if (!el) {
      return;
    }
    el.style.pointerEvents = canInteract ? "auto" : "none";
    el.toggleAttribute("inert", !canInteract);
  }, [canInteract, layerRef]);
}

/** Hint opacity driven by transition progress. */
export function useScrollHintOpacity(
  hintRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const el = hintRef.current;
    if (!el) {
      return;
    }
    return subscribeTransitionVisual((snapshot) => {
      el.style.opacity = String(snapshot.hintOpacity);
      el.style.visibility = snapshot.hintOpacity < 0.02 ? "hidden" : "visible";
    });
  }, [hintRef]);
}

export function useTransitionVisualRef(): {
  current: TransitionVisualSnapshot;
} {
  const ref = useRef(transitionRuntime.visual);
  useEffect(() => {
    return subscribeTransitionVisual((snapshot) => {
      ref.current = snapshot;
    });
  }, []);
  return ref;
}
