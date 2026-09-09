//! The hyperplane: a cube seen down a body diagonal, and what fills the
//! space around it.
//!
//! This crate carries geometry only. It asserts nothing about physics and
//! nothing about what the geometry is a model of. Every number in it is
//! either an exact rational, an exact trigonometric constant, or a limit
//! with a closed form, and each is checked by a test that states what would
//! falsify it.
//!
//! The picture this came from is recorded verbatim at
//! `sketch/koch-hexagon-cube.md`, including a note on which vocabulary was
//! supplied by the agent rather than the user.
//!
//! # The apex convention
//!
//! Decided 2026-08-20: angles run in `(0, 360]` and the value `0` is
//! reserved to mean the apex -- the point on the projection axis, where
//! two cube vertices land on the centroid and the shadow radius is zero.
//! No corner ever reports `0`. See [`apex_convention`] and [`Node`].
//!
//! The `bounded-lattice` crate does NOT use this convention; it is a
//! faithful port of prior work and still returns `0.0` for position 1
//! Future. `a2::apex_convention` is the adapter between the two.

pub mod cube;
pub mod hex;
pub mod koch;
pub mod solid;

pub use cube::{level, Projection, BODY_DIAGONALS, CUBE_VERTICES};
pub use hex::{Hex, HEX_NEIGHBOURS};
pub use koch::{circumscribing_cube_edge, koch_volume_limit, koch_volume_partial, tetra_volume};
pub use solid::{
    octa_dihedral_deg, octa_vertex_solid_angle, tetra_dihedral_deg, tetra_vertex_solid_angle,
};

/// The reserved value meaning "apex": on the projection axis, radius zero.
pub const APEX: f64 = 0.0;

/// A point in the hyperplane is either the apex or a corner at some angle.
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum Node {
    /// On the projection axis. Both body-diagonal vertices land here.
    Apex,
    /// Off axis, at an angle in `(0, 360]`.
    Corner { angle_deg: f64 },
}

/// Map a raw angle to the apex convention: wrap into `(0, 360]`, so that a
/// raw `0` becomes `360` and the value `0` is left free to mean the apex.
///
/// This is the adapter for `bounded_lattice::position_to_angle_deg`, which
/// returns `0.0` for position 1 Future.
pub fn apex_convention(raw_deg: f64) -> f64 {
    let a = raw_deg.rem_euclid(360.0);
    if a == 0.0 {
        360.0
    } else {
        a
    }
}

/// Classify a shadow by its radius: on-axis points are the apex, everything
/// else is a corner at its angle under the apex convention.
///
/// `radius_tol` is the radius below which a point counts as on-axis. It is
/// a caller decision because it depends on the scale of the coordinates
/// being projected.
pub fn classify(shadow: [f64; 2], radius_tol: f64) -> Node {
    let r = (shadow[0] * shadow[0] + shadow[1] * shadow[1]).sqrt();
    if r <= radius_tol {
        Node::Apex
    } else {
        let deg = shadow[1].atan2(shadow[0]).to_degrees();
        Node::Corner { angle_deg: apex_convention(deg) }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Falsifier: no input maps to 0 under the apex convention, and raw 0
    /// maps to 360. If any angle returns 0 the reserved value is not
    /// reserved and the apex is indistinguishable from a corner.
    #[test]
    fn zero_is_reserved_and_never_produced() {
        assert_eq!(apex_convention(0.0), 360.0);
        assert_eq!(apex_convention(360.0), 360.0);
        assert_eq!(apex_convention(720.0), 360.0);
        assert_eq!(apex_convention(-360.0), 360.0);
        for i in -1000..1000 {
            let a = apex_convention(i as f64 * 0.37);
            assert!(a > 0.0 && a <= 360.0, "apex_convention({}) = {a}", i as f64 * 0.37);
        }
    }

    /// Falsifier: the convention is a relabelling, not a rotation. Every
    /// angle must be unchanged modulo 360.
    #[test]
    fn convention_preserves_angle_modulo_360() {
        for i in 0..3600 {
            let raw = i as f64 / 10.0;
            let got = apex_convention(raw);
            let diff = (got - raw).rem_euclid(360.0);
            assert!(diff < 1e-12 || (360.0 - diff) < 1e-12, "raw {raw} -> {got}");
        }
    }

    /// Falsifier: a point on the axis classifies as Apex; a point off it
    /// does not. This is the null test for `classify` -- with the radius
    /// tolerance raised above the corner radius, every corner must collapse
    /// to Apex, which shows the test is sensitive to the thing it measures.
    #[test]
    fn classify_separates_apex_from_corner() {
        assert_eq!(classify([0.0, 0.0], 1e-9), Node::Apex);
        match classify([1.0, 0.0], 1e-9) {
            Node::Corner { angle_deg } => assert!((angle_deg - 360.0).abs() < 1e-12),
            other => panic!("expected corner, got {other:?}"),
        }
        assert_eq!(classify([1.0, 0.0], 2.0), Node::Apex, "null test: tolerance swallows it");
    }
}
