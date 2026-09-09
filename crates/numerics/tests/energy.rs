//! Long-run energy behavior of velocity Verlet on the harmonic oscillator.
//!
//! Test problem and solution chain as in `convergence.rs`: q'' = -q with
//! q(0) = 1, v(0) = 0. The conserved energy is E = v^2/2 + q^2/2 (kinetic
//! plus potential for unit mass and unit frequency; dE/dt =
//! v v' + q q' = v(-q) + q v = 0, so E is constant along exact solutions).
//! E(0) = 1/2.
//!
//! A symplectic integrator's energy error stays bounded over long runs
//! instead of drifting secularly; this test measures that boundedness over
//! 100 periods.
//!
//! Falsifier, declared before running: with dt = 1e-3, the maximum
//! relative energy deviation max_k |E_k - E_0| / E_0 over 100 periods
//! (about 6.3e5 steps) exceeds 1e-5.

use numerics::ode::{verlet_step, SecondOrderSystem};

struct Sho;

impl SecondOrderSystem for Sho {
    fn dim(&self) -> usize {
        1
    }
    fn accel(&self, _t: f64, q: &[f64], acc: &mut [f64]) {
        acc[0] = -q[0];
    }
}

#[test]
fn verlet_energy_drift_bounded_over_100_periods() {
    let dt = 1e-3;
    let t_end = 100.0 * 2.0 * std::f64::consts::PI;
    let steps = (t_end / dt).ceil() as usize;

    let mut q = [1.0_f64];
    let mut v = [0.0_f64];
    let e0 = 0.5 * (v[0] * v[0] + q[0] * q[0]);
    let mut max_rel = 0.0_f64;
    let mut t = 0.0;
    for _ in 0..steps {
        verlet_step(&Sho, t, &mut q, &mut v, dt);
        t += dt;
        let e = 0.5 * (v[0] * v[0] + q[0] * q[0]);
        max_rel = max_rel.max(((e - e0) / e0).abs());
    }
    println!(
        "verlet  dt = {:e}  steps = {}  max relative energy deviation = {:.3e}",
        dt, steps, max_rel
    );
    assert!(
        max_rel < 1e-5,
        "relative energy deviation {} above 1e-5",
        max_rel
    );
}
