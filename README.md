# Personal Portfolio & Observatory

Interactive personal workspace combining a professional software portfolio with an astronomy / astrophotography experience.

The landing experience is a full-screen **desktop-style portfolio**. Scrolling or swiping transitions into an **interactive celestial sky** with deep-sky waypoints, object search, inspection panel, and camera targeting.

## Technology stack

- **Next.js** (App Router) + **React** + **TypeScript** (strict)
- **Zustand** for desktop window + experience state
- **React Three Fiber** + **Three.js** for the celestial sky engine
- **Vitest** for astronomy coordinate unit tests
- **ESLint** + **Prettier**

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm run test` | Unit tests (Vitest) |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check Prettier formatting |

## Architecture overview

- [docs/architecture.md](docs/architecture.md) — conventions, state, DOM vs WebGL, transition ownership
- [docs/desktop.md](docs/desktop.md) — window system, shortcuts, responsive notes
- [docs/transition.md](docs/transition.md) — progress model, config, camera handoff
- [docs/sky-engine.md](docs/sky-engine.md) — celestial coordinates, navigation, waypoints, quality
- [docs/object-interface.md](docs/object-interface.md) — object panel, search, deep links
- [docs/assets.md](docs/assets.md) — web-derivative asset policy
- [docs/reference-images.md](docs/reference-images.md) — third-party reference imagery

```text
src/
  app/
  components/
    desktop/           Desktop shell, shortcuts, windows
    experience/        Experience host, mode controls, debug overlays
    three/             R3F sky engine + transition camera
      sky/             Star field, waypoints, celestial camera, labels
  experience/
    transition/        Progress, input, config, visual derivation
    sky/               Sky wheel / exit policy
  features/
    portfolio/         Projects window + project data
    about/             About window content
    contact/           Contact links + window content
    astronomy/         Coordinates, catalogs, object panel / search
    captures/          Capture helpers + selectors
  state/               desktop-store, experience-store, sky-runtime, …
  config/              site, env, desktop, sky navigation/quality
  types/
  data/
  hooks/
  lib/
public/assets/
```

### Desktop usage

- Shortcuts: Projects, About, Contact (configured in `src/config/desktop.ts`)
- Add projects in `src/features/portfolio/data/projects.ts`
- Replace About/Contact placeholders in their feature `data/` files
- Scroll / swipe (or **Explore the night sky**) enters the sky
- In sky: drag to look, wheel to zoom (zoom out fully then scroll toward desktop to exit), tap waypoints or search (`/?object=andromeda-galaxy` deep links supported)

## Static asset policy

This site hosts **web-optimized derivatives only** — not original astrophotography masters. See [docs/assets.md](docs/assets.md).

## Environment configuration

```bash
cp .env.example .env.local
```

Typed access: `src/config/env.ts`.

| Variable | Scope | Required | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | No | Canonical site URL when known |
| `NEXT_PUBLIC_VERCEL_ENV` | Public | No | Mapped from Vercel `VERCEL_ENV` |

## GitHub + Vercel

Create a GitHub repo, push, then import the project in Vercel (Next.js preset). No GitHub Actions are required for basic deploys.

## Accessibility

Portfolio content is available through normal DOM windows and shortcuts. The WebGL sky is an enhancement path with keyboard-accessible enter/leave controls; scroll is not required.

## License

Private personal project unless otherwise noted.
