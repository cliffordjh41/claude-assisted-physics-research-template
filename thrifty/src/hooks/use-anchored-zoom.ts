import { useCallback, useEffect, useRef, useState } from "react"

interface UseAnchoredZoomOptions {
  /** Home scale; also the minimum. Default 1. */
  min?: number
  /** Maximum scale. Default 8. */
  max?: number
  /** Multiplicative scale change per wheel tick. Default 1.1. */
  step?: number
}

interface AnchoredZoomState {
  scale: number
  /** Content translation in px, relative to the container's top-left. */
  x: number
  y: number
}

interface UseAnchoredZoomReturn extends AnchoredZoomState {
  /** Attach to the zoom *container* (the clipping viewport). */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** `translate(x, y) scale(s)` for the content element. */
  transform: string
  /** Snap back to home (scale = min, centered). */
  reset: () => void
}

// Asymmetric anchored zoom for an artboard/canvas surface.
//
// Wheel in:  zoom toward the cursor — the content point under the pointer
//            stays under the pointer (Google-Maps style). With a top-left
//            transform origin and m = cursor-in-container, the invariant
//            m = scale * c + t (content point c) gives, for a scale change
//            f = s1 / s0:  t1 = m - f * (m - t0).
// Wheel out: ignore the cursor and trend back to home. Translation is
//            scaled by f = (s1 - min) / (s0 - min), so it reaches exactly
//            (0, 0) — the centered home view — as scale returns to min.
//
// The asymmetry is deliberate: zooming in inspects wherever you point;
// zooming out always recovers the whole-canvas origin, so you never get
// lost panned-and-zoomed in a corner.
//
// The content element must use `transform-origin: 0 0` (top-left) for the
// math to hold. The wheel listener is attached natively (non-passive) so it
// can `preventDefault` the page scroll — React's synthetic onWheel is
// passive and cannot.
export function useAnchoredZoom(
  options?: UseAnchoredZoomOptions
): UseAnchoredZoomReturn {
  const { min = 1, max = 8, step = 1.1 } = options ?? {}
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState<AnchoredZoomState>({ scale: min, x: 0, y: 0 })

  // The native wheel handler closes over a ref, not the state value, so the
  // effect can register once and still read the latest transform each tick.
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onWheel(e: WheelEvent) {
      if (e.deltaY === 0) return
      e.preventDefault()
      const rect = el!.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const { scale: s0, x: x0, y: y0 } = stateRef.current

      if (e.deltaY < 0) {
        const s1 = Math.min(max, s0 * step)
        if (s1 === s0) return
        const f = s1 / s0
        setState({ scale: s1, x: mx - f * (mx - x0), y: my - f * (my - y0) })
      } else {
        const s1 = Math.max(min, s0 / step)
        if (s1 === s0) return
        const f = s1 <= min ? 0 : (s1 - min) / (s0 - min)
        setState({ scale: s1, x: x0 * f, y: y0 * f })
      }
    }

    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [min, max, step])

  const reset = useCallback(() => setState({ scale: min, x: 0, y: 0 }), [min])

  return {
    ...state,
    containerRef,
    transform: `translate(${state.x}px, ${state.y}px) scale(${state.scale})`,
    reset,
  }
}
