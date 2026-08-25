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
import { resolveSkyQualitySettings } from "@/config/sky-quality";
import {
  subscribeTransitionVisual,
  transitionRuntime,
  type TransitionVisualSnapshot,
} from "@/experience/transition/transition-runtime";
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
 */
export function SkyExperience({ className }: SkyExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelHostRef = useRef<HTMLDivElement>(null);
  const [labelHost, setLabelHost] = useState<HTMLElement | null>(null);
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

  const quality = useMemo(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1280;
    const height = typeof window !== "undefined" ? window.innerHeight : 800;
    const dpr =
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const pointerCoarse =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;

    return resolveSkyQualitySettings(
      skyRenderQualityPreference,
      {
        width,
        height,
        devicePixelRatio: dpr,
        hardwareConcurrency:
          typeof navigator !== "undefined"
            ? navigator.hardwareConcurrency
            : 4,
        maxTouchPoints:
          typeof navigator !== "undefined" ? navigator.maxTouchPoints : 0,
        pointerCoarse,
      },
      { allowDevGrid: process.env.NODE_ENV === "development" },
    );
  }, [skyRenderQualityPreference]);

  useEffect(() => {
    skyRuntime.quality = quality.quality;
  }, [quality.quality]);

  useEffect(() => {
    setLabelHost(labelHostRef.current);
  }, []);

  useEffect(() => {
    return subscribeTransitionVisual((snapshot: TransitionVisualSnapshot) => {
      const el = containerRef.current;
      if (!el) {
        return;
      }
      el.style.opacity = String(snapshot.skyOpacity);
      el.style.visibility = snapshot.skyOpacity > 0.001 ? "visible" : "hidden";
    });
  }, []);

  const touchFriendly =
    quality.quality === "low" ||
    (typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches);

  const enableHover =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{
        opacity: 0,
        visibility: "hidden",
        pointerEvents: skyPointerActive ? "auto" : "none",
      }}
    >
      <div ref={labelHostRef} className="sky-label-host" />
      <Canvas
        dpr={quality.dpr}
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
      >
        <color attach="background" args={["#03070e"]} />
        <TransitionCameraController />
        <CelestialCameraController />
        <SkyEnvironment />
        <StarField starCount={quality.starCount} />
        <DeepSkyWaypoints touchFriendly={touchFriendly} />
        <SkyPointerControls
          active={skyPointerActive}
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
