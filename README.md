# Personal Portfolio & Observatory

Interactive personal workspace combining a professional software portfolio with a planned astronomy / astrophotography experience.

The landing experience is a full-screen **desktop-style portfolio**. A Stellarium-like sky explorer comes in a later milestone.

## Technology stack

- **Next.js** (App Router) + **React** + **TypeScript** (strict)
- **Zustand** for desktop window + experience state
- **React Three Fiber** + **Three.js** reserved for the future sky experience
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

- [docs/architecture.md](docs/architecture.md) — conventions, state, DOM vs WebGL
- [docs/desktop.md](docs/desktop.md) — window system, shortcuts, responsive notes
- [docs/assets.md](docs/assets.md) — web-derivative asset policy

```text
src/
  app/
  components/
    desktop/           Desktop shell, shortcuts, windows
    experience/        Experience host (desktop today; sky later)
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

Portfolio content is available through normal DOM windows and shortcuts. The future WebGL sky must remain an enhancement path, not the only content path.

## License

Private personal project unless otherwise noted.
