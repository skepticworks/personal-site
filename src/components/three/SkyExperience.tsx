"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";

import { TransitionCameraController } from "@/components/three/TransitionCameraController";
import { CelestialCameraController } from "@/components/three/sky/CelestialCameraController";
import { DeepSkyWaypoints } from "@/components/three/sky/DeepSkyWaypoints";
import { EquatorialDebugGuides } from "@/components/three/sky/EquatorialDebugGuides";
import { SkyEnvironment } from "@/components/three/sky/SkyEnvironment";
import { SkyPointerControls } from "@/components/three/sky/SkyPointerControls";
import { StarField } from "@/components/three/sky/StarField";
import { WaypointLabels } from "@/components/three/sky/WaypointLabels";
import { PERFORMANCE_BUDGETS } from "@/config/performance-budgets";
import { resolveSkyQualitySettings } from "@/config/sky-quality";
import {
  subscribeTransitionVisual,
  transitionRuntime,
  type TransitionVisualSnapshot,
} from "@/experience/transition/transition-runtime";
import { useInteractionCapabilities } from "@/hooks/useInteractionCapabilities";
import { useExperienceStore } from "@/state/experience-store";
import { skyRuntime } from "@/state/sky-runtime";

interface SkyExperienceProps {
  className?: string;
}

/**
 * Interactive celestial sky engine (R3F).
 *
 * Owns WebGL rendering + sky camera when `cameraOwner === "sky"`.
 * Logical selection / mode state stays in the experience store.
 * Decorative stars are not exposed to the accessibility tree — use the DOM
 * object interface / fallback browser for assistive access.
 */
export function SkyExperience({ className }: SkyExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelHostRef = useRef<HTMLDivElement>(null);
  const [labelHost, setLabelHost] = useState<HTMLElement | null>(null);
  const [skyVisible, setSkyVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [viewport, setViewport] = useState({ width: 1280, height: 800 });
  const capabilities = useInteractionCapabilities();

  const canInteractWithSky = useExperienceStore(
    (state) => state.canInteractWithSky,
  );
  const isCaptureViewerOpen = useExperienceStore(
    (state) => state.isCaptureViewerOpen,
  );
  const skyPointerActive = canInteractWithSky && !isCaptureViewerOpen;
  const skyRenderQualityPreference = useExperienceStore(
    (state) => state.skyRenderQualityPreference,
  );

  useEffect(() => {
    const update = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      setTabVisible(document.visibilityState === "visible");
    };
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const quality = useMemo(() => {
    return resolveSkyQualitySettings(
      skyRenderQualityPreference,
      {
        width: viewport.width,
        height: viewport.height,
        devicePixelRatio: Math.min(
          capabilities.devicePixelRatio,
          PERFORMANCE_BUDGETS.maxRendererDpr,
        ),
        hardwareConcurrency:
          typeof navigator !== "undefined"
            ? navigator.hardwareConcurrency
            : 4,
        maxTouchPoints: capabilities.touchPoints,
        pointerCoarse: capabilities.coarsePointer,
      },
      { allowDevGrid: process.env.NODE_ENV === "development" },
    );
  }, [
    capabilities.coarsePointer,
    capabilities.devicePixelRatio,
    capabilities.touchPoints,
    skyRenderQualityPreference,
    viewport.height,
    viewport.width,
  ]);

  useEffect(() => {
    skyRuntime.quality = quality.quality;
    skyRuntime.rendererDpr = quality.dpr;
  }, [quality.dpr, quality.quality]);

  useEffect(() => {
    setLabelHost(labelHostRef.current);
  }, []);

  useEffect(() => {
    let lastVisible = false;
    return subscribeTransitionVisual((snapshot: TransitionVisualSnapshot) => {
      const el = containerRef.current;
      if (!el) {
        return;
      }
      el.style.opacity = String(snapshot.skyOpacity);
      const visible = snapshot.skyOpacity > 0.001;
      el.style.visibility = visible ? "visible" : "hidden";
      if (visible !== lastVisible) {
        lastVisible = visible;
        setSkyVisible(visible);
      }
    });
  }, []);

  const touchFriendly =
    quality.quality === "low" || capabilities.coarsePointer;
  const enableHover = capabilities.fineHover;
  const frameloop = skyVisible && tabVisible ? "always" : "never";

  return (
    <div
      ref={containerRef}
      className={className}
      role="img"
      aria-label="Interactive night sky. Use search and object details to browse deep-sky objects without relying on the canvas."
      style={{
        opacity: 0,
        visibility: "hidden",
        pointerEvents: skyPointerActive ? "auto" : "none",
      }}
    >
      <div ref={labelHostRef} className="sky-label-host" aria-hidden="true" />
      <Canvas
        dpr={quality.dpr}
        frameloop={frameloop}
        gl={{
          antialias: quality.antialias,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{
          fov: transitionRuntime.visual.cameraFov,
          near: 0.1,
          far: 250,
          position: [0, 0, 0.15],
        }}
        style={{ width: "100%", height: "100%", display: "block" }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          canvas.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            if (process.env.NODE_ENV === "development") {
              console.warn("[SkyExperience] WebGL context lost");
            }
          });
        }}
      >
        <color attach="background" args={["#03070e"]} />
        <TransitionCameraController />
        <CelestialCameraController />
        <SkyEnvironment />
        <StarField starCount={quality.starCount} />
        <DeepSkyWaypoints touchFriendly={touchFriendly} />
        <SkyPointerControls
          active={skyPointerActive && skyVisible && tabVisible}
          enableHover={enableHover}
        />
        <WaypointLabels
          maxOrdinaryLabels={quality.maxOrdinaryLabels}
          host={labelHost}
        />
        {process.env.NODE_ENV === "development" && quality.showDevGrid ? (
          <EquatorialDebugGuides />
        ) : null}
      </Canvas>
    </div>
  );
}
