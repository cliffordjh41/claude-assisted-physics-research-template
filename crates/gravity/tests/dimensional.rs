//! Dimensional check of the force law using the `uom` typed-unit library
//! (compile-time dimensional analysis; https://crates.io/crates/uom).
//!
//! The binding `let f: Force = g * m1 * m2 / (r * r)` only compiles if the
//! right-hand side has the dimension of force. G is constructed with its SI
//! dimension m^3 kg^-1 s^-2 (value: CODATA 2018 recommended value, cited in
//! the crate root), so a dimensional error in the force law -- a wrong
//! power of r, a swapped mass and distance -- fails at compile time rather
//! than at run time. The run-time part of the test only confirms the typed
//! computation agrees with the crate's plain-f64 implementation.
//!
//! Falsifier, declared before running: the typed force in newtons differs
//! from `gravity::gravitational_force(m1, m2, r)` by more than 1 part in
//! 1e15 relative, for Earth-Moon-scale inputs.

use uom::si::f64::{Force, Length, Mass, Time};
use uom::si::force::newton;
use uom::si::length::meter;
use uom::si::mass::kilogram;
use uom::si::time::second;

#[test]
fn force_law_is_dimensionally_a_force() {
    let m = Length::new::<meter>(1.0);
    let kg = Mass::new::<kilogram>(1.0);
    let s = Time::new::<second>(1.0);

    // G with its SI dimension, from the crate's CODATA value.
    let g = gravity::G * m * m * m / kg / (s * s);

    // Earth mass, Moon mass, mean Earth-Moon distance -- magnitudes only
    // exercise the arithmetic; the test's claim is dimensional, and the
    // numeric agreement below is against the crate's own function, not an
    // external measurement.
    let m1 = Mass::new::<kilogram>(5.97e24);
    let m2 = Mass::new::<kilogram>(7.35e22);
    let r = Length::new::<meter>(3.84e8);

    // The binding to `Force` is the dimensional check.
    let f: Force = g * m1 * m2 / (r * r);

    let typed = f.get::<newton>();
    let plain = gravity::gravitational_force(5.97e24, 7.35e22, 3.84e8);
    let rel = ((typed - plain) / plain).abs();
    println!(
        "typed force = {:.6e} N  plain force = {:.6e} N  relative difference = {:.3e}",
        typed, plain, rel
    );
    assert!(rel < 1e-15, "relative difference {} above 1e-15", rel);
}
