# Content authoring guide

This site keeps portfolio projects, deep-sky objects, and astrophotography
captures in typed TypeScript data modules. Routine content updates should not
require editing React components or application logic.

## Where content lives

| Content | Source of truth |
| --- | --- |
| Portfolio projects | `src/features/portfolio/data/projects.ts` |
| Deep-sky objects | `src/features/astronomy/data/deep-sky-objects.ts` |
| Captures | `src/features/captures/data/captures.ts` |
| About copy | `src/features/about/data/about-content.ts` |
| Contact links | `src/features/contact/data/contact-links.ts` |
| Desktop shortcuts | `src/config/desktop.ts` |

Schemas live in:

- `src/types/portfolio.ts` → `PortfolioProject`
- `src/types/astronomy.ts` → `CelestialObject`, `StarRecord`
- `src/types/captures.ts` → `AstrophotographyCapture`

## Coordinate and catalog conventions

- **Right ascension**: hours in `[0, 24)` as `coordinates.rightAscensionHours`
- **Declination**: degrees in `[-90, 90]` as `coordinates.declinationDegrees`
- **Epoch**: J2000 / ICRS unless noted
- **Distance**: light-years (`distanceLy`)
- **Magnitude**: apparent visual magnitude (smaller = brighter)
- **Catalog IDs**: `{ catalog: "M" | "NGC" | …, id: "31" }` — never encode
  display formatting into the stable `id` / `slug`

Captures reference objects by **stable object id** (`targetObjectId`), not by
name. Capture imagery is never copied onto the object record.

## Add a portfolio project

1. Add a `PortfolioProject` record to `projects.ts` with a unique `id` and
   kebab-case `slug`.
2. Optionally set `sortOrder`, `featured`, links, technologies, and images.
3. Place approved web images under `public/assets/` (project thumbnails if used).
4. Run validation:

```bash
npm run validate:content
```

Example:

```ts
{
  id: "proj-example",
  slug: "example-tool",
  title: "Example Tool",
  summary: "One-sentence card summary.",
  description: "Longer body copy for the detail pane.",
  category: "tooling",
  status: "active",
  technologies: ["TypeScript"],
  links: { repository: "https://github.com/example/tool" },
  images: [],
  featured: false,
  sortOrder: 40,
  startedAt: "2026-08-01",
}
```

## Add a deep-sky object

1. Add a `CelestialObject` to `deep-sky-objects.ts`.
2. Use a stable `id` (`obj-m81`) and URL slug (`bodes-galaxy`).
3. Provide coordinates, catalog IDs, and optional description / reference image.
4. Do **not** embed capture metadata on the object — link captures via
   `targetObjectId` instead.
5. Validate:

```bash
npm run validate:content
```

Search, waypoints, the object panel, and `?object=` deep links consume the
catalog automatically.

## Add a personal astrophotography capture

Publishing constraints (also in `docs/astrophotography-publishing.md`):

- Only deliberately exported **web previews** enter this repository.
- Never add RAW, FITS, TIFF masters, stacked masters, calibration frames, or
  archive paths.
- Do not expose private GPS unless `location.privacy` is intentionally
  `"exact"` and you mean it.

Steps:

1. Export derivatives into:

```text
public/assets/astrophotography/captures/<capture-id>/
  thumbnail.webp
  preview.webp
  high-quality-preview.webp   # optional
```

2. Add an `AstrophotographyCapture` to `captures.ts` with:
   - unique `id` / `slug`
   - `targetObjectId` matching an existing object
   - `images.thumbnail` + `images.preview` metadata (src, width, height, alt)
3. Optionally mark `featured`, set `sortOrder`, equipment, acquisition, notes.
4. Keep `location.privacy` at `"hidden"` or `"region"` unless you deliberately
   publish coarser/exact coordinates.
5. Validate both content links and on-disk assets:

```bash
npm run validate:content
npm run validate:astro-assets
```

## Associate captures with objects

- Captures own the relationship: `targetObjectId: "obj-m42"`.
- Projects may optionally list related capture ids: `relatedCaptureIds`.
- Captures may optionally list related project ids: `relatedProjectIds`.
- Derived helpers (do not duplicate in data):
  - `getCapturesForObject(objectId)`
  - `hasPersonalCapture(objectId)`
  - `getObjectsWithPersonalCaptures()`
  - `getFeaturedCaptureForObject(objectId)`

## Reference imagery

Reference images are third-party / public assets for objects **without** (or
in addition to) personal captures. Store them under:

```text
public/assets/images/reference/
```

Point `CelestialObject.referenceImage` at the public path and include credit /
source fields. The UI distinguishes **Photographed by me** from
**Reference imagery**. See `docs/reference-images.md`.

## Validation

| Command | Checks |
| --- | --- |
| `npm run validate:content` | Unique ids/slugs, object↔capture↔project refs, coords, magnitudes, required image paths, URLs/dates |
| `npm run validate:astro-assets` | Derivative presence, extensions, size ceilings, prohibited masters |
| `npm run validate` | Typecheck + both validators |
| `npm run build` | Runs content + asset validators via `prebuild` |

Useful failure shapes:

```text
[capture] cap-m31-2025: Capture "cap-m31-2025" references unknown object "m31".
[cross-reference] proj-personal-site: Project "proj-personal-site" references unknown capture "cap-orion-nebula".
```

## Common mistakes

- Using display names or array indexes as persistent ids
- Putting capture image URLs on the object record
- Shipping original masters or linking to local archive paths
- Leaving `relatedCaptureIds` / `relatedProjectIds` pointing at removed records
- Forgetting alt text or zero width/height on image metadata
- Publishing exact GPS under a non-`"exact"` privacy level

## Access utilities

Prefer these helpers over scanning arrays in UI code:

```ts
getProjectById / getProjectBySlug
getDeepSkyObjectById / getDeepSkyObjectBySlug
getCaptureById / getCapturesForObject
searchDeepSkyObjects(query)
getObjectsWithPersonalCaptures()
```
