"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Stages the R3F sky shell after first paint / idle so the initial desktop
 * render stays light, while still being ready before a blank transition.
 */
const SkyExperienceLazy = dynamic(
  () =>
    import("@/components/three/SkyExperience").then((mod) => mod.SkyExperience),
  { ssr: false },
);

export function SkyExperienceHost() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const mount = () => {
      if (!cancelled) {
        setReady(true);
      }
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      const id = idleWindow.requestIdleCallback(mount, { timeout: 1200 });
      return () => {
        cancelled = true;
        idleWindow.cancelIdleCallback?.(id);
      };
    }

    const timer = window.setTimeout(mount, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  if (!ready) {
    return null;
  }

  return <SkyExperienceLazy className="sky-experience-layer" />;
}
