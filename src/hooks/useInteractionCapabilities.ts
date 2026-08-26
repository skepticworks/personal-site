"use client";

import { useEffect, useState } from "react";

import { MEDIA } from "@/config/breakpoints";

export interface InteractionCapabilities {
  coarsePointer: boolean;
  finePointer: boolean;
  canHover: boolean;
  fineHover: boolean;
  touchPoints: number;
  devicePixelRatio: number;
  reducedMotion: boolean;
  orientation: "portrait" | "landscape" | "unknown";
  shortViewport: boolean;
}

const DEFAULT_CAPABILITIES: InteractionCapabilities = {
  coarsePointer: false,
  finePointer: true,
  canHover: true,
  fineHover: true,
  touchPoints: 0,
  devicePixelRatio: 1,
  reducedMotion: false,
  orientation: "unknown",
  shortViewport: false,
};

function readCapabilities(): InteractionCapabilities {
  if (typeof window === "undefined") {
    return DEFAULT_CAPABILITIES;
  }

  const mq = (query: string) =>
    typeof window.matchMedia === "function" && window.matchMedia(query).matches;

  return {
    coarsePointer: mq(MEDIA.coarsePointer),
    finePointer: mq(MEDIA.finePointer),
    canHover: mq(MEDIA.canHover),
    fineHover: mq(MEDIA.fineHover),
    touchPoints: navigator.maxTouchPoints || 0,
    devicePixelRatio: window.devicePixelRatio || 1,
    reducedMotion: mq(MEDIA.reducedMotion),
    orientation: mq(MEDIA.portrait)
      ? "portrait"
      : mq(MEDIA.landscape)
        ? "landscape"
        : "unknown",
    shortViewport: mq(MEDIA.shortViewport),
  };
}

/**
 * Feature-detect pointer precision, hover, touch, DPR, orientation, and height.
 * Prefer this over scattering raw matchMedia calls through UI components.
 */
export function useInteractionCapabilities(): InteractionCapabilities {
  const [capabilities, setCapabilities] =
    useState<InteractionCapabilities>(DEFAULT_CAPABILITIES);

  useEffect(() => {
    const queries = [
      MEDIA.coarsePointer,
      MEDIA.finePointer,
      MEDIA.canHover,
      MEDIA.fineHover,
      MEDIA.reducedMotion,
      MEDIA.portrait,
      MEDIA.landscape,
      MEDIA.shortViewport,
    ].map((query) => window.matchMedia(query));

    const update = () => setCapabilities(readCapabilities());
    update();

    for (const media of queries) {
      media.addEventListener("change", update);
    }
    window.addEventListener("resize", update);

    return () => {
      for (const media of queries) {
        media.removeEventListener("change", update);
      }
      window.removeEventListener("resize", update);
    };
  }, []);

  return capabilities;
}
