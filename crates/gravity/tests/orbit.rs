//! Textbook checks on the gravity crate: the force-law value and its
//! inverse-square scaling, circular-orbit closure against Kepler's third law,
//! and energy conservation over an elliptical orbit. Each test states its
//! falsifier in the doc comment; run with `--nocapture` to see the measured
//! quantities printed alongside the asserted bound.

use gravity::{circular_speed, gravitational_force, Orbit, Vec2, G};

/// Falsifier: two 1 kg point masses 1 m apart must feel exactly G newtons.
#[test]
fn force_law_unit_masses() {
    let f = gravitational_force(1.0, 1.0, 1.0);
    assert!((f - G).abs() < 1e-25, "F={f:e}, expected G={G:e}");
    println!("gravitational_force(1 kg, 1 kg, 1 m) = {f:e} N (== G)");
}

/// Falsifier: inverse-square scaling -- doubling the separation must quarter
/// the force, exactly.
#[test]
fn force_inverse_square() {
    let f1 = gravitational_force(5.0, 3.0, 2.0);
    let f2 = gravitational_force(5.0, 3.0, 4.0);
    let ratio = f1 / f2;
    assert!(
        (ratio - 4.0).abs() < 1e-12,
        "F(r)/F(2r)={ratio}, expected 4"
    );
    println!("F(r) / F(2r) = {ratio} (inverse-square law)");
}

/// Falsifier: a body launched at circular speed must return to its start
/// after one Kepler period T = 2*pi*sqrt(r^3/mu), to integrator tolerance.
#[test]
fn circular_orbit_closes_at_kepler_period() {
    let mu = 1.0;
    let r = 1.0;
    let v = circular_speed(mu, r);
    let period = 2.0 * std::f64::consts::PI * (r * r * r / mu).sqrt();
    let steps = 20_000;
    let dt = period / steps as f64;
    let mut o = Orbit::new(Vec2::new(r, 0.0), Vec2::new(0.0, v), mu);
    for _ in 0..steps {
        o.step(dt);
    }
    let drift = (o.pos.x - r).hypot(o.pos.y);
    assert!(drift < 1e-3, "closure drift={drift:e} after one period");
    println!("circular orbit: period T={period:.6}, closure drift={drift:e}");
}

/// Falsifier: specific energy eps = v^2/2 - mu/|r| must stay constant across a
/// full elliptical orbit (symplectic integrator), within 1e-3 relative.
#[test]
fn energy_conserved_over_elliptical_orbit() {
    let mu = 1.0;
    let r = 1.0;
    let v = 0.85 * circular_speed(mu, r); // sub-circular launch -> ellipse
    let mut o = Orbit::new(Vec2::new(r, 0.0), Vec2::new(0.0, v), mu);
    let e0 = o.specific_energy();
    let dt = 0.001;
    let mut max_dev = 0.0_f64;
    for _ in 0..20_000 {
        o.step(dt);
        max_dev = max_dev.max((o.specific_energy() - e0).abs());
    }
    let rel = max_dev / e0.abs();
    assert!(rel < 1e-3, "max relative energy drift={rel:e}");
    println!("elliptical orbit: eps0={e0:.6}, max relative energy drift={rel:e}");
}
