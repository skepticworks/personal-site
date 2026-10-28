# Personal Portfolio & Observatory

Interactive personal site for [tylermatthews.dev](https://tylermatthews.dev): a desktop-style software portfolio paired with a React Three Fiber night-sky explorer and astrophotography.

## Stack

- Next.js (App Router) + React + TypeScript
- Zustand for desktop / experience state
- React Three Fiber + Three.js for the sky
- Static export (`output: "export"`) for DigitalOcean App Platform hosting

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production static export |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Vitest unit tests |
| `npm run validate` | Typecheck + content + astro asset validation |

## Content

- Projects: `src/features/portfolio/data/projects.ts`
- About: `src/features/about/data/about-content.ts`
- Contact: `src/features/contact/data/contact-links.ts`
- Skills: `src/features/skills/data/skills.ts`
- Resume PDF: `public/resume.pdf`

Crawlable pages: `/list/`, `/projects/`, `/projects/[slug]/`.

## Cloudflare note

If the live email appears as `[email protected]`, disable **Email Address Obfuscation** (Scrape Shield) for this domain in the Cloudflare dashboard. The site already emits a normal `mailto:` link in HTML.

## Docs

See `docs/` for architecture, desktop windows, sky transition, and content publishing.
