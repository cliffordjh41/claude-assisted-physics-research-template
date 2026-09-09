//! Core lattice formulas.
//!
//! Ported from `ephemeratory/crates/ephem-core/src/formulas.rs`. The source
//! header, reproduced:
//!
//! ```text
//! count(n)      = 3 x 4^n    -- positions at iteration n
//! angle_step(n) = 360 / count(n)  -- angular spacing between positions
//! cumulative(n) = sum count(0..=n)   -- total positions through iteration n
//!
//! Encoding space: iterations 0-512.
//! Address space:  iterations 513+.
//! ```

use crate::direction::Direction;

/// Iterations 0-512 are the encoding space. 513+ are the address space.
pub const ENCODING_BOUNDARY: u64 = 512;

/// Number of positions at iteration n: 3 x 4^n.
/// Returns None if the result would overflow u64 (n > ~31).
pub fn count(iteration: u64) -> Option<u64> {
    4u64.checked_pow(iteration as u32)?.checked_mul(3)
}

/// Angular step in degrees between adjacent positions at iteration n.
/// = 360 / count(n).
pub fn angle_step_deg(iteration: u64) -> Option<f64> {
    count(iteration).map(|c| 360.0 / c as f64)
}

/// Total positions from iteration 0 through n (inclusive).
/// Returns None on overflow.
pub fn cumulative_count(iteration: u64) -> Option<u64> {
    (0..=iteration).try_fold(0u64, |acc, n| acc.checked_add(count(n)?))
}

/// Distance scaling at iteration n: 3^n.
/// Uses f64 -- valid up to ~iteration 308 before hitting f64 infinity.
pub fn distance_scaling(iteration: u64) -> f64 {
    3.0f64.powi(iteration.min(308) as i32)
}

/// True if this iteration is in the encoding space (0..=ENCODING_BOUNDARY).
pub fn is_encoding_space(iteration: u64) -> bool {
    iteration <= ENCODING_BOUNDARY
}

/// True if this iteration is in the address space (> ENCODING_BOUNDARY).
pub fn is_address_space(iteration: u64) -> bool {
    iteration > ENCODING_BOUNDARY
}

/// Angular position in degrees for coordinate (n, direction) at the given
/// iteration.
///
/// Future face: `(n - 1) * angle_step`.
/// Past face:   `(n - 1) * angle_step + 180`, modulo 360.
///
/// Returns `None` if iteration overflows or `n` is zero (positions are
/// 1-indexed).
///
/// This returns `0.0` for `(1, Future)`, as the source does. The apex
/// convention decided on 2026-08-20 -- angles in `(0, 360]` with `0`
/// reserved for the apex -- is implemented in the `a2` crate and is
/// deliberately not applied here. See this crate's `lib.rs`.
pub fn position_to_angle_deg(n: u64, direction: Direction, iteration: u64) -> Option<f64> {
    let step = angle_step_deg(iteration)?;
    let base = n.checked_sub(1)? as f64 * step;
    match direction {
        Direction::Future => Some(base),
        Direction::Past => Some((base + 180.0) % 360.0),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Falsifier: the position count is 3 x 4^n. Exact integer equality is
    /// the threshold -- these are counts, not measurements, so any deviation
    /// at all means the lattice being addressed is not the one described.
    #[test]
    fn count_small_iterations() {
        assert_eq!(count(0), Some(3));
        assert_eq!(count(1), Some(12));
        assert_eq!(count(2), Some(48));
        assert_eq!(count(3), Some(192));
    }

    /// Falsifier: overflow returns None rather than wrapping. 4^32 exceeds
    /// u64; a wrap would silently hand out addresses that do not exist.
    #[test]
    fn count_overflow_returns_none() {
        assert!(count(32).is_none());
    }

    /// Falsifier: the angular step is 360/count. Threshold 1e-10 degrees --
    /// far below the 1e-16 relative resolution of f64 at this magnitude, so
    /// the test measures the formula and not the arithmetic.
    #[test]
    fn angle_step_matches_count() {
        for i in 0..8u64 {
            let step = angle_step_deg(i).unwrap();
            let c = count(i).unwrap() as f64;
            assert!((step - 360.0 / c).abs() < 1e-10, "iteration {i}");
            assert!((step * c - 360.0).abs() < 1e-9, "iteration {i} does not close");
        }
    }

    #[test]
    fn cumulative_count_values() {
        assert_eq!(cumulative_count(0), Some(3));
        assert_eq!(cumulative_count(1), Some(15));
        assert_eq!(cumulative_count(2), Some(63));
        assert_eq!(cumulative_count(3), Some(255));
    }

    #[test]
    fn distance_scaling_values() {
        assert_eq!(distance_scaling(0), 1.0);
        assert_eq!(distance_scaling(1), 3.0);
        assert_eq!(distance_scaling(2), 9.0);
        assert_eq!(distance_scaling(3), 27.0);
    }

    #[test]
    fn encoding_boundary() {
        assert!(is_encoding_space(0));
        assert!(is_encoding_space(512));
        assert!(!is_encoding_space(513));
        assert!(is_address_space(513));
        assert!(!is_address_space(512));
    }

    /// Falsifier: every (n, Future) / (n, Past) pair is a diameter, i.e.
    /// exactly 180 degrees apart modulo 360. If any pair is not, "Past" is
    /// not the antipodal map and the sign structure does not hold.
    /// Threshold 1e-10 degrees, as above.
    #[test]
    fn future_past_pairs_are_diameters() {
        for iteration in 0..4u64 {
            for n in 1..=count(iteration).unwrap() {
                let f = position_to_angle_deg(n, Direction::Future, iteration).unwrap();
                let p = position_to_angle_deg(n, Direction::Past, iteration).unwrap();
                let d = (p - f).rem_euclid(360.0);
                assert!(
                    (d - 180.0).abs() < 1e-10,
                    "iteration {iteration} n {n}: Future={f} Past={p} separation={d}"
                );
            }
        }
    }

    /// Falsifier: the source's stated clock analogy at iteration 1 (12
    /// positions, 30 degree step). These four values are quoted in the
    /// source doc comment; if they do not reproduce, the port is not
    /// faithful and every claim of provenance in this crate is void.
    #[test]
    fn source_clock_analogy_reproduces() {
        assert!((position_to_angle_deg(1, Direction::Future, 1).unwrap() - 0.0).abs() < 1e-10);
        assert!((position_to_angle_deg(7, Direction::Future, 1).unwrap() - 180.0).abs() < 1e-10);
        assert!((position_to_angle_deg(1, Direction::Past, 1).unwrap() - 180.0).abs() < 1e-10);
        assert!((position_to_angle_deg(12, Direction::Past, 1).unwrap() - 150.0).abs() < 1e-10);
    }

    /// Falsifier: iteration 0 places three Future positions at 0, 120, 240
    /// and three Past positions at 180, 300, 60. This is the six-angle set
    /// that `a2` cross-checks against the hexagon. If it moves, that
    /// cross-check is comparing something else.
    #[test]
    fn iteration_zero_is_six_angles_at_sixty_degree_spacing() {
        let mut angles: Vec<f64> = Vec::new();
        for n in 1..=3u64 {
            angles.push(position_to_angle_deg(n, Direction::Future, 0).unwrap());
            angles.push(position_to_angle_deg(n, Direction::Past, 0).unwrap());
        }
        angles.sort_by(|a, b| a.partial_cmp(b).unwrap());
        let expected = [0.0, 60.0, 120.0, 180.0, 240.0, 300.0];
        assert_eq!(angles.len(), 6);
        for (got, want) in angles.iter().zip(expected.iter()) {
            assert!((got - want).abs() < 1e-10, "got {angles:?}, want {expected:?}");
        }
    }

    #[test]
    fn zero_number_and_overflow_return_none() {
        assert!(position_to_angle_deg(0, Direction::Future, 1).is_none());
        assert!(position_to_angle_deg(1, Direction::Future, 32).is_none());
    }
}
