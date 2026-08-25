# Astrophotography publishing workflow

This document is the operational contract for publishing personal
astrophotography to the website.

## Source library vs website

```text
Original astrophotography library   (outside this project)
        |
        | manual export of web derivatives only
        v
Web publishing exports
        |
        | validation / size checks
        v
Website assets + typed capture metadata
```

The website **must never** function as storage for the original library.

Do **not** add code that discovers, indexes, syncs, mounts, or otherwise
accesses the offline source library. The project only knows about final
exported derivatives that you deliberately place under
`public/assets/astrophotography/captures/`.

## Security / privacy boundary

**Anything included in the deployed frontend should be treated as public.**

Therefore:

- Hidden DOM is not private
- Client JSON / capture metadata is not private
- Source maps are not private storage
- Unlinked `public/` asset URLs are not private
- CSS hiding does not protect data

Only publish data and files intended to be public. Exact observing coordinates
that should remain private must **not** be shipped in capture JSON at all.

Disabling right-click, drag prevention, or obfuscated URLs does **not** protect
images. Anyone who can see a web preview can save that preview. The real
boundary is that only deliberately exported web derivatives are published.

## Prohibited assets

Never commit, deploy, or host:

- RAW camera files (CR2, CR3, NEF, ARW, DNG, …)
- FITS / FTS / XISF
- TIFF masters
- PSD / layered masters
- Calibration frames (bias, dark, flat)
- Stacked masters / intermediate processing files
- PixInsight project / source files
- Archival exports
- Full-resolution source files intended as masters
- Original camera output

This applies to the git repository, `public/`, Next.js static imports, Vercel
artifacts, and any future CDN or object storage for this site.

Do not create upload portals or infrastructure that makes publishing originals
possible.

## Allowed assets

Only intentionally exported **web derivatives**:

| Role | Filename | Typical use |
| --- | --- | --- |
| Thumbnail | `thumbnail.avif` or `thumbnail.webp` | Lists, switcher, compact UI |
| Preview | `preview.avif` or `preview.webp` | Object panel / inline viewing |
| High-quality preview (optional) | `preview-hq.avif` or `preview-hq.webp` | Full-screen viewer only |

Prefer **AVIF** or **WebP**. Do not keep giant PNG/JPEG exports merely because
a framework can optimize them at runtime — the repository file itself must
already be web-appropriate.

### Directory layout

```text
public/assets/astrophotography/captures/<capture-id>/
  thumbnail.webp
  preview.webp
  preview-hq.webp   # optional
```

Use stable **capture IDs** in paths, not mutable titles.

### Size policy

Central limits live in `src/config/astrophotography-assets.ts`:

| Role | Recommended long edge | Max long edge | Max bytes |
| --- | --- | --- | --- |
| Thumbnail | 400–800 px | 960 px | 150 KB |
| Preview | 1600–2400 px | 2560 px | 900 KB |
| HQ preview | 3000–4000 px (only when justified) | 4096 px | 2.5 MB |

### High-quality preview policy

Include `preview-hq` only when it materially improves full-screen inspection
(dense star fields, fine nebulosity, large monitors). Skip it when the normal
preview is already adequate or the transfer cost is not worth it.

Never name or treat HQ assets as `original`, `full-resolution`, `master`, or
`source`.

## Capture metadata

Captures are typed static data (`src/data/mock-captures.ts` until real records
replace placeholders). Relationship:

```text
DeepSkyObject
      ^
      |
targetObjectId
      |
AstrophotographyCapture (many per object)
```

Required ideas:

- Stable `id` + `slug`
- `images.thumbnail` + `images.preview` (+ optional `highQualityPreview`)
- Structured `equipment` and `acquisition` (exposure groups preferred)
- Optional notes / processing software
- Location with explicit `privacy` (`hidden` | `region` | `approximate` | `exact`)

There is **no** `originalSrc`, RAW link, master download, or source URL field.

Every personal image needs meaningful alt text in metadata (not filenames).

### Location privacy

| Level | What may be published |
| --- | --- |
| `hidden` | Nothing (default-safe) |
| `region` | Broad label only (e.g. “Catskills, New York”) |
| `approximate` | Coarse coords and/or regional label, labeled approximate |
| `exact` | Precise coords only when intentionally public |

Do not store private exact coordinates in the repo and “hide” them in the UI.

### EXIF / embedded metadata

Strip unintended metadata from exports before commit:

- GPS EXIF
- Camera serial numbers
- Personal file paths
- Private copyright / software path fields

UI location privacy does not help if the image file still contains GPS.

## Publishing checklist

1. Export thumbnail (web format, within budget).
2. Export preview (web format, within budget).
3. Optionally export HQ web preview when justified.
4. Strip sensitive embedded metadata.
5. Copy **only** those derivatives into `captures/<capture-id>/`.
6. Add/update typed capture metadata (including alt text + location privacy).
7. Ensure `targetObjectId` references a real catalog object.
8. Run `npm run validate:astro-assets`.
9. Run `npm run validate` / `npm run build` and preview locally.
10. Review panel + full-screen viewer before commit/deploy.

## Validation commands

```bash
npm run validate:astro-assets
npm run validate
```

`validate:astro-assets` checks:

- Allowed vs prohibited extensions under capture asset dirs
- Expected filenames / directory shape
- File size ceilings
- Capture metadata references (assets, object IDs, unique IDs/slugs)
- Location privacy shape / conflicting integration totals

Validation never silently rewrites assets — it fails with:

```text
capture ID
file
violation
expected constraint
```

Repository `.gitignore` also blocks common source extensions under
`public/assets/astrophotography/`.

## Runtime behavior (summary)

- Personal imagery defaults over reference imagery when captures exist.
- Multiple captures per object are switchable without changing the selected object.
- Full-screen viewer uses `highQualityPreview` if present, else `preview`.
- Viewer is DOM-based (zoom/pan); sky navigation pauses while it is open.
- Optional deep link: `/?object=orion-nebula&capture=orion-2025-narrowband`
- Zoom/pan state is never encoded in the URL.

## Out of scope

No original storage, RAW/FITS pipelines, DAM, upload portal, cloud archival,
anti-download tricks, plate solving, or image processing tools in this app.
