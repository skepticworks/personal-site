"use client";

import { Desktop } from "@/components/desktop/Desktop";
import { useExperienceStore } from "@/state/experience-store";

/**
 * Root experience host. The desktop owns the portfolio mode viewport today;
 * later milestones can mount transition / sky layers beside it without
 * rewriting the desktop window system.
 */
export function PortfolioExperience() {
  const mode = useExperienceStore((state) => state.mode);
  const showDesktop =
    mode === "portfolio" || mode === "transition-to-sky";

  return (
    <div className="experience-root">
      {showDesktop ? <Desktop /> : null}
      {/* Future: sky / R3F layer when mode is sky or transition-to-portfolio */}
    </div>
  );
}
