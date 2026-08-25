# Static asset policy

## Rule

This repository and deployed site host **web-optimized derivatives only**.

Do **not** commit or deploy:

- Full-resolution RAW / TIFF / FITS masters
- Uncompressed exhibition prints
- Complete original capture libraries
- Multi-hundred-megabyte “archive quality” files

Those assets live in an external library. The site may reference them conceptually (metadata, offline notes) but does not serve them.

## Allowed assets

| Kind | Location | Guidance |
| --- | --- | --- |
| General UI imagery | `public/assets/images/` | Prefer compressed WebP/AVIF; use `next/image` in DOM UI |
| Astrophotography thumbnails | `public/assets/astrophotography/thumbnails/` | Small grid / marker images |
| Astrophotography previews | `public/assets/astrophotography/previews/` | Display-sized compressed images |
| Three.js textures | `public/assets/textures/` | Power-of-two where helpful; sized for GPU upload |
| Icons | `public/assets/icons/` | SVG preferred |
| Fonts | `public/assets/fonts/` | Only if self-hosting is required |

## Modeling images in code

Use `WebImageAsset` from `src/types/assets.ts`:

```ts
interface WebImageAsset {
  src: string;
  width: number;
  height: number;
  alt: string;
}
```

Point `src` at paths under `/assets/...`. Do not invent fields that imply an original master is available from this app.

## Loading strategy

- **DOM UI**: `next/image` for conventional imagery when files exist
- **WebGL**: load textures via Three.js / R3F from `public/assets/textures` (or capture previews when intentionally used as textures)

Empty asset folders are intentional until real optimized media is added.
