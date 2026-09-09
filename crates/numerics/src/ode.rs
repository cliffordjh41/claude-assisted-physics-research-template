//! ODE integrators: fixed-step RK4, fixed-step velocity Verlet, and the
//! adaptive Dormand-Prince 5(4) embedded pair. Citations in the crate root.

/// A first-order system dy/dt = f(t, y), y in R^n.
pub trait OdeSystem {
    /// State dimension n.
    fn dim(&self) -> usize;
    /// Write f(t, y) into `dydt` (length n).
    fn eval(&self, t: f64, y: &[f64], dydt: &mut [f64]);
}

/// A second-order system q'' = a(t, q), q in R^n, for symplectic stepping.
/// The acceleration must not depend on the velocity (separable Hamiltonian
/// with H = T(p) + V(q)); velocity Verlet's symplecticity argument assumes
/// that form.
pub trait SecondOrderSystem {
    /// Configuration dimension n.
    fn dim(&self) -> usize;
    /// Write a(t, q) into `acc` (length n).
    fn accel(&self, t: f64, q: &[f64], acc: &mut [f64]);
}

/// One classical RK4 step of size `dt` from (t, y), writing the new state
/// into `y` in place. Classical fourth-order Runge-Kutta with the standard
/// weights 1/6, 1/3, 1/3, 1/6; fourth-order accuracy is measured, not
/// assumed, in `tests/convergence.rs`.
pub fn rk4_step<S: OdeSystem>(sys: &S, t: f64, y: &mut [f64], dt: f64) {
    let n = sys.dim();
    let mut k1 = vec![0.0; n];
    let mut k2 = vec![0.0; n];
    let mut k3 = vec![0.0; n];
    let mut k4 = vec![0.0; n];
    let mut tmp = vec![0.0; n];

    sys.eval(t, y, &mut k1);
    for i in 0..n {
        tmp[i] = y[i] + 0.5 * dt * k1[i];
    }
    sys.eval(t + 0.5 * dt, &tmp, &mut k2);
    for i in 0..n {
        tmp[i] = y[i] + 0.5 * dt * k2[i];
    }
    sys.eval(t + 0.5 * dt, &tmp, &mut k3);
    for i in 0..n {
        tmp[i] = y[i] + dt * k3[i];
    }
    sys.eval(t + dt, &tmp, &mut k4);
    for i in 0..n {
        y[i] += dt / 6.0 * (k1[i] + 2.0 * k2[i] + 2.0 * k3[i] + k4[i]);
    }
}

/// One velocity-Verlet step of size `dt` from (t, q, v), in place:
///   q_{k+1} = q_k + v_k dt + a(t, q_k) dt^2 / 2
///   v_{k+1} = v_k + [a(t, q_k) + a(t+dt, q_{k+1})] dt / 2
/// (Swope et al. 1982; citation in the crate root.) Second-order and
/// symplectic for velocity-independent accelerations, so the energy error
/// stays bounded rather than drifting secularly; both properties are
/// measured in `tests/convergence.rs` and `tests/energy.rs`.
pub fn verlet_step<S: SecondOrderSystem>(sys: &S, t: f64, q: &mut [f64], v: &mut [f64], dt: f64) {
    let n = sys.dim();
    let mut a0 = vec![0.0; n];
    let mut a1 = vec![0.0; n];
    sys.accel(t, q, &mut a0);
    for i in 0..n {
        q[i] += v[i] * dt + 0.5 * a0[i] * dt * dt;
    }
    sys.accel(t + dt, q, &mut a1);
    for i in 0..n {
        v[i] += 0.5 * (a0[i] + a1[i]) * dt;
    }
}

/// Outcome of an adaptive integration.
#[derive(Clone, Debug, PartialEq)]
pub struct StepOutcome {
    /// Steps accepted.
    pub accepted: usize,
    /// Steps rejected and retried with a smaller dt.
    pub rejected: usize,
}

/// Dormand-Prince 5(4): an explicit embedded Runge-Kutta pair. The
/// fifth-order solution propagates; the difference against the embedded
/// fourth-order solution estimates the local error, which drives the step
/// size. Tableau from Dormand & Prince (1980); citation in the crate root.
///
/// FSAL (first-same-as-last) is not exploited: the seventh stage is
/// recomputed each step. That costs one extra function evaluation per step
/// and changes no result.
pub struct DormandPrince54 {
    /// Relative tolerance for the per-step error test.
    pub rtol: f64,
    /// Absolute tolerance for the per-step error test.
    pub atol: f64,
}

/// Nodes c_i.
const C: [f64; 7] = [0.0, 1.0 / 5.0, 3.0 / 10.0, 4.0 / 5.0, 8.0 / 9.0, 1.0, 1.0];

/// Stage coefficients a_ij (row i gives stage i+2's dependence on k_1..k_i+1).
const A: [&[f64]; 6] = [
    &[1.0 / 5.0],
    &[3.0 / 40.0, 9.0 / 40.0],
    &[44.0 / 45.0, -56.0 / 15.0, 32.0 / 9.0],
    &[
        19372.0 / 6561.0,
        -25360.0 / 2187.0,
        64448.0 / 6561.0,
        -212.0 / 729.0,
    ],
    &[
        9017.0 / 3168.0,
        -355.0 / 33.0,
        46732.0 / 5247.0,
        49.0 / 176.0,
        -5103.0 / 18656.0,
    ],
    &[
        35.0 / 384.0,
        0.0,
        500.0 / 1113.0,
        125.0 / 192.0,
        -2187.0 / 6784.0,
        11.0 / 84.0,
    ],
];

/// Fifth-order weights b_i.
const B5: [f64; 7] = [
    35.0 / 384.0,
    0.0,
    500.0 / 1113.0,
    125.0 / 192.0,
    -2187.0 / 6784.0,
    11.0 / 84.0,
    0.0,
];

/// Embedded fourth-order weights b*_i.
const B4: [f64; 7] = [
    5179.0 / 57600.0,
    0.0,
    7571.0 / 16695.0,
    393.0 / 640.0,
    -92097.0 / 339200.0,
    187.0 / 2100.0,
    1.0 / 40.0,
];

/// Tableau accessors for the consistency tests.
pub fn dp54_tableau() -> (
    &'static [f64; 7],
    [&'static [f64]; 6],
    &'static [f64; 7],
    &'static [f64; 7],
) {
    (&C, A, &B5, &B4)
}

impl DormandPrince54 {
    pub fn new(rtol: f64, atol: f64) -> Self {
        Self { rtol, atol }
    }

    /// Integrate from (t0, y) to t1, mutating `y` in place, with initial
    /// trial step `dt0`. Standard controller: with the RMS-scaled error
    /// estimate err (accept when err <= 1), the next step is
    ///   dt <- dt * min(5, max(0.2, 0.9 * err^(-1/5))),
    /// the exponent 1/5 matching the propagating order. Returns the
    /// accepted/rejected step counts.
    ///
    /// Panics if `dt0` is not positive and finite or if t1 < t0.
    pub fn integrate<S: OdeSystem>(
        &self,
        sys: &S,
        t0: f64,
        t1: f64,
        y: &mut [f64],
        dt0: f64,
    ) -> StepOutcome {
        assert!(dt0.is_finite() && dt0 > 0.0, "dt0 must be positive");
        assert!(t1 >= t0, "t1 must be >= t0");
        let n = sys.dim();
        let mut k = vec![vec![0.0; n]; 7];
        let mut y_stage = vec![0.0; n];
        let mut y5 = vec![0.0; n];
        let mut t = t0;
        let mut dt = dt0.min(t1 - t0);
        let mut out = StepOutcome {
            accepted: 0,
            rejected: 0,
        };

        while t < t1 {
            dt = dt.min(t1 - t);
            // Stages.
            sys.eval(t, y, &mut k[0]);
            for s in 1..7 {
                for i in 0..n {
                    let mut acc = 0.0;
                    for (j, &a) in A[s - 1].iter().enumerate() {
                        acc += a * k[j][i];
                    }
                    y_stage[i] = y[i] + dt * acc;
                }
                sys.eval(t + C[s] * dt, &y_stage, &mut k[s]);
            }
            // Fifth-order solution and RMS-scaled error vs the embedded
            // fourth-order solution.
            let mut err_sq = 0.0;
            for i in 0..n {
                let mut d5 = 0.0;
                let mut d4 = 0.0;
                for s in 0..7 {
                    d5 += B5[s] * k[s][i];
                    d4 += B4[s] * k[s][i];
                }
                y5[i] = y[i] + dt * d5;
                let e = dt * (d5 - d4);
                let scale = self.atol + self.rtol * y[i].abs().max(y5[i].abs());
                err_sq += (e / scale) * (e / scale);
            }
            let err = (err_sq / n as f64).sqrt();

            if err <= 1.0 {
                t += dt;
                y.copy_from_slice(&y5);
                out.accepted += 1;
            } else {
                out.rejected += 1;
            }
            let factor = if err == 0.0 {
                5.0
            } else {
                (0.9 * err.powf(-0.2)).clamp(0.2, 5.0)
            };
            dt *= factor;
        }
        out
    }
}
