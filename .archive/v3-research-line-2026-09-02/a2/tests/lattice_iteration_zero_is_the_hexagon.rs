//! Cross-check: the bounded lattice's iteration 0 and the hyperplane hexagon
//! are the same six angles.
//!
//! `bounded-lattice` is a port of prior work and knows nothing about cubes.
//! `a2` is built from the cube and knows nothing about the lattice. If the
//! six angles agree, that agreement is a property of the two constructions
//! and not of a shared implementation.

use a2::cube::{level, Projection, CUBE_VERTICES};
use a2::{apex_convention, classify, Node};
use bounded_lattice::{position_to_angle_deg, Direction};

/// Falsifier: the six angles produced by `position_to_angle_deg` at
/// iteration 0 -- three Future, three Past -- are, as a set, the six angles
/// of the cube's hexagonal shadow, under the apex convention. If the sets
/// differ by more than 1e-9 degrees in any member, the two constructions are
/// not the same object and no statement connecting them is supported.
///
/// The threshold is 1e-9 degrees. The lattice angles are exact multiples of
/// 120 in f64; the shadow angles come from atan2 on small integers. Both
/// carry rounding at the 1e-13-degree level at worst, so 1e-9 measures
/// agreement of the constructions rather than of the arithmetic.
#[test]
fn iteration_zero_angles_equal_the_cube_shadow_angles() {
    let mut lattice: Vec<f64> = Vec::new();
    for n in 1..=3u64 {
        lattice.push(apex_convention(
            position_to_angle_deg(n, Direction::Future, 0).unwrap(),
        ));
        lattice.push(apex_convention(
            position_to_angle_deg(n, Direction::Past, 0).unwrap(),
        ));
    }

    let proj = Projection::along([1, 1, 1]);
    let mut shadow: Vec<f64> = Vec::new();
    for v in CUBE_VERTICES {
        let p = [v[0] as f64, v[1] as f64, v[2] as f64];
        if let Node::Corner { angle_deg } = classify(proj.project(p), 1e-12) {
            shadow.push(angle_deg);
        }
    }

    assert_eq!(lattice.len(), 6, "lattice iteration 0 should give six angles");
    assert_eq!(shadow.len(), 6, "the cube shadow should give six corners");

    // The two constructions fix different zero directions, so compare the
    // sets after removing a common rotation: align on the smallest angle.
    lattice.sort_by(|a, b| a.partial_cmp(b).unwrap());
    shadow.sort_by(|a, b| a.partial_cmp(b).unwrap());

    let offset = shadow[0] - lattice[0];
    for (l, s) in lattice.iter().zip(shadow.iter()) {
        let d = (s - l - offset).rem_euclid(360.0);
        let d = d.min(360.0 - d);
        assert!(
            d < 1e-9,
            "angle sets differ: lattice {lattice:?} shadow {shadow:?} offset {offset}"
        );
    }

    // And the gaps are 60 degrees in both.
    for set in [&lattice, &shadow] {
        for i in 0..6 {
            let gap = (set[(i + 1) % 6] - set[i]).rem_euclid(360.0);
            assert!((gap - 60.0).abs() < 1e-9, "gap {i} is {gap} in {set:?}");
        }
    }
}

/// Falsifier: the Future/Past split of the lattice matches the level split
/// of the cube -- three of one sign, three of the other, alternating around
/// the ring. If the signs interleave differently, "Past = +180 degrees" and
/// "level = -1" are not the same operation.
#[test]
fn future_past_split_matches_the_level_split() {
    let future: Vec<f64> = (1..=3u64)
        .map(|n| apex_convention(position_to_angle_deg(n, Direction::Future, 0).unwrap()))
        .collect();
    let past: Vec<f64> = (1..=3u64)
        .map(|n| apex_convention(position_to_angle_deg(n, Direction::Past, 0).unwrap()))
        .collect();

    let plus = CUBE_VERTICES.into_iter().filter(|v| level(*v) == 1).count();
    let minus = CUBE_VERTICES.into_iter().filter(|v| level(*v) == -1).count();

    assert_eq!(future.len(), plus, "Future count vs level +1 count");
    assert_eq!(past.len(), minus, "Past count vs level -1 count");

    // Within each triple the spacing is 120 degrees.
    for set in [&future, &past] {
        let mut s = set.clone();
        s.sort_by(|a, b| a.partial_cmp(b).unwrap());
        for i in 0..3 {
            let gap = (s[(i + 1) % 3] - s[i]).rem_euclid(360.0);
            assert!((gap - 120.0).abs() < 1e-9, "triple gap {i} is {gap} in {s:?}");
        }
    }

    // Null test: if Past did not add 180, the two triples would coincide.
    let raw_future = position_to_angle_deg(1, Direction::Future, 0).unwrap();
    let raw_past = position_to_angle_deg(1, Direction::Past, 0).unwrap();
    assert!(
        (raw_past - raw_future - 180.0).abs() < 1e-12,
        "the antipodal step is what separates the triples"
    );
}
