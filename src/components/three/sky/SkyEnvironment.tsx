"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { BackSide, Color, type Mesh } from "three";

import {
  subscribeTransitionVisual,
  transitionRuntime,
} from "@/experience/transition/transition-runtime";

/**
 * Soft inward sky dome + optional horizon glow during desk transition.
 *
 * Keep this behind stars/waypoints with explicit `renderOrder`. Transparent
 * meshes centered on the camera can otherwise swap paint order mid-pan and
 * make the whole star field suddenly look dimmer.
 */
export function SkyEnvironment() {
  const atmosphereRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const visualRef = useRef(transitionRuntime.visual);

  useEffect(() => {
    return subscribeTransitionVisual((snapshot) => {
      visualRef.current = snapshot;
    });
  }, []);

  useFrame(() => {
    const atmosphere = atmosphereRef.current;
    if (atmosphere && "opacity" in atmosphere.material) {
      atmosphere.material.opacity =
        0.35 + visualRef.current.environmentDarken * 0.45;
    }

    const glow = glowRef.current;
    if (glow) {
      const fade = 1 - visualRef.current.environmentDarken;
      glow.visible = fade > 0.02;
      if ("opacity" in glow.material) {
        glow.material.opacity = fade * 0.55;
      }
    }
  });

  return (
    <>
      <mesh ref={atmosphereRef} renderOrder={0}>
        <sphereGeometry args={[90, 32, 24]} />
        <meshBasicMaterial
          color={new Color("#050b14")}
          side={BackSide}
          transparent
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
          opacity={0.4}
        />
      </mesh>
      <mesh
        ref={glowRef}
        renderOrder={1}
        position={[0, -2, -20]}
        rotation={[-0.15, 0, 0]}
      >
        <planeGeometry args={[80, 24]} />
        <meshBasicMaterial
          color={new Color("#1a3340")}
          transparent
          depthWrite={false}
          depthTest={false}
          toneMapped={false}
          opacity={0.5}
        />
      </mesh>
    </>
  );
}
