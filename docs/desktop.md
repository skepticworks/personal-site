# Desktop experience notes

## Overview

Full-viewport desktop portfolio. Shortcuts open reusable windows; content is data-driven. Milestone 3 adds a scroll-driven transition into a placeholder night sky without destroying desktop window state.

## How to add a window / shortcut

1. Add a `DesktopWindowType` variant.
2. Configure defaults + optional shortcut in `src/config/desktop.ts`.
3. Implement content under `src/features/...`.
4. Register it in `src/components/desktop/window-registry.ts`.

## How to add a project

Append a `PortfolioProject` in `src/features/portfolio/data/projects.ts`.

## Responsive behavior

Presentation is resolved by `useViewportMode()` (width + height + pointer/hover),
not a single CSS breakpoint. See
`docs/responsive-accessibility-performance.md`.

| Presentation | Behavior |
| --- | --- |
| `desktop-windows` (≥ ~1024px, fine pointer) | Freely positioned windows, title-bar dragging |
| `tablet-panels` | Near full-screen panels, limited / no drag |
| `mobile-sheets` (phones / short viewports) | Bottom reading sheet — not a tiny OS window |

Legacy CSS still adjusts shortcuts at `767px` / `480px`. Resize reclamps window geometry so title bars stay reachable.

## Scroll-to-explore

The hint at the bottom of the desktop fades with transition progress. Copy prefers “Scroll or swipe to explore” on coarse pointers. Wheel / trackpad / swipe drive normalized experience progress (see `docs/architecture.md`).

Accessible alternative: **Explore the night sky** / **Return to desktop** buttons.

## Integration with the sky experience

`PortfolioExperience` mounts:

1. Staged R3F `SkyExperience` (behind)
2. Desktop DOM layer (transformed by progress)
3. Mode controls + (dev) transition debug overlay

Desktop interaction is allowed only near progress `0`. Open windows survive a round trip via `desktop-store`. Dragging stops if a transition begins mid-drag.
