# Physics research template (v3)

A discipline scaffold for doing theoretical-physics research with an AI
coding assistant (Claude Code). It pairs a small always-on rule set with a
seven-stage rigor ladder and a Rust -> WebAssembly -> browser compute and
visualization lab.

What the scaffold is for: recording what is not written down anywhere else.
A picture in its original form before formalization, negative results, the
numbers a run produced with the parameters that produced them, which framing
was taken and what was discarded, and the point where a result and a
published one diverge. Prior art is cited for provenance, with a locator, at
the point of use -- it is not restated, and it does not justify anything.

Read ADVISORY.md before relying on anything produced here. The discipline
raises the floor on honesty; it does not, and cannot, make the output true.

## What is in here

- `CLAUDE.md` -- project instructions loaded every session: the seven-stage
  workflow, the session-start protocol, and the layout.
- `.claude/rules/` -- the discipline, in two layers. Always-on:
  `.claude/rules/honesty.md` (claims, evidence, reserved words, surprise-is-a-bug,
  frame-lock) and `.claude/rules/conduct.md` (register, terseness, preservation, domain
  identification). Path-scoped, loading only when their files are touched:
  `sketch.md`, `hypothesis.md`, `sources.md`, `writing.md`, and `code.md`,
  all in `.claude/rules/`. Read
  `.claude/rules/index.md` first.
- `sketch/` -- stage 0. Pictures verbatim and dated, before formalization.
- `library/` -- a canonical, portable source library filed by discipline,
  `<domain>/<author>/<publication>/` with `notes.md` and the source, or
  `<domain>/<short-name>.md` where the file is not held. It carries its own
  filing contract at `library/CLAUDE.md` and travels between projects whole,
  so nothing project-specific goes in it. **Ships empty of sources**, which is
  deliberate: a template carrying them would distribute other people's
  copyrighted material.
- `prior-art/` -- what your searching concluded, which is not the same thing as
  what a source says: the search log with every query verbatim, syntheses
  setting your results against published ones, and the generated library index.
  The dividing test is portability -- a file that would be meaningless after
  the library is copied into another project is not a library file.
- `lean/` -- machine-checked algebra, Lean 4 with Mathlib, for the algebra a
  result rests on rather than for every derivation. `lean/example/` builds and
  carries the pattern; see its README.
- `runs/` -- automatic full-output log of every cargo test/run/bench, so
  "the output was seen" stays checkable after the session that saw it.
- `.claude/skills/adversary/` -- attack pass on a result before it is filed:
  assumption enumeration, null test, regime-shift check, then a verdict.
- `.claude/skills/paper-writing/` -- a stage-6 (thesis/paper) skill.
- `.claude/skills/session-close/` -- the session-end skill: files the
  journal entry and rewrites `handoff.md`.
- `.claude/hooks/` + `.claude/settings.json` -- the safety and state layer:
  a SessionStart hook that injects `handoff.md` and the last journal entry
  into context, a deletion block, an emoji/pictograph block, a PostToolUse
  run logger, the subagent tool denied, and auto-memory disabled.
- `ADVISORY.md` -- a sourced advisory on the limits of AI-assisted research.
- `crates/numerics/` -- generic numerical methods: RK4, velocity Verlet,
  adaptive Dormand-Prince 5(4), bisection/Newton root finding. Tests
  measure convergence orders against theory rather than asserting them.
- `crates/gravity/` -- example physics crate: Newton's inverse-square law
  and a Kepler-orbit integrator, with tests (force law, inverse-square
  scaling, Kepler-period closure, energy conservation, and a `uom`-typed
  dimensional check that fails at compile time on a unit error).
- `crates/pendulum/` -- example physics crate: the plane pendulum, with
  energy-conservation and small-angle-reduction tests.
- `crates/lab-core/` -- the wasm bridge crate; re-exports the `gravity`
  and `pendulum` computations to the browser via `wasm-bindgen`.
- `thrifty/` -- the `thrifty-ui` React kit (Radix + Tailwind v4), vendored
  as a pnpm workspace package. `apps/lab` depends on it as
  `"thrifty-ui": "workspace:*"`, so there is no registry version to track
  and edits to the kit are picked up by the lab's dev server directly. The
  kit ships as TypeScript source; the lab's `src/index.css` pulls its
  utilities in with `@source "../../../thrifty/src"`. Its authoring
  contract is `thrifty/.claude/rules/authoring-panels.md`.
- `apps/lab/` -- a Vite + React + Tailwind workbench built on the kit's
  slidable-column shell: the sketch registry in a draggable left column,
  the active sketch filling the viewport behind them, and a readout in a
  draggable right column. `ColumnToolBar` slides either column off-edge to
  reclaim the full work surface; below the mobile breakpoint the columns
  hide and the same two bodies open as bottom sheets. Ships one sketch,
  the two-body orbit, composed from the `gravity` crate through wasm.
- `tools/cite.py` -- citation-skeleton generator: give it an arXiv ID or a
  DOI and it emits a library note skeleton with the full citation (it fills
  in bibliography, not reading).
- `tools/index_library.py` -- regenerates `prior-art/library-index.md` by
  walking `library/`. Once the library is large enough that listing
  directories does not reveal what is in it, a grep against the index is what
  answers "do we already hold this?" before a search is run.
- `.github/workflows/ci.yml` -- release-mode tests with output captured,
  wasm build, type-check, the production lab bundle, and the Lean project with
  `axiom-audit` enabled, on every push. The audit fails the build if any
  declaration depends on an axiom outside `propext, Classical.choice,
  Quot.sound`, which is the same check `#print axioms` performs by hand; a
  `sorry` fails it too, so a placeholder proof cannot reach `main`. **CI is
  unexercised in the template** -- there is no remote to run it against.
- `papers/two-body-orbit/` -- example paper (LaTeX) on the gravity system,
  demonstrating the stage-6 format. See `papers/two-body-orbit/README.md`
  for build instructions.

## The seven stages

sketch -> intuition -> conceptual framework -> mathematical formalism ->
internal consistency -> predictions -> thesis/paper. These are a rigor
ladder, not a pipeline: enter at the stage matching what you bring and climb
only as far as the work warrants -- many projects never start at sketch or
aim at a paper. See `CLAUDE.md` for what each stage requires.

Stage 0 (sketch) is claim-free by construction: it cites nothing, owes no
falsifier, and records the picture in the words it arrived in. It exists
because the first formalization of an intuition is usually wrong, and once
that formalization exists the original picture is unrecoverable. At each
transition upward the frame is re-answered -- would it be chosen again from
scratch? -- and if not, it is discarded and the work restarts from the
sketch.

## Requirements

- Node >= 20 and pnpm.
- A Rust toolchain (cargo) with the wasm target:
  `rustup target add wasm32-unknown-unknown`.
- wasm-pack is provided as a dev dependency of the lab; no global install
  is needed.
- Optional: a LaTeX toolchain (e.g., Tectonic via `brew install tectonic`)
  to build the example paper under `papers/`.

## Getting started

Install dependencies:

    pnpm install

Build the wasm package (`crates/lab-core` -> `apps/lab/src/wasm`):

    pnpm --filter lab wasm

Serve the app at http://localhost:5173:

    pnpm --filter lab dev

Other commands -- run the physics tests the way the discipline requires
(release mode, output captured), type-check, and produce a production
bundle:

    cargo test --release --workspace -- --nocapture
    cargo check
    pnpm --filter lab build

The generated wasm package at `apps/lab/src/wasm/` is git-ignored; run the
`wasm` script after cloning and again after changing any crate that
`crates/lab-core` re-exports.

Note: do not paste trailing `# ...` comments into your shell. Zsh (the macOS
default) does not strip inline comments by default, so any text after the `#`
is passed as arguments to the command.

## Adding a sketch

A sketch is a React component; the shell supplies the columns, the
toolbar, and the mobile fallback around it.

1. Put the physics in a crate under `crates/` with its tests, and expose
   what the browser needs through `crates/lab-core` (see the pendulum
   bindings there for the pattern). Rebuild with `pnpm --filter lab wasm`.
2. Add a component under `apps/lab/src/sketches/` that consumes the wasm
   output (see `GravityDemo.tsx`, which composes `MathView`, `Chart2D`,
   `Scene3D` and `Wasm` into one view). Position it `absolute inset-0`;
   the shell gives it a clipping viewport above the bottom bar.
3. Register it -- id, label, component -- in
   `apps/lab/src/sketches/index.ts`. It appears in the left column.

Style with the kit's CSS-variable tokens (`bg-background`, `text-mute-fg`,
`border-line`), not hardcoded colors. Per the kit's authoring contract, a
panel or primitive never branches on `useIsMobile` itself -- the host
(`apps/lab/src/App.tsx`) chooses the surface per breakpoint.

## Papers

Stage-6 drafts live at `papers/<paper-name>/`. The shipped example,
`papers/two-body-orbit/`, is a short worked-example LaTeX paper on the
gravity system; see its README for build instructions. Edit it or delete
the directory for your own work.

## No desktop shell

This template ships the browser path only. The v3 template carried a Tauri
v2 desktop shell at `apps/lab/src-tauri/`; the lab was rebuilt on the
`thrifty-ui` kit, which has no Tauri dependency, and the shell was not
carried over. Adding one back is a per-project decision, not a default.

## License

MIT. See `LICENSE`.
