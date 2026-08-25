# Transition system (Milestone 3)

## Progress

```text
targetProgress  ← wheel / touch / a11y buttons
renderedProgress ← rAF smoothed toward target
visuals         ← deriveTransitionVisual(renderedProgress)
mode / locks    ← discrete thresholds on renderedProgress
```

Tune sensitivities and phase windows in:

`src/experience/transition/transition-config.ts`

| Constant | Intent (approx.) |
| --- | --- |
| `wheelSensitivity` / `wheelMaxStep` | Mouse / trackpad feel; clamp large ticks |
| `touchSensitivity` / `touchGestureThresholdPx` | Swipe feel; ignore taps |
| `progressSmoothing` | Follow latency vs smoothness |
| `phases.*` | Overlap desktop exit, camera pan, stars |
| `cameraStartPitch` → `cameraEndPitch` | Desk-facing → sky-facing |
| `desktopExitRotateXDeg` | Desktop rotates away under the camera |

## Files

| Path | Role |
| --- | --- |
| `interpolation.ts` | `lerp`, `smoothstep`, `clamp` |
| `derive-transition-visual.ts` | Progress → visual snapshot |
| `transition-progress.ts` | Target/render tick, input normalization, mode derivation |
| `transition-runtime.ts` | Mutable high-frequency store + listeners |
| `useTransitionInput.ts` | Wheel + pointer gestures |
| `useTransitionProgress.ts` | rAF loop + Zustand logical sync |
| `useDesktopTransitionLayer.ts` | DOM transform / inert binding |

## Camera handoff (for later sky nav)

1. While `cameraOwner === "transition"`, only `TransitionCameraController` writes the camera.
2. At progress `1`, `cameraOwner` becomes `"sky"`.
3. Future controls should set `skyNavigationActiveRef.current = true` and write pose only then.
4. On reverse transition, ownership returns to `"transition"` automatically.
