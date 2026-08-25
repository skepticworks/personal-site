"use client";

import dynamic from "next/dynamic";

const ExperienceCanvas = dynamic(
  () =>
    import("@/components/three/ExperienceCanvas").then(
      (module) => module.ExperienceCanvas,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        role="status"
        aria-live="polite"
        style={{
          display: "grid",
          placeItems: "center",
          width: "100%",
          height: "100%",
          color: "#94a3b8",
          fontSize: "0.875rem",
        }}
      >
        Loading 3D experience…
      </div>
    ),
  },
);

/**
 * Boundary between the DOM shell and the lazily loaded R3F canvas.
 * The WebGL layer can evolve independently of surrounding UI chrome.
 */
export function ExperienceViewport() {
  return (
    <div
      aria-label="Three.js experience viewport"
      style={{
        width: "100%",
        height: "100%",
        minHeight: "16rem",
        background: "#020617",
        overflow: "hidden",
      }}
    >
      <ExperienceCanvas />
    </div>
  );
}
