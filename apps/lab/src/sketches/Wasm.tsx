import { useEffect, useState } from "react"
import init, { add, version } from "../wasm/lab_core"

// Compact wasm-bridge readout for the demo header: initializes the wasm module
// and shows a number (add) and a string (version) round-tripping from Rust.
export function BridgeStatus() {
  const [text, setText] = useState("bridge: connecting")

  useEffect(() => {
    let alive = true
    init()
      .then(() => {
        if (alive) setText(`${version()}  add(2,3) = ${add(2, 3)}`)
      })
      .catch((e) => {
        if (alive) setText(`bridge error: ${String(e)}`)
      })
    return () => {
      alive = false
    }
  }, [])

  return <span className="text-[11px] text-neutral-500">{text}</span>
}
