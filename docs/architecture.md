# Architecture and conventions

## Purpose

Foundation for a dual-purpose site:

1. Professional portfolio (DOM UI, eventually a desk / computer metaphor)
2. Interactive astronomy experience (React Three Fiber / Three.js), closer to Stellarium than a decorative starfield

The layers must stay loosely coupled so either can evolve without rewriting the other.

## Directory responsibilities

| Path | Responsibility |
| --- | --- |
| `src/app` | Next.js routes, layouts, metadata |
| `src/components/ui` | Conventional DOM UI |
| `src/components/experience` | Boundary that mounts / lazy-loads the WebGL viewport |
| `src/components/three` | R3F canvas, scenes, Three-specific helpers |
| `src/features/*` | Feature-scoped logic for portfolio, astronomy, captures |
| `src/types` | Domain models |
| `src/data` | Static / mock records |
| `src/state` | Shared stores and Three runtime refs |
| `src/config` | Site constants and validated environment config |
| `src/hooks` | Shared hooks (`useX`) |
| `src/lib` | Genuinely cross-cutting utilities only |
| `public/assets` | Optimized static assets |

Do not add empty directories for ceremony. Every directory should earn its place with real modules.

## Coding conventions

- Components: **PascalCase** filenames and exports
- Hooks: **`useX`** naming
- Types / interfaces: descriptive domain names (`AstrophotographyCapture`, not `Data`)
- Prefer explicit imports; avoid barrel `index.ts` files unless they materially improve a public API
- Feature logic stays in `features/` when practical
- Shared utilities stay small and cross-cutting only
- Distinguish server-only vs client-only code; do not sprinkle `"use client"` across the tree
- Avoid `any` unless interoperability forces it (document why)

## DOM vs Three.js boundaries

**DOM layer** owns navigation, portfolio UI, dialogs, panels, settings, metadata, loading / error states, and accessibility surfaces.

**R3F / Three.js layer** owns celestial rendering, camera orientation inside the canvas, sky navigation, spatial markers, and desk↔sky visual transitions.

Application controls stay outside the canvas unless a control is inherently spatial. The WebGL viewport (`ExperienceViewport` → `ExperienceCanvas`) is replaceable without rewriting the shell.

## State management

Two Zustand stores plus a mutable Three runtime holder:

- `src/state/application-store.ts` — sections, panels, selected project / capture, user settings
- `src/state/experience-store.ts` — `ExperienceMode`, astronomy activity, selected celestial object
- `src/state/three-runtime.ts` — high-frequency values (e.g. camera yaw/pitch) updated from `useFrame` without React rerenders

Local UI state stays local. Do not globalize every value.

`ExperienceMode`:

```ts
type ExperienceMode =
  | "portfolio"
  | "transition-to-sky"
  | "sky"
  | "transition-to-portfolio";
```

Transitions are modeled now; animation comes later.

## Domain models

| Domain | Types | Sample data |
| --- | --- | --- |
| Portfolio | `src/types/portfolio.ts` | `src/data/mock-projects.ts` |
| Astronomy | `src/types/astronomy.ts` | `src/data/mock-celestial-objects.ts` |
| Captures | `src/types/captures.ts` | `src/data/mock-captures.ts` |
| Web images | `src/types/assets.ts` | embedded on captures / projects |

Astronomy coordinates:

- Right ascension: **hours** `[0, 24)` via `rightAscensionHours`
- Declination: **degrees** `[-90, 90]` via `declinationDegrees`
- Frame: ICRS / J2000 unless noted

Astrophotography image fields use `WebImageAsset` (src, width, height, alt). They refer to web derivatives only.

## Environment model

`src/config/env.ts` exposes `publicEnv` (client-safe) and `serverEnv` (server-only).

`next.config.ts` maps Vercel’s `VERCEL_ENV` to `NEXT_PUBLIC_VERCEL_ENV` so the client can distinguish development / preview / production without scattering `process.env` reads.

## Performance assumptions

- No React store updates every animation frame
- R3F canvas is client-only and dynamically imported (`ssr: false`)
- Keep code-splitting paths open for a heavier sky renderer later
- Do not ship oversized photography originals

## Accessibility

Portfolio information must remain reachable through semantic DOM UI even when WebGL is unavailable or unused. The sky is an enhancement path, not the sole content path.

## Future architectural constraints

Future milestones must preserve:

- Clear **DOM / 3D separation**
- **Typed astronomy coordinates** with unambiguous units
- **Lightweight optimized** astrophotography assets only
- **No hosting** of the original photography library in this app
- **Accessibility** of portfolio information outside WebGL
- **Isolation** of high-frequency Three.js state from React UI state
