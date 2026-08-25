# Personal Portfolio & Observatory

Interactive personal workspace combining a professional software portfolio with an astronomy / astrophotography experience.

This repository is the technical foundation (Milestone 1). The desk interface, Stellarium-like sky, and final visual design arrive in later milestones.

## Technology stack

- **Next.js** (App Router) + **React** + **TypeScript** (strict)
- **React Three Fiber** + **Three.js** for the WebGL experience
- **Zustand** for lightweight application / experience state
- **ESLint** + **Prettier** for linting and formatting

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

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

See [docs/architecture.md](docs/architecture.md) for conventions, DOM vs WebGL boundaries, state strategy, domain models, and future constraints.

High-level layout:

```text
src/
  app/                 Next.js App Router
  components/
    ui/                DOM application chrome
    experience/        Bridge to the 3D viewport
    three/             React Three Fiber scenes / canvas
  features/            Feature-scoped helpers (portfolio, astronomy, captures)
  lib/                 Cross-cutting utilities (reserved; keep small)
  state/               Zustand stores + Three.js runtime refs
  types/               Domain TypeScript models
  data/                Mock / static content records
  config/              Site + environment configuration
  hooks/               Shared React hooks
public/assets/         Web-optimized static assets only
```

## Static asset policy

This site is **not** an archive for original astrophotography files.

Commit only web-appropriate derivatives:

- Thumbnails
- Compressed display previews
- UI imagery, icons, fonts
- Three.js textures sized for WebGL

Original / high-resolution masters stay in an external library. See [docs/assets.md](docs/assets.md).

## Environment configuration

Copy `.env.example` to `.env.local` when you need local overrides:

```bash
cp .env.example .env.local
```

Typed access lives in `src/config/env.ts`. Prefer that module over reading `process.env` in components.

| Variable | Scope | Required | Notes |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | No | Canonical site URL when known |
| `NEXT_PUBLIC_VERCEL_ENV` | Public | No | Mapped from Vercel `VERCEL_ENV` in `next.config.ts` |

The app runs without secrets. Environments:

- **development** — local `next dev`
- **preview** — Vercel branch / PR deployments
- **production** — public site

## GitHub workflow

1. Create a GitHub repository.
2. Add the remote and push:

```bash
git remote add origin git@github.com:<you>/<repo>.git
git branch -M main
git add .
git commit -m "Initial foundation for portfolio and astronomy experience"
git push -u origin main
```

No GitHub Actions are required for deployment; Vercel’s Git integration is enough.

## Vercel deployment

1. Import the GitHub repository in the [Vercel dashboard](https://vercel.com/new).
2. Framework preset: **Next.js** (auto-detected).
3. Root directory: repository root.
4. Build command: `npm run build` (default).
5. Output: Next.js default (no static export required).
6. Optionally set `NEXT_PUBLIC_SITE_URL` to the production domain.

Preview deployments are created automatically for pull requests.

## Accessibility assumption

Important portfolio content must remain available through normal DOM interfaces. The WebGL sky enhances discovery; it must not be the only path to critical information.

## License

Private personal project unless otherwise noted.
