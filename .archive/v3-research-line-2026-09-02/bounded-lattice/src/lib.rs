//! The bounded lattice: a port, not a reinterpretation.
//!
//! # Provenance
//!
//! This crate is a port of code that already exists on disk at
//! `/Users/cliff/Desktop/ephemeratory`, written by the user in a prior
//! project. It was ported on 2026-08-20 under an explicit instruction to
//! reconstruct it "without adding information to it". The structure,
//! the constants, the naming and the arithmetic are the source's.
//!
//! Sources ported:
//!
//! | this crate      | source file                                    |
//! |-----------------|------------------------------------------------|
//! | `direction`     | `crates/ephem-core/src/direction.rs`           |
//! | `formulas`      | `crates/ephem-core/src/formulas.rs`            |
//! | `position`      | `crates/ephem-core/src/position.rs`            |
//! | `nested`        | `crates/lattice/src/nested.rs`                 |
//!
//! # Deliberate differences from the source, and only these
//!
//! 1. `serde::{Serialize, Deserialize}` derives are dropped. The template's
//!    crates carry no dependencies; serialization is not exercised here.
//!    This removes a capability, it does not change any value the source
//!    computes.
//! 2. `lattice::Position` on disk types `iteration` as `u8` while
//!    `ephem_core::Position` types it as `u64`. Both exist in the source
//!    tree. The `u64` form is ported because `formulas::position_to_angle_deg`
//!    and the wasm bridge both use it.
//! 3. `NestedLattice::seed` writes the iteration as a single byte, matching
//!    the source's `u8` field. With a `u64` iteration that byte is the low
//!    byte; this is recorded in the function and is the one place where
//!    difference 2 is visible.
//!
//! Nothing else is changed. In particular `position_to_angle_deg` still
//! returns `0.0` for position 1 Future, as the source does. The convention
//! reserving `0` for the apex and running angles in `(0, 360]` was decided
//! on 2026-08-20 and lives in the `a2` crate; it is not applied here,
//! because applying it here would make this a rewrite rather than a port.
//!
//! See `sketch/koch-hexagon-cube.md` for the picture this came from.

pub mod direction;
pub mod formulas;
pub mod nested;
pub mod position;

pub use direction::Direction;
pub use formulas::{
    angle_step_deg, count, cumulative_count, distance_scaling, is_address_space,
    is_encoding_space, position_to_angle_deg, ENCODING_BOUNDARY,
};
pub use nested::NestedLattice;
pub use position::{Position, PositionError};
