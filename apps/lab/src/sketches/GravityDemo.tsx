import { Chart2D } from "./Chart2D"
import { MathView } from "./MathView"
import { Scene3D } from "./Scene3D"
import { BridgeStatus } from "./Wasm"

// One composed view of the gravity system: a thin row of the three governing
// equations, then two equal larger panels -- the 2D trajectory and the
// animated 3D orbit -- with the wasm-bridge status in the header. All of it is
// driven by the same Rust/wasm integrator. This is the lab's single shipped
// scene; add more by registering them in index.ts.
export function GravityDemo() {
  return (
    <div className="absolute inset-0 flex flex-col bg-neutral-950">
      <header className="h-11 shrink-0 flex items-center justify-between pl-11 pr-5 lg:pl-5 border-b border-neutral-800">
        <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">
          two-body orbit
        </span>
        <BridgeStatus />
      </header>

      <div className="shrink-0 border-b border-neutral-800">
        <MathView />
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 min-w-0 overflow-hidden border-b border-neutral-800">
          <Chart2D />
        </div>
        <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
          <Scene3D />
        </div>
      </div>
    </div>
  )
}
