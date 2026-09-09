//! Plane-pendulum checks: energy conservation at large amplitude and the
//! small-angle reduction to the harmonic oscillator (derivations in the
//! crate root docstring).
//!
//! Falsifiers, declared before running:
//!   - Energy: with g = l = 1, theta_0 = 2.0 rad, omega_0 = 0, dt = 1e-3,
//!     over t in [0, 1000], the maximum relative deviation of the specific
//!     energy from its initial value exceeds 1e-5.
//!   - Small-angle period: with g = l = 1, theta_0 = 1e-3 rad, dt = 1e-4,
//!     the period measured from the first downward zero crossing of theta
//!     (linearly interpolated; the first crossing of theta = 0 from a
//!     cosine-like start sits at T/4) differs from T0 = 2 pi by more than
//!     one part in 1e6 relative. (The amplitude correction to the period
//!     enters at order theta_0^2 ~ 1e-6 of itself, i.e. ~6e-8 relative,
//!     below the declared tolerance.)

use pendulum::PlanePendulum;

#[test]
fn energy_conserved_at_large_amplitude() {
    let p = PlanePendulum { g: 1.0, l: 1.0 };
    let dt = 1e-3;
    let steps = (1000.0 / dt) as usize;
    let path = p.phase_path(2.0, 0.0, dt, steps);
    let e0 = p.specific_energy(path[0], path[1]);
    let mut max_rel = 0.0_f64;
    for pair in path.chunks_exact(2) {
        let e = p.specific_energy(pair[0], pair[1]);
        max_rel = max_rel.max(((e - e0) / e0).abs());
    }
    println!(
        "pendulum  theta0 = 2.0  dt = {:e}  steps = {}  max relative energy deviation = {:.3e}",
        dt, steps, max_rel
    );
    assert!(
        max_rel < 1e-5,
        "relative energy deviation {} above 1e-5",
        max_rel
    );
}

#[test]
fn small_angle_period_reduces_to_harmonic_oscillator() {
    let p = PlanePendulum { g: 1.0, l: 1.0 };
    let dt = 1e-4;
    let theta0 = 1e-3;
    // Integrate past a quarter period (T0/4 ~ 1.57) and find the first
    // downward zero crossing of theta by linear interpolation.
    let steps = 20_000; // t up to 2.0
    let path = p.phase_path(theta0, 0.0, dt, steps);
    let mut t_cross = None;
    for (k, w) in path
        .chunks_exact(2)
        .collect::<Vec<_>>()
        .windows(2)
        .enumerate()
    {
        let (th_a, th_b) = (w[0][0], w[1][0]);
        if th_a > 0.0 && th_b <= 0.0 {
            let frac = th_a / (th_a - th_b);
            t_cross = Some((k as f64 + frac) * dt);
            break;
        }
    }
    let t_quarter = t_cross.expect("no zero crossing found within 2.0 time units");
    let period = 4.0 * t_quarter;
    let t0 = 2.0 * std::f64::consts::PI;
    let rel = ((period - t0) / t0).abs();
    println!(
        "pendulum  theta0 = {:e}  measured period = {:.9}  T0 = {:.9}  relative difference = {:.3e}",
        theta0, period, t0, rel
    );
    assert!(rel < 1e-6, "relative period difference {} above 1e-6", rel);
}
