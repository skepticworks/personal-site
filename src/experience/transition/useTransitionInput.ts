"use client";

import { useEffect, useRef, type RefObject } from "react";

import { TRANSITION_CONFIG } from "@/experience/transition/transition-config";
import {
  applyProgressDelta,
  normalizeTouchDelta,
  normalizeWheelDelta,
} from "@/experience/transition/transition-progress";
import { transitionRuntime } from "@/experience/transition/transition-runtime";
import {
  handleSkyWheelDelta,
  normalizeSkyWheelDeltaY,
  resetSkyWheelExitState,
} from "@/experience/sky/sky-wheel-policy";
import { useExperienceStore } from "@/state/experience-store";
import { resetSkyNavigationGestures } from "@/state/sky-runtime";

/**
 * Scroll / trackpad / touch input → normalized transition progress.
 *
 * Intentional transition policy:
 * - Desktop windows never chain into the sky transition (no edge overscroll).
 * - Empty desktop / non-window areas still drive progress via wheel.
 * - Sky: wheel zooms FOV first; exit only via intentional max-FOV overscroll
 *   (see sky-wheel-policy) or explicit "Return to desktop".
 * - Pointer drag is owned by the sky engine while `canInteractWithSky`.
 */
export function useTransitionInput(
  rootRef: RefObject<HTMLElement | null>,
): void {
  const touchRef = useRef<{
    pointerId: number;
    startY: number;
    lastY: number;
    active: boolean;
    gesturing: boolean;
  } | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const shouldConsumeWheel = (deltaY: number): boolean => {
      const progress = transitionRuntime.targetProgress;
      const { endpointEpsilon } = TRANSITION_CONFIG;
      if (progress > endpointEpsilon && progress < 1 - endpointEpsilon) {
        return true;
      }
      if (progress <= endpointEpsilon && deltaY > 0) {
        return true;
      }
      if (progress >= 1 - endpointEpsilon && deltaY < 0) {
        return true;
      }
      return false;
    };

    const onWheel = (event: WheelEvent) => {
      const state = useExperienceStore.getState();
      const target = event.target as HTMLElement | null;

      // Object panel / search / mode controls own their own scrolling.
      if (
        target?.closest(
          ".dso-interface, .experience-mode-controls, .sky-hud",
        )
      ) {
        return;
      }

      // Sky owns wheel for zoom; may delegate intentional exit-to-portfolio.
      if (state.canInteractWithSky && state.cameraOwner === "sky") {
        const skyDelta = normalizeSkyWheelDeltaY(event);
        const result = handleSkyWheelDelta(skyDelta);
        if (result === "zoom") {
          event.preventDefault();
          return;
        }
        if (result === "exit-to-portfolio") {
          event.preventDefault();
          resetSkyWheelExitState();
          resetSkyNavigationGestures();
          applyProgressDelta(normalizeWheelDelta(event));
          return;
        }
        // Edge settle / insufficient overscroll — do not start a transition.
        event.preventDefault();
        return;
      }

      // Portfolio windows fully own wheel — never chain into explore mode.
      if (state.canInteractWithDesktop && target?.closest(".desktop-window")) {
        return;
      }

      if (!shouldConsumeWheel(event.deltaY)) {
        return;
      }

      event.preventDefault();
      applyProgressDelta(normalizeWheelDelta(event));
    };

    const onPointerDown = (event: PointerEvent) => {
      // Sky owns look-around drag; do not start transition gestures
      if (useExperienceStore.getState().canInteractWithSky) {
        return;
      }

      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          ".desktop-shortcut, .desktop-window, .experience-mode-controls, .sky-hud, .dso-interface, button, a, input, textarea, select",
        )
      ) {
        return;
      }

      touchRef.current = {
        pointerId: event.pointerId,
        startY: event.clientY,
        lastY: event.clientY,
        active: true,
        gesturing: false,
      };
    };

    const onPointerMove = (event: PointerEvent) => {
      if (useExperienceStore.getState().canInteractWithSky) {
        return;
      }

      const touch = touchRef.current;
      if (!touch || !touch.active || touch.pointerId !== event.pointerId) {
        return;
      }

      const dy = event.clientY - touch.lastY;
      touch.lastY = event.clientY;
      const total = Math.abs(event.clientY - touch.startY);

      if (!touch.gesturing) {
        if (total < TRANSITION_CONFIG.touchGestureThresholdPx) {
          return;
        }
        touch.gesturing = true;
        try {
          root.setPointerCapture(event.pointerId);
        } catch {
          // ignore capture failures
        }
      }

      // Finger moving up → toward sky (positive progress)
      const progressDelta = normalizeTouchDelta(-dy);
      if (progressDelta !== 0) {
        event.preventDefault();
        applyProgressDelta(progressDelta);
      }
    };

    const endPointer = (event: PointerEvent) => {
      const touch = touchRef.current;
      if (!touch || touch.pointerId !== event.pointerId) {
        return;
      }
      if (touch.gesturing && root.hasPointerCapture(event.pointerId)) {
        root.releasePointerCapture(event.pointerId);
      }
      touchRef.current = null;
    };

    const onBlur = () => {
      touchRef.current = null;
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", endPointer);
    root.addEventListener("pointercancel", endPointer);
    window.addEventListener("blur", onBlur);

    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", endPointer);
      root.removeEventListener("pointercancel", endPointer);
      window.removeEventListener("blur", onBlur);
    };
  }, [rootRef]);
}
