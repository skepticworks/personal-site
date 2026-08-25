"use client";

import { useExperienceMode } from "@/hooks/useExperienceMode";

export function ExperienceModeControls() {
  const { mode, enterSky, enterPortfolio } = useExperienceMode();

  return (
    <section aria-labelledby="experience-mode-heading">
      <h2 id="experience-mode-heading">Experience mode</h2>
      <p>
        Current mode: <strong>{mode}</strong>
      </p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button type="button" onClick={enterPortfolio}>
          Portfolio
        </button>
        <button type="button" onClick={enterSky}>
          Sky
        </button>
      </div>
      <p style={{ fontSize: "0.875rem", opacity: 0.75 }}>
        Transition modes are modeled in state but not animated yet.
      </p>
    </section>
  );
}
