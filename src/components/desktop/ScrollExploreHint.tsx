"use client";

import { useEffect, useRef } from "react";

import { useScrollHintOpacity } from "@/experience/transition/useDesktopTransitionLayer";

/**
 * Decorative scroll / swipe affordance. Opacity is driven by transition progress.
 */
export function ScrollExploreHint() {
  const hintRef = useRef<HTMLDivElement>(null);
  useScrollHintOpacity(hintRef);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const label = hintRef.current?.querySelector(
      ".scroll-explore-hint__label",
    );
    if (label) {
      label.textContent = coarse
        ? "Scroll or swipe to explore"
        : "Scroll to explore";
    }
  }, []);

  return (
    <div ref={hintRef} className="scroll-explore-hint" aria-hidden="true">
      <p className="scroll-explore-hint__label">Scroll or swipe to explore</p>
      <span className="scroll-explore-hint__chevron" />
    </div>
  );
}
