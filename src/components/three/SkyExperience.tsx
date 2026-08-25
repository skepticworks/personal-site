"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Mesh } from "three";
import { BackSide, Color } from "three";

import { PlaceholderStarfield } from "@/components/three/PlaceholderStarfield";
import { TransitionCameraController } from "@/components/three/TransitionCameraController";
import {
  subscribeTransitionVisual,
  transitionRuntime,
  type TransitionVisualSnapshot,
} from "@/experience/transition/transition-runtime";

function SkyAtmosphere() {
  const meshRef = useRef<Mesh>(null);
  const visualRef = useRef(transitionRuntime.visual);

  useEffect(() => {
    return subscribeTransitionVisual((snapshot) => {
      visualRef.current = snapshot;
    });
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }
    const material = mesh.material;
    if ("opacity" in material) {
      material.opacity = 0.35 + visualRef.current.environmentDarken * 0.45;
    }
  });

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[90, 32, 24]} />
      <meshBasicMaterial
        color={new Color("#050b14")}
        side={BackSide}
        transparent
        depthWrite={false}
        opacity={0.4}
      />
    </mesh>
  );
}

function HorizonGlow() {
  const meshRef = useRef<Mesh>(null);
  const visualRef = useRef(transitionRuntime.visual);

  useEffect(() => {
    return subscribeTransitionVisual((snapshot) => {
      visualRef.current = snapshot;
    });
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }
    const fade = 1 - visualRef.current.environmentDarken;
    mesh.visible = fade > 0.02;
    const material = mesh.material;
    if ("opacity" in material) {
      material.opacity = fade * 0.55;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2, -20]} rotation={[-0.15, 0, 0]}>
      <planeGeometry args={[80, 24]} />
      <meshBasicMaterial
        color={new Color("#1a3340")}
        transparent
        depthWrite={false}
        opacity={0.5}
      />
    </mesh>
  );
}

interface SkyExperienceProps {
  className?: string;
}

/**
 * Placeholder night-sky shell for validating the desk → sky transition.
 *
 * Intentionally free of catalog / constellation / search logic so later
 * astronomy milestones can replace the renderer without touching scroll,
 * progress, or ownership systems.
 */
export function SkyExperience({ className }: SkyExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
      }}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{
          fov: transitionRuntime.visual.cameraFov,
          near: 0.1,
          far: 200,
          position: [0, 0, 0.15],
        }}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <color attach="background" args={["#03070e"]} />
        <TransitionCameraController />
        <SkyAtmosphere />
        <HorizonGlow />
        <PlaceholderStarfield />
      </Canvas>
    </div>
  );
}
