# Desktop experience notes

## Overview

Milestone 2 replaces the temporary foundation shell with a full-viewport desktop portfolio. Shortcuts open reusable windows; content is data-driven.

## How to add a window / shortcut

1. Add a `DesktopWindowType` variant.
2. Configure defaults + optional shortcut in `src/config/desktop.ts`.
3. Implement content under `src/features/...`.
4. Register it in `src/components/desktop/window-registry.ts`.

## How to add a project

Append a `PortfolioProject` in `src/features/portfolio/data/projects.ts`.

## Responsive behavior

| Viewport | Behavior |
| --- | --- |
| ≥ 768px | Freely positioned windows, title-bar dragging, left shortcut column |
| &lt; 768px | Near full-screen windows, no dragging, bottom shortcut row |

## Scroll-to-explore

Decorative hint for the future desk → sky transition. It does not activate astronomy mode yet.

## Integration with the sky experience

`PortfolioExperience` checks `ExperienceMode`. Desktop renders for `portfolio` and `transition-to-sky`. A future R3F sky layer can mount for `sky` / `transition-to-portfolio` beside (not inside) the window system.
