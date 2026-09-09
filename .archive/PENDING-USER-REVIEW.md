# Pending user review

Material the agent archived instead of deleting. Nothing here is removed
without the user. Each entry: what, when, why, whether anything still
points at it, and whether it is safe to remove.

The agent appends; the user deletes. An archived file is never a blocker --
work continues past it.

<!-- No entries yet. The first archive appends below this line. -->

## 2026-09-02 -- v3-research-line-2026-09-02/

**What.** The research line carried in by the v3 workspace this template was
cloned from: `crates/a2` and `crates/bounded-lattice`, the `crates/lab-core`
tail that bound them to the browser
(`lab-core-hyperplane-bindings.rs`, the `cube_*`, `hyperplane_*`, `shadow_*`,
`lattice_*`, `tetra_*` and `koch_*` bindings), the stage-0 sketch
`koch-hexagon-cube.md`, and the two prior run logs
(`runs/2026-08-20.log`, `runs/2026-08-22.log`).

**Why.** A template ships a worked example, not someone else's open line.
The `gravity`, `pendulum`, `numerics` and `lab-core` crates and the
`papers/two-body-orbit/` draft are the worked example and stay.

**Still pointed at.** Nothing. `Cargo.toml` members, `crates/lab-core/Cargo.toml`
dependencies, and `crates/lab-core/src/lib.rs` were all trimmed to match;
the workspace builds and the lab bundles without them.

**Safe to remove.** Yes, once the parent workspace at
`~/Desktop/templates/claude-physics-research-template-v3-clone` is confirmed to
still hold this material. It was copied here, not moved out of the parent.
