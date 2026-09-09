# lab — handoff

Current session state for the lab sketch workbench. Lab-scoped only.

> **Sticky — 2026-07-03 (lab embedded at cliffordjh `/lab`; lattice sketches
> archived; chrome remade on thrifty):**
> - The lab is now **cross-imported by the cliffordjh site** as a flat
>   full-viewport route `/lab` (`apps/cliffordjh/src/routes/Lab.tsx`), linked
>   from `/portfolio/claude-stacks/claude-research`. `App` gained an optional
>   `onBack` (standalone renders none; the embed passes a navigate-back).
> - **`App.tsx` chrome remade on thrifty primitives** to match the site: a
>   desktop left rail; below `useIsMobile` a mobile bar (single **`ArrowUp`**
>   slot) opens the rail as a thrifty **bottom `Sheet`** (`h-[85dvh]`,
>   `modal={false}`). Root is `relative` (not `fixed`) so the bar's `z-[60]`
>   sits above the body-portaled Sheet — same layering as `Layout.tsx`. The
>   sheet **stays open on select** (mirrors the site's L column). Header is
>   `← back`. cliffordjh's `index.css` gained `@source "../../lab/src"` so lab
>   utility classes generate in the embed build. *built + tsc-clean +
>   build-clean; not browser-observed.*
> - **Lattice/hexagon thread archived** to `.archive/lab-sketches-2026-07-03/`
>   (hexagon, greater hexagon, hexagon 3D, hexagram, pappus spiral) — they
>   belonged to the old ephemeratory lab, not this gravity workbench. Registry
>   the geometry notes below are kept as history if that thread resumes. Note:
>   `apps/cliffordjh/src/lib/Hexagon3DPanel.tsx` (the copy for
>   `/portfolio/ephemeratory`) is now the only live Hexagon3D; the lab source
>   it was copied from is archived.
> - **GravityDemo two-body showcase — done (built + build-clean, not
>   browser-observed).** Copied the physics-research-template's lab scene set
>   into the workspace lab: `sketches/{GravityDemo,Chart2D,Scene3D,MathView,Wasm}.tsx`
>   + `index.ts` (registry is now one **"two-body orbit"** scene composing the
>   force law + 2D trajectory + animated 3D orbit), `lib/orbit.ts`, the
>   **gravity-enabled prebuilt wasm** (`gravitational_force` + `orbit_path`,
>   no `wasm-pack` rebuild needed — the template ships it), and the matching
>   `crates/lab-core/src/lib.rs`. The prior generic scaffold sketches
>   (Chart2D/Scene3D/MathView/Wasm) + add/version-only wasm were overwritten
>   (git history preserves them).

## What the lab is

A workbench of self-contained sketches. Each sketch is a component in
`src/sketches/`, registered in `src/sketches/index.ts` (`SKETCHES` array —
add an entry and it appears in the left rail). `App.tsx` mounts the active
one. Dark theme via thrifty CSS tokens.

Run: `pnpm dev` (from `apps/lab/`).

## Sketches

Lattice-visualization thread (the active work):

- **hexagram** — two overlaid equilateral triangles (up = +, down = −).
  The 2D shadow of the two opposed cones.
- **hexagon** — regular pointy-top hexagon as 6 wedges from the center.
  Corners carry signed values, color-coded; 0° at top, clockwise. The
  three diameters are the flip-axes.
- **greater hexagon** — grow the hexagon outward: side-n = 6n² unit
  triangles (size control). The side-1 hexagon stays colored at the core;
  outer tiles neutral (their values not yet defined).
- **hexagon 3D** — the flat hexagon in the ground plane plus its volume:
  + corners lift to an RGB tetrahedron, − corners drop to a CMY
  tetrahedron, sharing the center apex. Ground hexagon is √3-scaled and
  +30°-rotated so its 6 tiles are the same-size, same-color partners of
  the 6 tetra side faces. Colored connectors link each corner's ground
  position to its tetra vertex; signed labels on both.
  **Copied** (not moved) into the cliffordjh site as
  `apps/cliffordjh/src/lib/Hexagon3DPanel.tsx` for the
  `/portfolio/ephemeratory` route — two copies now; keep in sync if the
  geometry changes.

Pre-existing scaffold sketches (stack proofs): **pappus spiral**,
**3D scene**, **2D chart**, **math**, **wasm bridge**.

## Geometry established (so it isn't re-derived)

- Corner layout: 0° top, clockwise. Values by corner —
  0:+1, 60:−3, 120:+2, 180:−1, 240:+3, 300:−2.
- Color = signed value: +1 red, +2 green, +3 blue, −1 cyan, −2 magenta,
  −3 yellow. Opposite corners are +k / −k (antiphase) and complementary
  colors.
- Tetra lift height for a regular tetra: H = R·√2 (R = center-to-corner);
  every tetra edge is R·√3. A tetra side face has 3× the area of a flat
  wedge.
- The √3-scale + 30°-rotate that matches the 2D tiles to the 3D faces is
  one step of a √3 (rep-3) subdivision: ×√3 linear / ×3 count / +30° per
  step; two steps = ×9. Same generator drives the 2D tiling and the 3D
  volume; subdivision (inward) and growth (outward) are the same rule,
  count = (linear scale)².
- 3D used a coordinate mirror (−sin on X in `flat`/`ground`) to match the
  2D sketch's handedness so RGB reads clockwise from above.

## Open next-step

- **Outer-tile values.** The greater hexagon's outer tiles have no value
  rule yet. Deciding it determines whether the lattice is the per-ring
  ×4 growth (6n²) or the √3 / ×3-×9 fractal. This is the fork to resolve.

## Archive

- `.archive/TriangleGrid-2026-05-24.tsx` — superseded first scaffold
  (full ×4 midpoint subdivision), replaced by the hexagon line.

## Not in this handoff

The broader ephemeratory re-envisioning (security model, consensus
direction, what the lattice ultimately represents) is still in
deliberation and deliberately not recorded here yet.
