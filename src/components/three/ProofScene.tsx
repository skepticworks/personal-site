"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

import { cameraOrientationRef } from "@/state/three-runtime";
import { useExperienceStore } from "@/state/experience-store";

/**
 * Temporary proof scene confirming R3F + Three.js initialize correctly.
 * Replace with the celestial sphere in a later milestone.
 */
export function ProofScene() {
  const meshRef = useRef<Mesh>(null);
  const mode = useExperienceStore((state) => state.mode);
  const isSky =
    mode === "sky" ||
    mode === "transition-to-sky" ||
    mode === "transition-to-portfolio";

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    mesh.rotation.x += delta * 0.35;
    mesh.rotation.y += delta * 0.55;

    // Demonstrate keeping high-frequency values out of React state.
    cameraOrientationRef.current.yaw = mesh.rotation.y;
    cameraOrientationRef.current.pitch = mesh.rotation.x;
  });

  return (
    <>
      <color attach="background" args={[isSky ? "#020617" : "#0f172a"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 3, 2]} intensity={1.1} />
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color={isSky ? "#93c5fd" : "#64748b"}
          wireframe={isSky}
          roughness={0.45}
          metalness={0.15}
        />
      </mesh>
    </>
  );
}
