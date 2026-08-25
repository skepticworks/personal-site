# Personal Portfolio & Observatory

Interactive personal workspace combining a professional software portfolio with an astronomy / astrophotography experience.

The landing experience is a full-screen **desktop-style portfolio**. Scrolling or swiping transitions into a placeholder night-sky shell (Milestone 3). Full Stellarium-style controls come later.

## Technology stack

- **Next.js** (App Router) + **React** + **TypeScript** (strict)
- **Zustand** for desktop window + experience state
- **React Three Fiber** + **Three.js** for the sky shell / transition camera
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
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check Prettier formatting |

## Architecture overview

- [docs/architecture.md](docs/architecture.md) — conventions, state, DOM vs WebGL, transition ownership
- [docs/desktop.md](docs/desktop.md) — window system, shortcuts, responsive notes
- [docs/transition.md](docs/transition.md) — progress model, config, camera handoff
- [docs/assets.md](docs/assets.md) — web-derivative asset policy

```text
src/
  app/
  components/
    desktop/           Desktop shell, shortcuts, windows
    experience/        Experience host, mode controls, debug overlay
    three/             R3F sky shell, transition camera, placeholder stars
  experience/
    transition/        Progress, input, config, visual derivation
  features/
    portfolio/         Projects window + project data
    about/             About window content
    contact/           Contact links + window content
    astronomy/         Celestial helpers (future sky)
    captures/          Capture helpers (future sky)
  state/               desktop-store, experience-store, …
  config/              site, env, desktop shortcuts/windows
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
- Scroll / swipe (or **Explore the night sky**) enters the sky transition

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
