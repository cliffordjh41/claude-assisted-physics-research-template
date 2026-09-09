import init, { orbit_path } from "../wasm/lab_core"

// The shared demo system: a test mass orbiting a fixed central body
// (mu = G*M = 1) launched at radius 1 with 0.85x the circular speed, giving a
// bound ellipse. The same parameters feed every view, so the equations, the
// 2D trajectory, and the 3D animation all show one system. The physics and
// the velocity-Verlet integrator live in the Rust `gravity` crate; this just
// drives it across the wasm bridge.
export const ORBIT = {
  mu: 1,
  x0: 1,
  y0: 0,
  vx0: 0,
  vy0: 0.85,
  dt: 0.005,
  steps: 870, // ~one orbital period at this dt, so the path closes for looping
}

// Wall-clock seconds for one visual loop, shared by the 2D and 3D views so
// their moving markers stay in sync.
export const LOOP_SECONDS = 7

// Phase of the looping animation at wall time `nowMs`, as indices into a path
// of `count` samples plus an interpolation fraction. The path is one closed
// period, so wrapping count-1 -> 0 is seamless.
export function loopPhase(count: number, nowMs: number) {
  const phase = (((nowMs / 1000) % LOOP_SECONDS) / LOOP_SECONDS) * count
  const i = Math.floor(phase) % count
  const j = (i + 1) % count
  return { i, j, f: phase - Math.floor(phase) }
}

let cached: Promise<Float32Array> | null = null

// Initialize the wasm module once and integrate the demo orbit, returning the
// trajectory as a flat [x0, y0, x1, y1, ...] Float32Array.
export function loadOrbitPath(): Promise<Float32Array> {
  if (!cached) {
    cached = init().then(() =>
      orbit_path(
        ORBIT.mu,
        ORBIT.x0,
        ORBIT.y0,
        ORBIT.vx0,
        ORBIT.vy0,
        ORBIT.steps,
        ORBIT.dt,
      ),
    )
  }
  return cached
}
