# Deep-sky object interface (Milestone 5)

## Purpose

DOM inspection, search, and deep-link navigation for curated deep-sky objects,
synchronized with the Milestone 4 celestial engine. Metadata stays in the DOM —
not WebGL.

## Architecture

```text
CelestialObject (catalog)
      |
      +--> Three.js waypoint
      |
      +--> selectedCelestialObjectId (experience-store)
                |
                +--> camera targeting (skyRuntime / CelestialCameraController)
                |
                +--> DeepSkyObjectDetails (panel or sheet)
                |
                +--> ?object=<slug> URL sync
```

**One authoritative selection:** `experience-store.selectedCelestialObjectId`.
Panel visibility is derived (`id !== null`). Object records are resolved by ID
from the catalog — not duplicated in shared state.

### Shared selection action

All entry paths call `selectCelestialObject(id, options?)` in
`src/features/astronomy/actions/selectCelestialObject.ts`:

| Path | Behavior |
| --- | --- |
| Waypoint tap | select + focus camera + URL |
| Search result | select + focus + URL; clears search |
| Direct `?object=` | select + enter sky (snapped) + focus; no URL rewrite loop |
| Center object | `requestSkyObjectFocus` only |
| Close / Escape | clear selection; camera orientation unchanged |

Options: `{ focusCamera?, updateUrl?, enterSky? }`.

### Camera coupling

```text
URL / UI → selected object state → pendingFocusObjectId → sky camera controller
```

The router never mutates Three.js quaternions. Pending focus is flushed when
`cameraOwner === "sky"`.

Manual pan after targeting returns to free navigation but **keeps** selection
and the open panel. Use **Center object** to re-target.

## URL model

```text
/?object=andromeda-galaxy
```

- Stable **slug** on each `CelestialObject` (not array indices).
- Interactive picks use `router.replace` (no history spam per click).
- Invalid slugs are stripped; selection is not set.
- Direct links **enter sky** with snapped progress (skip long cinematic).
- Returning to desktop clears the `object` param so a lingering deep link does
  not immediately force the user back into the sky.
- Selection ID may remain in the store across desk ↔ sky round-trips; sky UI
  hides outside sky mode and reappears on re-entry.

## Search

Client-side only (`searchDeepSkyObjects`). Ranking:

1. Exact primary name
2. Exact catalog ID (`M31`, `NGC 224`, spacing/case normalized)
3. Prefix matches
4. Alias matches
5. Broader substring / constellation / type

Result limit defaults to 10.

## Imagery precedence

```text
personal capture (by targetObjectId)
    → referenceImage on object
    → no-image fallback
```

Centralized in `getPreferredDisplayImage`. Missing asset files fail soft into
the no-image state.

## Responsive presentation

| Viewport | Shell |
| --- | --- |
| ≥768px | `DeepSkyObjectPanel` (side) |
| &lt;768px | `DeepSkyObjectSheet` (partial / expanded via buttons) |

Shared body: `DeepSkyObjectDetails` + metadata + image helpers.

## Reduced motion

- Panel / sheet / image fade animations suppressed.
- Camera targeting still uses Milestone 4 reduced-motion slerp rates.
- Direct links still reach the object immediately.

## Accessibility

- Semantic heading + `<dl>` metadata
- Labeled search input + keyboard result navigation
- Non-modal sheet (no focus trap)
- `aria-live` announces selection changes only
- Pointer sky picks do not steal focus into the panel

## Data accuracy

Catalog values are published approximate J2000 / common literature figures for
the curated set. See object records and `docs/reference-images.md` for imagery.
