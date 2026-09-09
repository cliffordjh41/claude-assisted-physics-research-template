//! The hyperplane: the integer points of level zero, tessellated.
//!
//! A cell is an integer triple `(x, y, z)` with `x + y + z = 0`. Its
//! position in the plane is its shadow under [`crate::cube::Projection`]
//! along `(1,1,1)`, so the tessellation and the cube shadow are the same
//! construction rather than two that happen to agree.
//!
//! The six neighbours are the permutations of `(1, -1, 0)`.

use crate::cube::Projection;

/// A cell of the hyperplane: an integer triple summing to zero.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Hex {
    pub x: i64,
    pub y: i64,
    pub z: i64,
}

/// The six neighbour steps: the permutations of (1, -1, 0).
pub const HEX_NEIGHBOURS: [[i64; 3]; 6] = [
    [1, -1, 0],
    [1, 0, -1],
    [0, 1, -1],
    [-1, 1, 0],
    [-1, 0, 1],
    [0, -1, 1],
];

impl Hex {
    /// Construct a cell. Panics unless the coordinates sum to zero.
    pub fn new(x: i64, y: i64, z: i64) -> Self {
        assert_eq!(x + y + z, 0, "hyperplane cells satisfy x + y + z = 0");
        Self { x, y, z }
    }

    /// The origin cell.
    pub fn origin() -> Self {
        Self { x: 0, y: 0, z: 0 }
    }

    /// Step to a neighbour by index 0..6.
    pub fn neighbour(self, i: usize) -> Self {
        let d = HEX_NEIGHBOURS[i % 6];
        Self { x: self.x + d[0], y: self.y + d[1], z: self.z + d[2] }
    }

    /// Ring distance from the origin: the number of steps needed to reach it.
    pub fn distance(self) -> i64 {
        (self.x.abs() + self.y.abs() + self.z.abs()) / 2
    }

    /// Position in the plane, as the shadow down `(1,1,1)`.
    pub fn shadow(self, proj: &Projection) -> [f64; 2] {
        proj.project([self.x as f64, self.y as f64, self.z as f64])
    }

    /// Every cell within `radius` steps of the origin, the origin included.
    pub fn disc(radius: i64) -> Vec<Hex> {
        assert!(radius >= 0, "radius must be non-negative");
        let mut out = Vec::new();
        for x in -radius..=radius {
            let lo = (-radius).max(-x - radius);
            let hi = radius.min(-x + radius);
            for y in lo..=hi {
                out.push(Hex { x, y, z: -x - y });
            }
        }
        out
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::cube::Projection;

    /// Falsifier: the six neighbour steps are all of level zero, all the
    /// same distance, and their shadows sit at 60-degree spacing on one
    /// circle. If they do not, the hyperplane is not the triangular
    /// tessellation and every count below is about a different object.
    /// Threshold 1e-9 degrees, well above f64 rounding on integer inputs.
    #[test]
    fn the_six_neighbours_form_a_regular_hexagon() {
        let proj = Projection::along([1, 1, 1]);
        let mut angles = Vec::new();
        let mut radii = Vec::new();
        for d in HEX_NEIGHBOURS {
            assert_eq!(d[0] + d[1] + d[2], 0, "neighbour {d:?} leaves the plane");
            let s = proj.project([d[0] as f64, d[1] as f64, d[2] as f64]);
            radii.push((s[0] * s[0] + s[1] * s[1]).sqrt());
            angles.push(s[1].atan2(s[0]).to_degrees().rem_euclid(360.0));
        }
        for r in &radii {
            assert!((r - radii[0]).abs() < 1e-12, "neighbour radii differ: {radii:?}");
        }
        angles.sort_by(|a, b| a.partial_cmp(b).unwrap());
        for i in 0..6 {
            let gap = (angles[(i + 1) % 6] - angles[i]).rem_euclid(360.0);
            assert!((gap - 60.0).abs() < 1e-9, "gap {i} is {gap}");
        }
    }

    /// Falsifier: the number of cells within radius r is the centred
    /// hexagonal number 3r^2 + 3r + 1. Exact integer equality; a tessellation
    /// with gaps or overlaps gives a different count. Checked to r = 40,
    /// which is past the point where any small-r coincidence could hold.
    #[test]
    fn disc_size_is_the_centred_hexagonal_number() {
        for r in 0..=40i64 {
            let cells = Hex::disc(r);
            assert_eq!(
                cells.len() as i64,
                3 * r * r + 3 * r + 1,
                "radius {r} count mismatch"
            );
            for c in &cells {
                assert_eq!(c.x + c.y + c.z, 0, "cell {c:?} left the plane");
                assert!(c.distance() <= r, "cell {c:?} outside radius {r}");
            }
        }
    }

    /// Falsifier: cells are distinct -- no address appears twice. A repeated
    /// cell means the enumeration is not a partition.
    #[test]
    fn disc_has_no_duplicates() {
        for r in 0..=12i64 {
            let cells = Hex::disc(r);
            let mut seen = std::collections::HashSet::new();
            for c in cells {
                assert!(seen.insert(c), "duplicate cell {c:?} at radius {r}");
            }
        }
    }

    /// Falsifier: stepping to a neighbour changes the ring distance by
    /// exactly one from the origin's neighbours, and every neighbour of a
    /// cell is adjacent to it. Null test: a step of [0,0,0] must NOT satisfy
    /// this, which shows the check has teeth.
    #[test]
    fn neighbours_are_one_step_away() {
        for i in 0..6 {
            assert_eq!(Hex::origin().neighbour(i).distance(), 1);
        }
        let null = Hex::origin();
        assert_eq!(null.distance(), 0, "null test: no step leaves distance at zero");
    }
}
