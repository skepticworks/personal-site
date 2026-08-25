"use client";

import { useEffect, useState } from "react";

import { useApplicationStore } from "@/state/application-store";
import { useExperienceStore } from "@/state/experience-store";
import { transitionRuntime } from "@/experience/transition/transition-runtime";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Syncs `prefers-reduced-motion` into application + experience stores and the
 * transition runtime so all layers share one policy.
 */
export function useReducedMotionSync(): boolean {
  const [matches, setMatches] = useState(false);
  const updateSettings = useApplicationStore((state) => state.updateSettings);
  const setReduceMotion = useExperienceStore((state) => state.setReduceMotion);

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    const apply = () => {
      const value = media.matches;
      setMatches(value);
      transitionRuntime.reduceMotion = value;
      updateSettings({ reduceMotion: value });
      setReduceMotion(value);
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [setReduceMotion, updateSettings]);

  return matches;
}
