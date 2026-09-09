//! Measured convergence orders on the harmonic oscillator.
//!
//! Test problem: y'' = -y, taken as the first-order system
//! (y, v)' = (v, -y), with y(0) = 1, v(0) = 0. Solution:
//! y(t) = cos t, v(t) = -sin t. Verification by direct differentiation:
//! y' = -sin t = v; v' = -cos t = -y; y(0) = cos 0 = 1; v(0) = -sin 0 = 0.
//! No external source is needed for this chain.
//!
//! Method: integrate to t = 2*pi with step counts N and 2N, take the
//! end-state error e_N = sqrt((y_N - 1)^2 + v_N^2), and measure the order
//! as p = log2(e_N / e_2N). For a method of order p the end-state error
//! scales as dt^p (for dt small enough that the leading term dominates and
//! large enough that roundoff does not), so the measured p should sit near
//! the theoretical order.
//!
//! Falsifiers, declared before running:
//!   - RK4: measured order outside [3.8, 4.2] for any tested pair.
//!   - velocity Verlet: measured order outside [1.8, 2.2] for any pair.
//!   - Dormand-Prince 5(4) at rtol = atol = 1e-9: end-state error above
//!     1e-6, or zero accepted steps. (The bound is deliberately three
//!     orders above the local tolerance: the controller bounds local,
//!     not global, error.)

use numerics::ode::{rk4_step, verlet_step, DormandPrince54, OdeSystem, SecondOrderSystem};

const TWO_PI: f64 = 2.0 * std::f64::consts::PI;

struct Sho;

impl OdeSystem for Sho {
    fn dim(&self) -> usize {
        2
    }
    fn eval(&self, _t: f64, y: &[f64], dydt: &mut [f64]) {
        dydt[0] = y[1];
        dydt[1] = -y[0];
    }
}

impl SecondOrderSystem for Sho {
    fn dim(&self) -> usize {
        1
    }
    fn accel(&self, _t: f64, q: &[f64], acc: &mut [f64]) {
        acc[0] = -q[0];
    }
}

/// End-state error against (cos 2pi, -sin 2pi) = (1, 0).
fn end_error(y: f64, v: f64) -> f64 {
    ((y - 1.0).powi(2) + v * v).sqrt()
}

fn rk4_end_error(n: usize) -> f64 {
    let dt = TWO_PI / n as f64;
    let mut y = [1.0, 0.0];
    let mut t = 0.0;
    for _ in 0..n {
        rk4_step(&Sho, t, &mut y, dt);
        t += dt;
    }
    end_error(y[0], y[1])
}

fn verlet_end_error(n: usize) -> f64 {
    let dt = TWO_PI / n as f64;
    let mut q = [1.0];
    let mut v = [0.0];
    let mut t = 0.0;
    for _ in 0..n {
        verlet_step(&Sho, t, &mut q, &mut v, dt);
        t += dt;
    }
    end_error(q[0], v[0])
}

#[test]
fn rk4_order_is_four() {
    let ns = [100usize, 200, 400];
    let errs: Vec<f64> = ns.iter().map(|&n| rk4_end_error(n)).collect();
    for (n, e) in ns.iter().zip(&errs) {
        println!("rk4  N = {:4}  end error = {:.3e}", n, e);
    }
    for w in errs.windows(2) {
        let p = (w[0] / w[1]).log2();
        println!("rk4  measured order = {:.3}", p);
        assert!(
            (3.8..=4.2).contains(&p),
            "measured order {} outside [3.8, 4.2]",
            p
        );
    }
}

#[test]
fn verlet_order_is_two() {
    let ns = [200usize, 400, 800];
    let errs: Vec<f64> = ns.iter().map(|&n| verlet_end_error(n)).collect();
    for (n, e) in ns.iter().zip(&errs) {
        println!("verlet  N = {:4}  end error = {:.3e}", n, e);
    }
    for w in errs.windows(2) {
        let p = (w[0] / w[1]).log2();
        println!("verlet  measured order = {:.3}", p);
        assert!(
            (1.8..=2.2).contains(&p),
            "measured order {} outside [1.8, 2.2]",
            p
        );
    }
}

#[test]
fn dp54_meets_tolerance() {
    let solver = DormandPrince54::new(1e-9, 1e-9);
    let mut y = [1.0, 0.0];
    let outcome = solver.integrate(&Sho, 0.0, TWO_PI, &mut y, 0.1);
    let e = end_error(y[0], y[1]);
    println!(
        "dp54  rtol = atol = 1e-9  end error = {:.3e}  accepted = {}  rejected = {}",
        e, outcome.accepted, outcome.rejected
    );
    assert!(outcome.accepted > 0, "no steps accepted");
    assert!(e < 1e-6, "end error {} above 1e-6", e);
}
