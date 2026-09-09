//! Newtonian gravitation: the inverse-square force law and a fixed-center
//! (Kepler problem) orbit integrator.
//!
//! Scope: textbook two-body gravitation reduced to a test mass moving in the
//! field of a fixed central mass at the origin. Provides the force-law
//! magnitude and a velocity-Verlet integrator parameterized by the standard
//! gravitational parameter mu = G * M_central.
//!
//! References:
//!   - Inverse-square law of universal gravitation: I. Newton,
//!     Philosophiae Naturalis Principia Mathematica (1687), Book III.
//!   - Value of the gravitational constant G (SI units): E. Tiesinga,
//!     P. J. Mohr, D. B. Newell, and B. N. Taylor, "CODATA recommended
//!     values of the fundamental physical constants: 2018," Reviews of
//!     Modern Physics 93, 025010 (2021), DOI 10.1103/RevModPhys.93.025010.

/// Newton's gravitational constant, CODATA 2018 recommended value, in SI
/// units (m^3 kg^-1 s^-2).
pub const G: f64 = 6.674_30e-11;

/// Magnitude of the gravitational force (newtons) between two point masses
/// `m1`, `m2` (kg) separated by distance `r` (m): F = G * m1 * m2 / r^2.
pub fn gravitational_force(m1: f64, m2: f64, r: f64) -> f64 {
    G * m1 * m2 / (r * r)
}

/// Circular-orbit speed at radius `r` for central gravitational parameter
/// `mu` = G * M_central: v = sqrt(mu / r).
pub fn circular_speed(mu: f64, r: f64) -> f64 {
    (mu / r).sqrt()
}

/// A planar vector.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Vec2 {
    pub x: f64,
    pub y: f64,
}

impl Vec2 {
    pub fn new(x: f64, y: f64) -> Self {
        Self { x, y }
    }

    /// Euclidean length.
    pub fn norm(self) -> f64 {
        (self.x * self.x + self.y * self.y).sqrt()
    }
}

/// State of a test mass orbiting a fixed central body at the origin.
///
/// `mu` is the standard gravitational parameter mu = G * M_central. Working in
/// mu keeps the integrator unit-agnostic: pass mu = G * M for an orbit in SI,
/// or mu = 1 for normalized units (as the tests and the browser demo do).
#[derive(Clone, Copy, Debug)]
pub struct Orbit {
    pub pos: Vec2,
    pub vel: Vec2,
    pub mu: f64,
}

impl Orbit {
    pub fn new(pos: Vec2, vel: Vec2, mu: f64) -> Self {
        Self { pos, vel, mu }
    }

    /// Acceleration from the central body: a = -mu * r / |r|^3.
    pub fn acceleration(&self) -> Vec2 {
        let r = self.pos.norm();
        let k = -self.mu / (r * r * r);
        Vec2::new(k * self.pos.x, k * self.pos.y)
    }

    /// Advance one step of size `dt` with velocity Verlet, a symplectic
    /// scheme whose energy error stays bounded over an orbit rather than
    /// drifting secularly as explicit Euler would.
    pub fn step(&mut self, dt: f64) {
        let a0 = self.acceleration();
        self.pos.x += self.vel.x * dt + 0.5 * a0.x * dt * dt;
        self.pos.y += self.vel.y * dt + 0.5 * a0.y * dt * dt;
        let a1 = self.acceleration();
        self.vel.x += 0.5 * (a0.x + a1.x) * dt;
        self.vel.y += 0.5 * (a0.y + a1.y) * dt;
    }

    /// Specific orbital energy per unit test mass: eps = v^2/2 - mu/|r|.
    /// A constant of the motion; the integrator holds it nearly fixed.
    pub fn specific_energy(&self) -> f64 {
        self.vel.norm().powi(2) / 2.0 - self.mu / self.pos.norm()
    }
}
