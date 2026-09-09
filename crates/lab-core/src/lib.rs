use gravity::{gravitational_force as gforce, Orbit, Vec2};
use wasm_bindgen::prelude::*;

// lab-core — the lab's Rust computation core, compiled to wasm and consumed
// by the lab's TypeScript via wasm-bindgen. `add` and `version` are the
// minimal round-trip proof that the Rust -> wasm -> TS bridge is live; the
// gravity bindings below run the `gravity` crate's physics in the browser so
// the lab scene renders a real integrated orbit, not canned data.

/// Numbers across the wasm boundary.
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

/// A String across the boundary -- wasm-bindgen marshals it, proving the
/// bridge handles real data, not just primitives.
#[wasm_bindgen]
pub fn version() -> String {
    format!(
        "lab-core {} -- rust->wasm bridge live",
        env!("CARGO_PKG_VERSION")
    )
}

/// Newtonian force magnitude (newtons) between point masses `m1`, `m2` (kg)
/// at separation `r` (m). Thin wrapper over `gravity::gravitational_force`.
#[wasm_bindgen]
pub fn gravitational_force(m1: f64, m2: f64, r: f64) -> f64 {
    gforce(m1, m2, r)
}

/// Integrate a test mass orbiting a fixed central body and return the
/// trajectory as a flat `[x0, y0, x1, y1, ...]` array of length `2 * steps`
/// (as `Float32Array` in JS). `mu` is the central gravitational parameter;
/// `(x0, y0)` and `(vx0, vy0)` are the initial position and velocity; `dt` is
/// the step size. The physics and integrator live in the `gravity` crate.
#[wasm_bindgen]
pub fn orbit_path(
    mu: f64,
    x0: f64,
    y0: f64,
    vx0: f64,
    vy0: f64,
    steps: usize,
    dt: f64,
) -> Vec<f32> {
    let mut o = Orbit::new(Vec2::new(x0, y0), Vec2::new(vx0, vy0), mu);
    let mut out = Vec::with_capacity(steps * 2);
    for _ in 0..steps {
        out.push(o.pos.x as f32);
        out.push(o.pos.y as f32);
        o.step(dt);
    }
    out
}

/// Relative specific-energy deviation (eps_k - eps_0) / |eps_0| at each of
/// `steps` samples of the same orbit `orbit_path` integrates, as a length
/// `steps` array. The physics lives in `gravity::Orbit::specific_energy`;
/// this re-runs the identical integration, so index k here corresponds to
/// point k of `orbit_path` with the same arguments.
#[wasm_bindgen]
pub fn orbit_energy_drift(
    mu: f64,
    x0: f64,
    y0: f64,
    vx0: f64,
    vy0: f64,
    steps: usize,
    dt: f64,
) -> Vec<f32> {
    let mut o = Orbit::new(Vec2::new(x0, y0), Vec2::new(vx0, vy0), mu);
    let e0 = o.specific_energy();
    let mut out = Vec::with_capacity(steps);
    for _ in 0..steps {
        out.push(((o.specific_energy() - e0) / e0.abs()) as f32);
        o.step(dt);
    }
    out
}

/// Plane-pendulum phase-space trajectory: `steps` samples of
/// (theta, omega) flattened as `[theta0, omega0, theta1, ...]` (length
/// `2 * steps`), integrated with velocity Verlet at fixed step `dt`. The
/// physics and integrator live in the `pendulum` and `numerics` crates.
#[wasm_bindgen]
pub fn pendulum_phase_path(
    g: f64,
    l: f64,
    theta0: f64,
    omega0: f64,
    steps: usize,
    dt: f64,
) -> Vec<f32> {
    let p = pendulum::PlanePendulum { g, l };
    p.phase_path(theta0, omega0, dt, steps)
        .into_iter()
        .map(|x| x as f32)
        .collect()
}

/// Relative specific-energy deviation (E_k - E_0) / E_0 at each sample of
/// the same pendulum trajectory `pendulum_phase_path` returns (length
/// `steps`). E is `pendulum::PlanePendulum::specific_energy`; E_0 > 0 for
/// any nonzero initial displacement or velocity.
#[wasm_bindgen]
pub fn pendulum_energy_drift(
    g: f64,
    l: f64,
    theta0: f64,
    omega0: f64,
    steps: usize,
    dt: f64,
) -> Vec<f32> {
    let p = pendulum::PlanePendulum { g, l };
    let path = p.phase_path(theta0, omega0, dt, steps);
    let e0 = p.specific_energy(path[0], path[1]);
    path.chunks_exact(2)
        .map(|s| ((p.specific_energy(s[0], s[1]) - e0) / e0) as f32)
        .collect()
}
