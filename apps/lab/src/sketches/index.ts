import type { ComponentType } from "react"
import { GravityDemo } from "./GravityDemo"

// The scene registry — the lab's unit of work. Add an entry here and it
// appears in the rail. The shipped example is one composed view of the
// `gravity` crate: the force law, the 2D trajectory, and the animated 3D
// orbit, all from the same wasm integrator.
export interface Sketch {
  id: string
  label: string
  Component: ComponentType
}

export const SKETCHES: Sketch[] = [
  { id: "gravity", label: "two-body orbit", Component: GravityDemo },
]
