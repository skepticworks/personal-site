"use client";

import { useRef } from "react";

import { Desktop } from "@/components/desktop/Desktop";
import { ExperienceModeControls } from "@/components/experience/ExperienceModeControls";
import { TransitionDebugOverlay } from "@/components/experience/TransitionDebugOverlay";
import { SkyExperienceHost } from "@/components/three/SkyExperienceHost";
import { useDesktopTransitionLayer } from "@/experience/transition/useDesktopTransitionLayer";
import { useTransitionInput } from "@/experience/transition/useTransitionInput";
import { useTransitionProgressLoop } from "@/experience/transition/useTransitionProgress";
import { useReducedMotionSync } from "@/hooks/useReducedMotionSync";
import { useExperienceStore } from "@/state/experience-store";

/**
 * Root experience host: desktop portfolio ↔ scroll-driven sky transition.
 *
 * The desktop DOM layer stays mounted so open windows survive a sky round-trip
 * (state lives in Zustand; the layer is only visually/inertly parked at progress 1).
 * The R3F sky mounts beside it, not inside the window system.
 */
export function PortfolioExperience() {
  const rootRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);
  const mode = useExperienceStore((state) => state.mode);

  useReducedMotionSync();
  useTransitionProgressLoop();
  useTransitionInput(rootRef);
  useDesktopTransitionLayer(desktopRef);

  return (
    <div ref={rootRef} className="experience-root" data-mode={mode}>
      <SkyExperienceHost />

      <div ref={desktopRef} className="desktop-transition-layer">
        <Desktop />
      </div>

      <ExperienceModeControls />
      <TransitionDebugOverlay />
    </div>
  );
}
