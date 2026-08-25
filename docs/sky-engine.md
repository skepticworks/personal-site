# Interactive sky engine (Milestone 4)

## Purpose

Foundational celestial navigation engine: look around a sphere, discover deep-sky
waypoints, select/target them, and return to the desktop. This is **not** a
full Stellarium clone and **not** a local horizon / sidereal simulator yet.

## Celestial coordinates

Canonical internal format (`src/types/astronomy.ts`):

```ts
interface EquatorialCoordinates {
  rightAscensionHours: number; // [0, 24)
  declinationDegrees: number;  // [-90, 90]
}
```

- **Epoch:** J2000 / ICRS for bundled catalogs (`CATALOG_COORDINATE_EPOCH`).
- Engine maps **static** catalog coordinates. It does **not** apply precession,
  nutation, observer location, sidereal time, or refraction.
- Do not invent ambiguous `ra` / `dec` properties without units.

Helpers live under `src/features/astronomy/coordinates/` (Three.js-free).

## Three.js sphere orientation

Camera sits at the **origin** looking outward. Objects lie on a large virtual
sphere (`SKY_NAVIGATION.celestialSphereRadius`).

| Celestial | World |
| --- | --- |
| North pole (Dec = +90°) | +Y |
| South pole (Dec = −90°) | −Y |
| RA = 0h, Dec = 0° | +Z |
| Increasing RA | toward +X (eastward; CCW about +Y from above) |

Conversion (`equatorialToCartesian`):

```text
ra  = RA_hours * 15° → radians
dec = Dec_degrees → radians
x = r * cos(dec) * sin(ra)
y = r * sin(dec)
z = r * cos(dec) * cos(ra)
```

Always use these helpers — never hand-place catalog objects in arbitrary XYZ.

## Camera ownership

```text
portfolio:   cameraOwner = none
transition:  cameraOwner = transition  → TransitionCameraController
sky:         cameraOwner = sky         → CelestialCameraController
```

Within sky mode:

```text
SkyCameraMode = "free" | "targeting" | "focused"
```

- **free** — pointer drag rotates view (quaternion about world Y + camera right).
- **targeting** — slerp toward look quaternion for selected object; drag cancels.
- **focused** — arrived at target; further drag returns to free.

Orientation is **preserved** across desktop round-trips. On re-entry, sky seeds
from the transition handoff pose once, then keeps prior sky orientation/FOV
where practical.

Live camera pose stays in Three.js + `skyRuntime` / `cameraOrientationRef`.
Do **not** write per-frame quaternions into Zustand.

## Object inspection (Milestone 5)

DOM panel / search / deep links sit on top of this engine. Selection always goes
through `selectCelestialObject()` → `selectedCelestialObjectId` → optional
`pendingFocusObjectId` → `beginSkyObjectTargeting`. See `docs/object-interface.md`.

Do not wire the Next.js router directly to camera quaternions.

## Navigation & input precedence

```text
waypoint tap (movement < threshold) → select + target
pointer drag                        → free look (cancels targeting)
wheel / trackpad                    → FOV zoom (always when FOV can move)
wheel at max FOV + continued zoom-out
  after settle + overscroll         → transition-to-desktop (intentional)
"Return to desktop" / a11y          → transition-to-desktop
Escape                              → cancel targeting / clear selection
```

Zoom limits: `SKY_NAVIGATION.minFov` … `maxFov`.

Scroll-up from max FOV always zooms in — it does **not** exit. Exit overscroll
tuning: `SKY_EXIT_EDGE_SETTLE_MS` / `SKY_EXIT_OVERSCROLL_THRESHOLD` in
`sky-wheel-policy.ts`.

Desktop portfolio windows never chain wheel into the sky transition; only empty
desktop areas (or the explicit explore control) start progress from progress 0.

## Deep-sky objects & waypoints

- Domain model: `CelestialObject` with stable `id`.
- Curated set: `src/features/astronomy/data/deep-sky-objects.ts`.
- Captures should keep using `targetObjectId` → this catalog.
- Waypoints: camera-facing reticles + invisible hit discs; raycast only those.
- Selection: `experience-store.selectedCelestialObjectId` (ID only).
- Visual priority: **selected > hovered > ordinary > hidden**.

### Labels

DOM-projected overlays (`WaypointLabels` → `sky-label-host`). Rules in
`evaluateWaypointVisibility`:

- No labels behind the camera / invalid projection.
- Selected and hovered always labeled when on-facing.
- Ordinary labels: near view center, capped by quality.

## Stars

`StarField` uses `THREE.Points` + buffer attributes. Records are
`StarRecord` with equatorial coordinates and magnitude (catalog bright stars +
synthetic equatorial fillers marked `source: "synthetic"`). Magnitude → size /
intensity / soft B−V tint via `features/astronomy/stars/magnitude.ts`.

## Quality

`SkyRenderQuality` = `low` | `medium` | `high` (+ user `auto`).

Controls DPR clamp, star count, antialias, ordinary label cap. Auto uses
conservative viewport / DPR / touch signals — not a GPU benchmark.

## Accessibility & reduced motion

- Selected object readout + deep-sky list in DOM (`sky-hud`).
- Enter/leave sky via keyboard-operable buttons.
- List selection triggers the same targeting path as waypoints.
- Reduced motion: targeting uses a much higher slerp rate (near-immediate).

## Debugging

Development only:

- `SkyDebugOverlay` — look RA/Dec, FOV, mode, quality, labels.
- `EquatorialDebugGuides` — NCP/SCP/RA0/RA6 + equator ring.
- Transition overlay remains available.

## Future constraints

Preserve:

- Coordinate + orientation conventions above
- Camera ownership boundaries
- Domain IDs (no Three objects in app state)
- Data / rendering separation
- Capture `targetObjectId` linkage

Out of scope until later milestones: full catalogs, constellations, observer
location, sidereal rotation, planets, atmosphere/horizon, capture markers.
