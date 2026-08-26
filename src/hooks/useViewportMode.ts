"use client";

import { useEffect, useState } from "react";

import {
  resolveInteractionPresentation,
  resolveViewportClass,
  type InteractionPresentation,
  type ViewportClass,
} from "@/config/breakpoints";
import { useInteractionCapabilities } from "@/hooks/useInteractionCapabilities";

export interface ViewportMode {
  width: number;
  height: number;
  viewportClass: ViewportClass;
  presentation: InteractionPresentation;
  /** True when floating desktop windows are inappropriate. */
  useMobileSheets: boolean;
  /** True when near-fullscreen tablet panels should be used. */
  useTabletPanels: boolean;
  /** Legacy compact cut (~phone / small tablet). */
  isCompact: boolean;
}

const DEFAULT_MODE: ViewportMode = {
  width: 1280,
  height: 800,
  viewportClass: "laptop",
  presentation: "desktop-windows",
  useMobileSheets: false,
  useTabletPanels: false,
  isCompact: false,
};

/**
 * Single source of truth for portfolio / sky presentation mode.
 * Updates on resize and capability media-query changes.
 */
export function useViewportMode(): ViewportMode {
  const capabilities = useInteractionCapabilities();
  const [size, setSize] = useState({
    width: DEFAULT_MODE.width,
    height: DEFAULT_MODE.height,
  });

  useEffect(() => {
    const update = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const viewportClass = resolveViewportClass(size.width, size.height);
  const presentation = resolveInteractionPresentation({
    width: size.width,
    height: size.height,
    coarsePointer: capabilities.coarsePointer,
    canHover: capabilities.canHover,
  });

  return {
    width: size.width,
    height: size.height,
    viewportClass,
    presentation,
    useMobileSheets: presentation === "mobile-sheets",
    useTabletPanels: presentation === "tablet-panels",
    isCompact: presentation !== "desktop-windows",
  };
}
