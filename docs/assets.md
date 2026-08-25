# Static asset policy

## Rule

This repository and deployed site host **web-optimized derivatives only**.

Do **not** commit or deploy:

- Full-resolution RAW / TIFF / FITS masters
- Calibration frames, stacked masters, or intermediate processing files
- Uncompressed exhibition prints
- Complete original capture libraries
- Multi-hundred-megabyte “archive quality” files

Those assets live in an external library. The site may reference them
conceptually (metadata, offline notes) but does not serve them.

For the full publishing contract, see
[astrophotography-publishing.md](./astrophotography-publishing.md).

## Allowed assets

| Kind | Location | Guidance |
| --- | --- | --- |
| General UI imagery | `public/assets/images/` | Prefer compressed WebP/AVIF |
| Astrophotography captures | `public/assets/astrophotography/captures/<capture-id>/` | `thumbnail`, `preview`, optional `preview-hq` |
| Third-party reference imagery | `public/assets/images/reference/` | Credited survey / educational stills |
| Three.js textures | `public/assets/textures/` | Power-of-two where helpful; sized for GPU upload |
| Icons | `public/assets/icons/` | SVG preferred |
| Fonts | `public/assets/fonts/` | Only if self-hosting is required |

Legacy flat `astrophotography/thumbnails` and `previews` folders are retired for
new content — use per-capture directories.

## Modeling images in code

Use `WebImageAsset` / `CaptureImageSet` from `src/types/assets.ts`:

```ts
interface CaptureImageSet {
  thumbnail: CaptureImageAsset;
  preview: CaptureImageAsset;
  highQualityPreview?: CaptureImageAsset;
}
```

Point `src` at paths under `/assets/...`. Do not invent fields that imply an
original master is available from this app (`originalSrc`, RAW links, etc.).

Policy ceilings: `src/config/astrophotography-assets.ts`.

## Loading strategy

- **DOM UI**: responsive `<img>` / `sizes` for capture previews; lazy-load
  offscreen thumbnails; eager-load the selected capture preview
- **Full-screen viewer**: `preview`, upgrading to `highQualityPreview` when
  present and loaded
- **WebGL**: textures from `public/assets/textures` only — do not use capture
  previews as Three.js textures by default

## Validation

```bash
npm run validate:astro-assets
```

Runs as `prebuild` so production builds refuse prohibited source formats and
broken capture asset references.
