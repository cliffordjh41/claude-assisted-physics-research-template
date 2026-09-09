//! Root-finder checks against roots known in closed form.
//!
//! Falsifiers, declared before running:
//!   - bisection on cos over [1, 2]: result differs from pi/2 by more
//!     than 1e-12 (cos(pi/2) = 0 by definition of pi/2 as the first
//!     positive zero of cosine; 1 < pi/2 < 2 since pi is between 2 and 4).
//!   - Newton on f(x) = x^2 - 2 from x0 = 1: result differs from sqrt(2)
//!     by more than 1e-14 (sqrt(2)^2 - 2 = 0 by definition).
//!   - Newton on f(x) = atan(x) from x0 = 2 must NOT converge to the root
//!     at 0: the iteration x <- x - atan(x)(1 + x^2) overshoots with
//!     growing magnitude for large |x0| (the update magnitude
//!     |atan(x)|(1 + x^2) grows quadratically while the root distance is
//!     |x|), ending in Degenerate (non-finite iterate) or MaxIterations.
//!     If it returns Ok, this test fails.
//!   - Bracketed Newton on atan over [-4, 5]: result differs from 0 by
//!     more than 1e-12 (atan(0) = 0).
//!   - bisection on x^2 + 1 over [-1, 2] must return NoSignChange.

use numerics::root::{bisect, newton, newton_bracketed, RootError};

#[test]
fn bisect_finds_first_zero_of_cosine() {
    let r = bisect(|x: f64| x.cos(), 1.0, 2.0, 1e-13, 200).expect("bracket is valid");
    let target = std::f64::consts::FRAC_PI_2;
    println!(
        "bisect  root = {:.15}  pi/2 = {:.15}  |diff| = {:.3e}",
        r,
        target,
        (r - target).abs()
    );
    assert!((r - target).abs() < 1e-12);
}

#[test]
fn newton_finds_sqrt_two() {
    let r = newton(|x| x * x - 2.0, |x| 2.0 * x, 1.0, 1e-15, 100).expect("converges locally");
    let target = std::f64::consts::SQRT_2;
    println!(
        "newton  root = {:.15}  sqrt2 = {:.15}  |diff| = {:.3e}",
        r,
        target,
        (r - target).abs()
    );
    assert!((r - target).abs() < 1e-14);
}

#[test]
fn plain_newton_fails_on_atan_far_start() {
    let res = newton(|x: f64| x.atan(), |x| 1.0 / (1.0 + x * x), 2.0, 1e-12, 100);
    println!("newton on atan from x0 = 2: {:?}", res);
    assert!(res.is_err(), "expected divergence, got {:?}", res);
}

#[test]
fn bracketed_newton_finds_atan_root() {
    let r = newton_bracketed(
        |x: f64| x.atan(),
        |x| 1.0 / (1.0 + x * x),
        -4.0,
        5.0,
        1e-13,
        200,
    )
    .expect("bracket is valid");
    println!("newton_bracketed  root = {:+.3e}", r);
    assert!(r.abs() < 1e-12);
}

#[test]
fn bisect_rejects_bracket_without_sign_change() {
    let res = bisect(|x: f64| x * x + 1.0, -1.0, 2.0, 1e-12, 100);
    println!("bisect on x^2 + 1 over [-1, 2]: {:?}", res);
    assert_eq!(res, Err(RootError::NoSignChange));
}
