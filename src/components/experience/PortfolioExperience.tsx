"use client";

import { Suspense, useRef } from "react";

import { Desktop } from "@/components/desktop/Desktop";
import { ExperienceModeControls } from "@/components/experience/ExperienceModeControls";
import { SkyDebugOverlay } from "@/components/experience/SkyDebugOverlay";
import { TransitionDebugOverlay } from "@/components/experience/TransitionDebugOverlay";
import { SkipLink } from "@/components/system/SkipLink";
import { SkyExperienceHost } from "@/components/three/SkyExperienceHost";
import { DeepSkyObjectInterface } from "@/features/astronomy/components/DeepSkyObjectInterface";
import { useSelectedObjectUrlSync } from "@/features/astronomy/hooks/useSelectedObjectUrlSync";
import { useDesktopTransitionLayer } from "@/experience/transition/useDesktopTransitionLayer";
import { useTransitionInput } from "@/experience/transition/useTransitionInput";
import { useTransitionProgressLoop } from "@/experience/transition/useTransitionProgress";
import { useReducedMotionSync } from "@/hooks/useReducedMotionSync";
import { useSkyKeyboardShortcuts } from "@/hooks/useSkyKeyboardShortcuts";
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
  useSkyKeyboardShortcuts();

  return (
    <div ref={rootRef} className="experience-root" data-mode={mode}>
      <SkipLink />
      <SkyExperienceHost />

      <main id="main-content" className="experience-main">
        <div ref={desktopRef} className="desktop-transition-layer">
          <Desktop />
        </div>
      </main>

      <Suspense fallback={null}>
        <ObjectUrlSync />
      </Suspense>
      <DeepSkyObjectInterface />
      <ExperienceModeControls />
      <TransitionDebugOverlay />
      <SkyDebugOverlay />
    </div>
  );
}

function ObjectUrlSync() {
  useSelectedObjectUrlSync();
  return null;
}
