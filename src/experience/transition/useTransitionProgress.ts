"use client";

import { useEffect } from "react";

import { MOBILE_MEDIA_QUERY } from "@/experience/transition/transition-config";
import {
  commitRenderedProgress,
  setTargetProgress,
  subscribeTransitionLogical,
  tickTransitionProgress,
} from "@/experience/transition/transition-progress";
import { transitionRuntime } from "@/experience/transition/transition-runtime";
import {
  registerExperienceNavigationHandlers,
  useExperienceStore,
} from "@/state/experience-store";

/**
 * Owns the rAF smoothing loop and syncs discrete logical snapshots into Zustand.
 */
export function useTransitionProgressLoop(): void {
  const applyLogicalSnapshot = useExperienceStore(
    (state) => state.applyLogicalSnapshot,
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MEDIA_QUERY);
    const syncMobile = () => {
      transitionRuntime.isMobile = media.matches;
      commitRenderedProgress(transitionRuntime.renderedProgress);
    };
    syncMobile();
    media.addEventListener("change", syncMobile);
    return () => media.removeEventListener("change", syncMobile);
  }, []);

  useEffect(() => {
    return subscribeTransitionLogical((snapshot) => {
      applyLogicalSnapshot(snapshot);
    });
  }, [applyLogicalSnapshot]);

  useEffect(() => {
    return registerExperienceNavigationHandlers({
      enterSky: () => {
        setTargetProgress(1, {
          direction: "to-sky",
          snapRendered: transitionRuntime.reduceMotion,
        });
      },
      enterPortfolio: () => {
        setTargetProgress(0, {
          direction: "to-portfolio",
          snapRendered: transitionRuntime.reduceMotion,
        });
      },
    });
  }, []);

  useEffect(() => {
    let frame = 0;
    let lastTime = performance.now();
    let running = true;

    const loop = (now: number) => {
      if (!running) {
        return;
      }
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      tickTransitionProgress(dt);
      frame = window.requestAnimationFrame(loop);
    };

    frame = window.requestAnimationFrame(loop);
    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
    };
  }, []);
}
