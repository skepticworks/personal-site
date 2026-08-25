# Architecture and conventions

## Purpose

Dual-purpose site:

1. Professional portfolio presented as a **desktop-style personal workspace** (DOM)
2. Interactive astronomy experience (React Three Fiber / Three.js) — placeholder sky shell in Milestone 3; full Stellarium features later

Layers stay loosely coupled so either can evolve without rewriting the other.

## Directory responsibilities

| Path | Responsibility |
| --- | --- |
| `src/app` | Next.js routes, layouts, metadata |
| `src/components/desktop` | Desktop shell, shortcuts, window chrome |
| `src/components/experience` | Experience host, mode controls, transition debug overlay |
| `src/components/three` | R3F sky shell, transition camera, placeholder starfield |
| `src/experience/transition` | Progress model, input, config, visual derivation |
| `src/features/*` | Feature content (portfolio, about, contact, astronomy, captures) |
| `src/types` | Domain models including `desktop.ts`, `experience.ts` |
| `src/data` | Shared static / mock domain records |
| `src/state` | Zustand stores + Three.js runtime refs |
| `src/config` | Site, env, desktop shortcut / window definitions |
| `src/hooks` | Shared hooks (`useX`) |
| `src/lib` | Cross-cutting utilities (geometry helpers, formatting) |
| `public/assets` | Optimized static assets only |

## Coding conventions

- Components: **PascalCase**
- Hooks: **`useX`**
- Descriptive domain type names
- Prefer explicit imports; avoid barrel files unless they improve a public API
- Feature logic stays in `features/` when practical
- Distinguish server-only vs client-only code; keep `"use client"` at real boundaries
- Avoid `any` unless interoperability forces it

## DOM vs Three.js boundaries

**DOM layer** owns the desktop, windows, portfolio content, and accessibility.

**R3F / Three.js layer** owns the night-sky shell (placeholder stars + atmosphere). It must not be required to use the portfolio.

`PortfolioExperience` always mounts both layers. Visibility and interaction are driven by normalized transition progress, not route changes.

## Experience state model

`ExperienceMode` (`src/types/experience.ts`):

```ts
"portfolio" | "transition-to-sky" | "sky" | "transition-to-portfolio"
```

(`"portfolio"` is the established name for the desktop half — keep it.)

### Logical application state (`experience-store`)

| Field | Role |
| --- | --- |
| `mode` | Discrete mode from progress endpoints / direction |
| `transitionDirection` | `"to-sky"` \| `"to-portfolio"` \| `null` |
| `transitionProgress` | Discrete snapshot for UI (not per-frame) |
| `canInteractWithDesktop` | `progress ≈ 0` |
| `canInteractWithSky` | `progress ≈ 1` |
| `cameraOwner` | `"none"` \| `"transition"` \| `"sky"` |
| `interactionOwner` | `"desktop"` \| `"transition"` \| `"sky"` |
| `selectedCelestialObjectId` | Future astronomy selection (preserved on return to desk) |
| `reduceMotion` | Synced from `prefers-reduced-motion` |

### High-frequency animation state (not Zustand)

| Location | Contents |
| --- | --- |
| `src/experience/transition/transition-runtime.ts` | `targetProgress`, `renderedProgress`, visual snapshot |
| `src/state/three-runtime.ts` | Camera orientation ref for WebGL consumers |

## Transition progress model

Normalized progress:

```text
0 = fully portfolio (desktop)
1 = fully sky
```

All cinematic visuals derive from this value via `deriveTransitionVisual()`:

- Desktop `perspective` / `rotateX` / `translateY` / `scale` / opacity
- Camera pitch / yaw / fov / Y
- Sky opacity, star opacity, environment darkening, hint opacity

Forward and reverse use the **same** mapping — reversing scroll only changes `targetProgress`.

Config lives in `src/experience/transition/transition-config.ts` (sensitivities, phase windows, camera endpoints, mobile tweaks).

### Mode thresholds

```text
progress ≈ 0          → portfolio
0 < progress < 1      → transition-to-sky | transition-to-portfolio (by direction)
progress ≈ 1          → sky
```

Endpoints use epsilon clamping so values like `0.999999` snap to `1`.

### Progress smoothing

Input writes `targetProgress`. An rAF loop eases `renderedProgress` toward it (exponential decay). Direction reverses immediately when the target crosses the rendered value.

## Camera ownership

```text
portfolio (progress 0):     cameraOwner = none
transition:                 cameraOwner = transition  → TransitionCameraController writes
sky (progress 1):           cameraOwner = sky         → future sky navigation writes
```

**Rule for future milestones:** sky navigation must check `cameraOwner === "sky"` (and/or `skyNavigationActiveRef`) before mutating the camera. Never fight the transition controller mid-flight.

## Interaction ownership

```text
canInteractWithDesktop ⇔ progress ≤ desktopInteractMax
canInteractWithSky     ⇔ progress ≥ skyInteractMin
```

During transition:

- Desktop layer gets `pointer-events: none` + `inert`
- Window dragging releases capture when interaction is revoked
- Sky canvas stays non-interactive until sky mode (Milestone 3 placeholder)

Open desktop windows are **not** destroyed on sky entry; Zustand preserves geometry and open flags.

## Scroll / wheel / touch

Primary driver: wheel + pointer vertical gestures on the experience root.

- Wheel deltas normalized for `deltaMode` (pixel / line / page); clamped per event
- Trackpads: many small deltas → smoothing absorbs jitter
- Touch: Pointer Events; movement threshold before a gesture starts (avoids accidental transition on shortcut taps)
- Vertical component only
- `preventDefault` only when the experience consumes that gesture (transition in flight, or leaving an endpoint)
- Scrollable window bodies keep internal scroll while at desktop rest; overscroll at edges may spill into the transition

Document scroll is disabled (`overflow: hidden` on `html`/`body`) because the experience is a full-viewport stage — not a multi-section document scroll.

## Reduced motion

`useReducedMotionSync` mirrors `prefers-reduced-motion: reduce` into:

- `application-store.settings.reduceMotion`
- `experience-store.reduceMotion`
- `transitionRuntime.reduceMotion`

When active:

- Spatial camera / desktop rotation is minimized (crossfade-style opacity)
- Small scroll deltas accumulate to a threshold, then snap target to `0` or `1`
- A11y buttons still jump between experiences

## Resource staging

`SkyExperienceHost` mounts the R3F canvas after idle (`requestIdleCallback`, fallback timeout) so the desktop paints first without leaving a blank sky if the user transitions quickly afterward.

## Accessibility

- Portfolio remains normal DOM
- `Explore the night sky` / `Return to desktop` buttons are keyboard operable
- Scroll is not the only navigation path
- Debug overlay is development-only (`NODE_ENV === "development"`)

## Desktop window system

### Responsibilities

- `Desktop` — wallpaper, brand, shortcut grid, window layer, scroll hint
- `DesktopShortcut` — accessible button that opens a window type
- `DesktopWindow` — shared shell (title bar, focus, drag, sizing, body scroll)
- `window-registry.ts` — maps `DesktopWindowType` → title, size defaults, content component

### State (`src/state/desktop-store.ts`)

Serializable window instances only (no JSX in the store):

- `isOpen`, `zIndex`, `position`, `size`
- Actions: `openWindow`, `closeWindow`, `focusWindow`, `moveWindow`, `resizeWindow`

**Singleton policy:** one instance per `DesktopWindowType`. Opening an already-open window focuses it.

**Position policy:** closing preserves session position/size; reopen restores them (UI clamps to the viewport).

### Focus and layering

A monotonic `zCounter` assigns stacking order on open/focus/drag-start. Values reset toward a low baseline after a ceiling to avoid runaway z-index growth. The active window receives a subtle title-bar / border treatment.

### Dragging and responsive constraints

- Pointer Events on the title bar (`useWindowDrag`); close control uses `data-window-no-drag`
- Drag cancels if desktop interaction is revoked mid-gesture
- Positions clamped so the title bar stays reachable (`src/lib/desktop-geometry.ts`)
- Below `767px`: near full-screen windows, dragging disabled, shortcuts move to a bottom grid

### Adding a desktop application

1. Extend `DesktopWindowType` in `src/types/desktop.ts`
2. Add defaults in `src/config/desktop.ts` and a shortcut entry if desired
3. Create feature content under `src/features/<name>/`
4. Register the content component in `src/components/desktop/window-registry.ts`

### Adding a project

Edit `src/features/portfolio/data/projects.ts`. The Projects window reads that list.

## State management

- `desktop-store` — window manager
- `application-store` — cross-cutting selections/settings
- `experience-store` — `ExperienceMode`, interaction/camera ownership, selection
- `transition-runtime` — high-frequency transition values
- `three-runtime` — high-frequency WebGL values (refs), not React state

## Domain models

| Domain | Types | Data |
| --- | --- | --- |
| Desktop | `src/types/desktop.ts` | `src/config/desktop.ts` |
| Portfolio | `src/types/portfolio.ts` | `src/features/portfolio/data/projects.ts` |
| About | — | `src/features/about/data/about-content.ts` |
| Contact | — | `src/features/contact/data/contact-links.ts` |
| Astronomy | `src/types/astronomy.ts` | `src/data/mock-celestial-objects.ts` |
| Captures | `src/types/captures.ts` | `src/data/mock-captures.ts` |

Astronomy coordinates: RA in **hours** `[0,24)`, Dec in **degrees** `[-90,90]`, J2000/ICRS unless noted.

## Accessibility assumptions

- Shortcuts are real `<button>` elements (Enter/Space)
- Windows are non-modal regions (`<article>` + labelled title); desktop shortcuts stay usable while windows are open
- Close controls have accessible names; focus rings are visible
- Scroll hint is decorative (`aria-hidden`); opacity follows transition progress
- Critical portfolio content remains in the DOM, not only in WebGL

## Environment model

`src/config/env.ts` + `next.config.ts` mapping of `VERCEL_ENV` → `NEXT_PUBLIC_VERCEL_ENV`.

## Future architectural constraints

- DOM / 3D separation — replace `PlaceholderStarfield` without rewriting scroll/progress/ownership
- Typed astronomy coordinates
- Lightweight optimized astrophotography assets only
- No hosting of original photography masters
- Accessibility of portfolio information outside WebGL
- Isolation of high-frequency Three.js state from React UI state
- Sky navigation must honor `cameraOwner === "sky"` before taking the camera
- No separate `/desktop` `/sky` routes solely for experience mode
- Desktop must not permanently own the viewport — experience modes remain the integration seam
