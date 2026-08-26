import { remapSmooth, smoothstep } from "@/experience/transition/interpolation";
import {
  TRANSITION_CONFIG,
  type TransitionConfig,
} from "@/experience/transition/transition-config";
import type { TransitionVisualSnapshot } from "@/experience/transition/transition-runtime";

export function deriveTransitionVisual(
  progress: number,
  options: {
    reduceMotion: boolean;
    isMobile: boolean;
    config?: TransitionConfig;
  },
): TransitionVisualSnapshot {
  const config = options.config ?? TRANSITION_CONFIG;
  const { phases } = config;
  const exitRotate = options.isMobile
    ? config.mobile.desktopExitRotateXDeg
    : config.desktopExitRotateXDeg;

  if (options.reduceMotion) {
    const skyWeight = progress >= 0.5 ? 1 : 0;
    const deskWeight = 1 - skyWeight;
    return {
      progress,
      desktopRotateXDeg: 0,
      desktopTranslateYPx: 0,
      desktopScale: 1,
      desktopOpacity: deskWeight,
      desktopPerspectivePx: config.desktopPerspectivePx,
      skyOpacity: skyWeight,
      starsOpacity: skyWeight,
      environmentDarken: skyWeight,
      hintOpacity: deskWeight,
      cameraPitch: remapSmooth(skyWeight, 0, 1, config.cameraStartPitch, config.cameraEndPitch),
      cameraYaw: config.cameraStartYaw,
      cameraFov: config.cameraStartFov,
      cameraY: config.cameraStartY,
    };
  }

  const desktopT = smoothstep(phases.desktopExitStart, phases.desktopExitEnd, progress);
  const cameraT = smoothstep(phases.cameraPanStart, phases.cameraPanEnd, progress);
  const starsT = smoothstep(phases.starsStart, phases.starsEnd, progress);
  const darkenT = smoothstep(0.04, 0.48, progress);
  const hintT = 1 - smoothstep(0.02, 0.18, progress);
  // Sky layer rises as the desk recedes so neither UI is "blank" mid-transition.
  const skyOpacity = smoothstep(0.12, 0.48, progress);

  return {
    progress,
    desktopRotateXDeg: desktopT * exitRotate,
    desktopTranslateYPx: desktopT * config.desktopExitTranslateYPx,
    desktopScale: 1 - desktopT * (1 - config.desktopExitScale),
    desktopOpacity: 1 - smoothstep(0.48, 0.88, progress),
    desktopPerspectivePx: config.desktopPerspectivePx,
    skyOpacity,
    starsOpacity: starsT,
    environmentDarken: darkenT,
    hintOpacity: hintT,
    cameraPitch: remapSmooth(cameraT, 0, 1, config.cameraStartPitch, config.cameraEndPitch),
    cameraYaw: remapSmooth(cameraT, 0, 1, config.cameraStartYaw, config.cameraEndYaw),
    cameraFov: remapSmooth(cameraT, 0, 1, config.cameraStartFov, config.cameraEndFov),
    cameraY: remapSmooth(cameraT, 0, 1, config.cameraStartY, config.cameraEndY),
  };
}
