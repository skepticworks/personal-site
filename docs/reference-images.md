# Public reference images for deep-sky objects

## Policy

Reference imagery is **separate** from personal astrophotography captures.

| Kind | Owner | Location |
| --- | --- | --- |
| Personal captures | `AstrophotographyCapture` | `/assets/astrophotography/{thumbnails,previews}/` |
| Reference images | `CelestialObject.referenceImage` | `/assets/images/reference/` |

Do not copy personal preview URLs onto deep-sky object records.

## Licensing

Only place web-optimized derivatives here when usage terms allow site hosting:

- Public-domain NASA / ESA / Hubble Heritage releases
- Other sources with clear redistribution rights
- Always keep `credit`, `sourceName`, and `sourceUrl` on the object record

Do **not** hotlink arbitrary third-party URLs without an explicit project policy.

## Current catalog paths

Objects in `src/features/astronomy/data/deep-sky-objects.ts` reference files such as:

- `m31-andromeda.webp`
- `m42-orion.webp`
- `m45-pleiades.webp`
- `m57-ring.webp`
- `m51-whirlpool.webp`
- `m13-hercules.webp`
- `m81-bode.webp`
- `m27-dumbbell.webp`

Until those optimized files are added, the object panel shows the intentional
**No image available** fallback (or personal capture previews when present).

Keep derivatives modest (roughly ≤1200px on the long edge) — panel display only.
