"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

import { ErrorBoundary } from "@/components/system/ErrorBoundary";
import { AstronomyFallbackBrowser } from "@/features/astronomy/components/AstronomyFallbackBrowser";
import { subscribeTransitionVisual } from "@/experience/transition/transition-runtime";
import {
  describeWebGlFailure,
  detectWebGlSupport,
  type WebGlSupportStatus,
} from "@/lib/webgl-support";
import { useExperienceStore } from "@/state/experience-store";

type SkyHostPhase = "deferred" | "active" | "unsupported";

const SkyExperienceLazy = dynamic(
  () =>
    import("@/components/three/SkyExperience")
      .then((mod) => mod.SkyExperience)
      .catch((error: unknown) => {
        console.error("[SkyExperienceHost] chunk load failed", error);
        throw error;
      }),
  {
    ssr: false,
    loading: () => (
      <div className="sky-load-status" role="status" aria-live="polite">
        <p className="sky-load-status__label">Loading night sky…</p>
      </div>
    ),
  },
);

/**
 * Stages the R3F sky after idle / transition intent so the initial portfolio
 * payload stays light. Surfaces loading + recoverable WebGL failures without
 * crashing the React tree.
 */
export function SkyExperienceHost() {
  const [phase, setPhase] = useState<SkyHostPhase>("deferred");
  const [webglStatus, setWebglStatus] =
    useState<WebGlSupportStatus>("unknown");
  const [retryKey, setRetryKey] = useState(0);
  const [enteringSky, setEnteringSky] = useState(false);
  const startedRef = useRef(false);
  const mode = useExperienceStore((state) => state.mode);
  const requestEnterPortfolio = useExperienceStore(
    (state) => state.requestEnterPortfolio,
  );

  const activateSky = useCallback(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;
    const status = detectWebGlSupport();
    setWebglStatus(status);
    setPhase(status === "supported" ? "active" : "unsupported");
  }, []);

  useEffect(() => {
    return subscribeTransitionVisual((snapshot) => {
      if (snapshot.skyOpacity > 0.02) {
        setEnteringSky(true);
        activateSky();
      }
    });
  }, [activateSky]);

  useEffect(() => {
    if (mode === "portfolio") {
      return;
    }
    // Defer so mode transitions do not cascade setState inside the effect body.
    const timer = window.setTimeout(() => {
      setEnteringSky(true);
      activateSky();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [activateSky, mode]);

  useEffect(() => {
    let cancelled = false;
    const schedule = () => {
      if (!cancelled) {
        activateSky();
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
      const id = idleWindow.requestIdleCallback(schedule, { timeout: 1800 });
      return () => {
        cancelled = true;
        idleWindow.cancelIdleCallback?.(id);
      };
    }

    const timer = window.setTimeout(schedule, 400);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [activateSky]);

  const retry = () => {
    startedRef.current = false;
    setWebglStatus("unknown");
    setPhase("deferred");
    setRetryKey((value) => value + 1);
    window.setTimeout(() => {
      activateSky();
    }, 0);
  };

  const showFallback = phase === "unsupported";
  const needsVisibleLoading =
    (enteringSky || mode !== "portfolio") && phase === "deferred";

  return (
    <>
      {needsVisibleLoading ? (
        <div className="sky-load-status" role="status" aria-live="polite">
          <p className="sky-load-status__label">Preparing night sky…</p>
        </div>
      ) : null}

      {showFallback ? (
        <div className="sky-fallback-layer">
          <AstronomyFallbackBrowser
            reason={describeWebGlFailure(webglStatus)}
            onRetry={retry}
            onReturnToPortfolio={() => requestEnterPortfolio()}
          />
        </div>
      ) : null}

      {phase === "active" ? (
        <ErrorBoundary
          key={retryKey}
          name="SkyExperience"
          fallback={(error, reset) => (
            <div className="sky-fallback-layer">
              <AstronomyFallbackBrowser
                reason="The interactive sky encountered an unexpected error. Portfolio content remains available."
                onRetry={() => {
                  if (process.env.NODE_ENV === "development") {
                    console.error("[SkyExperience] recovered from", error);
                  }
                  reset();
                  retry();
                }}
                onReturnToPortfolio={() => requestEnterPortfolio()}
              />
            </div>
          )}
        >
          <SkyExperienceLazy className="sky-experience-layer" />
        </ErrorBoundary>
      ) : null}
    </>
  );
}
