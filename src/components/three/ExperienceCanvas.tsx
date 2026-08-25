"use client";

import { Canvas } from "@react-three/fiber";

import { ProofScene } from "@/components/three/ProofScene";

/**
 * Client-only WebGL viewport. Keep ordinary application controls in the DOM
 * layer (`components/ui`), not inside this canvas.
 */
export function ExperienceCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <ProofScene />
    </Canvas>
  );
}
