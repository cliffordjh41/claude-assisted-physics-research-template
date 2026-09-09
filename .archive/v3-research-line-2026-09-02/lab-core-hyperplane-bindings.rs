// ---------------------------------------------------------------------------
// Hyperplane bindings -- the `a2` and `bounded-lattice` crates in the browser.
//
// Rust owns the geometry; the scene owns the camera. Every value returned
// here is produced by a crate whose tests state a falsifier for it, so the
// readout in the lab is showing measured quantities and not numbers typed
// into TypeScript.
// ---------------------------------------------------------------------------

use a2::cube::{level as a2_level, Projection, BODY_DIAGONALS, CUBE_VERTICES};
use a2::hex::Hex;
use a2::{apex_convention, classify, Node};
use bounded_lattice::{position_to_angle_deg, Direction};

fn diagonal(axis: usize) -> [i8; 3] {
    BODY_DIAGONALS[axis.min(BODY_DIAGONALS.len() - 1)]
}

/// The eight cube vertices with the component along the projection axis
/// scaled by `lift`, as a flat `[x0,y0,z0, x1,y1,z1, ...]` of length 24.
///
/// `lift = 1` is the cube. `lift = 0` removes the axis component entirely,
/// which flattens the cube into the hexagon and puts the two on-axis
/// vertices exactly on the centroid.
#[wasm_bindgen]
pub fn cube_points(axis: usize, lift: f64) -> Vec<f32> {
    let proj = Projection::along(diagonal(axis));
    let mut out = Vec::with_capacity(24);
    for v in CUBE_VERTICES {
        let p = [v[0] as f64, v[1] as f64, v[2] as f64];
        let h = proj.height(p) * (1.0 - lift);
        out.push((p[0] - h * proj.axis[0]) as f32);
        out.push((p[1] - h * proj.axis[1]) as f32);
        out.push((p[2] - h * proj.axis[2]) as f32);
    }
    out
}

/// Level (`x + y + z`) of each cube vertex, in the same order as
/// `cube_points`. The two values of magnitude 3 are the on-axis pair.
#[wasm_bindgen]
pub fn cube_levels() -> Vec<i32> {
    CUBE_VERTICES.iter().map(|v| a2_level(*v) as i32).collect()
}

/// Cube edges as flat index pairs into `cube_points`.
#[wasm_bindgen]
pub fn cube_edges() -> Vec<u32> {
    let mut out = Vec::new();
    for i in 0..CUBE_VERTICES.len() {
        for j in (i + 1)..CUBE_VERTICES.len() {
            let differing = (0..3).filter(|k| CUBE_VERTICES[i][*k] != CUBE_VERTICES[j][*k]).count();
            if differing == 1 {
                out.push(i as u32);
                out.push(j as u32);
            }
        }
    }
    out
}

/// The hyperplane cells within `radius` steps of the origin, flat xyz.
/// Every cell has level zero, so the lift does not move them.
#[wasm_bindgen]
pub fn hyperplane_points(radius: i32) -> Vec<f32> {
    Hex::disc(radius.max(0) as i64)
        .into_iter()
        .flat_map(|c| [c.x as f32, c.y as f32, c.z as f32])
        .collect()
}

/// Neighbour links among the cells of `hyperplane_points(radius)`, as flat
/// index pairs. Each pair is emitted once.
#[wasm_bindgen]
pub fn hyperplane_edges(radius: i32) -> Vec<u32> {
    let cells = Hex::disc(radius.max(0) as i64);
    let mut out = Vec::new();
    for (i, a) in cells.iter().enumerate() {
        for (j, b) in cells.iter().enumerate().skip(i + 1) {
            let d = [b.x - a.x, b.y - a.y, b.z - a.z];
            let mut sorted = d;
            sorted.sort();
            if sorted == [-1, 0, 1] {
                out.push(i as u32);
                out.push(j as u32);
            }
        }
    }
    out
}

/// The six corner angles of the shadow, in degrees under the apex
/// convention, when the cube is viewed exactly down `axis`. Sorted. No
/// entry is ever zero; zero is reserved for the apex.
#[wasm_bindgen]
pub fn shadow_angles(axis: usize) -> Vec<f64> {
    let proj = Projection::along(diagonal(axis));
    let mut out = Vec::new();
    for v in CUBE_VERTICES {
        let p = [v[0] as f64, v[1] as f64, v[2] as f64];
        if let Node::Corner { angle_deg } = classify(proj.project(p), 1e-12) {
            out.push(angle_deg);
        }
    }
    out.sort_by(|a, b| a.partial_cmp(b).unwrap());
    out
}

/// How many of the eight vertices land on the centroid when viewed down
/// `axis`.
#[wasm_bindgen]
pub fn shadow_apex_count(axis: usize) -> u32 {
    let proj = Projection::along(diagonal(axis));
    CUBE_VERTICES
        .iter()
        .filter(|v| {
            let p = [v[0] as f64, v[1] as f64, v[2] as f64];
            matches!(classify(proj.project(p), 1e-12), Node::Apex)
        })
        .count() as u32
}

/// The six angles of iteration 0 of the bounded lattice, under the apex
/// convention, sorted. This comes from the ported crate, which knows
/// nothing about cubes; `crates/a2/tests` asserts it is the same set as
/// `shadow_angles`.
#[wasm_bindgen]
pub fn lattice_iteration_zero_angles() -> Vec<f64> {
    let mut out = Vec::new();
    for n in 1..=3u64 {
        out.push(apex_convention(position_to_angle_deg(n, Direction::Future, 0).unwrap()));
        out.push(apex_convention(position_to_angle_deg(n, Direction::Past, 0).unwrap()));
    }
    out.sort_by(|a, b| a.partial_cmp(b).unwrap());
    out
}

/// Dihedral angle of a regular tetrahedron, degrees.
#[wasm_bindgen]
pub fn tetra_dihedral_deg() -> f64 {
    a2::solid::tetra_dihedral_deg()
}

/// The shortfall left by five regular tetrahedra around an edge, degrees.
#[wasm_bindgen]
pub fn tetra_edge_gap_deg() -> f64 {
    a2::solid::tetra_edge_gap_deg()
}

/// Residual of `8 * tetra + 6 * octa - 4*pi` at a vertex, steradians.
/// Zero to rounding is the statement that the honeycomb closes.
#[wasm_bindgen]
pub fn vertex_closure_residual() -> f64 {
    8.0 * a2::solid::tetra_vertex_solid_angle() + 6.0 * a2::solid::octa_vertex_solid_angle()
        - 4.0 * std::f64::consts::PI
}

/// Fraction of the solid angle at a vertex covered by the eight tetrahedra.
#[wasm_bindgen]
pub fn tetra_vertex_coverage() -> f64 {
    8.0 * a2::solid::tetra_vertex_solid_angle() / (4.0 * std::f64::consts::PI)
}

/// The 3D Koch limit volume as a multiple of the starting tetrahedron.
/// Equals the circumscribing cube; `crates/a2` asserts the identity.
#[wasm_bindgen]
pub fn koch_limit_over_tetra() -> f64 {
    a2::koch::koch_volume_limit(1.0) / a2::koch::tetra_volume(1.0)
}
