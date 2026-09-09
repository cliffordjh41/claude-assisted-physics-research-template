//! What fills the space around a point.
//!
//! Regular tetrahedra do not tile space: five around an edge fall short of
//! a full turn. Tetrahedra together with octahedra do, and the closure is
//! exact in two independent senses -- around an edge and around a vertex.
//!
//! Nothing here is novel. It is classical solid geometry, recorded as tests
//! so that the obstruction is in the code and cannot be forgotten by a
//! later session.

use std::f64::consts::PI;

/// Dihedral angle of a regular tetrahedron, in degrees: `acos(1/3)`.
pub fn tetra_dihedral_deg() -> f64 {
    (1.0f64 / 3.0).acos().to_degrees()
}

/// Dihedral angle of a regular octahedron, in degrees: `acos(-1/3)`.
pub fn octa_dihedral_deg() -> f64 {
    (-1.0f64 / 3.0).acos().to_degrees()
}

/// Solid angle at a vertex of a regular tetrahedron, in steradians:
/// `3*acos(1/3) - pi`.
pub fn tetra_vertex_solid_angle() -> f64 {
    3.0 * (1.0f64 / 3.0).acos() - PI
}

/// Solid angle at a vertex of a regular octahedron, in steradians:
/// `4*asin(1/3)`.
pub fn octa_vertex_solid_angle() -> f64 {
    4.0 * (1.0f64 / 3.0).asin()
}

/// How many regular tetrahedra fit around an edge before the turn closes,
/// as a real number. It is not an integer; that is the obstruction.
pub fn tetrahedra_per_edge() -> f64 {
    360.0 / tetra_dihedral_deg()
}

/// The angular shortfall left by five regular tetrahedra around an edge,
/// in degrees.
pub fn tetra_edge_gap_deg() -> f64 {
    360.0 - 5.0 * tetra_dihedral_deg()
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Falsifier: regular tetrahedra do NOT tile space. If 360/dihedral came
    /// out an integer, or the five-around-an-edge shortfall were zero, they
    /// would, and the honeycomb below would be unnecessary.
    ///
    /// The declared values are exact consequences of acos(1/3); the
    /// threshold 1e-9 degrees is far above f64 rounding for this expression
    /// and far below the 7.36-degree effect, so the test cannot pass by
    /// numerical accident.
    #[test]
    fn regular_tetrahedra_do_not_tile_space() {
        let d = tetra_dihedral_deg();
        assert!((d - 70.528779).abs() < 1e-6, "dihedral {d}");

        let n = tetrahedra_per_edge();
        assert!((n - 5.104299).abs() < 1e-6, "tetrahedra per edge {n}");
        assert!(
            (n - n.round()).abs() > 1e-3,
            "if this were an integer, tetrahedra would tile"
        );

        let gap = tetra_edge_gap_deg();
        assert!((gap - 7.356103).abs() < 1e-6, "edge gap {gap}");
        assert!(gap > 1.0, "the gap is real, not rounding");
    }

    /// Falsifier: two tetrahedra and two octahedra close an edge exactly.
    /// The tetrahedron and octahedron dihedrals are supplementary, so the
    /// sum is 360 identically. Threshold 1e-9 degrees: any real failure to
    /// close would be degrees, not nanodegrees.
    #[test]
    fn tetrahedra_and_octahedra_close_an_edge() {
        let t = tetra_dihedral_deg();
        let o = octa_dihedral_deg();
        assert!((t + o - 180.0).abs() < 1e-9, "dihedrals are not supplementary");
        assert!((2.0 * t + 2.0 * o - 360.0).abs() < 1e-9, "edge does not close");
    }

    /// Falsifier: eight tetrahedra and six octahedra close a vertex exactly.
    /// Eight is four axes times two directions -- the bicones on all four
    /// body diagonals sharing one point. They cover only about 35 per cent
    /// of the sphere; the six octahedra are the remaining 65.
    ///
    /// Threshold 1e-12 steradians against 4*pi. The measured residual is at
    /// the 1e-15 level, so the bound is three orders above rounding and
    /// twelve orders below the 8.16-steradian shortfall it would have to
    /// miss for the claim to be wrong.
    #[test]
    fn eight_tetrahedra_and_six_octahedra_close_a_vertex() {
        let t = tetra_vertex_solid_angle();
        let o = octa_vertex_solid_angle();
        let total = 8.0 * t + 6.0 * o;
        assert!((total - 4.0 * PI).abs() < 1e-12, "vertex does not close: {total}");

        let covered = 8.0 * t / (4.0 * PI);
        assert!(
            (covered - 0.350959).abs() < 1e-6,
            "eight tetrahedra cover {covered} of the sphere"
        );

        // Null test: drop the octahedra and the vertex must NOT close.
        assert!(
            (8.0 * t - 4.0 * PI).abs() > 1.0,
            "tetrahedra alone must leave a large deficit"
        );
    }
}
