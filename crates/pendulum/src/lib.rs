//! Plane pendulum: a point mass m on a rigid massless rod of length l,
//! swinging in a vertical plane under uniform gravity g, described by the
//! angle theta from the downward vertical.
//!
//! Equation of motion, chain written out: the weight m g resolves along
//! the rod (balanced by the rod's tension) and tangent to the circular
//! path, with tangential component -m g sin(theta) (restoring, hence the
//! sign). The tangential acceleration of a point constrained to a circle
//! of radius l is l * theta''. Newton's second law along the tangent then
//! gives m l theta'' = -m g sin(theta), i.e.
//! theta'' = -(g / l) sin(theta).
//!
//! Energy per unit mass, measured from the bottom of the arc: kinetic
//! (l theta')^2 / 2 plus potential g l (1 - cos theta) (the bob's height
//! above the bottom is l - l cos theta). Along exact solutions
//! dE/dt = l^2 theta' theta'' + g l sin(theta) theta'
//!       = l theta' [l theta'' + g sin(theta)] = 0
//! by the equation of motion, so E is conserved; the integrator's drift
//! against it is measured in `tests/pendulum.rs`.
//!
//! Small-angle limit (the reduction to known physics): for |theta| << 1,
//! sin(theta) = theta + O(theta^3), so the equation reduces to the
//! harmonic oscillator theta'' = -(g/l) theta with angular frequency
//! omega = sqrt(g/l) and period T0 = 2 pi sqrt(l/g); theta(t) =
//! theta_0 cos(omega t) checks by direct differentiation. The tests
//! measure the numerical period against T0 at small amplitude.

use numerics::ode::{verlet_step, SecondOrderSystem};

/// Plane pendulum parameters: gravitational acceleration `g` (length /
/// time^2) and rod length `l` (length), in any consistent unit system.
#[derive(Clone, Copy, Debug)]
pub struct PlanePendulum {
    pub g: f64,
    pub l: f64,
}

impl SecondOrderSystem for PlanePendulum {
    fn dim(&self) -> usize {
        1
    }
    /// theta'' = -(g/l) sin(theta); derivation in the crate root.
    fn accel(&self, _t: f64, q: &[f64], acc: &mut [f64]) {
        acc[0] = -(self.g / self.l) * q[0].sin();
    }
}

impl PlanePendulum {
    /// Energy per unit mass from the bottom of the arc:
    /// E = (l * omega)^2 / 2 + g l (1 - cos theta). Derivation in the
    /// crate root.
    pub fn specific_energy(&self, theta: f64, omega: f64) -> f64 {
        0.5 * (self.l * omega).powi(2) + self.g * self.l * (1.0 - theta.cos())
    }

    /// Integrate from (theta0, omega0) with velocity Verlet at fixed step
    /// `dt`, returning `steps` samples of (theta, omega) including the
    /// initial state, flattened as [theta_0, omega_0, theta_1, ...].
    pub fn phase_path(&self, theta0: f64, omega0: f64, dt: f64, steps: usize) -> Vec<f64> {
        let mut q = [theta0];
        let mut v = [omega0];
        let mut t = 0.0;
        let mut out = Vec::with_capacity(steps * 2);
        for _ in 0..steps {
            out.push(q[0]);
            out.push(v[0]);
            verlet_step(self, t, &mut q, &mut v, dt);
            t += dt;
        }
        out
    }
}
