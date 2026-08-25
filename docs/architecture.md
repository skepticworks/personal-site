# Architecture and conventions

## Purpose

Dual-purpose site:

1. Professional portfolio presented as a **desktop-style personal workspace** (DOM)
2. Interactive astronomy experience (React Three Fiber / Three.js) — planned; not the landing UI yet

Layers stay loosely coupled so either can evolve without rewriting the other.

## Directory responsibilities

| Path | Responsibility |
| --- | --- |
| `src/app` | Next.js routes, layouts, metadata |
| `src/components/desktop` | Desktop shell, shortcuts, window chrome |
| `src/components/experience` | Experience host (`PortfolioExperience`) for desktop ↔ future sky |
| `src/components/three` | Reserved for future R3F sky (not mounted in Milestone 2) |
| `src/features/*` | Feature content (portfolio, about, contact, astronomy, captures) |
| `src/types` | Domain models including `desktop.ts` |
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

**R3F / Three.js layer** will own celestial rendering later. It must not be required to use the portfolio.

`PortfolioExperience` hosts the desktop in `portfolio` / `transition-to-sky` modes and leaves room for a future sky layer.

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
- `experience-store` — `ExperienceMode` and astronomy orchestration flags
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
- Scroll hint is decorative (`aria-hidden`); motion respects `prefers-reduced-motion`
- Critical portfolio content remains in the DOM, not only in WebGL

## Environment model

`src/config/env.ts` + `next.config.ts` mapping of `VERCEL_ENV` → `NEXT_PUBLIC_VERCEL_ENV`.

## Future architectural constraints

- DOM / 3D separation
- Typed astronomy coordinates
- Lightweight optimized astrophotography assets only
- No hosting of original photography masters
- Accessibility of portfolio information outside WebGL
- Isolation of high-frequency Three.js state from React UI state
- Desktop must not permanently own the viewport — experience modes remain the integration seam for the sky transition
