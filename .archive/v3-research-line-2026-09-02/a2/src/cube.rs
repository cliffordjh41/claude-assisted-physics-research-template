//! The cube and its shadow down a body diagonal.
//!
//! Projecting the eight cube vertices orthogonally along a body diagonal
//! sends the two vertices on that diagonal to the centroid and the other
//! six to a regular hexagon. The coordinate that the projection destroys is
//! the level, `x + y + z`; it is not lost, it is the coordinate no longer
//! being drawn.

/// The eight vertices of the cube centred on the origin with edge 2.
pub const CUBE_VERTICES: [[i8; 3]; 8] = [
    [-1, -1, -1],
    [-1, -1, 1],
    [-1, 1, -1],
    [-1, 1, 1],
    [1, -1, -1],
    [1, -1, 1],
    [1, 1, -1],
    [1, 1, 1],
];

/// The four body diagonals. A cube has four, not one; each gives an
/// equivalent hexagonal shadow.
pub const BODY_DIAGONALS: [[i8; 3]; 4] = [[1, 1, 1], [1, 1, -1], [1, -1, 1], [-1, 1, 1]];

/// The level of a lattice point: `x + y + z`. Constant on each plane
/// perpendicular to `(1,1,1)`, and the coordinate the projection removes.
pub fn level(v: [i8; 3]) -> i8 {
    v[0] + v[1] + v[2]
}

fn norm(v: [f64; 3]) -> f64 {
    (v[0] * v[0] + v[1] * v[1] + v[2] * v[2]).sqrt()
}

fn scale(v: [f64; 3], k: f64) -> [f64; 3] {
    [v[0] * k, v[1] * k, v[2] * k]
}

fn dot(a: [f64; 3], b: [f64; 3]) -> f64 {
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

fn cross(a: [f64; 3], b: [f64; 3]) -> [f64; 3] {
    [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ]
}

/// An orthogonal projection along an axis, with an orthonormal basis for
/// the plane perpendicular to it.
#[derive(Debug, Clone, Copy)]
pub struct Projection {
    /// Unit vector along the projection axis. Its component is the height.
    pub axis: [f64; 3],
    e1: [f64; 3],
    e2: [f64; 3],
}

impl Projection {
    /// Build the projection along `axis`. Panics if `axis` is zero.
    pub fn along(axis: [i8; 3]) -> Self {
        let a = [axis[0] as f64, axis[1] as f64, axis[2] as f64];
        let n_len = norm(a);
        assert!(n_len > 0.0, "projection axis must be non-zero");
        let n = scale(a, 1.0 / n_len);

        // Any vector not parallel to n, made perpendicular to it.
        let seed = if n[0].abs() < 0.9 { [1.0, 0.0, 0.0] } else { [0.0, 1.0, 0.0] };
        let mut e1 = [
            seed[0] - n[0] * dot(seed, n),
            seed[1] - n[1] * dot(seed, n),
            seed[2] - n[2] * dot(seed, n),
        ];
        let l = norm(e1);
        e1 = scale(e1, 1.0 / l);
        let e2 = cross(n, e1);
        Self { axis: n, e1, e2 }
    }

    /// The two-dimensional shadow of a point.
    pub fn project(&self, v: [f64; 3]) -> [f64; 2] {
        [dot(v, self.e1), dot(v, self.e2)]
    }

    /// The component along the axis: the coordinate the shadow discards.
    pub fn height(&self, v: [f64; 3]) -> f64 {
        dot(v, self.axis)
    }

    /// Shadow radius.
    pub fn radius(&self, v: [f64; 3]) -> f64 {
        let p = self.project(v);
        (p[0] * p[0] + p[1] * p[1]).sqrt()
    }
}

/// Height of the apex of a regular tetrahedron whose three base vertices lie
/// at radius `r` on a circle: `r * sqrt(2)`. Every edge is then `r * sqrt(3)`.
///
/// This is the lift used in the user's `Hexagon3D.tsx`, reproduced here so
/// the relation is checked rather than assumed.
pub fn regular_tetra_lift(r: f64) -> f64 {
    r * std::f64::consts::SQRT_2
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Falsifier: for EVERY body diagonal, exactly two of the eight vertices
    /// land on the centroid and the remaining six form a regular hexagon --
    /// one distinct shadow radius and six gaps of 60 degrees. If any diagonal
    /// fails, the hexagon is an artefact of one chosen axis rather than a
    /// property of the cube.
    ///
    /// Threshold 1e-12 on radius and 1e-9 degrees on gaps. The coordinates
    /// are small integers and the basis is orthonormal, so rounding is at
    /// the 1e-16 relative level; these bounds are several orders above that
    /// and so measure the geometry, not the arithmetic.
    #[test]
    fn every_body_diagonal_gives_a_regular_hexagon() {
        for diag in BODY_DIAGONALS {
            let proj = Projection::along(diag);
            let mut radii = Vec::new();
            let mut angles = Vec::new();
            let mut on_axis = 0;

            for v in CUBE_VERTICES {
                let p = [v[0] as f64, v[1] as f64, v[2] as f64];
                let r = proj.radius(p);
                if r < 1e-12 {
                    on_axis += 1;
                } else {
                    radii.push(r);
                    let s = proj.project(p);
                    angles.push(s[1].atan2(s[0]).to_degrees().rem_euclid(360.0));
                }
            }

            assert_eq!(on_axis, 2, "diagonal {diag:?}: vertices on the centroid");
            assert_eq!(radii.len(), 6, "diagonal {diag:?}: off-axis vertices");

            let r0 = radii[0];
            for r in &radii {
                assert!((r - r0).abs() < 1e-12, "diagonal {diag:?}: radii differ");
            }

            angles.sort_by(|a, b| a.partial_cmp(b).unwrap());
            for i in 0..6 {
                let gap = (angles[(i + 1) % 6] - angles[i]).rem_euclid(360.0);
                assert!(
                    (gap - 60.0).abs() < 1e-9,
                    "diagonal {diag:?}: gap {i} is {gap}, not 60"
                );
            }
        }
    }

    /// Falsifier: the six off-axis vertices split by level into two triples,
    /// `+1` and `-1`, and each triple is equilateral. If the split is uneven
    /// or a triple is not equilateral, the alternating sign structure of the
    /// hexagon does not exist.
    #[test]
    fn the_two_triples_are_equilateral_and_split_by_level() {
        for target in [1i8, -1] {
            let triple: Vec<[i8; 3]> =
                CUBE_VERTICES.into_iter().filter(|v| level(*v) == target).collect();
            assert_eq!(triple.len(), 3, "level {target} should hold three vertices");

            let mut d = Vec::new();
            for i in 0..3 {
                for j in (i + 1)..3 {
                    let a = triple[i];
                    let b = triple[j];
                    let dx = (a[0] - b[0]) as f64;
                    let dy = (a[1] - b[1]) as f64;
                    let dz = (a[2] - b[2]) as f64;
                    d.push((dx * dx + dy * dy + dz * dz).sqrt());
                }
            }
            for x in &d {
                assert!((x - d[0]).abs() < 1e-12, "level {target} is not equilateral: {d:?}");
                assert!((x - 8.0f64.sqrt()).abs() < 1e-12, "expected 2*sqrt(2), got {x}");
            }
        }
        // The two on-axis vertices are the levels +3 and -3.
        assert_eq!(CUBE_VERTICES.into_iter().filter(|v| level(*v).abs() == 3).count(), 2);
    }

    /// Falsifier: the level is exactly the height along the axis, up to the
    /// fixed factor sqrt(3). This is the statement that the projection does
    /// not destroy the volume but moves it into a coordinate that is no
    /// longer drawn. If the two disagree, that statement is false.
    #[test]
    fn level_is_the_discarded_coordinate() {
        let proj = Projection::along([1, 1, 1]);
        for v in CUBE_VERTICES {
            let p = [v[0] as f64, v[1] as f64, v[2] as f64];
            let h = proj.height(p);
            let expected = level(v) as f64 / 3.0f64.sqrt();
            assert!((h - expected).abs() < 1e-12, "vertex {v:?}: height {h} vs {expected}");
        }
    }

    /// Falsifier: lifting three points at radius r to height r*sqrt(2)
    /// produces a regular tetrahedron with the apex at the origin -- all six
    /// edges equal r*sqrt(3). This is the relation asserted in the comment
    /// block of the user's `Hexagon3D.tsx`; if it fails, that sketch's
    /// geometry is wrong.
    #[test]
    fn the_lift_gives_a_regular_tetrahedron() {
        let r = 2.0;
        let h = regular_tetra_lift(r);
        let mut pts = vec![[0.0, 0.0, 0.0]];
        for k in 0..3 {
            let t = (k as f64) * 120.0f64.to_radians();
            pts.push([r * t.cos(), h, r * t.sin()]);
        }
        let mut edges = Vec::new();
        for i in 0..4 {
            for j in (i + 1)..4 {
                let d = [pts[i][0] - pts[j][0], pts[i][1] - pts[j][1], pts[i][2] - pts[j][2]];
                edges.push((d[0] * d[0] + d[1] * d[1] + d[2] * d[2]).sqrt());
            }
        }
        assert_eq!(edges.len(), 6);
        let want = r * 3.0f64.sqrt();
        for e in &edges {
            assert!((e - want).abs() < 1e-12, "edge {e} != r*sqrt(3) = {want}");
        }
    }
}
