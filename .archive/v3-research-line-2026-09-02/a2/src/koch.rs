//! The three-dimensional Koch construction and the solid it converges to.
//!
//! # Source
//!
//! Adam Issah, "Properties of a Custom 3-Dimensional Koch Snowflake",
//! self-published on Medium, article id 5f282845ceec, presented by its
//! author as an International Baccalaureate Internal Assessment. It is not
//! peer reviewed. It is cited here for the construction and the series it
//! sets up, both of which are stated explicitly in the article; the
//! arithmetic below was carried out independently rather than taken from
//! the article's conclusions.
//!
//! # The construction, as the article states it
//!
//! Start from a regular tetrahedron of edge `s`. On each face, iteration 1
//! erects one tetrahedron of edge `s/2`; iteration 2 erects 6 of edge `s/4`;
//! iteration 3 erects 36 of edge `s/8`. Per face the count multiplies by 6
//! and the edge halves. The article's volume, quoted:
//!
//! ```text
//! Volume of Snowflake = s^3/(6 sqrt 2) * (1 + 4 * sum_{n=1..inf} 6^(n-1)/2^(3n))
//! ```
//!
//! # What is established here, and what is not
//!
//! Established, by the tests below: the series sums to exactly 1/2, so the
//! limiting volume is exactly three times the starting tetrahedron, which is
//! exactly the volume of the cube in which that tetrahedron is inscribed.
//!
//! NOT established: that the erected tetrahedra fill that cube without
//! overlapping. The volume identity is consistent with it and is strong
//! evidence, but no proof is given here and none should be assumed.
//!
//! Also unresolved: the article's surface-area accounting grows by exactly
//! 3/2 per iteration and therefore diverges, while the cube it converges to
//! has finite surface area `3 s^2`. The divergent count includes faces that
//! end up interior. Recorded, not settled.

/// Volume of a regular tetrahedron of edge `s`: `s^3 / (6 sqrt 2)`.
pub fn tetra_volume(s: f64) -> f64 {
    s * s * s / (6.0 * std::f64::consts::SQRT_2)
}

/// Surface area of a regular tetrahedron of edge `s`: `sqrt(3) s^2`.
pub fn tetra_surface_area(s: f64) -> f64 {
    3.0f64.sqrt() * s * s
}

/// Edge of the cube in which a regular tetrahedron of edge `s` is inscribed:
/// the cube's face diagonal is the tetrahedron's edge, so the edge is
/// `s / sqrt 2`.
pub fn circumscribing_cube_edge(s: f64) -> f64 {
    s / std::f64::consts::SQRT_2
}

/// Partial sum of the article's volume series after `n` iterations.
pub fn koch_volume_partial(s: f64, n: u32) -> f64 {
    let base = tetra_volume(s);
    let mut acc = 0.0;
    for k in 1..=n {
        acc += 6.0f64.powi(k as i32 - 1) / 8.0f64.powi(k as i32);
    }
    base * (1.0 + 4.0 * acc)
}

/// The limit of the article's volume series: `3 * tetra_volume(s)`.
pub fn koch_volume_limit(s: f64) -> f64 {
    3.0 * tetra_volume(s)
}

/// Surface area after `n` iterations under the article's accounting, which
/// counts every added face. Grows by exactly 3/2 each iteration.
pub fn koch_surface_area_partial(s: f64, n: u32) -> f64 {
    let mut area = tetra_surface_area(s);
    for k in 1..=n {
        let count = 6.0f64.powi(k as i32 - 1) * 4.0; // per face, times four faces
        let t = s / 2.0f64.powi(k as i32);
        area += count * 2.0 * (3.0f64.sqrt() / 4.0) * t * t;
    }
    area
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Falsifier: the series `sum 6^(n-1)/8^n` converges to exactly 1/2. It
    /// is geometric with ratio 3/4 and first term 1/8, so the value is
    /// (1/8)/(1-3/4) = 1/2. Threshold 1e-15 on the partial sum at n = 200,
    /// by which point the remaining tail is below f64 resolution. If this
    /// were any other value the identity with the cube below would not hold.
    #[test]
    fn the_volume_series_sums_to_one_half() {
        let mut acc = 0.0;
        for k in 1..=200i32 {
            acc += 6.0f64.powi(k - 1) / 8.0f64.powi(k);
        }
        assert!((acc - 0.5).abs() < 1e-15, "series sums to {acc}, not 1/2");
    }

    /// Falsifier: the limiting volume equals the volume of the circumscribing
    /// cube, exactly. If it does not, the limit shape is not that cube and
    /// the whole reading of the construction is wrong.
    ///
    /// Threshold 1e-15 relative. Both sides are short closed-form expressions
    /// in f64; a genuine mismatch would be a ratio, not a last-bit
    /// disagreement.
    #[test]
    fn the_limit_volume_is_the_circumscribing_cube() {
        for s in [0.5f64, 1.0, 2.0, 7.3] {
            let limit = koch_volume_limit(s);
            let a = circumscribing_cube_edge(s);
            let cube = a * a * a;
            assert!(
                (limit - cube).abs() <= 1e-15 * cube.max(1.0),
                "s = {s}: limit {limit} vs cube {cube}"
            );
            // A regular tetrahedron is exactly one third of its cube.
            assert!((cube / tetra_volume(s) - 3.0).abs() < 1e-12);
        }
    }

    /// Falsifier: the partial sums rise, never overshoot, and fall short of
    /// the limit by exactly the closed-form tail of the series.
    ///
    /// Derivation of the criterion, in two parts.
    ///
    /// The mathematics. The series is geometric with ratio 3/4, so the tail
    /// after n terms is
    ///
    /// ```text
    ///     sum_{k>n} 6^(k-1)/8^k = (1/2) (3/4)^n
    /// ```
    ///
    /// and the volume falls short of its limit by
    /// `4 * V_tet * (1/2) (3/4)^n = 2 * V_tet * (3/4)^n`.
    ///
    /// The arithmetic. The shortfall is computed as `limit - v`, a
    /// difference of two f64 values of magnitude `limit`, so its absolute
    /// error is a small fixed multiple of `ulp(limit) = eps * limit` and
    /// does NOT shrink as n grows. Measured over n = 1..=120 at s = 1 and
    /// s = 3.7, the largest observed discrepancy is 1.73 * eps * limit. The
    /// bound below is 8 * eps * limit, a factor of about 4.6 above that and
    /// still far below the shortfall at every n where the shortfall is
    /// resolvable at all.
    ///
    /// History, kept deliberately, because the same mistake was made twice.
    ///
    /// The first version asserted the partial sum reached the limit to 1e-15
    /// by n = 60. It failed: at n = 60 the tail is 7.5e-9, and the observed
    /// shortfall matched that prediction to nine significant figures. The
    /// tolerance had been chosen, not derived.
    ///
    /// The second version asserted the shortfall matched the closed form to
    /// a *relative* 1e-6. It failed at n = 75, where the relative error is
    /// 1.1e-6. That failure was not a tighter version of the first: a
    /// relative criterion is the wrong SHAPE here, because the numerator's
    /// error floor is fixed while the denominator decays, so the relative
    /// error necessarily diverges with n. The bound has to be absolute.
    /// Beyond roughly n = 110 the shortfall itself sinks into that floor and
    /// the comparison stops carrying information; the range is capped there
    /// for that reason and not for convenience.
    #[test]
    fn partial_volumes_fall_short_by_exactly_the_geometric_tail() {
        const EPS: f64 = f64::EPSILON;

        for s in [1.0f64, 3.7] {
            let limit = koch_volume_limit(s);
            let base = tetra_volume(s);
            let floor = 8.0 * EPS * limit;
            let mut prev = base;

            for n in 1..=110u32 {
                let v = koch_volume_partial(s, n);

                assert!(v >= prev, "s={s} n={n}: volume decreased");
                if n <= 60 {
                    assert!(v > prev, "s={s} n={n}: volume did not increase");
                }
                assert!(v <= limit + floor, "s={s} n={n}: overshot the limit");

                let shortfall = limit - v;
                let predicted = 2.0 * base * 0.75f64.powi(n as i32);
                assert!(
                    (shortfall - predicted).abs() <= floor,
                    "s={s} n={n}: shortfall {shortfall:e} vs predicted {predicted:e}, \
                     difference {:e} exceeds the {floor:e} arithmetic floor",
                    (shortfall - predicted).abs()
                );
                prev = v;
            }

            // Past n = 116 the predicted tail is below the arithmetic floor,
            // so the sum has reached the limit as far as f64 can express it.
            let v = koch_volume_partial(s, 150);
            assert!(
                (v - limit).abs() <= floor,
                "s={s}: n=150 gives {v}, limit {limit}"
            );
        }
    }

    /// Falsifier: the article's surface-area accounting grows by exactly 3/2
    /// per iteration, and so diverges. This is recorded because it CONFLICTS
    /// with the limit being a cube of finite surface area 3 s^2. The test
    /// asserts the conflict rather than resolving it, so that a later
    /// session finds the open question instead of a tidy answer.
    ///
    /// Threshold 1e-12 on the ratio; it is an exact rational and any real
    /// departure would be at the percent level.
    #[test]
    fn surface_area_accounting_diverges_and_conflicts_with_the_cube() {
        let s = 1.0;
        let mut prev = koch_surface_area_partial(s, 0);
        for n in 1..=20u32 {
            let a = koch_surface_area_partial(s, n);
            assert!((a / prev - 1.5).abs() < 1e-12, "iteration {n} ratio {}", a / prev);
            prev = a;
        }
        assert!(prev > 1000.0, "the accounting must diverge");

        let edge = circumscribing_cube_edge(s);
        let cube_area = 6.0 * edge * edge;
        assert!((cube_area - 3.0 * s * s).abs() < 1e-15, "cube area is 3 s^2");
        assert!(
            prev > cube_area,
            "OPEN: the counted area exceeds the limit solid's area; \
             the excess is faces that end up interior, and this is not resolved"
        );
    }
}
