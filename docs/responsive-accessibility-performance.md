# Responsive design, accessibility, and performance

Milestone 7 adapts the existing desktop portfolio and Stellarium-like sky
without forking into separate apps. Shared components and catalogs stay
common; presentation and input change by device capability.

## Responsive behavior overview

Breakpoints and helpers live in `src/config/breakpoints.ts`. Presentation is
resolved by `useViewportMode()` from **width, height, pointer coarseness, and
hover** — not width alone.

| Presentation | Typical devices | Portfolio chrome | Sky inspection |
| --- | --- | --- | --- |
| `desktop-windows` | Laptop / large desktop, fine pointer | Floating windows, drag | Side panel |
| `tablet-panels` | Tablets / coarse pointer mid-width | Near-fullscreen panels | Side panel (or sheet if compact) |
| `mobile-sheets` | Phones / short viewports | Bottom reading sheets | Bottom sheet |

CSS media queries still handle layout polish (`max-width: 767px`, `480px`,
`max-height: 520px`). Dynamic resize reclamps window geometry.

## Desktop vs mobile interaction

**Desktop / laptop**

- Free-position windows with title-bar drag and independent body scroll
- Focused window gets visual + `data-active` state; stacking via z-index
- Windows clamp so the title bar stays reachable after resize

**Mobile**

- Portfolio content uses a bottom sheet (`desktop-window--mobile-sheet`) —
  reading-first, not a tiny OS window
- Shortcuts stay as a bottom grid
- Astronomy details use collapsed / partial / expanded sheet extents so the
  sky remains visible while inspecting

## Touch astronomy navigation

`SkyPointerControls` supports:

- One-finger drag → pan
- Two-finger pinch → FOV zoom (limits from `SKY_NAVIGATION`)
- Tap vs pan via movement threshold
- Rebaseline when fingers are added/removed (no camera jump)
- `touch-action: none` **only** on the WebGL canvas while sky controls are active

Sheet extent uses explicit buttons (not drag) to avoid fighting sky pan.

## Keyboard interaction

| Area | Behavior |
| --- | --- |
| Skip link | First focusable control → `#main-content` |
| Desktop shortcuts | Native `<button>` (Enter/Space) |
| Window close | Named button; Escape clears sky selection / closes viewer |
| Search | Labeled input; arrows / Enter / Escape |
| Capture viewer | Modal dialog, focus trap, Escape / + / − / 0 |
| Enter / leave sky | Explicit buttons (scroll not required) |

Do not create keyboard traps outside true modals (capture viewer).

## Accessibility architecture

- Portfolio and object metadata remain **DOM** — the WebGL canvas is never the
  only path to astronomy content
- Canvas uses `role="img"` + purpose label; star field is not mirrored into the
  accessibility tree
- Search, results, details, captures, and the **AstronomyFallbackBrowser**
  provide structured access (name, catalogs, type, constellation, distance,
  magnitude, RA/Dec, descriptions, personal-photo status)
- Image `alt` identifies the target; captions carry separate metadata
- Live region announces selection changes

## Reduced motion

`prefers-reduced-motion: reduce` syncs into application + experience stores and
`transitionRuntime`. Effects:

- Transition becomes opacity-led (no cinematic desktop fly-out)
- Targeting uses a high slerp rate (near-immediate)
- Panel / sheet / image / viewer CSS animations disable
- Essential focus and selection feedback remains

## WebGL fallback

`SkyExperienceHost` probes WebGL, lazy-loads the sky chunk, and wraps it in an
`ErrorBoundary`. On failure:

1. Clear message that the interactive sky is unavailable
2. Portfolio remains usable
3. `AstronomyFallbackBrowser` supports search / browse / photo inspection
4. Retry + return-to-portfolio actions

Context-loss is logged in development; the portfolio shell does not crash.

## Astronomy lazy-loading

- Three.js / R3F sky loads via `next/dynamic` (`ssr: false`)
- Idle prefetch (`requestIdleCallback`) or earlier when transition opacity rises
  / mode leaves portfolio
- Intentional loading status when the user is entering the sky
- Catalogs ship with the sky chunk — not the first portfolio paint path

## Rendering quality strategy

`src/config/sky-quality.ts` + `PERFORMANCE_BUDGETS.maxRendererDpr`:

- Quality tiers: `low` / `medium` / `high` (or `auto`)
- Caps DPR (never blind `devicePixelRatio`)
- Scales star count, antialias, label density
- Canvas `frameloop="never"` when sky opacity ≈ 0 or the tab is hidden
- Batched `Points` star field; separate waypoint meshes for selection only

## Performance budgets

Documented in `src/config/performance-budgets.ts`:

| Budget | Soft ceiling |
| --- | --- |
| Initial JS before sky | 280 KB |
| Astronomy JS chunk | 450 KB |
| Initial image payload | 120 KB |
| Thumbnail | 80 KB (harder ceilings in asset policy) |
| Preview | 450 KB |
| Preview HQ | 1200 KB |
| Critical requests | ~18 |

Hard file-size / long-edge ceilings for captures remain in
`astrophotography-assets.ts` and `validate:astro-assets`.

Images use explicit dimensions, `sizes`, optional `srcset` from thumbnail /
preview / HQ derivatives, and lazy loading for below-the-fold thumbs.

## Testing matrix

| Scenario | What to verify |
| --- | --- |
| Desktop mouse + keyboard | Window drag, focus rings, search, enter/leave sky |
| Laptop viewport | Window clamp on resize |
| Tablet landscape / portrait | Panel sizing, touch pan / pinch |
| Phone portrait / landscape | Mobile sheets, collapsed object sheet, shortcuts |
| Short viewport | Title bar / sheet still usable |
| Touch only | Tap select vs pan; no page zoom while on canvas |
| Keyboard only | Skip link → shortcuts → windows → sky controls |
| Reduced motion | No long fly-to; CSS transitions off |
| High DPR | Quality auto chooses capped DPR |
| WebGL disabled | Fallback browser + portfolio |
| Slow CPU / network | Loading status; no indefinite spinner |

## Known limitations

- Sheet height is button-cycled, not gesture-dragged (avoids sky conflicts)
- Auto quality uses environment signals, not continuous FPS sampling in
  production UI
- Star catalogs are not independently code-split from the sky chunk
- Automated axe CI is not wired; prefer manual SR + keyboard checks alongside
  unit tests

## Development diagnostics

`SkyDebugOverlay` (development only) shows camera mode, look RA/Dec, FOV,
selection, quality tier, renderer DPR, and label count. Never shown in
production builds.
